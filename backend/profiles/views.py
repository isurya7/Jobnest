from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from .models import Skill, SeekerProfile, SeekerSkill
from .serializers import SeekerProfileSerializer, AddSkillSerializer, ResumeUploadSerializer
from .resume_parser import extract_text_from_resume
from matching.embeddings import compute_embedding


class MyProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = SeekerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, _ = SeekerProfile.objects.get_or_create(user=self.request.user)
        return profile


class AddSkillView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = AddSkillSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        profile, _ = SeekerProfile.objects.get_or_create(user=request.user)
        skill, _ = Skill.objects.get_or_create(
            name__iexact=serializer.validated_data["skill_name"],
            defaults={"name": serializer.validated_data["skill_name"]},
        )

        seeker_skill, created = SeekerSkill.objects.update_or_create(
            seeker=profile,
            skill=skill,
            defaults={"proficiency": serializer.validated_data["proficiency"]},
        )

        return Response(
            {"skill": skill.name, "proficiency": seeker_skill.proficiency},
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class ResumeUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser]

    def post(self, request):
        serializer = ResumeUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        profile, _ = SeekerProfile.objects.get_or_create(user=request.user)
        resume_file = serializer.validated_data["resume"]

        profile.resume_file = resume_file
        profile.save()

        extracted_text = extract_text_from_resume(profile.resume_file)
        profile.resume_text = extracted_text
        profile.save()

        all_skills = Skill.objects.all()
        matched_skills = []
        text_lower = extracted_text.lower()

        for skill in all_skills:
            if skill.name.lower() in text_lower:
                SeekerSkill.objects.update_or_create(
                    seeker=profile,
                    skill=skill,
                    defaults={"proficiency": 3},
                )
                matched_skills.append(skill.name)

        profile.resume_embedding = compute_embedding(extracted_text)
        profile.save()

        return Response({
            "message": "Resume uploaded and processed.",
            "matched_skills": matched_skills,
            "text_length": len(extracted_text),
        })
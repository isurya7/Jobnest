from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Skill, SeekerProfile, SeekerSkill
from .serializers import SeekerProfileSerializer, AddSkillSerializer


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
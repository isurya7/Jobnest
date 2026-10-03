from django.db import models
from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import JobPosting
from .serializers import JobPostingSerializer
from matching.scoring import compute_match_score, score_to_tag, compute_match_breakdown
from profiles.models import SeekerProfile
from applications.models import SavedJob, Application


class JobListView(generics.ListAPIView):
    serializer_class = JobPostingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = JobPosting.objects.all().order_by("-posted_at")

        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                models.Q(title__icontains=search) |
                models.Q(company__icontains=search) |
                models.Q(location__icontains=search)
            )

        work_mode = self.request.query_params.get("work_mode")
        if work_mode:
            queryset = queryset.filter(work_mode=work_mode)

        country = self.request.query_params.get("country")
        if country:
            queryset = queryset.filter(country__icontains=country)

        skill = self.request.query_params.get("skill")
        if skill:
            queryset = queryset.filter(skills__name__icontains=skill)

        return queryset.distinct()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        data = serializer.data

        profile, _ = SeekerProfile.objects.get_or_create(user=request.user)
        seeker_skill_ids = set(profile.skills.values_list("id", flat=True))
        saved_ids = set(SavedJob.objects.filter(seeker=profile).values_list("job_id", flat=True))
        applied_ids = set(Application.objects.filter(seeker=profile).values_list("job_id", flat=True))

        for job_data, job in zip(data, queryset):
            job_skill_ids = set(job.skills.values_list("id", flat=True))
            score = compute_match_score(
                seeker_skill_ids, job_skill_ids, profile.resume_embedding, job.embedding,
            )
            job_data["match_score"] = score
            job_data["match_tag"] = score_to_tag(score)
            job_data["is_saved"] = job.id in saved_ids
            job_data["is_applied"] = job.id in applied_ids

        data.sort(key=lambda j: j["match_score"], reverse=True)
        return Response(data)


class JobDetailView(generics.RetrieveAPIView):
    serializer_class = JobPostingSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = JobPosting.objects.all()

    def retrieve(self, request, *args, **kwargs):
        job = self.get_object()
        serializer = self.get_serializer(job)
        data = serializer.data

        profile, _ = SeekerProfile.objects.get_or_create(user=request.user)
        seeker_skill_ids = set(profile.skills.values_list("id", flat=True))
        seeker_skill_names = set(profile.skills.values_list("name", flat=True))
        job_skill_ids = set(job.skills.values_list("id", flat=True))
        job_skill_names = set(job.skills.values_list("name", flat=True))

        breakdown = compute_match_breakdown(
            seeker_skill_ids, seeker_skill_names,
            job_skill_ids, job_skill_names,
            profile.resume_embedding, job.embedding,
        )
        data.update(breakdown)
        data["is_saved"] = SavedJob.objects.filter(seeker=profile, job=job).exists()
        data["is_applied"] = Application.objects.filter(seeker=profile, job=job).exists()

        return Response(data)
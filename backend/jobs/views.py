from rest_framework import generics, permissions
from .models import JobPosting
from rest_framework.response import Response
from applications.models import SavedJob, Application
from .serializers import JobPostingSerializer
from matching.scoring import compute_match_score, score_to_tag
from profiles.models import SeekerProfile


class JobListView(generics.ListAPIView):
    serializer_class = JobPostingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return JobPosting.objects.all().order_by("-posted_at")

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
    queryset = JobPosting.objects.all()
    serializer_class = JobPostingSerializer
    permission_classes = [permissions.IsAuthenticated]
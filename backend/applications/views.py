from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from profiles.models import SeekerProfile
from jobs.models import JobPosting
from .models import SavedJob, Application
from .serializers import SavedJobSerializer, ApplicationSerializer


class SavedJobListView(generics.ListAPIView):
    serializer_class = SavedJobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile, _ = SeekerProfile.objects.get_or_create(user=self.request.user)
        return SavedJob.objects.filter(seeker=profile).order_by("-saved_at")


class ToggleSaveJobView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, job_id):
        profile, _ = SeekerProfile.objects.get_or_create(user=request.user)
        job = JobPosting.objects.get(id=job_id)

        saved_job = SavedJob.objects.filter(seeker=profile, job=job).first()
        if saved_job:
            saved_job.delete()
            return Response({"saved": False})

        SavedJob.objects.create(seeker=profile, job=job)
        return Response({"saved": True})


class ApplicationListView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile, _ = SeekerProfile.objects.get_or_create(user=self.request.user)
        return Application.objects.filter(seeker=profile).order_by("-applied_at")


class MarkAppliedView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, job_id):
        profile, _ = SeekerProfile.objects.get_or_create(user=request.user)
        job = JobPosting.objects.get(id=job_id)

        application, created = Application.objects.get_or_create(
            seeker=profile, job=job, defaults={"status": "applied"}
        )
        return Response(
            ApplicationSerializer(application).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class UpdateApplicationStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, application_id):
        profile, _ = SeekerProfile.objects.get_or_create(user=request.user)
        application = Application.objects.get(id=application_id, seeker=profile)
        application.status = request.data.get("status", application.status)
        application.save()
        return Response(ApplicationSerializer(application).data)
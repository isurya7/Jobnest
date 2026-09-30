from rest_framework import generics, permissions
from .models import JobPosting
from .serializers import JobPostingSerializer


class JobListView(generics.ListAPIView):
    queryset = JobPosting.objects.all().order_by("-posted_at")
    serializer_class = JobPostingSerializer
    permission_classes = [permissions.IsAuthenticated]


class JobDetailView(generics.RetrieveAPIView):
    queryset = JobPosting.objects.all()
    serializer_class = JobPostingSerializer
    permission_classes = [permissions.IsAuthenticated]
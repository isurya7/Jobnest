from rest_framework import serializers
from .models import SavedJob, Application


class SavedJobSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source="job.title", read_only=True)
    job_company = serializers.CharField(source="job.company", read_only=True)

    class Meta:
        model = SavedJob
        fields = ("id", "job", "job_title", "job_company", "saved_at")


class ApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source="job.title", read_only=True)
    job_company = serializers.CharField(source="job.company", read_only=True)

    class Meta:
        model = Application
        fields = ("id", "job", "job_title", "job_company", "status", "applied_at", "status_updated_at")
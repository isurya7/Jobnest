from rest_framework import serializers
from .models import JobPosting


class JobPostingSerializer(serializers.ModelSerializer):
    is_expired = serializers.BooleanField(read_only=True)
    skills = serializers.StringRelatedField(many=True)

    class Meta:
        model = JobPosting
        fields = (
            "id",
            "source",
            "title",
            "company",
            "location",
            "description",
            "redirect_url",
            "posted_at",
            "is_expired",
            "skills",
        )
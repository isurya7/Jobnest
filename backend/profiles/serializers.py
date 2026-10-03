from rest_framework import serializers
from .models import SeekerProfile, Skill, SeekerSkill


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ("id", "name")


class SeekerSkillSerializer(serializers.ModelSerializer):
    skill_name = serializers.CharField(source="skill.name", read_only=True)

    class Meta:
        model = SeekerSkill
        fields = ("id", "skill", "skill_name", "proficiency")


class SeekerProfileSerializer(serializers.ModelSerializer):
    seeker_skills = SeekerSkillSerializer(source="seekerskill_set", many=True, read_only=True)
    resume_file_url = serializers.SerializerMethodField()
    resume_file_name = serializers.SerializerMethodField()

    class Meta:
        model = SeekerProfile
        fields = (
            "id",
            "bio",
            "resume_file_url",
            "resume_file_name",
            "linkedin_url",
            "seeker_skills",
            "experience_years",
        )

    def get_resume_file_url(self, obj):
        return obj.resume_file.url if obj.resume_file else None

    def get_resume_file_name(self, obj):
        return obj.resume_file.name.split("/")[-1] if obj.resume_file else None


class AddSkillSerializer(serializers.Serializer):
    skill_name = serializers.CharField(max_length=100)
    proficiency = serializers.IntegerField(min_value=1, max_value=5, default=3)


class ResumeUploadSerializer(serializers.Serializer):
    resume = serializers.FileField()
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

class AddSkillSerializer(serializers.Serializer):
    skill_name = serializers.CharField(max_length=100)
    proficiency = serializers.IntegerField(min_value=1, max_value=5, default=3)


class ResumeUploadSerializer(serializers.Serializer):
    resume = serializers.FileField()

class SeekerProfileSerializer(serializers.ModelSerializer):
    seeker_skills = SeekerSkillSerializer(
        source="seekerskill_set", many=True, read_only=True
    )

    class Meta:
        model = SeekerProfile
        fields = (
            "id",
            "bio",
            "resume_url",
            "linkedin_url",
            "seeker_skills",
        )
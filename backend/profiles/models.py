from django.db import models
from django.conf import settings


class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class SeekerProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="seeker_profile",
    )
    bio = models.TextField(blank=True)
    resume_file = models.FileField(upload_to="resumes/", blank=True, null=True)
    resume_text = models.TextField(blank=True)
    resume_embedding = models.JSONField(null=True, blank=True)
    linkedin_url = models.URLField(blank=True, null=True)
    skills = models.ManyToManyField(Skill, through="SeekerSkill", related_name="seekers")

    def __str__(self):
        return f"{self.user.email}'s profile"


class SeekerSkill(models.Model):
    seeker = models.ForeignKey(SeekerProfile, on_delete=models.CASCADE)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    proficiency = models.PositiveSmallIntegerField(default=3)  # 1–5 scale

    class Meta:
        unique_together = ("seeker", "skill")

    def __str__(self):
        return f"{self.seeker.user.email} – {self.skill.name} ({self.proficiency})"
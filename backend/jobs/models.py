from django.db import models
from django.utils import timezone
from datetime import timedelta
from profiles.models import Skill


class JobPosting(models.Model):
    source = models.CharField(max_length=50)
    external_id = models.CharField(max_length=200)
    title = models.CharField(max_length=255)
    company = models.CharField(max_length=255, blank=True)
    location = models.CharField(max_length=255, blank=True)
    country = models.CharField(max_length=100, blank=True)
    work_mode = models.CharField(
        max_length=20,
        choices=[("remote", "Remote"), ("hybrid", "Hybrid"), ("onsite", "On-site")],
        default="onsite",
    )
    description = models.TextField(blank=True)
    redirect_url = models.URLField(max_length=500)
    posted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    embedding = models.JSONField(null=True, blank=True)
    language = models.CharField(max_length=10, default="en")

    skills = models.ManyToManyField(Skill, through="JobSkill", related_name="jobs")

    class Meta:
        unique_together = ("source", "external_id")

    def __str__(self):
        return f"{self.title} @ {self.company}"

    @property
    def is_expired(self):
        if not self.posted_at:
            return False
        return self.posted_at < timezone.now() - timedelta(days=30)


class JobSkill(models.Model):
    job = models.ForeignKey(JobPosting, on_delete=models.CASCADE)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("job", "skill")
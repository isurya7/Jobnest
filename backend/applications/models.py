from django.db import models
from profiles.models import SeekerProfile
from jobs.models import JobPosting


class SavedJob(models.Model):
    seeker = models.ForeignKey(SeekerProfile, on_delete=models.CASCADE)
    job = models.ForeignKey(JobPosting, on_delete=models.CASCADE)
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("seeker", "job")

    def __str__(self):
        return f"{self.seeker.user.email} saved {self.job.title}"


class Application(models.Model):
    STATUS_CHOICES = [
        ("applied", "Applied"),
        ("interviewing", "Interviewing"),
        ("rejected", "Rejected"),
        ("offer", "Offer"),
    ]

    seeker = models.ForeignKey(SeekerProfile, on_delete=models.CASCADE)
    job = models.ForeignKey(JobPosting, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="applied")
    applied_at = models.DateTimeField(auto_now_add=True)
    status_updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("seeker", "job")

    def __str__(self):
        return f"{self.seeker.user.email} → {self.job.title} ({self.status})"
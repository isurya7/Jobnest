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
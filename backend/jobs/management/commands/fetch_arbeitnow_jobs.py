import requests
from django.core.management.base import BaseCommand
from django.utils import timezone as django_timezone
from datetime import datetime, timezone as dt_timezone
from jobs.models import JobPosting
from profiles.models import Skill


class Command(BaseCommand):
    help = "Fetch job listings from the Arbeitnow API"

    def handle(self, *args, **options):
        url = "https://www.arbeitnow.com/api/job-board-api"
        response = requests.get(url, timeout=15)
        response.raise_for_status()
        data = response.json()

        all_skills = list(Skill.objects.values_list("name", flat=True))
        created_count = 0

        for job_data in data.get("data", []):
            posted_at = None
            if job_data.get("created_at"):
                posted_at = datetime.fromtimestamp(
                    job_data["created_at"], tz=dt_timezone.utc
                )

            job, created = JobPosting.objects.update_or_create(
                source="arbeitnow",
                external_id=job_data.get("slug", ""),
                defaults={
                    "title": job_data.get("title", ""),
                    "company": job_data.get("company_name", ""),
                    "location": job_data.get("location", ""),
                    "description": job_data.get("description", ""),
                    "redirect_url": job_data.get("url", ""),
                    "posted_at": posted_at,
                },
            )

            if created:
                created_count += 1

            description_lower = job.description.lower()
            for skill_name in all_skills:
                if skill_name.lower() in description_lower:
                    skill = Skill.objects.get(name=skill_name)
                    job.skills.add(skill)

        self.stdout.write(self.style.SUCCESS(
            f"Arbeitnow: {created_count} new jobs created, "
            f"{len(data.get('data', []))} total processed."
        ))
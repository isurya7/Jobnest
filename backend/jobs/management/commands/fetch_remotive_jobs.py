import requests
from django.core.management.base import BaseCommand
from django.utils import timezone as django_timezone
from django.utils.dateparse import parse_datetime
from jobs.models import JobPosting
from profiles.models import Skill


class Command(BaseCommand):
    help = "Fetch job listings from the Remotive API"

    def handle(self, *args, **options):
        url = "https://remotive.com/api/remote-jobs"
        response = requests.get(url, timeout=15)
        response.raise_for_status()
        data = response.json()

        all_skills = list(Skill.objects.values_list("name", flat=True))
        created_count = 0

        for job_data in data.get("jobs", []):
            raw_date = parse_datetime(job_data.get("publication_date"))
            if raw_date and django_timezone.is_naive(raw_date):
                posted_at = django_timezone.make_aware(raw_date)
            else:
                posted_at = raw_date

            job, created = JobPosting.objects.update_or_create(
                source="remotive",
                external_id=str(job_data["id"]),
                defaults={
                    "title": job_data.get("title", ""),
                    "company": job_data.get("company_name", ""),
                    "location": job_data.get("candidate_required_location", ""),
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
            f"Remotive: {created_count} new jobs created, "
            f"{len(data.get('jobs', []))} total processed."
        ))
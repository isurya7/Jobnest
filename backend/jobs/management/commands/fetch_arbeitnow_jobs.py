import requests
from django.core.management.base import BaseCommand
from datetime import datetime, timezone as dt_timezone
from jobs.models import JobPosting
from jobs.parsing_utils import infer_work_mode, infer_country, clean_description, detect_language
from matching.skill_extraction import find_skills_in_text
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

            location = job_data.get("location", "")
            raw_description = job_data.get("description", "")
            description = clean_description(raw_description)
            language = detect_language(raw_description)
            work_mode = infer_work_mode(location, raw_description)
            country = infer_country(location)

            job, created = JobPosting.objects.update_or_create(
                source="arbeitnow",
                external_id=job_data.get("slug", ""),
                defaults={
                    "title": job_data.get("title", ""),
                    "company": job_data.get("company_name", ""),
                    "location": location,
                    "country": country,
                    "work_mode": work_mode,
                    "description": description,
                    "language": language,
                    "redirect_url": job_data.get("url", ""),
                    "posted_at": posted_at,
                },
            )

            if created:
                created_count += 1

            matched_names = find_skills_in_text(job.description, all_skills)
            for name in matched_names:
                skill = Skill.objects.get(name=name)
                job.skills.add(skill)

        self.stdout.write(self.style.SUCCESS(
            f"Arbeitnow: {created_count} new jobs created, "
            f"{len(data.get('data', []))} total processed."
        ))
from django.core.management.base import BaseCommand
from jobs.models import JobPosting
from matching.embeddings import compute_embedding


class Command(BaseCommand):
    help = "Compute and store embeddings for all jobs missing one"

    def handle(self, *args, **options):
        jobs = JobPosting.objects.filter(embedding__isnull=True)
        total = jobs.count()
        self.stdout.write(f"Computing embeddings for {total} jobs...")

        for i, job in enumerate(jobs, start=1):
            text = f"{job.title}\n{job.description}"
            job.embedding = compute_embedding(text)
            job.save()

            if i % 20 == 0:
                self.stdout.write(f"{i}/{total} done")

        self.stdout.write(self.style.SUCCESS(f"Finished: {total} job embeddings computed."))
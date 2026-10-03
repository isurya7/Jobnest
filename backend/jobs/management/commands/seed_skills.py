from django.core.management.base import BaseCommand
from profiles.models import Skill

SKILLS = [
    "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "Rust", "Ruby", "PHP", "Swift", "Kotlin",
    "Django", "Flask", "FastAPI", "React", "Vue", "Angular", "Node.js", "Express", "Next.js", "Spring", "Rails",
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Elasticsearch",
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "CI/CD", "Jenkins",
    "Git", "Linux", "REST API", "GraphQL", "gRPC",
    "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "scikit-learn", "Pandas", "NumPy",
    "HTML", "CSS", "Tailwind", "SASS", "Figma",
    "Agile", "Scrum", "Jira",
]


class Command(BaseCommand):
    help = "Seed a baseline taxonomy of common tech skills"

    def handle(self, *args, **options):
        created = 0
        for name in SKILLS:
            _, was_created = Skill.objects.get_or_create(name__iexact=name, defaults={"name": name})
            if was_created:
                created += 1
        self.stdout.write(self.style.SUCCESS(f"Seeded skills: {created} new, {len(SKILLS)} total checked."))
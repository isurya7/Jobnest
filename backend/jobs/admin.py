from django.contrib import admin
from .models import JobPosting, JobSkill


class JobSkillInline(admin.TabularInline):
    model = JobSkill
    extra = 1


@admin.register(JobPosting)
class JobPostingAdmin(admin.ModelAdmin):
    list_display = ("title", "company", "source", "posted_at", "is_expired")
    list_filter = ("source",)
    search_fields = ("title", "company")
    inlines = [JobSkillInline]
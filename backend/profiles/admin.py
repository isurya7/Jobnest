from django.contrib import admin
from .models import Skill, SeekerProfile, SeekerSkill


class SeekerSkillInline(admin.TabularInline):
    model = SeekerSkill
    extra = 1


@admin.register(SeekerProfile)
class SeekerProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "bio")
    inlines = [SeekerSkillInline]


admin.site.register(Skill)
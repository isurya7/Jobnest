from django.urls import path
from .views import MyProfileView, AddSkillView, ResumeUploadView

urlpatterns = [
    path("", MyProfileView.as_view(), name="my-profile"),
    path("skills/", AddSkillView.as_view(), name="add-skill"),
    path("resume/", ResumeUploadView.as_view(), name="resume-upload"),
]
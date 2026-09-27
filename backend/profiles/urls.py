from django.urls import path
from .views import MyProfileView, AddSkillView

urlpatterns = [
    path("", MyProfileView.as_view(), name="my-profile"),
    path("skills/", AddSkillView.as_view(), name="add-skill"),
]
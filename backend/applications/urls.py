from django.urls import path
from .views import (
    SavedJobListView, ToggleSaveJobView,
    ApplicationListView, MarkAppliedView, UpdateApplicationStatusView,
)

urlpatterns = [
    path("saved/", SavedJobListView.as_view(), name="saved-jobs"),
    path("saved/<int:job_id>/toggle/", ToggleSaveJobView.as_view(), name="toggle-save"),
    path("", ApplicationListView.as_view(), name="applications-list"),
    path("<int:job_id>/apply/", MarkAppliedView.as_view(), name="mark-applied"),
    path("<int:application_id>/status/", UpdateApplicationStatusView.as_view(), name="update-status"),
]
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


class UserAdmin(BaseUserAdmin):
    model = User

    list_display = (
        "email",
        "username",
        "is_staff",
        "email_verified",
        "github_verified",
        "aadhaar_simulated_verified",
    )
    list_filter = ("is_staff", "is_superuser", "email_verified", "github_verified")

    fieldsets = (
        (None, {"fields": ("email", "username", "password")}),
        ("Personal info", {"fields": ("first_name", "last_name")}),
        (
            "Verification",
            {
                "fields": (
                    "email_verified",
                    "github_username",
                    "github_verified",
                    "aadhaar_simulated_verified",
                )
            },
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "username", "password1", "password2"),
            },
        ),
    )

    search_fields = ("email", "username")
    ordering = ("email",)


admin.site.register(User, UserAdmin)
from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from api.models.base import Base

class Role(Base):
    name = models.CharField(max_length=100, blank=True, null=False)
    description = models.CharField(max_length=500, blank=True, null=True)
    HILSC_verified = models.BooleanField(default=False, null=False)
    approve_queue = models.BooleanField(default=False, null=False)
    skip_queue = models.BooleanField(default=False, null=False)
    add_advocacy_reports = models.BooleanField(default=False, null=False)
    view_advocacy_reports = models.BooleanField(default=False, null=False)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "api_roles"
        verbose_name = "Role"
        verbose_name_plural = "Roles"


class Profile(Base):
    agency = models.CharField(max_length=100, blank=True, null=True)

    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)

    role = models.ForeignKey(
        Role,
        on_delete=models.CASCADE,
        related_name="related_role_%(class)s",
        null=True,
    )

    @receiver(post_save, sender=User)
    def create_user_profile(sender, instance, created, **kwargs):
        if created:
            Profile.objects.create(user=instance)

    @receiver(post_save, sender=User)
    def save_user_profile(sender, instance, **kwargs):
        instance.profile.save()

    def __str__(self):
        return self.user.email

    class Meta:
        db_table = "api_profiles"
        verbose_name = "Profile"
        verbose_name_plural = "Profiles"

    @property
    def is_admin(self):
        return self.role.name == 'Admin'

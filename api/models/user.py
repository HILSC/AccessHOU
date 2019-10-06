from django.contrib.auth.models import User
from django.db import models

from api.models.base import Base


class UserProfile(Base):
  """
  Additional information associated with a user.
  """
  user = models.OneToOneField(User, related_name="userprofile", on_delete=models.CASCADE)
  name = models.CharField(max_length=100, blank=True, null=True)

  class Meta:
    db_table = "api_user_profiles"
    verbose_name = "UserProfle"
    verbose_name_plural = "UserProfiles"

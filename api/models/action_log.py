from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField
from django.contrib import admin

from api.models.base import Base


class ActionLog(Base):
    info = models.CharField(max_length=500, null=False, blank=False, default=None)
    additional_info = ArrayField(models.CharField(max_length=250), null=True, default=None)
    action = models.CharField(max_length=45, null=False, blank=False)
    model = models.CharField(max_length=45, null=False, blank=False)
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="created_by_%(class)s", null=True
    )

    def __str__(self):
        return "{}, {}, {}".format(self.model, self.action, self.description)

    class Meta:
        db_table = "api_actions_logs"

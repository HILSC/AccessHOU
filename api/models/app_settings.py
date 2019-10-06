from django.db import models
from django.contrib import admin


class AppSettings(models.Model):
    emergency_mode = models.BooleanField(default=False, null=False)

    class Meta:
        db_table = "api_app_settings"

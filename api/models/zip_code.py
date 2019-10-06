from django.db import models
from django.contrib import admin


class ZipCodeData(models.Model):
    zip_code = models.CharField(max_length=5, null=False)
    state = models.CharField(max_length=2, null=False)
    latitude = models.CharField(max_length=10, null=False)
    longitude = models.CharField(max_length=10, null=False)
    city = models.CharField(max_length=50, null=False)
    full_state = models.CharField(max_length=50, null=False)

    def __str__(self):
        return self.zip_code

    class Meta:
        db_table = "api_zip_codes"
        ordering = ["zip_code", "state", "city"]

import enum
from django.contrib.auth.models import User
from django.db import models

from api.models.base import Base

class AdvocacyReportEntity(enum.Enum):
  agency = 1
  program = 2

class AdvocacyReport(Base):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    submitter_phone_number = models.CharField(max_length=15, null=True, blank=True)
    incident_datetime = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    entity_reported = models.IntegerField(choices=[(entity.value, entity) for entity in AdvocacyReportEntity], null=False)
    entity_reported_id = models.IntegerField(null=False)
    description = models.TextField(null=False)
    recommendation = models.TextField(null=True)
    status = models.CharField(max_length=45, default="Open", null=False)
    notes = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.user.email

    class Meta:
        db_table = "api_advocacy_reports"
        verbose_name = "AdvocacyReport"
        verbose_name_plural = "AdvocacyReports"




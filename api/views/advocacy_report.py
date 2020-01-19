from datetime import datetime
import enum
import logging
import json
import time
from pytz import timezone

from django.db import transaction
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.forms.models import model_to_dict

from rest_framework.views import APIView
from rest_framework.views import status

from api.models.advocacy_report import AdvocacyReport
from api.models.advocacy_report import AdvocacyReportEntity

logger = logging.getLogger(__name__)

class AdvocacyReportEntityListView(APIView):
  def get(self, request):
    return JsonResponse(
      {
        "entities": [
          {
            "id": AdvocacyReportEntity.agency.value,
            "name": AdvocacyReportEntity.agency
          },{
            "id": AdvocacyReportEntity.program.value,
            "name": AdvocacyReportEntity.program
          }
        ]
      }
    )

class AdvocacyReportListView(APIView):
  def get(self, request):
    pass

class AdvocacyReportView(APIView):
  def get(self, request, id):
    pass

  def post(self, request, *args, **kwargs):
    try:
      if request.user and request.user.is_active and request.user.profile.role.add_advocacy_reports:
        incident_date = datetime.strptime(request.data.get("incident_date"), '%m-%d-%Y')
        incident_time = datetime.strptime(request.data.get("incident_time"), '%m-%d-%Y, %I:%M %p')
        incident_time.replace(tzinfo=timezone('UTC'))
        incident_time = incident_time.replace(year=incident_date.year, month=incident_date.month, day=incident_date.day)

        entity_reported = AdvocacyReportEntity[request.data.get("entity_reported")]

        advocacy_report = AdvocacyReport.objects.create(
          user=request.user,
          submitter_phone_number=request.data.get("phone", None),
          incident_datetime=incident_time,
          entity_reported=entity_reported.value,
          entity_reported_id=request.data.get("entity_reported_id"),
          description=request.data.get("description"),
          recommendation=request.data.get("recomendation", None),
          status=request.data.get("status", "Open"),
          notes=request.data.get("notes", None)
        )
        
        return JsonResponse(
          {
            "message": "Advocacy report created successfully."
          }
        )

      raise Exception('User does not have access to add an advocacy report.')
    except Exception as e:
      logger.error("Error creating an Advocacy Report", e)
      return JsonResponse(
        {
          "message": "Error creating an Advocacy Report",
        }, status=500
      )


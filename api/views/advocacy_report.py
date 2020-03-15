from datetime import datetime
import enum
import logging
import json
import time
from pytz import timezone
from itertools import chain

from django.db import transaction
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.forms.models import model_to_dict

from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.views import status

from api.models.agency import Agency
from api.models.program import Program
from api.models.advocacy_report import AdvocacyReport
from api.models.advocacy_report import AdvocacyReportEntity

logger = logging.getLogger(__name__)

class AdvocacyReportEntityListView(APIView):
  permission_classes = [IsAuthenticated]

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
  permission_classes = [IsAuthenticated]

  def get(self, request):
    try:
      if request.user and request.user.is_active and request.user.profile.role.add_advocacy_reports:
        page = request.GET.get("page", 1)

        open_reports = AdvocacyReport.objects.filter(status="Open").order_by('-created_at', '-id')
        in_review_reports = AdvocacyReport.objects.filter(status="In Review").order_by('-created_at', '-id')
        closed_reports = AdvocacyReport.objects.filter(status="Close").order_by('-created_at', '-id')
        na_reports = AdvocacyReport.objects.filter(status="n/a").order_by('-created_at', '-id')

        reports = list(chain(open_reports, in_review_reports, closed_reports, na_reports))
        results = []

        for report in reports:
          entity_selected = AdvocacyReportEntity(report.entity_reported)
          if entity_selected == AdvocacyReportEntity.agency:
            entity = Agency.objects.get(id=report.entity_reported_id)
          else:
            entity = Program.objects.get(id=report.entity_reported_id)

          results.append({
              "id": report.id,
              "status": report.status,
              "created_at": report.created_at.strftime("%m-%d-%Y"),
              "entity_selected": entity_selected.name.capitalize(),
              "user": "{} {}".format(report.user.first_name, report.user.last_name),
              "entity": {
                "name": entity.name,
              }
          })

        # Paginate results
        paginator = Paginator(results, 10)  # Show 10 results per page
        results_page = paginator.get_page(page)
        results_json = json.dumps(results_page.object_list)

        return JsonResponse(
            {
                "results": json.loads(results_json),
                "total_records": paginator.count,
                "total_pages": paginator.num_pages,
                "page": results_page.number,
                "has_next": results_page.has_next(),
                "has_prev": results_page.has_previous(),
            },
            safe=False,
        )
        
      raise Exception('User does not have access to view an advocacy report.')
    except Exception as e:
      logger.error("Error getting Advocacy Reports", e)
      return JsonResponse(
        {
          "message": "Error getting Advocacy Reports",
        }, status=500
      )

  def post(self, request, *args, **kwargs):
    try:
      if request.user and request.user.is_active and request.user.profile.role.add_advocacy_reports:
        incident_date = datetime.strptime(request.data.get("incident_date"), '%m/%d/%Y')
        incident_time = datetime.strptime(request.data.get("incident_time"), '%B %d, %Y %I:%M %p')
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
          recommendation=request.data.get("recommendation", None),
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

class AdvocacyReportView(APIView):
  permission_classes = [IsAuthenticated]
  
  def get(self, request, id):
    try:
      if request.user and request.user.is_active and request.user.profile.role.add_advocacy_reports:
        report = AdvocacyReport.objects.get(id=id)
        
        parent_agency = None
        entity_selected = AdvocacyReportEntity(report.entity_reported)
        if entity_selected == AdvocacyReportEntity.agency:
          entity = Agency.objects.get(id=report.entity_reported_id)
        else:
          entity = Program.objects.get(id=report.entity_reported_id)
          parent_agency = entity.agency.id

        return JsonResponse(
          {
            "id": report.id,
            "status": report.status,
            "entity_selected": entity_selected.name.capitalize(),
            "user": {
              "email": report.user.email,
              "name": "{} {}".format(report.user.first_name, report.user.last_name),
              "agency": report.user.profile.agency
            },
            "phone": report.submitter_phone_number,
            "issue": report.description,
            "issue_time": report.incident_datetime.strftime("%I:%M %p"),
            "issue_date": report.incident_datetime.strftime("%m-%d-%Y"),
            "recommendation": report.recommendation,
            "notes": report.notes,
            "entity": {
              "name": entity.name,
              "slug": entity.slug,
              "agency": parent_agency,
            },
          }
        )

      raise Exception('User does not have access to view an advocacy report.')
    except Exception as e:
      logger.error("Error getting Advocacy Report", e)
      return JsonResponse(
        {
          "message": "Error getting Advocacy Report",
        }, status=500
      )

  def put(self, request, id):
    try:
      if request.user and request.user.is_active and request.user.profile.role.add_advocacy_reports:
        report = AdvocacyReport.objects.get(id=id)
        
        report.status = request.data.get('status', report.status)
        report.notes = request.data.get('notes', report.notes)
        report.save()

        return JsonResponse(
          {
            "message": "Advocacy report updated successfully."
          }
        )

      raise Exception('User does not have access to view an advocacy report.')
    except Exception as e:
      logger.error("Error getting Advocacy Report", e)
      return JsonResponse(
        {
          "message": "Error getting Advocacy Report",
        }, status=500
      )


  


import logging
import json

from django.db import transaction
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.forms.models import model_to_dict

from rest_framework.views import APIView
from rest_framework.views import status
from rest_framework.permissions import IsAuthenticated

from api.models.action_log import ActionLog
from api.models.agency import Agency
from api.models.agency import AgencyQueue
from api.models.app_settings import AppSettings
from api.models.program import Program
from api.models.program import ProgramQueue

from api.models.user import Role

from api.utils import UserActions

logger = logging.getLogger(__name__)

class QueueListView(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request):
    try:
      if request.user and request.user.is_active:
        page = request.GET.get("page", 1)

        agency_queue = AgencyQueue.objects.all().order_by('created_at')
        results = []

        for agency_q in agency_queue:
            results.append({
                "id": agency_q.id,
                "name": agency_q.name,
                "model": "Agency",
                "model_id": agency_q.related_agency_id,
                "action": agency_q.action,
                "requestor_name": agency_q.requested_by_name,
                "requestor_email": agency_q.requested_by_email,
                "emergency_mode": agency_q.emergency_mode
            })

        program_queue = ProgramQueue.objects.all().order_by('created_at')
        for program_q in program_queue:
            results.append({
                "id": program_q.id,
                "name": program_q.name,
                "model": "Program",
                "model_id": program_q.related_program_id,
                "action": program_q.action,
                "requestor_name": program_q.requested_by_name,
                "requestor_email": program_q.requested_by_email,
                "emergency_mode": program_q.emergency_mode
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
    except Exception as e:
      logger.error("Error getting Queue", e)
      return JsonResponse(
          {
              "message": "Error getting results",
          }, status=500
      )

class QueueAgencyView(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request, id):
    try:
      agency_queue = AgencyQueue.objects.get(id=id)

      try:
        agency = Agency.objects.get(id=agency_queue.related_agency_id)
        agency_dict = model_to_dict(agency)
      except Agency.DoesNotExist:
        agency_dict = None

      agency_queue_dict = model_to_dict(agency_queue)
      if not agency_dict:
        agency_dict = agency_queue_dict

      app_settings = AppSettings.objects.first()

      return JsonResponse(
          {
              "agency": agency_dict,
              "agency_queue": agency_queue_dict,
              "emergency_mode_on": app_settings.emergency_mode
          },
          safe=False,
      )
    except Exception as e:
      logger.error("Error getting Agency queue", e)
      return JsonResponse(
        {
          "message": "Error getting agency queue",
        }, status=500
      )
    
  @transaction.atomic
  def post(self, request):
    # Approve or Reject
    try:
      if request.user:

        # Validate logged user role can approve or reject
        role = Role.objects.filter(id=request.user.profile.role.id, approve_queue=True)

        if role:
          queue_id = request.data.get("queue_id", None)
          action = request.data.get("action", None)
          hilsc_verified = request.data.get("hilsc_verified", False)

          if queue_id and action:
            agency_queue = AgencyQueue.objects.get(id=queue_id)

            if action == "approve":
              if agency_queue.action == UserActions.ADD.value:
                Agency.custom_create(
                  user=request.user,
                  agency=agency_queue,
                  hilsc_verified=hilsc_verified,
                  emergency_mode=False
                )
              elif agency_queue.action == UserActions.UPDATE.value:
                Agency.custom_update(
                  user=request.user,
                  agency=agency_queue,
                  agency_id=agency_queue.related_agency_id,
                  hilsc_verified=hilsc_verified,
                  emergency_mode=False
                )
              elif agency_queue.action == UserActions.DELETE.value:
                agency = Agency.objects.get(id=agency_queue.related_agency_id)
                agency.delete()

              ActionLog.objects.create(
                  info=agency_queue.name,
                  additional_info=[
                    agency_queue.requested_by_email,
                    agency_queue.action,
                    agency_queue.related_agency_id
                  ],
                  action="approved",
                  model="agency queue",
                  created_by=request.user
              )
            else:
              ActionLog.objects.create(
                  info=agency_queue.name,
                  additional_info=[
                    agency_queue.requested_by_email,
                    agency_queue.action
                  ],
                  action="rejected",
                  model="agency queue",
                  created_by=request.user
              )

            agency_queue.delete()

            return JsonResponse(
              {
                "message": "Agency queue {} successfully.".format(action),
              }
            )
    except Exception as e:
      logger.error("Error approving/rejecting agency queue", e)
      return JsonResponse(
        {
          "message": "Error approving/rejecting agency queue",
        }, status=500
      )

class QueueProgramView(APIView):
  permission_classes = [IsAuthenticated]
  
  def get(self, request, id):
    try:
      program_queue = ProgramQueue.objects.get(id=id)
      program_dict = None

      try:
        program = Program.objects.get(id=program_queue.related_program_id)
        program_dict = model_to_dict(program)
        program_dict["agency_name"] = program.agency.name
        program_dict["agency_slug"] = program.agency.slug
      except Program.DoesNotExist:
        pass

      program_queue_dict = model_to_dict(program_queue)
      if not program_dict:
        program_dict = program_queue_dict
        program_dict["agency_name"] = program_queue.agency.name
        program_dict["agency_slug"] = program_queue.agency.slug

      app_settings = AppSettings.objects.first()

      return JsonResponse(
          {
              "program": program_dict,
              "program_queue": program_queue_dict,
              "emergency_mode_on": app_settings.emergency_mode
          },
          safe=False,
      )
    except Exception as e:
      logger.error("Error getting Program queue", e)
      return JsonResponse(
        {
          "message": "Error getting Program queue",
        }, status=500
      )
  
  @transaction.atomic
  def post(self, request):
    try:
      if request.user:

        # Validate logged user role can approve or reject
        role = Role.objects.filter(id=request.user.profile.role.id, approve_queue=True)

        if role:
          queue_id = request.data.get("queue_id", None)
          action = request.data.get("action", None)

          if queue_id and action:
            program_queue = ProgramQueue.objects.get(id=queue_id)

            if action == "approve":
              if program_queue.action == UserActions.ADD.value:
                Program.custom_create(
                  user=request.user,
                  program=program_queue,
                  emergency_mode=False
                )
              elif program_queue.action == UserActions.UPDATE.value:
                Program.custom_update(
                  user=request.user,
                  program=program_queue,
                  program_id=program_queue.related_program_id,
                  emergency_mode=False
                )
              elif program_queue.action == UserActions.DELETE.value:
                program = Program.objects.get(id=program_queue.related_program_id)
                program.delete()

              ActionLog.objects.create(
                  info=program_queue.name,
                  additional_info=[
                    program_queue.requested_by_email,
                    program_queue.action,
                    program_queue.related_program_id
                  ],
                  action="approved",
                  model="program queue",
                  created_by=request.user
              )
            else:
              ActionLog.objects.create(
                  info=program_queue.name,
                  additional_info=[
                    program_queue.requested_by_email,
                    program_queue.action
                  ],
                  action="rejected",
                  model="program queue",
                  created_by=request.user
              )

            program_queue.delete()

            return JsonResponse(
              {
                "message": "Program queue {} successfully.".format(action),
              }
            )
    except Exception as e:
      logger.error("Error approving/rejecting program queue", e)
      return JsonResponse(
        {
          "message": "Error approving/rejecting program queue",
        }, status=500
      )

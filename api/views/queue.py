from django.http import JsonResponse
from django.core.paginator import Paginator
from django.forms.models import model_to_dict

from rest_framework.views import APIView
from rest_framework.views import status

from api.models.agency import Agency
from api.models.agency import AgencyQueue

from api.models.program import Program
from api.models.program import ProgramQueue

import logging
import json

logger = logging.getLogger(__name__)

class QueueListView(APIView):
  def get(self, request):
    try:
      if request.user and request.user.is_active:
        page = request.GET.get("page", 1)

        agency_queue = AgencyQueue.objects.all()
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
                "emergency_mode": agency_q.emergency_mode,
            })

        program_queue = ProgramQueue.objects.all()
        for program_q in program_queue:
            results.append({
                "id": program_q.id,
                "name": program_q.name,
                "model": "Program",
                "model_id": program_q.related_program_id,
                "action": program_q.action,
                "requestor_name": program_q.requested_by_name,
                "requestor_email": program_q.requested_by_email,
                "emergency_mode": program_q.emergency_mode,
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
              "error": True,
              "message": "Error getting results",
          }, status=500
      )

class QueueAgencyView(APIView):
  def get(self, request, id):
    try:
      agency_queue = AgencyQueue.objects.get(id=id)
      agency_dict = None

      try:
        agency = Agency.objects.get(id=agency_queue.related_agency_id)
        agency_dict = model_to_dict(agency)
      except Agency.DoesNotExist:
        pass

      agency_queue_dict = model_to_dict(agency_queue)
      if not agency_dict:
        agency_dict = agency_queue_dict

      return JsonResponse(
          {
              "agency": agency_dict,
              "agency_queue": agency_queue_dict
          },
          safe=False,
      )
    except Exception as e:
      logger.error("Error getting Agency queue", e)
      return JsonResponse(
        {
          "error": True,
          "message": "Error getting agency queue",
        }, status=200
      )
    
  def post(self, request):
    # Approve or Reject
    pass


class QueueProgramView(APIView):
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

      return JsonResponse(
          {
              "program": program_dict,
              "program_queue": program_queue_dict
          },
          safe=False,
      )
    except Exception as e:
      logger.error("Error getting Program queue", e)
      return JsonResponse(
        {
          "error": True,
          "message": "Error getting Program queue",
        }, status=200
      )
    
  def post(self, request):
    # Approve or Reject
    pass

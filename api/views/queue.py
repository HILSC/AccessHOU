import logging
import json

from django.core.paginator import Paginator
from django.db import transaction
from django.http import JsonResponse
from django.forms.models import model_to_dict
from django.utils.text import slugify
from django.utils.timezone import now

from rest_framework.views import APIView
from rest_framework.views import status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated

from api.models.action_log import ActionLog
from api.models.agency import Agency
from api.models.agency import AgencyQueue
from api.models.app_settings import AppSettings
from api.models.program import Program
from api.models.program import ProgramQueue

from api.models.user import Role

from api.utils import getGeocodingByAddress
from api.utils import isProgramAccessibilityCompleted
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
      logger.error("Error getting Queue: {}".format(str(e)))
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
      logger.error("Error getting Agency queue: {}".format(str(e)))
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
              action = "approved"
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
              action = "rejected"

            agency_queue.delete()

            return JsonResponse(
              {
                "message": "Agency queue {} successfully.".format(action),
              }
            )
    except Exception as e:
      logger.error("Error approving/rejecting agency queue: {}".format(str(e)))
      return JsonResponse(
        {
          "message": "Error approving/rejecting agency queue",
        }, status=500
      )

  @transaction.atomic
  def put(self, request, id):
      try:
        if request.user and request.user.is_active:
          # Find agency queue
          id = int(request.data.get("id", 0))
          agency_name = request.data.get("name", None)
          slug = slugify(agency_name)

          agency_in_queue = AgencyQueue.objects.get(id=id)

          if agency_in_queue.action in [UserActions.DELETE.value, UserActions.UPDATE.value]:
            related_agency = Agency.objects.get(id=agency_in_queue.related_agency_id)
            # Verify if agency exists with that slug
            if (
              Agency.objects.filter(
                  slug=slug
              ).exclude(
                  id=related_agency.id
              ).exists()
              or AgencyQueue.objects.filter(
                slug=slug
              ).exclude(
                related_agency=related_agency
              ).exists()
            ):
              return JsonResponse(
                {
                  "error": True,
                  "message": "An Agency with that name already exists."
                }
              )

          # Address
          street = request.data.get("street", None)
          city = request.data.get("city", None)
          state = request.data.get("state", None)
          zip_code = request.data.get("zip_code", None)
          geocode = agency_in_queue.geocode

          # Geocode
          if agency_in_queue.street != street or agency_in_queue.city != city or agency_in_queue.state != state or agency_in_queue.zip_code != zip_code:
            geocode = getGeocodingByAddress(
              street=street,
              city=city,
              state=state,
              zip_code=zip_code,
            )

          agency_queue, created = AgencyQueue.objects.update_or_create(
              id=agency_in_queue.id,
              defaults={
                  "name":agency_name,
                  "slug":slug,
                  "website":request.data.get("website", None),
                  "phone":request.data.get("phone", None),
                  
                  # Address
                  "street":street,
                  "city":city,
                  "state":state,
                  "zip_code":zip_code,
                  "geocode":geocode,

                  "next_steps":request.data.get("next_steps", None),
                  "payment_options":request.data.get("payment_options", None),

                  # Eligibility
                  "age_groups":request.data.get("age_groups", None),
                  "zip_codes":request.data.get("zip_codes", None),
                  "gender":request.data.get("gender", None),
                  "immigration_statuses":request.data.get("immigration_statuses", None),

                  # Requirements
                  "accepted_ids_current":request.data.get("accepted_ids_current", None),
                  "accepted_ids_expired":request.data.get("accepted_ids_expired", None),
                  "notes":request.data.get("notes", None),
                  "proof_of_address":request.data.get("proof_of_address", None),

                  # Schedule
                  "schedule":request.data.get("schedules", None),
                  "schedule_notes":request.data.get("schedule_notes", None),
                  "holiday_schedule":request.data.get("holiday_schedule", None),

                  # Languages
                  "languages":request.data.get("languages", None),
                  "documents_languages":request.data.get("documents_languages", None),
                  "website_languages":request.data.get("website_languages", None),
                  "frontline_staff_languages":request.data.get(
                      "frontline_staff_languages", None
                  ),
                  "interpretations_available":request.data.get(
                      "interpretations_available", None
                  ),

                  # Services
                  "assistance_with_forms":request.data.get(
                      "assistance_with_forms", None
                  ),
                  "visual_aids":request.data.get("visual_aids", None),
                  "ada_accessible":request.data.get("ada_accessible", None),

                  # Policies
                  "response_requests":request.data.get("response_requests", None),
                  "cultural_training":request.data.get("cultural_training", None),

                  "updated_by": request.user,
                  "updated_at": now
              },
          )
          return JsonResponse(
              {
                  "message": "Agency queue was updated successfully.",
              }
          )

        raise Exception('User does not have permissions.')
      except Exception as e:
        logger.error("Error updating agency: {}".format(str(e)))
        return JsonResponse(
            {
                "message": "Agency cannot be updated. Please try again!"
            }, status=500
        )

class QueueProgramView(APIView):
  permission_classes = [IsAuthenticated]
  
  def get(self, request, id):
    try:
      program_queue = ProgramQueue.objects.get(id=id)

      try:
        program = Program.objects.get(id=program_queue.related_program_id)
        program_dict = model_to_dict(program)
        program_dict["agency_name"] = program.agency.name
        program_dict["agency_slug"] = program.agency.slug
      except Program.DoesNotExist:
        program_dict = None

      program_queue_dict = model_to_dict(program_queue)
      program_queue_dict["agency"] = { "id": program_queue.agency.id}
      program_queue_dict["agency_name"] = program_queue.agency.name
      program_queue_dict["agency_slug"] = program_queue.agency.slug
      if not program_dict:
        program_dict = program_queue_dict
        
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
      logger.error("Error getting Program queue: {}".format(str(e)))
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
              action = "approved"
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
              action = "rejected"

            program_queue.delete()

            return JsonResponse(
              {
                "message": "Program queue {} successfully.".format(action),
              }
            )
    except Exception as e:
      logger.error("Error approving/rejecting program queue: {}".format(str(e)))
      return JsonResponse(
        {
          "message": "Error approving/rejecting program queue",
        }, status=500
      )

  @transaction.atomic
  def put(self, request, id):
    try:
      if request.user and request.user.is_active:
        # Find program
        program_in_queue = ProgramQueue.objects.get(id=id)

        program_name = request.data.get("name", None)
        slug = slugify(program_name)

        # Agency
        agency = Agency.objects.get(id=program_in_queue.agency.id)

        if program_in_queue.action in [UserActions.DELETE.value, UserActions.UPDATE.value]:
          related_program = Program.objects.get(id=program_in_queue.related_program_id)
          # Verify if program exists with that slug
          if (
            Program.objects.filter(
              slug=slug,
              agency=agency
            ).exclude(
              id=related_program.id
            ).exists()
            or ProgramQueue.objects.filter(
              slug=slug,
              agency=agency
            ).exclude(
              related_program=related_program
            ).exists()
          ):
            return JsonResponse(
              {
                "error": True,
                "message": "A program with that name already exists.",
              }
            )

        street = request.data.get("street", None)
        city = request.data.get("city", None)
        state = request.data.get("state", None)
        zip_code = request.data.get("zip_code", None)
        geocode = program_in_queue.geocode

        if program_in_queue.street != street or program_in_queue.city != city or program_in_queue.state != state or program_in_queue.zip_code != zip_code:
          geocode = getGeocodingByAddress(
            street=street,
            city=city,
            state=state,
            zip_code=zip_code,
          )

        # If user is logged in, this program doesn't have to go to the queue.
        program_queue, created = ProgramQueue.objects.update_or_create(
          id=program_in_queue.id,
          defaults={
            "name": program_name,
            "slug": slug,
            "description": request.data.get("description", None),
            "service_types": request.data.get("service_types", None),
            "case_management_provided": request.data.get(
                "case_management_provided", None
            ),
            "case_management_notes": request.data.get(
                "case_management_notes", None
            ),
            "website": request.data.get("website", None),
            "phone": request.data.get("phone", None),
            "street": street,
            "city": city,
            "state": state,
            "zip_code": zip_code,
            "geocode": geocode,
            "next_steps": request.data.get("next_steps", None),
            "payment_service_cost": request.data.get(
              "payment_service_cost", None
            ),
            "payment_options": request.data.get("payment_options", None),
            "age_groups": request.data.get("age_groups", None),
            "zip_codes": request.data.get("zip_codes", None),
            "incomes_percent_poverty_level": request.data.get(
              "incomes_percent_poverty_level", None
            ),
            "immigration_statuses": request.data.get(
              "immigration_statuses", None
            ),
            "requires_enrollment_in": request.data.get(
              "requires_enrollment_in", None
            ),
            "other_requirements": request.data.get(
                "other_requirements", None
            ),
            "documents_required": request.data.get(
              "documents_required", None
            ),
            "schedule": request.data.get("schedules", None),
            "walk_in_schedule": request.data.get("walk_in_schedule", None),
            "schedule_notes": request.data.get("schedule_notes", None),
            "holiday_schedule": request.data.get("holiday_schedule", None),
            "appointment_required": request.data.get(
              "appointment_required", None
            ),
            "appointment_notes": request.data.get(
              "appointment_notes", None
            ),
            "service_same_day_intake": request.data.get(
              "service_same_day_intake", None
            ),
            "intake_notes": request.data.get("intake_notes", None),
            "languages": request.data.get("languages", None),
            "crisis": request.data.get("crisis", None),
            "disaster_recovery": request.data.get(
              "disaster_recovery", None
            ),
            "transportation": request.data.get("transportation", None),
            "client_consult": request.data.get("client_consult", None),
            "updated_by": request.user,
            "updated_at": now
          },
        )

        # Immigration Accessibility Profile
        program_queue.immigration_accessibility_profile = isProgramAccessibilityCompleted(program_queue)
        program_queue.save()

        return JsonResponse(
          {
              "message": "Program agency was updated successfully.",
          }
        )
      
      raise Exception('User does not have permissions.')
    except Exception as e:
        logger.error("Error updating program: {}".format(str(e)))
        return JsonResponse(
            {
                "message": "Program cannot be updated. Please try again!"
            }, status=500
        )


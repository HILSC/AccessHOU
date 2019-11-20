from django.db import transaction
from django.http import JsonResponse
from django.core import serializers
from django.core.paginator import Paginator
from django.utils.text import slugify
from django.forms.models import model_to_dict

from rest_framework.views import APIView
from rest_framework import permissions

from api.models.agency import Agency
from api.models.agency import AgencyQueue
from api.models.agency import AgencyEmergencyQueue
from api.models.action_log import ActionLog
from api.models.user import Role
from api.models.app_settings import AppSettings

from api.models.program import Program
from api.utils import getGeocodingByAddress
from api.utils import getMapURL
from api.utils import UserActions
from api.models.user import Role

import logging
import json
import re

logger = logging.getLogger(__name__)


class AgencyQueueView(APIView):
    permission_classes = (permissions.AllowAny,)

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            agency_name = request.data.get("name", None)
            slug = slugify(agency_name)

            # Verify if agency exists with that slug
            if (
                Agency.objects.filter(slug=slug).exists()
                or AgencyQueue.objects.filter(slug=slug).exists()
            ):
                return JsonResponse(
                    {
                        "error": True,
                        "message": "An Agency with that name already exists.",
                    },
                    status=200,
                )

            # Address
            street = request.data.get("street", None)
            city = request.data.get("city", None)
            state = request.data.get("state", None)
            zip_code = request.data.get("zip_code", None)
            geocode = None

            # Geocode
            if street and city and state and zip_code:
                geocode = getGeocodingByAddress(
                    street=street,
                    city=city,
                    state=state,
                    zip_code=zip_code,
                )

            agency = AgencyQueue.objects.create(
                name=agency_name,
                slug=slug,
                website=request.data.get("website", None),
                phone=request.data.get("phone", None),
                
                # Address
                street=street,
                city=city,
                state=state,
                zip_code=zip_code,
                geocode=geocode,

                next_steps=request.data.get("next_steps", None),
                payment_options=request.data.get("payment_options", None),

                # Eligibility
                age_groups=request.data.get("age_groups", None),
                zip_codes=request.data.get("zip_codes", None),
                gender=request.data.get("gender", None),
                immigration_statuses=request.data.get("immigration_statuses", None),

                # Requirements
                accepted_ids_current=request.data.get("accepted_ids_current", None),
                accepted_ids_expired=request.data.get("accepted_ids_expired", None),
                notes=request.data.get("notes", None),
                proof_of_address=request.data.get("proof_of_address", None),

                # Schedule
                schedule=request.data.get("schedules", None),
                schedule_notes=request.data.get("schedule_notes", None),
                holiday_schedule=request.data.get("holiday_schedule", None),

                # Languages
                languages=request.data.get("languages", None),
                documents_languages=request.data.get("documents_languages", None),
                website_languages=request.data.get("website_languages", None),
                frontline_staff_languages=request.data.get(
                    "frontline_staff_languages", None
                ),
                interpretations_available=request.data.get(
                    "interpretations_available", None
                ),

                # Services
                assistance_with_forms=request.data.get(
                    "assistance_with_forms", None
                ),
                visual_aids=request.data.get("visual_aids", None),
                ada_accessible=request.data.get("ada_accessible", None),

                # Policies
                response_requests=request.data.get("response_requests", None),
                cultural_training=request.data.get("cultural_training", None),

                requested_by_name=request.data.get("requested_by_name", None),
                requested_by_email=request.data.get("requested_by_email", None),
                action=UserActions.ADD.value,
            )

            # Check if in Emergency Mode
            app_settings = AppSettings.objects.first()
            if agency and app_settings and app_settings.emergency_mode:
                agency.emergency_mode = app_settings.emergency_mode
                agency.save()

                # Create the agency in the final table api_agencies with emergency_mode equal to True
                Agency.custom_create(agency=agency)

            return JsonResponse(
                {
                    "agency": {
                        "id": agency.id,
                        "slug": agency.slug,
                        "name": agency.name,
                        "emergency_mode": agency.emergency_mode
                    },
                    "model": "queue",
                }
            )
        except Exception:
            logger.error("Error requesting to create a new agency")
            return JsonResponse(
                {"message": "Request couldn't be completed. Please try again!",}, status=500
            )

    @transaction.atomic
    def put(self, request, *args, **kwargs):
        try:
            agency_name = request.data.get("name", None)
            slug = slugify(agency_name)

            # Agency
            related_agency_id = int(request.data.get("id", 0))
            related_agency = Agency.objects.get(id=related_agency_id)

            # Verify if agency exists with that slug
            if (
                Agency.objects.filter(slug=slug).exclude(id=related_agency_id).exists()
                or AgencyQueue.objects.filter(slug=slug)
                .exclude(related_agency_id=related_agency_id)
                .exists()
            ):
                return JsonResponse(
                    {
                        "error": True,
                        "message": "An Agency with that name already exists."
                    }, status=200
                )

            # Address
            street = request.data.get("street", None)
            city = request.data.get("city", None)
            state = request.data.get("state", None)
            zip_code = request.data.get("zip_code", None)
            geocode = related_agency.geocode

            # Geocode
            if related_agency.street != street or related_agency.city != city or related_agency.state != state or related_agency.zip_code != zip_code:
                geocode = getGeocodingByAddress(
                    street=street,
                    city=city,
                    state=state,
                    zip_code=zip_code,
                )

            agency = AgencyQueue.objects.create(
                name=agency_name,
                slug=slug,
                website=request.data.get("website", None),
                phone=request.data.get("phone", None),
                
                # Address
                street=street,
                city=city,
                state=state,
                zip_code=zip_code,
                geocode=geocode,

                next_steps=request.data.get("next_steps", None),
                payment_options=request.data.get("payment_options", None),

                # Eligibility
                age_groups=request.data.get("age_groups", None),
                zip_codes=request.data.get("zip_codes", None),
                gender=request.data.get("gender", None),
                immigration_statuses=request.data.get("immigration_statuses", None),

                # Requirements
                accepted_ids_current=request.data.get("accepted_ids_current", None),
                accepted_ids_expired=request.data.get("accepted_ids_expired", None),
                notes=request.data.get("notes", None),
                proof_of_address=request.data.get("proof_of_address", None),

                # Schedule
                schedule=request.data.get("schedules", None),
                schedule_notes=request.data.get("schedule_notes", None),
                holiday_schedule=request.data.get("holiday_schedule", None),

                # Languages
                languages=request.data.get("languages", None),
                documents_languages=request.data.get("documents_languages", None),
                website_languages=request.data.get("website_languages", None),
                frontline_staff_languages=request.data.get(
                    "frontline_staff_languages", None
                ),
                interpretations_available=request.data.get(
                    "interpretations_available", None
                ),

                # Services
                assistance_with_forms=request.data.get(
                    "assistance_with_forms", None
                ),
                visual_aids=request.data.get("visual_aids", None),
                ada_accessible=request.data.get("ada_accessible", None),

                # Policies
                response_requests=request.data.get("response_requests", None),
                cultural_training=request.data.get("cultural_training", None),

                requested_by_name=request.data.get("requested_by_name", None),
                requested_by_email=request.data.get("requested_by_email", None),
                related_agency=related_agency,
                action=UserActions.UPDATE.value,
            )

            # Check if in Emergency Mode
            app_settings = AppSettings.objects.first()
            if agency and app_settings and app_settings.emergency_mode:
                agency.emergency_mode = app_settings.emergency_mode
                agency.save()

                # Save original agency in temporary emergency backup table
                AgencyEmergencyQueue.custom_create(agency=related_agency)

                # Update the agency in the final table api_agencies with emergency_mode equal to True
                Agency.custom_update(agency=agency, agency_id=related_agency.id)

            return JsonResponse(
                {
                    "agency": {
                        "id": related_agency.id,
                        "slug": related_agency.slug,
                        "name": related_agency.name,
                        "emergency_mode": agency.emergency_mode
                    },
                    "model": "queue",
                }
            )
        except Exception:
            logger.error("Error requesting to update agency {}".format(related_agency.name))
            return JsonResponse(
                {"message": "Request couldn't be completed. Please try again!",}, status=500
            )


class AgencyQueueDeleteView(APIView):
    permission_classes = (permissions.AllowAny,)

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            related_agency_id = int(request.data.get("id", 0))
            related_agency = Agency.objects.get(id=related_agency_id)

            AgencyQueue.objects.create(
                name=related_agency.name,
                slug=related_agency.name,
                requested_by_name=request.data.get("requested_by_name", None),
                requested_by_email=request.data.get("requested_by_email", None),
                related_agency=related_agency,
                action=UserActions.DELETE.value
            )

            return JsonResponse(
                {
                    "agency": {
                        "id": related_agency.id,
                        "slug": related_agency.slug,
                        "name": related_agency.name,
                    },
                    "model": "queue",
                }
            )
        except Exception:
            logger.error("Error requesting to delete an agency")
            return JsonResponse(
                {"message": "Request couldn't be completed. Please try again!",}, status=500
            )


class AgencyQueueListView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        pass


class AgencyView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, property_name, property_value):
        try:
            kw = {property_name: property_value}
            agency = Agency.objects.get(**kw)
            agency_dict = model_to_dict(agency)
            agency_programs = Program.objects.filter(agency_id=agency.id)
            agency_program_list = []
            for program in agency_programs:
                agency_program_list.append(model_to_dict(program))

            agency_dict['state'] = None
            if agency.state:
                agency_dict['state'] = agency.state.capitalize()

            agency_dict["programs"] = agency_program_list
            agency_dict['map_url'] = getMapURL(agency)
            agency_dict['update_at'] = agency.updated_at.strftime('%b/%d/%Y')
            return JsonResponse(agency_dict, safe=False)
        except (Agency.DoesNotExist, Program.DoesNotExist):
            return JsonResponse(
                {
                    "error": True,
                    "message": "Agency with {} {} doesn't exists.".format(
                        property_name, property_value
                    ),
                }
            )

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            if request.user and request.user.is_active:
                agency_name = request.data.get("name", None)
                slug = slugify(agency_name)

                # Verify if agency exists with that slug
                if Agency.objects.filter(slug=slug).exists():
                    return JsonResponse(
                        {
                            "error": True,
                            "message": "An agency with that name already exists.",
                        }
                    )

                # Address
                street = request.data.get("street", None)
                city = request.data.get("city", None)
                state = request.data.get("state", None)
                zip_code = request.data.get("zip_code", None)
                geocode = None

                # Geocode
                if street and city and state and zip_code:
                    geocode = getGeocodingByAddress(
                        street=street,
                        city=city,
                        state=state,
                        zip_code=zip_code,
                    )

                agency = Agency.objects.create(
                    name=agency_name,
                    slug=slug,
                    phone=request.data.get("phone", None),
                    website=request.data.get("website", None),
                    street=street,
                    city=city,
                    state=state,
                    zip_code=zip_code,
                    geocode=geocode,
                    next_steps=request.data.get("next_steps", None),
                    payment_options=request.data.get("payment_options", None),
                    age_groups=request.data.get("age_groups", None),
                    zip_codes=request.data.get("zip_codes", None),
                    gender=request.data.get("gender", None),
                    immigration_statuses=request.data.get("immigration_statuses", None),
                    accepted_ids_current=request.data.get("accepted_ids_current", None),
                    accepted_ids_expired=request.data.get("accepted_ids_expired", None),
                    notes=request.data.get("notes", None),
                    proof_of_address=request.data.get("proof_of_address", None),
                    schedule=request.data.get("schedules", None),
                    schedule_notes=request.data.get("schedule_notes", None),
                    holiday_schedule=request.data.get("holiday_schedule", None),
                    languages=request.data.get("languages", None),
                    documents_languages=request.data.get("documents_languages", None),
                    website_languages=request.data.get("website_languages", None),
                    frontline_staff_languages=request.data.get(
                        "frontline_staff_languages", None
                    ),
                    interpretations_available=request.data.get(
                        "interpretations_available", None
                    ),
                    assistance_with_forms=request.data.get(
                        "assistance_with_forms", None
                    ),
                    visual_aids=request.data.get("visual_aids", None),
                    ada_accessible=request.data.get("ada_accessible", None),
                    response_requests=request.data.get("response_requests", None),
                    cultural_training=request.data.get("cultural_training", None),
                    hilsc_verified=request.user.profile.role.HILSC_verified,
                    created_by=request.user,
                )

                return JsonResponse(
                    {
                        "agency": {
                            "id": agency.id,
                            "slug": agency.slug,
                            "name": agency.name,
                        },
                        "model": "agency",
                    }
                )

            raise Exception('User does not have permissions.')
        except Exception as e:
            logger.error("Error creating a new agency: {}".format(str(e)))
            return JsonResponse(
                {"error": "Agency cannot be created. Please try again!",}, status=500
            )

    @transaction.atomic
    def put(self, request, *args, **kwargs):
        try:
            if request.user and request.user.is_active:
                # Find agency
                id = int(request.data.get("id", 0))
                agency = Agency.objects.get(id=id)

                agency_name = request.data.get("name", None)
                slug = slugify(agency_name)

                # Verify if agency exists with that slug
                if (
                    Agency.objects.filter(slug=slug).exclude(id=agency.id).exists()
                    or AgencyQueue.objects.filter(slug=slug)
                    .exclude(related_agency_id=agency.id)
                    .exists()
                ):
                    return JsonResponse(
                        {
                            "error": True,
                            "message": "An Agency with that name already exists.",
                        },
                        status=200,
                    )

                street = request.data.get("street", None)
                city = request.data.get("city", None)
                state = request.data.get("state", None)
                zip_code = request.data.get("zip_code", None)
                geocode = agency.geocode

                if agency.street != street or agency.city != city or agency.state != state or agency.zip_code != zip_code:
                    geocode = getGeocodingByAddress(
                        street=street,
                        city=city,
                        state=state,
                        zip_code=zip_code,
                    )

                # If user is logged in, this agency doesn't have to go to the queue.
                agency, created = Agency.objects.update_or_create(
                    id=id,
                    defaults={
                        "name": agency_name,
                        "slug": slug,
                        "phone": request.data.get("phone", None),
                        "website": request.data.get("website", None),
                        "street": street,
                        "city": city,
                        "state": state,
                        "zip_code": zip_code,
                        "geocode": geocode,
                        "next_steps": request.data.get("next_steps", None),
                        "payment_options": request.data.get("payment_options", None),
                        "age_groups": request.data.get("age_groups", None),
                        "zip_codes": request.data.get("zip_codes", None),
                        "gender": request.data.get("gender", None),
                        "immigration_statuses": request.data.get(
                            "immigration_statuses", None
                        ),
                        "accepted_ids_current": request.data.get(
                            "accepted_ids_current", None
                        ),
                        "accepted_ids_expired": request.data.get(
                            "accepted_ids_expired", None
                        ),
                        "notes": request.data.get("notes", None),
                        "proof_of_address": request.data.get("proof_of_address", None),
                        "schedule": request.data.get("schedules", None),
                        "schedule_notes": request.data.get("schedule_notes", None),
                        "holiday_schedule": request.data.get("holiday_schedule", None),
                        "languages": request.data.get("languages", None),
                        "documents_languages": request.data.get(
                            "documents_languages", None
                        ),
                        "website_languages": request.data.get(
                            "website_languages", None
                        ),
                        "frontline_staff_languages": request.data.get(
                            "frontline_staff_languages", None
                        ),
                        "interpretations_available": request.data.get(
                            "interpretations_available", None
                        ),
                        "assistance_with_forms": request.data.get(
                            "assistance_with_forms", None
                        ),
                        "visual_aids": request.data.get("visual_aids", None),
                        "ada_accessible": request.data.get("ada_accessible", None),
                        "response_requests": request.data.get(
                            "response_requests", None
                        ),
                        "cultural_training": request.data.get(
                            "cultural_training", None
                        ),
                        "hilsc_verified": request.user.profile.role.HILSC_verified,
                        "updated_by": request.user,
                    },
                )
                return JsonResponse(
                    {
                        "agency": {
                            "id": agency.id,
                            "slug": agency.slug,
                            "name": agency.name,
                        },
                        "model": "agency",
                    }
                )

            raise Exception('User does not have permissions.')
        except Exception as e:
            logger.error("Error updating agency: {}".format(str(e)))
            return JsonResponse(
                {"message": "Agency cannot be updated. Please try again!",}, status=500
            )

    @transaction.atomic
    def delete(self, request, id, *args, **kwargs):
        agency = None
        agency_name = None
        try:
            if request.user and request.user.is_active:
                agency = Agency.objects.get(id=id)
                agency_name = agency.name
                agency_programs = list(Program.objects.filter(agency_id=agency.id).values_list('name', flat=True))
                
                ActionLog.objects.create(
                    info=agency.name,
                    additional_info=agency_programs,
                    action="delete",
                    model="agency",
                    created_by=request.user
                )

                agency.delete()

                return JsonResponse(
                    {
                        "agency": {
                            "name": agency_name
                        },
                        "model": "agency",
                    }
                )

            raise Exception('User does not have permissions.')
        except Exception as e:
            logger.error("Error deleting agency {}".format(str(e)))
            return JsonResponse(
                {"message": "Agency cannot be deleted. Please try again!",}, status=500
            )


class AgencyListView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, property_name, property_value, page):
        agency_list = None
        try:
            if property_value != "null":
                kw = {"{}__icontains".format(property_name): property_value}
                agency_list = Agency.objects.filter(**kw)
            else:
                agency_list = Agency.objects.all().order_by(
                    "-updated_at", "-created_at", "name"
                )

            paginator = Paginator(agency_list, 10)  # Show 10 agencies per page
            agencies = paginator.get_page(page)
            agencies_json = serializers.serialize("json", agencies.object_list)
            return JsonResponse(
                {
                    "results": json.loads(agencies_json),
                    "total_records": paginator.count,
                    "total_pages": paginator.num_pages,
                    "page": agencies.number,
                    "has_next": agencies.has_next(),
                    "has_prev": agencies.has_previous(),
                },
                safe=False,
            )
        except Agency.DoesNotExist:
            logger.error("Agency does not exists.")
            return JsonResponse(
                {
                    "error": True,
                    "message": "Agency with {} {} doesn't exists.".format(
                        property_name, property_value
                    ),
                }
            )

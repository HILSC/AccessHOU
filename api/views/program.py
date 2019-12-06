import logging
import json
import re

from django.db import transaction
from django.core import serializers
from django.forms.models import model_to_dict
from django.http import JsonResponse
from django.utils.text import slugify
from django.utils.timezone import now

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView

from api.models.program import Program
from api.models.program import ProgramEmergencyQueue
from api.models.program import ProgramQueue

from api.models.action_log import ActionLog
from api.models.agency import Agency
from api.models.app_settings import AppSettings

from api.utils import getGeocodingByAddress
from api.utils import isProgramAccessibilityCompleted
from api.utils import getMapURL
from api.utils import UserActions

logger = logging.getLogger(__name__)


class ProgramQueueView(APIView):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            program_name = request.data.get("name", None)
            slug = slugify(program_name)

            # Agency
            agency = None
            agency_id = int(request.data.get("agency_id", 0))
            if agency_id > 0:
                agency = Agency.objects.get(id=agency_id)

            # Verify if program exists with that slug
            if (
                Program.objects.filter(
                    slug=slug,
                    agency_id=agency_id
                ).exists()
                or ProgramQueue.objects.filter(
                    slug=slug,
                    agency_id=agency_id
                ).exists()
            ):
                return JsonResponse(
                    {
                        "error": True,
                        "message": "A program with that name already exists.",
                    }
                )

            # Address
            street = request.data.get("street", None)
            city = request.data.get("city", None)
            state = request.data.get("state", None)
            zip_code = request.data.get("zip_code", None)
            geocode = agency.geocode

            # Geocode
            if agency.street != street or agency.city != city or agency.state != state or agency.zip_code != zip_code:
                geocode = getGeocodingByAddress(
                    street=street,
                    city=city,
                    state=state,
                    zip_code=zip_code,
                )

            program = ProgramQueue.objects.create(
                name=program_name,
                slug=slug,
                description=request.data.get("description", None),
                service_types=request.data.get("service_types", None),
                case_management_provided=request.data.get(
                    "case_management_provided", None
                ),
                case_management_notes=request.data.get(
                    "case_management_notes", None
                ),
                website=request.data.get("website", None),
                phone=request.data.get("phone", None),

                # Address
                street=street,
                city=city,
                state=state,
                zip_code=zip_code,
                geocode=geocode,

                next_steps=request.data.get("next_steps", None),
                payment_service_cost=request.data.get("payment_service_cost", None),
                payment_options=request.data.get("payment_options", None),

                # Eligibility
                age_groups=request.data.get("age_groups", None),
                zip_codes=request.data.get("zip_codes", None),
                incomes_percent_poverty_level=request.data.get(
                    "incomes_percent_poverty_level", None
                ),
                immigration_statuses=request.data.get("immigration_statuses", None),

                # Requirements
                requires_enrollment_in=request.data.get(
                    "requires_enrollment_in", None
                ),
                other_requirements=request.data.get("other_requirements", None),
                documents_required=request.data.get("documents_required", None),
                appointment_required=request.data.get("appointment_required", None),
                appointment_notes=request.data.get("appointment_notes", None),

                # Schedule
                schedule=request.data.get("schedules", None),
                walk_in_schedule=request.data.get("walk_in_schedule", None),
                schedule_notes=request.data.get("schedule_notes", None),
                holiday_schedule=request.data.get("holiday_schedule", None),
                
                # Intake
                service_same_day_intake=request.data.get(
                    "service_same_day_intake", None
                ),
                intake_notes=request.data.get("intake_notes", None),

                # Language
                languages=request.data.get("languages", None),

                # Services
                crisis=request.data.get("crisis", None),
                disaster_recovery=request.data.get("disaster_recovery", None),
                transportation=request.data.get("transportation", None),
                client_consult=request.data.get("client_consult", None),

                agency=agency,
                requested_by_name=request.data.get("requested_by_name", None),
                requested_by_email=request.data.get("requested_by_email", None),
                action=UserActions.ADD.value,
                created_at=now
            )

            # Immigration Accessibility Profile
            program.immigration_accessibility_profile = isProgramAccessibilityCompleted(program)
            program.save()

            # Check if in Emergency Mode
            app_settings = AppSettings.objects.first()
            if program and app_settings and app_settings.emergency_mode:
                # Create the program in the final table api_programs with emergency_mode equal to True
                new_program = Program.custom_create(user=None, program=program)

                # Update related program id in program in queue
                program.emergency_mode = app_settings.emergency_mode
                program.related_program = new_program
                program.save()

            return JsonResponse(
                {
                    "program": {
                        "id": program.id,
                        "slug": program.slug,
                        "name": program.name,
                        "emergency_mode": program.emergency_mode
                    },
                    "model": "queue",
                }
            )
        except Exception as e:
            logger.error("Error request to create a new program: {}".format(str(e)))
            return JsonResponse(
                {
                    "message": "Request couldn't be completed. Please try again!"
                }, status=500
            )

    @transaction.atomic
    def put(self, request, *args, **kwargs):
        try:
            import pdb; pdb.set_trace()
            program_name = request.data.get("name", None)
            slug = slugify(program_name)

            # Agency
            agency = None
            agency_id = int(request.data.get("agency", 0))
            if agency_id > 0:
                agency = Agency.objects.get(id=agency_id)

            # Program
            related_program_id = int(request.data.get("program_id", 0))
            related_program = Program.objects.get(id=related_program_id)

            # Verify if program exists with that slug
            if (
                Program.objects.filter(
                    slug=slug,
                    agency_id=agency.id
                )
                .exclude(
                    id=related_program_id
                ).exists()
                or ProgramQueue.objects.filter(
                    slug=slug,
                    agency_id=agency.id
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
            geocode = agency.geocode

            if agency.street != street or agency.city != city or agency.state != state or agency.zip_code != zip_code:
                geocode = getGeocodingByAddress(
                    street=street,
                    city=city,
                    state=state,
                    zip_code=zip_code,
                )

            # If related program has emergency mode = True we have to check if there is already
            # a row in queue for that program, in that case we just need to update the actual queue
            try:
                existing_new_program = ProgramQueue.objects.get(
                    related_program=related_program,
                    action=UserActions.ADD.value,
                )
            except ProgramQueue.DoesNotExist:
                existing_new_program = None

            if related_program.emergency_mode and existing_new_program:
                program, crated = ProgramQueue.objects.update_or_create(
                    id=existing_new_program.id,
                    defaults={
                        # General
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

                        # Address
                        "street": street,
                        "city": city,
                        "state": state,
                        "zip_code": zip_code,
                        "geocode": geocode,

                        "next_steps": request.data.get("next_steps", None),
                        "payment_service_cost": request.data.get("payment_service_cost", None),
                        "payment_options": request.data.get("payment_options", None),

                        # Eligibility
                        "age_groups": request.data.get("age_groups", None),
                        "zip_codes": request.data.get("zip_codes", None),
                        "incomes_percent_poverty_level": request.data.get(
                            "incomes_percent_poverty_level", None
                        ),
                        "immigration_statuses": request.data.get("immigration_statuses", None),

                        # Requirements
                        "requires_enrollment_in": request.data.get(
                            "requires_enrollment_in", None
                        ),
                        "other_requirements": request.data.get("other_requirements", None),
                        "documents_required": request.data.get("documents_required", None),
                        "appointment_required": request.data.get("appointment_required", None),
                        "appointment_notes": request.data.get("appointment_notes", None),
                        
                        # Schedule
                        "schedule": request.data.get("schedules", None),
                        "walk_in_schedule": request.data.get("walk_in_schedule", None),
                        "schedule_notes": request.data.get("schedule_notes", None),
                        "holiday_schedule": request.data.get("holiday_schedule", None),
                        
                        # Intake
                        "service_same_day_intake": request.data.get(
                            "service_same_day_intake", None
                        ),
                        "intake_notes": request.data.get("intake_notes", None),

                        # Language
                        "languages": request.data.get("languages", None),

                        # Services
                        "crisis": request.data.get("crisis", None),
                        "disaster_recovery": request.data.get("disaster_recovery", None),
                        "transportation": request.data.get("transportation", None),
                        "client_consult": request.data.get("client_consult", None),

                        "requested_by_name": request.data.get("requested_by_name", None),
                        "requested_by_email": request.data.get("requested_by_email", None),

                        "action": UserActions.UPDATE.value,

                        "updated_at": now
                    },
                )
            else:
                program = ProgramQueue.objects.create(
                    # General
                    name=program_name,
                    slug=slug,
                    description=request.data.get("description", None),
                    service_types=request.data.get("service_types", None),
                    case_management_provided=request.data.get(
                        "case_management_provided", None
                    ),
                    case_management_notes=request.data.get(
                        "case_management_notes", None
                    ),
                    website=request.data.get("website", None),
                    phone=request.data.get("phone", None),

                    # Address
                    street=street,
                    city=city,
                    state=state,
                    zip_code=zip_code,
                    geocode=geocode,

                    next_steps=request.data.get("next_steps", None),
                    payment_service_cost=request.data.get("payment_service_cost", None),
                    payment_options=request.data.get("payment_options", None),

                    # Eligibility
                    age_groups=request.data.get("age_groups", None),
                    zip_codes=request.data.get("zip_codes", None),
                    incomes_percent_poverty_level=request.data.get(
                        "incomes_percent_poverty_level", None
                    ),
                    immigration_statuses=request.data.get("immigration_statuses", None),

                    # Requirements
                    requires_enrollment_in=request.data.get(
                        "requires_enrollment_in", None
                    ),
                    other_requirements=request.data.get("other_requirements", None),
                    documents_required=request.data.get("documents_required", None),
                    appointment_required=request.data.get("appointment_required", None),
                    appointment_notes=request.data.get("appointment_notes", None),
                    
                    # Schedule
                    schedule=request.data.get("schedules", None),
                    walk_in_schedule=request.data.get("walk_in_schedule", None),
                    schedule_notes=request.data.get("schedule_notes", None),
                    holiday_schedule=request.data.get("holiday_schedule", None),
                    
                    # Intake
                    service_same_day_intake=request.data.get(
                        "service_same_day_intake", None
                    ),
                    intake_notes=request.data.get("intake_notes", None),

                    # Language
                    languages=request.data.get("languages", None),

                    # Services
                    crisis=request.data.get("crisis", None),
                    disaster_recovery=request.data.get("disaster_recovery", None),
                    transportation=request.data.get("transportation", None),
                    client_consult=request.data.get("client_consult", None),

                    agency=agency,
                    related_program=related_program,
                    requested_by_name=request.data.get("requested_by_name", None),
                    requested_by_email=request.data.get("requested_by_email", None),

                    action=UserActions.UPDATE.value,

                    updated_at=now
                )

            # Immigration Accessibility Profile
            program.immigration_accessibility_profile = isProgramAccessibilityCompleted(program)
            program.save()

            # Check if in Emergency Mode
            app_settings = AppSettings.objects.first()
            if program and app_settings and app_settings.emergency_mode:
                program.emergency_mode = app_settings.emergency_mode
                program.save()

                # Check if the program updated is just a new program created in emergency mode
                # If it is a new program created during emergency mode, we don't want to 
                # write the update in the ProgramEmergencyQueue
                if not related_program.emergency_mode:
                    # Save original program in temporary emergency backup table
                    ProgramEmergencyQueue.custom_create(program=related_program)

                # Update the program in the final table api_programs with emergency_mode equal to True
                Program.custom_update(user=None, program=program, program_id=related_program.id)

            return JsonResponse(
                {
                    "program": {
                        "id": related_program.id,
                        "slug": related_program.slug,
                        "name": related_program.name,
                        "emergency_mode": program.emergency_mode,
                        "agency": related_program.agency.id,
                    },
                    "model": "queue",
                }
            )
        except Exception as e:
            logger.error("Error request to update program {}".format(str(e)))
            return JsonResponse(
                {
                    "message": "Request couldn't be completed. Please try again!"
                }, status=500
            )


class ProgramQueueDeleteView(APIView):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            related_program_id = int(request.data.get("program_id", 0))
            related_program = Program.objects.get(id=related_program_id)

            program = ProgramQueue.objects.create(
                name=related_program.name,
                slug=related_program.slug,
                requested_by_name=request.data.get("requested_by_name", None),
                requested_by_email=request.data.get("requested_by_email", None),
                related_program=related_program,
                action=UserActions.DELETE.value,
            )

            return JsonResponse(
                {
                    "program": {
                        "id": related_program.id,
                        "slug": related_program.slug,
                        "name": related_program.name,
                    },
                    "model": "queue",
                }
            )
        except Exception as e:
            logger.error("Error request to delete a program: {}".format(str(e)))
            return JsonResponse(
                {
                    "message": "Request couldn't be completed. Please try again!"
                }, status=500
            )


class ProgramView(APIView):
    def get(self, request, property_name, property_value, agency_id):
        try:
            kw = {property_name: property_value}
            program = Program.objects.get(**kw, agency_id=agency_id)
            program_dict = model_to_dict(program)

            program_dict['state'] = None
            if program.state:
                program_dict['state'] = program.state.capitalize()

            program_dict["agency_name"] = program.agency.name
            program_dict["agency_slug"] = program.agency.slug
            program_dict['map_url'] = getMapURL(program)
            program_dict['update_at'] = program.updated_at.strftime('%b/%d/%Y')
            return JsonResponse(program_dict, safe=False)
        except Program.DoesNotExist:
            return JsonResponse(
                {
                    "message": "Program with {} {} doesn't exists.".format(
                        property_name, property_value
                    ),
                }, status=500
            )

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            if request.user and request.user.is_active:
                program_name = request.data.get("name", None)
                slug = slugify(program_name)

                # Agency
                agency = None
                agency_id = int(request.data.get("agency_id", 0))
                agency = Agency.objects.get(id=agency_id)

                # Verify if program exists with that slug
                if (
                    Program.objects.filter(
                        slug=slug,
                        agency_id=agency_id
                    ).exists()
                    or ProgramQueue.objects.filter(
                        slug=slug,
                        agency_id=agency_id
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
                geocode = agency.geocode

                if agency.street != street or agency.city != city or agency.state != state or agency.zip_code != zip_code:
                    geocode = getGeocodingByAddress(
                        street=street,
                        city=city,
                        state=state,
                        zip_code=zip_code,
                    )

                program = Program.objects.create(
                    name=program_name,
                    slug=slug,
                    description=request.data.get("description", None),
                    service_types=request.data.get("service_types", None),
                    case_management_provided=request.data.get(
                        "case_management_provided", None
                    ),
                    case_management_notes=request.data.get(
                        "case_management_notes", None
                    ),
                    website=request.data.get("website", None),
                    phone=request.data.get("phone", None),
                    street=street,
                    city=city,
                    state=state,
                    zip_code=zip_code,
                    geocode=geocode,
                    next_steps=request.data.get("next_steps", None),
                    payment_service_cost=request.data.get("payment_service_cost", None),
                    payment_options=request.data.get("payment_options", None),
                    age_groups=request.data.get("age_groups", None),
                    zip_codes=request.data.get("zip_codes", None),
                    incomes_percent_poverty_level=request.data.get(
                        "incomes_percent_poverty_level", None
                    ),
                    immigration_statuses=request.data.get("immigration_statuses", None),
                    requires_enrollment_in=request.data.get(
                        "requires_enrollment_in", None
                    ),
                    other_requirements=request.data.get("other_requirements", None),
                    documents_required=request.data.get("documents_required", None),
                    schedule=request.data.get("schedules", None),
                    walk_in_schedule=request.data.get("walk_in_schedule", None),
                    schedule_notes=request.data.get("schedule_notes", None),
                    holiday_schedule=request.data.get("holiday_schedule", None),
                    appointment_required=request.data.get("appointment_required", None),
                    appointment_notes=request.data.get("appointment_notes", None),
                    service_same_day_intake=request.data.get(
                        "service_same_day_intake", None
                    ),
                    intake_notes=request.data.get("intake_notes", None),
                    languages=request.data.get("languages", None),
                    crisis=request.data.get("crisis", None),
                    disaster_recovery=request.data.get("disaster_recovery", None),
                    transportation=request.data.get("transportation", None),
                    client_consult=request.data.get("client_consult", None),
                    agency=agency,
                    created_by=request.user,
                )

                # Immigration Accessibility Profile
                program.immigration_accessibility_profile = isProgramAccessibilityCompleted(program)
                program.save()

                return JsonResponse(
                    {
                        "program": {
                            "id": program.id,
                            "slug": program.slug,
                            "name": program.name,
                            "agency": program.agency.id,
                        },
                        "model": "program",
                    }
                )

            raise Exception('User does not have permissions.')
        except Exception as e:
            logger.error("Error creating a new program: {}".format(str(e)))
            return JsonResponse(
                {
                    "message": "Program cannot be created."
                }, status=500
            )

    @transaction.atomic
    def put(self, request, *args, **kwargs):
        try:
            if request.user and request.user.is_active:
                # Find program
                id = int(request.data.get("program_id", 0))
                program = Program.objects.get(id=id)

                program_name = request.data.get("name", None)
                slug = slugify(program_name)

                # Agency
                agency = Agency.objects.get(id=program.agency.id)

                # Verify if program exists with that slug
                if (
                    Program.objects.filter(
                        slug=slug,
                        agency=agency
                    ).exclude(
                        id=program.id
                    ).exists()
                    or ProgramQueue.objects.filter(
                        slug=slug,
                        agency=agency
                    ).exclude(
                        related_program=program
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
                geocode = agency.geocode

                if program.street != street or program.city != city or program.state != state or program.zip_code != zip_code:
                    geocode = getGeocodingByAddress(
                        street=street,
                        city=city,
                        state=state,
                        zip_code=zip_code,
                    )

                # If user is logged in, this program doesn't have to go to the queue.
                program, crated = Program.objects.update_or_create(
                    id=program.id,
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
                program.immigration_accessibility_profile = isProgramAccessibilityCompleted(program)
                program.save()

                return JsonResponse(
                    {
                        "program": {
                            "id": program.id,
                            "slug": program.slug,
                            "name": program.name,
                            "agency": program.agency.id,
                        },
                        "model": "program",
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

    @transaction.atomic
    def delete(self, request, id, *args, **kwargs):
        try:
            program = None
            program_name = None
            if request.user and request.user.is_active:
                program = Program.objects.get(id=id)
                program_name = program.name

                ActionLog.objects.create(
                    info=program.name,
                    additional_info=[program.agency.name, str(program.agency.id)],
                    action="delete",
                    model="program",
                    created_by=request.user
                )

                program.delete()

                return JsonResponse(
                    {
                        "program": {
                            "name": program_name
                        },
                        "model": "program",
                    }
                )
            raise Exception('User does not have permissions.')
        except Exception as e:
            logger.error("Error deleting program: {}".format(str(e)))
            return JsonResponse(
                {
                    "message": "Program cannot be deleted. Please try again!"
                }, status=500
            )


class ProgramListView(APIView):
    def get(self, request, property_name, property_value, page):
        program_list = None
        try:
            if property_value != "null":
                kw = None
                if property_name in ["id", "agency_id"]:
                    kw = {property_name: int(property_value)}
                else:
                    kw = {"{}__icontains".format(property_name): property_value}
                program_list = Program.objects.filter(**kw)
            else:
                program_list = Program.objects.all().order_by(
                    "-updated_at", "-created_at", "name"
                )

            paginator = Paginator(program_list, 10)  # Show 10 programs per page
            programs = paginator.get_page(page)
            programs_json = serializers.serialize("json", programs.object_list)
            return JsonResponse(
                {
                    "results": json.loads(programs_json),
                    "total_records": paginator.count,
                    "total_pages": paginator.num_pages,
                    "page": programs.number,
                    "has_next": programs.has_next(),
                    "has_prev": programs.has_previous(),
                },
                safe=False,
            )
        except Program.DoesNotExist:
            logger.error("Program does not exists.")
            return JsonResponse(
                {
                    "message": "Program with {} {} doesn't exists.".format(
                        property_name, property_value
                    ),
                }, status=500
            )

import logging
import json
import re
import random

from django.core import serializers
from django.core.paginator import Paginator
from django.db import transaction
from django.forms.models import model_to_dict
from django.http import JsonResponse
from django.utils.text import slugify
from django.utils.timezone import now

from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from api.decorators import is_registered_api_consumer

from api.models.action_log import ActionLog
from api.models.agency import Agency
from api.models.agency import AgencyQueue
from api.models.agency import AgencyEmergencyQueue
from api.models.app_settings import AppSettings
from api.models.program import Program
from api.models.user import Role

from api.utils import getGeocodingByAddress
from api.utils import getMapURL
from api.utils import UserActions
from api.utils import addPublicActionLog
from api.utils import isInteger


logger = logging.getLogger(__name__)


class AgencyQueueView(APIView):
    permission_classes = [AllowAny]

    @is_registered_api_consumer
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        """
        Used when an non logged user request to add a new agency
        """
        try:
            agency_name = request.data.get("name", None)
            slug = slugify(agency_name)

            # Verify if agency exists with that slug
            if (
                Agency.objects.filter(slug=slug).exists()
                or AgencyQueue.objects.filter(slug=slug).exists()
            ):
                print('slug exists already')
                return JsonResponse({
                        "message": "An agency with that name already exists."
                    }, status=500 )

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

                created_at=now,

                hilsc_verified=request.data.get("hilsc_verified", None),

            )

            print(agency.name)
            print(agency.id)

            # Check if in Emergency Mode
            app_settings = AppSettings.objects.first()
            if agency and app_settings and app_settings.emergency_mode:
                # Create the agency in the final table api_agencies with emergency_mode equal to True
                new_agency = Agency.custom_create(user=None, agency=agency)

                # Update related agency id in agency in queue
                agency.emergency_mode = app_settings.emergency_mode
                agency.related_agency = new_agency
                agency.save()


            # Save public action log
            addPublicActionLog(
                entity_name=agency.name,
                entity_slug=agency.slug,
                action=agency.action,
                model='Agency',
                requested_by_name=agency.requested_by_name,
                requested_by_email=agency.requested_by_email
            )

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
        except Exception as e:
            logger.error("Error requesting to create a new agency: {}".format(str(e)))
            return JsonResponse(
                {
                    "message": "Request couldn't be completed. Please try again!"
                }, status=500
            )

    @is_registered_api_consumer
    @transaction.atomic
    def put(self, request, *args, **kwargs):
        """
        Used when an non logged user request to edit an agency
        """
        try:
            agency_name = request.data.get("name", None)
            slug = slugify(agency_name)

            # Agency
            related_agency_id = int(request.data.get("id", 0))
            related_agency = Agency.objects.get(id=related_agency_id)

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
                    related_agency_id=related_agency.id
                ).exists()
            ):
                return JsonResponse(
                    {
                        "message": "An Agency with that name already exists."
                    }, status=500
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

            # If related agency has emergency mode = True we have to check if there is already
            # a row in queue for that agency, in that case we just need to update the actual queue
            try:
                existing_new_queue = AgencyQueue.objects.get(
                    related_agency=related_agency,
                    action=UserActions.ADD.value,
                )
            except AgencyQueue.DoesNotExist:
                existing_new_queue = None

            if related_agency.emergency_mode and existing_new_queue:
                agency, created = AgencyQueue.objects.update_or_create(
                    id=existing_new_queue.id,
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

                        "requested_by_name":request.data.get("requested_by_name", None),
                        "requested_by_email":request.data.get("requested_by_email", None),

                        "updated_at": now,

                        "hilsc_verified":request.data.get("hilsc_verified", None),

                    },
                )
            else:
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

                    updated_at=now
                )

            # Check if in Emergency Mode
            app_settings = AppSettings.objects.first()
            if agency and app_settings and app_settings.emergency_mode:
                agency.emergency_mode = app_settings.emergency_mode
                agency.save()

                # Check if the agency updated is just a new agency created in emergency mode
                # If it is a new agency created during emergency mode, we don't want to
                # write the update in the AgencyEmergencyQueue
                if not related_agency.emergency_mode:
                    # Save original agency in temporary emergency backup table
                    AgencyEmergencyQueue.custom_create(agency=related_agency)

                # Update the agency in the final table api_agencies with emergency_mode equal to True
                Agency.custom_update(user=None, agency=agency, agency_id=related_agency.id)

            # Save public action log
            addPublicActionLog(
                entity_name=agency.name,
                entity_slug=agency.slug,
                action=agency.action,
                model='Agency',
                requested_by_name=agency.requested_by_name,
                requested_by_email=agency.requested_by_email
            )

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
        except Exception as e:
            logger.error("Error requesting to update agency {}: {}".format(related_agency.name, str(e)))
            return JsonResponse(
                {
                    "message": "Request couldn't be completed. Please try again!"
                }, status=500
            )


class AgencyQueueDeleteView(APIView):
    permission_classes = [AllowAny]

    @is_registered_api_consumer
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        """
        Used when an non logged user request to delete an agency
        """
        try:
            related_agency_id = int(request.data.get("id", 0))
            related_agency = Agency.objects.get(id=related_agency_id)

            agency = AgencyQueue.objects.create(
                name=related_agency.name,
                slug=related_agency.name,

                website=related_agency.website,
                phone=related_agency.phone,

                # Address
                street=related_agency.street,
                city=related_agency.city,
                state=related_agency.state,
                zip_code=related_agency.zip_code,
                geocode=related_agency.geocode,

                next_steps=related_agency.next_steps,
                payment_options=related_agency.payment_options,

                # Eligibility
                age_groups=related_agency.age_groups,
                zip_codes=related_agency.zip_codes,
                gender=related_agency.gender,
                immigration_statuses=related_agency.immigration_statuses,

                # Requirements
                accepted_ids_current=related_agency.accepted_ids_current,
                accepted_ids_expired=related_agency.accepted_ids_expired,
                notes=related_agency.notes,
                proof_of_address=related_agency.proof_of_address,

                # Schedule
                schedule=related_agency.schedule,
                schedule_notes=related_agency.schedule_notes,
                holiday_schedule=related_agency.holiday_schedule,

                # Languages
                languages=related_agency.languages,
                documents_languages=related_agency.documents_languages,
                website_languages=related_agency.website_languages,
                frontline_staff_languages=related_agency.frontline_staff_languages,
                interpretations_available=related_agency.interpretations_available,

                # Services
                assistance_with_forms=related_agency.assistance_with_forms,
                visual_aids=related_agency.visual_aids,
                ada_accessible=related_agency.ada_accessible,

                # Policies
                response_requests=related_agency.response_requests,
                cultural_training=related_agency.cultural_training,

                requested_by_name=request.data.get("requested_by_name", None),
                requested_by_email=request.data.get("requested_by_email", None),
                related_agency=related_agency,
                action=UserActions.DELETE.value
            )

            # Save public action log
            addPublicActionLog(
                entity_name=agency.name,
                entity_slug=agency.slug,
                action=agency.action,
                model='Agency',
                requested_by_name=agency.requested_by_name,
                requested_by_email=agency.requested_by_email
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
        except Exception as e:
            logger.error("Error requesting to delete an agency: {}".format(str(e)))
            return JsonResponse(
                {
                    "message": "Request couldn't be completed. Please try again!"
                }, status=500
            )

class AgencyBulkVerify(APIView):

    @permission_classes([IsAuthenticated])
    def get(self, request):
        try:

            Agency.objects.all().update(hilsc_verified=False)

            # agencies_verified = ["BakerRipley","Baylor College of Medicine","Bonding Against Adversity","Casa Juan Diego ","Catholic Charities Archdiocese Galveston-Houston ","Catholic Charities, Cabrini Center for Immigrant Legal Assistance","Children's Assessment Center Foundation","Chinese Community Center, inc.","DAYA Houston","East Harris County Empowerment Center","El Centro de Corazon","Fe y Justicia Worker Center","GHIRP, Galveston-Houston Immigration Representation Project","Harris County Public Health","HAWC, Houston Area Women's Center","Houston Food Bank","Houston Volunteer Lawyers","Human Rights First","Ibn Sina Foundation","IEDA Relief","Interfaith Ministries for Greater Houston","Justice for All Immigrants","KIND Houston, Kids in Need of Defense","La Unidad 11","Legacy Community Health","Living Hope Wheelchair Association","Lone Star Legal Aid","MAM, Memorial Assistance Ministires","Memorial Hermann","Mi Familia Vota","NALEO Education Fund","Northwest Assistance Ministries","OCA - Greater Houston","PAIR Houston, Partnership for the Advancement & Immersion of Refugees","RAICES, Refugee Immigrant Center for Education and Legal Services","South Texas College of Law -- Immigration Clinic","TAG, Trauma and Grief Center at Texas Children's Hospital","Tahirih Justice Center","Texas Childrens Hospital","The Harris Center","University of Houston Law Center","West Street Recovery","Workers Defense Project","YMCA International Services","Young Center for Immigrant Children's Rights"];

            agencies_verified = ["BakerRipley","BakerRipley: Gulfton Sharpstown Campus","Baylor College of Medicine: Menninger Department of Psychiatry and Behavioral Sciences","Bonding Against Adversity","Casa Juan Diego ","Catholic Charities - Main Office","Catholic Charities Cabrini Center","Children's Assessment Center","Chinese Community Center","Daya Houston","El Centro de Corazon - Eastwood Health Center","El Centro de Corazon - John S. Dunn Health Center (Children's Services)","El Centro de Corazon - Magnolia Health Center","Fe y Justicia Worker Center","Fe y Justicia Worker Center Houston","Galveston-Houston Immigration Representation Project (GHIRP)","Harris County Public Health: Antoine Community Health Center","Harris County Public Health: Humble Clinic","Harris County Public Health: Refugee Health Screening Program","Harris County Public Health: Southeast Clinic","Houston Area Women's Center (HAWC)","Houston Food Bank","Houston Volunteer Lawyers","Ibn Sina Foundation:Clear Lake Community Medical Center","Ibn Sina Foundation: North Shepherd Community Medical Center","Ibn Sina Foundation: Port Arthur Community Medical Center","Ibn Sina Foundation: Wilcrest Children's Clinic","IEDA Relief","Interfaith Ministries","Justice for All Immigrants (formerly JFON)","Kids In Need of Defense (KIND)","La Unidad 11","Legacy Community Health: BakerRipley","Legacy Community Health: Branard","Legacy Community Health: Central Beaumont","Legacy Community Health: Central Stagg","Legacy Community Health: Deer Park","Legacy Community Health: Lyons","Legacy Community Health: Mapleridge","Legacy Community Health: Montrose","Legacy Community Health: Northline","Legacy Community Health: San Jacinto","Legacy Community Health: Santa Clara","Legacy Community Health: Sharpstown Rookin","Legacy Community Health: Southwest","Legacy Community Health: Southpark","Living Hope Wheelchair Association","Lone Star Legal Aid","Memorial Assistance Ministires (MAM)","Memorial Hermann Health Centers for Schools: Alief Clinic","Mi Familia Vota","NALEO Educational Fund","Northwest Assistance Ministries","OCA Greater Houston","PAIR Houston (Partnership for the Advancement & Immersion of Refugees)","RACIES - Refugee Immigrant Center for Education and Legal Services","South Texas College of Law: Randall O Sorrels Legal Clinic","Tahirih Justice Center","The Alliance","The Beacon","Texas Center for Community Services","University of Houston Law Center - Civil Practice Clinic","West Street Recovery","Workers Defense Project","Workers Defense Fund","YMCA International Services","The Young Center for Immigrant Children's Rights"]

            agencies_updates = [];
            agencies_not_updated = [];
            for agency in agencies_verified:
                agency_search = Agency.objects.filter(name=agency)
                if agency_search :
                    agency_search.update(hilsc_verified=True)
                    agencies_updates.append(agency)
                if not agency_search :
                    agencies_not_updated.append(agency)

            return JsonResponse(agencies_not_updated, safe=False)
        except :
            return JsonResponse({
                    "message": "Bulkification failed.",
                }, status=500
            )

class AgencyView(APIView):
    @is_registered_api_consumer
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
                    "message": "Agency with {} {} doesn't exists.".format(
                        property_name, property_value
                    ),
                }, status=500
            )

    @permission_classes([IsAuthenticated])
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
                            "message": "An agency with that name already exists.",
                        }, status=500
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
                    # hilsc_verified=request.user.profile.role.HILSC_verified,
                    hilsc_verified=request.data.get("hilsc_verified", False),
                    created_by=request.user,
                    created_at=now,
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
                {
                    "message": "Agency cannot be created. Please try again!"
                }, status=500
            )

    @permission_classes([IsAuthenticated])
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
                            "message": "An Agency with that name already exists.",
                        }, status=500
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
                        # "hilsc_verified": request.user.profile.role.HILSC_verified,
                        "hilsc_verified": request.data.get("hilsc_verified", False),
                        "updated_by": request.user,
                        "updated_at": now
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
                {
                    "message": "Agency cannot be updated. Please try again!"
                }, status=500
            )

    @permission_classes([IsAuthenticated])
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
                {
                    "message": "Agency cannot be deleted. Please try again!"
                }, status=500
            )

class AgencyCopy(APIView):

    @permission_classes([IsAuthenticated])
    @transaction.atomic
    def get(self, request, property_name, property_value):
        try:
            kw = {property_name: property_value}
            agency = Agency.objects.get(**kw)
            agency_programs = Program.objects.filter(agency_id=agency.id)

            # Increment Slug
            agency.slug = agency.slug + '-' + str(random.randint(10000, 99999))

            # Save New Object
            agency.pk = None
            agency.created_by_id = request.user.id
            agency.updated_by_id = request.user.id
            agency.save()

            # Copy Programs
            for program in agency_programs:
                program.pk = None
                program.agency_id = agency.id
                program.created_by_id = request.user.id
                program.updated_by_id = request.user.id
                program.slug = program.slug + '-' + str(random.randint(10000, 99999))
                program.save()

            new_agency_programs = Program.objects.filter(agency_id=agency.id)
            agency_program_list = []
            for program in new_agency_programs:
                agency_program_list.append(model_to_dict(program))

            agency_dict = model_to_dict(agency)

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
                    "message": "Agency with {} {} doesn't exists.".format(
                        property_name, property_value
                    ),
                }, status=500
            )

class AgencyListView(APIView):
    permission_classes = [AllowAny]

    @is_registered_api_consumer
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
                    "message": "Agency with {} {} doesn't exists.".format(
                        property_name, property_value
                    ),
                }, status=500
            )

class AgencyMapView(APIView):
    permission_classes = [AllowAny]

    # @is_registered_api_consumer
    def get(self, request):
        agency_list = None
        try:
            agency_list = Agency.objects.all().filter(hilsc_verified=True)
            paginator = Paginator(agency_list, 1000)  # Show 10 agencies per page
            agencies = paginator.get_page(1)
            agency_list = [];

            for agency in agencies:
                agency_programs = Program.objects.filter(agency_id=agency.id)
                agency_program_list = []
                if ( agency_programs ) :
                    for program in agency_programs:
                        agency_program_list.append(model_to_dict(program))
                    agency_list.append({ 'name' : agency.name, 'geocode' : agency.geocode, 'slug' : agency.slug,
                        'website' : agency.website, 'phone' : agency.phone, 'street' : agency.street,
                        'city' : agency.city, 'state' : agency.state, 'zip_code' : agency.zip_code,
                        'verified' : agency.hilsc_verified, 'schedule' : agency.schedule, 'notes' : agency.notes,
                        'schedule' : agency.schedule, 'programs' : agency_program_list, 'languages' : agency.languages });

            return JsonResponse({ "results": agency_list }, safe=False,)

        except Agency.DoesNotExist:
            logger.error("Agency does not exists.")
            return JsonResponse(
                {
                    "message": "Agency with {} {} doesn't exists.".format(
                        property_name, property_value
                    ),
                }, status=500
            )

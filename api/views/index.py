import csv
import json
import logging
import os
from pytz import timezone
import re
import requests
from datetime import datetime
from datetime import timedelta

from django.forms.models import model_to_dict
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.generic import View
from django.conf import settings
from django.db import models
from django.db.models.expressions import RawSQL
from django.core.paginator import Paginator

from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.views import status

from api.decorators import is_registered_api_consumer

from api.models.action_log import PublicActionLog

from api.models.agency import Agency
from api.models.agency import AgencyQueue

from api.models.program import Program
from api.models.program import ProgramQueue

from api.models.zip_code import ZipCodeData
from api.models.app_settings import AppSettings

from api.utils import getZipCodeRadiusRawSQL

logger = logging.getLogger(__name__)

ENTITY_PROGRAM = "program"
ENTITY_AGENCY = "agency"

class FrontendAppView(View):
    """
    Serves the compiled frontend entry point (only works if you have run `yarn
    run build`).
    """

    def get(self, request):
        print(os.path.join(settings.REACT_APP_DIR, "build", "index.html"))
        try:
            with open(os.path.join(settings.REACT_APP_DIR, "build", "index.html")) as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            logging.exception("Production build of app not found")
            return HttpResponse(
                """
        This URL is only used when you have built the production
        version of the app. Visit http://localhost:3000/ instead, or
        run `yarn run build` to test the production version.
        """,
                status=status.HTTP_501_NOT_IMPLEMENTED,
            )


class SearchAppView(APIView):
    @is_registered_api_consumer
    def get(self, request):
        try:
            page = request.GET.get("page", 1)
            keyword = request.GET.get("search", None)
            entity = request.GET.get("entity", None)

            # Emergency Mode
            emergency_mode = False
            app_settings = AppSettings.objects.first()
            if app_settings:
                emergency_mode = app_settings.emergency_mode
                emergency_mode_msg = app_settings.emergency_message

            HILSC_verified = False
            HILSC_verified_get_value = request.GET.get("HILSCVerified", None)
            if HILSC_verified_get_value and HILSC_verified_get_value == "1":
                HILSC_verified = True
            elif not HILSC_verified_get_value and not emergency_mode:
                HILSC_verified = True

            service_types = request.GET.getlist("serviceType[]", None)
            immigration_status = request.GET.get("immigrationStatus", None)
            zip_code = request.GET.get("zipCode", None)
            radius = request.GET.get("radius", 0)
            annual_media_income = request.GET.get("incomeEligibility", None)
            immigrant_acc_profile = request.GET.get("immigrantAccProfile", None)

            walk_in_hours_get_value = request.GET.get("walkInHours", None)
            walk_in_hours = False
            if walk_in_hours_get_value and walk_in_hours_get_value == "1":
                walk_in_hours = True

            languages = request.GET.getlist("programLanguages[]", None)

            ada_accessible_get_value = request.GET.get("adaAccessible", None)
            ada_accessible = False
            if ada_accessible_get_value and ada_accessible_get_value == "1":
                ada_accessible = True

            #******* end params ********

            # Agency filters
            agency_filters = models.Q()

            # Program filters
            program_filters = models.Q()

            # Keyword
            if keyword:
                if entity == ENTITY_PROGRAM:
                    program_filters &= models.Q(name__icontains=keyword.strip(),)
                    program_filters |= models.Q(description__icontains=keyword.strip(),)

                if entity == ENTITY_AGENCY:
                    agency_filters &= models.Q(name__icontains=keyword.strip(),)

            # Service Types
            if service_types and len(service_types):
                for st in service_types:
                    program_filters &= models.Q(
                        service_types__contains=[st.lower()]
                    )

            # Immigration Status
            if immigration_status and immigration_status == "citizen":
                program_filters &= models.Q(
                    immigration_statuses__icontains=immigration_status
                )

                agency_filters &= models.Q(
                    immigration_statuses__icontains=immigration_status
                )

            # ZipCodes
            if zip_code and int(radius) == 0:
                program_filters &= models.Q(zip_code=zip_code)
                program_filters |= models.Q(zip_codes__icontains=zip_code)

                agency_filters &= models.Q(zip_code=zip_code)
                agency_filters |= models.Q(zip_codes__icontains=zip_code)
                
            # Program languages
            if languages and len(languages):
                for l in languages:
                    program_filters &= models.Q(languages__contains=[l.lower()])
                    agency_filters &= models.Q(languages__contains=[l.lower()])

            # Annual medium income
            if annual_media_income:
                program_filters &= models.Q(
                    incomes_percent_poverty_level__lte=int(annual_media_income)
                )

            # ADA accesible
            if ada_accessible:
                agency_filters &= models.Q(ada_accessible__icontains="Yes")

            # Immigration accessibility profile
            if immigrant_acc_profile and immigrant_acc_profile == '1':
                program_filters &= models.Q(immigration_accessibility_profile=True)

            # HILSC Verified Program's agency

            if entity == ENTITY_PROGRAM and not emergency_mode:
                program_filters &= models.Q(agency__hilsc_verified=HILSC_verified,)

            # Walk in hours
            if walk_in_hours:
                program_filters &= models.Q(walk_in_schedule__isnull=False)

            # Apply filters to programs queryset
            programs_queryset = Program.objects.select_related("agency").filter(program_filters).distinct()

            # Agencies to exclude from the agency search to avoid repeating them
            agency_ids = []
            if entity == ENTITY_PROGRAM:
                agency_ids = [
                    d["agency_id"]
                    for d in list(programs_queryset.values("agency_id").distinct())
                ]

            # HILSC Verified
            if entity == ENTITY_AGENCY and not emergency_mode:
                agency_filters &= models.Q(hilsc_verified=HILSC_verified,)

            # Apply filters to agencies queryset
            agencies_queryset = Agency.objects.filter(
                agency_filters
            ).exclude(
                id__in=agency_ids
            ).distinct()

            # ZipCodes and radius
            if zip_code and int(radius) > 0:
                # Get zip code geolocation
                try:
                    zip_code_data = ZipCodeData.objects.get(zip_code=zip_code)
                except ZipCodeData.DoesNotExist:
                    response = requests.get('https://maps.googleapis.com/maps/api/geocode/json?address={}&key={}'.format(zip_code, settings.GEOLOCATOR_API_KEY))
                    response_json = response.json()

                    resp_zip_code = response_json.get('results')[0].get('address_components')[0].get('short_name')
                    resp_city = response_json.get('results')[0].get('address_components')[1].get('long_name')
                    resp_state_short = response_json.get('results')[0].get('address_components')[3].get('short_name')
                    resp_state_long = response_json.get('results')[0].get('address_components')[3].get('long_name')
                    resp_location_lat = response_json.get('results')[0].get('geometry').get('location').get('lat')
                    resp_location_lng = response_json.get('results')[0].get('geometry').get('location').get('lng')
                    zip_code_data = ZipCodeData.objects.create(
                        zip_code=resp_zip_code,
                        state=resp_state_short,
                        latitude=str(resp_location_lat)[:10],
                        longitude=str(resp_location_lng)[:10],
                        city=resp_city,
                        full_state=resp_state_long
                    )

                raw_sql = getZipCodeRadiusRawSQL(Program.objects.model._meta.db_table, latitude=zip_code_data.latitude, longitude=zip_code_data.longitude)

                # Programs with zipcode and radius
                programs_queryset = (
                    programs_queryset.annotate(
                        distance=RawSQL(
                            raw_sql,
                            (),
                        )
                    )
                    .filter(models.Q(distance__lte=radius) | models.Q(zip_code=zip_code) | models.Q(zip_codes__icontains=zip_code))
                )

                # Agencies with zipcode and radius
                raw_sql = getZipCodeRadiusRawSQL(Agency.objects.model._meta.db_table, latitude=zip_code_data.latitude, longitude=zip_code_data.longitude)

                agencies_queryset = (
                    agencies_queryset.annotate(
                        distance=RawSQL(
                            raw_sql,
                            (),
                        )
                    )
                    .filter(models.Q(distance__lte=radius) | models.Q(zip_code=zip_code) | models.Q(zip_codes__icontains=zip_code))
                )

                # order by distance with zipcode and radius
                programs_queryset = (
                    programs_queryset.order_by('zip_code', 'distance')
                )

                agencies_queryset = (
                    agencies_queryset.order_by('zip_code', 'distance')
                )

            agencies_dict = {}

            # Programs and agencies
            if entity == ENTITY_PROGRAM:
                for program in programs_queryset:
                    key = program.agency.id
                    state = program.agency.state
                    city = program.agency.city
                    if program and program.agency and program.agency.state:
                        state = program.agency.state.capitalize()

                    if program and program.agency and program.agency.city:
                        city = program.agency.city.capitalize()

                    if key not in agencies_dict:
                        agencies_dict[key] = {
                            "agency": {
                                "name": program.agency.name,
                                "slug": program.agency.slug,
                                "phone": program.agency.phone,
                                "street": program.agency.street,
                                "city": city,
                                "state": state,
                                "zipcode": program.agency.zip_code,
                                "website": program.agency.website,
                            },
                            "programs": [
                                {
                                    "name": program.name,
                                    "description": program.description,
                                    "phone": program.phone,
                                    "slug": program.slug,
                                    "agency": program.agency.id,
                                }
                            ],
                        }
                    else:
                        agencies_dict[key]["programs"].append(
                            {
                                "name": program.name,
                                "description": program.description,
                                "phone": program.phone,
                                "slug": program.slug,
                                "agency": program.agency.id
                            }
                        )

            results = list(agencies_dict.values())
            more_results = list()

            # Agencies
            if entity == ENTITY_AGENCY:
                for agency in agencies_queryset:
                    agency_programs = Program.objects.filter(
                        program_filters
                    ).filter(
                        agency_id=agency.id
                    )

                    state = agency.state
                    city = agency.city
                    if agency and agency.state:
                        state = agency.state.capitalize()

                    if agency and agency.city:
                        city = agency.city.capitalize()

                    if len(agency_programs) > 0:
                        results.append(
                            {
                                "agency": {
                                    "name": agency.name,
                                    "slug": agency.slug,
                                    "phone": agency.phone,
                                    "street": agency.street,
                                    "city": city,
                                    "state": state,
                                    "zipcode": agency.zip_code,
                                    "website": agency.website,
                                },
                                "programs": [{
                                        "name": program.name,
                                        "description": program.description,
                                        "phone": program.phone,
                                        "slug": program.slug,
                                        "agency": program.agency.id,
                                    } for program in agency_programs],
                            }
                        )
                    else:
                        # We want this results to be appended a the end of list, agencies
                        # without programs should be shown at the end.
                        if len(program_filters) == 0:
                            more_results.append(
                                {
                                    "agency": {
                                        "name": agency.name,
                                        "slug": agency.slug,
                                        "phone": agency.phone,
                                        "street": agency.street,
                                        "city": city,
                                        "state": state,
                                        "zipcode": agency.zip_code,
                                        "website": agency.website,
                                    },
                                    "programs": [],
                                }
                            )

            results = results + more_results

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
                    "emergency_mode": emergency_mode,
                    "emergency_mode_msg": emergency_mode_msg
                },
                safe=False,
            )
        except Exception as e:
            logger.error("Search Error", e)
            return JsonResponse(
                {
                    "message": "Error getting results",
                }, status=500
            )


class EmergencyModeView(APIView):
    @is_registered_api_consumer
    def get(self, request):
        try:
            app_settings = AppSettings.objects.first()
            if app_settings:
                return JsonResponse(
                    {
                        "emergency_mode": app_settings.emergency_mode,
                        "emergency_message": app_settings.emergency_message,
                    }
                )
        except Exception as e:
            logger.error("Error getting emergency mode info", e)
            return JsonResponse(
                {
                    "message": "Error getting emergency mode info",
                }, status=500
            )


class PublicActionLogsView(APIView):
    @is_registered_api_consumer
    @permission_classes([IsAuthenticated])
    def get(self, request):
        try:
            if request.user and request.user.is_active:
                page = request.GET.get("page", 1)

                public_logs = PublicActionLog.objects.all().order_by(
                    "-updated_at", "-created_at", "entity_name"
                )

                results = [{
                    "id": public_log.id,
                    "entity_name": public_log.entity_name,
                    "action": public_log.action,
                    "model": public_log.model,
                    "requestor_name": public_log.requested_by_name,
                    "requestor_email": public_log.requested_by_email,
                    "created_at": public_log.created_at.strftime('%b/%d/%Y')
                } for public_log in public_logs]

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
        except Exception as ex:
            logger.error("Error getting public logs: {}".format(str(ex)))
            return JsonResponse(
                {
                    "message": "Public logs cannot be found."
                }, status=500
            )


class ExportPublicActionLogsView(APIView):
    @is_registered_api_consumer
    @permission_classes([IsAuthenticated])
    def get(self, request):
        try:
            default_start_date = datetime.now() - timedelta(days=30)
            default_end_date = datetime.now()

            start_date = datetime.strptime(request.GET.get("startDate", default_start_date), '%m/%d/%Y')
            end_date = datetime.strptime(request.GET.get("endDate", default_end_date), '%m/%d/%Y') + timedelta(days=1)

            start_date.replace(tzinfo=timezone('UTC'))
            end_date.replace(tzinfo=timezone('UTC'))

            results = PublicActionLog.objects.filter(created_at__gte=start_date, created_at__lte=end_date)

            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="accesshou_changelog.csv"'
            writer = csv.DictWriter(response, fieldnames=['entity_name', 'action', 'model', 'requested_by_name', 'requested_by_email', 'created_at'])
            writer.writeheader()
            for result in results:
                writer.writerow({
                    'entity_name': result.entity_name,
                    'action': result.action,
                    'model': result.model,
                    'requested_by_name': result.requested_by_name,
                    'requested_by_email': result.requested_by_email,
                    'created_at': result.created_at.strftime('%m/%d/%Y')
                })
            return response
        except Exception as ex:
            logger.error("Error getting CSV: {}".format(str(ex)))
            return JsonResponse(
                {
                    "message": "Program cannot be updated. Please try again!"
                }, status=500
            )
        

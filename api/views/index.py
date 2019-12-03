from django.http import HttpResponse
from django.http import JsonResponse
from django.views.generic import View
from django.conf import settings
from django.db import models
from django.db.models.expressions import RawSQL
from django.core.paginator import Paginator

from rest_framework.views import APIView
from rest_framework.views import status

from api.models.agency import Agency
from api.models.agency import AgencyQueue

from api.models.program import Program
from api.models.program import ProgramQueue

from api.models.zip_code import ZipCodeData

from api.models.app_settings import AppSettings

from api.utils import getZipCodeRadiusRawSQL

import os
import logging
import json
import re

logger = logging.getLogger(__name__)


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
    def get(self, request):
        try:
            page = request.GET.get("page", 1)
            keyword = request.GET.get("search", None)

            # Emergency Mode
            emergency_mode = False
            app_settings = AppSettings.objects.first()
            if app_settings:
                emergency_mode = app_settings.emergency_mode

            HILSC_verified = False
            HILSC_verified_get_value = request.GET.get("HILSCVerified", None)
            if HILSC_verified_get_value and HILSC_verified_get_value == "1":
                HILSC_verified = True
            elif not HILSC_verified_get_value and not emergency_mode:
                HILSC_verified = True

            service_types = request.GET.getlist("serviceType[]", None)
            immigration_status = request.GET.get("immigrationStatus", None)
            zip_code = request.GET.get("zipCode", None)
            radius = request.GET.get("radius", None)
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

            # Agency filters
            agency_filters = models.Q()
            agency_filters &= models.Q(hilsc_verified=HILSC_verified,)

            # Program filters
            program_filters = models.Q()
            program_filters &= models.Q(agency__hilsc_verified=HILSC_verified,)

            programs_queryset = Program.objects.select_related("agency").all()
            agencies_queryset = Agency.objects.all()

            # ZipCodes and radius
            if zip_code and radius:
                # Get zip code geolocation
                zip_code_data = ZipCodeData.objects.get(zip_code=zip_code)

                raw_sql = getZipCodeRadiusRawSQL(Program.objects.model._meta.db_table, latitude=zip_code_data.latitude, longitude=zip_code_data.longitude)

                # Programs with zipcode and radius
                programs_queryset = (
                    Program.objects.annotate(
                        distance=RawSQL(
                            raw_sql,
                            (),
                        )
                    )
                    .filter(distance__lte=radius)
                    .exclude(geocode__isnull=True)
                )

                # Agencies with zipcode and radius
                raw_sql = getZipCodeRadiusRawSQL(Agency.objects.model._meta.db_table, latitude=zip_code_data.latitude, longitude=zip_code_data.longitude)

                agencies_queryset = (
                    Agency.objects.annotate(
                        distance=RawSQL(
                            raw_sql,
                            (),
                        )
                    )
                    .filter(distance__lte=radius)
                    .exclude(geocode__isnull=True)
                )

            # Keyword
            if keyword:
                program_filters &= models.Q(name__icontains=keyword,)

                program_filters |= models.Q(description__icontains=keyword,)

                agency_filters &= models.Q(name__icontains=keyword,)

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
            if zip_code and radius is None:
                program_filters &= models.Q(zip_code=zip_code)
                program_filters |= models.Q(zip_codes__icontains=zip_code)

                agency_filters &= models.Q(zip_code=zip_code)
                agency_filters |= models.Q(zip_codes__icontains=zip_code)
                
            # Program languages
            if languages and len(languages):
                for l in languages:
                    program_filters &= models.Q(languages__contains=[l.lower()])
                    agency_filters &= models.Q(languages__contains=[l.lower()])

            # Walk in hours
            if walk_in_hours:
                program_filters &= models.Q(walk_in_schedule__isnull=False)

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
                program_filters &= models.Q(immigration_accessibily_profile=True)

            # Apply filters to programs queryset
            programs_queryset = programs_queryset.filter(program_filters).distinct()

            # Agencies to exclude from the agency search to avoid repeating them
            agency_ids = [
                d["agency_id"]
                for d in list(programs_queryset.values("agency_id").distinct())
            ]

            # Apply filters to agencies queryset
            agencies_queryset = (
                agencies_queryset.filter(agency_filters)
                .exclude(id__in=agency_ids)
                .distinct()
            )

            # order by distance with zipcode and radius
            if zip_code and radius is not None:
              programs_queryset = (
                programs_queryset.order_by('distance')
              )

              agencies_queryset = (
                agencies_queryset.order_by('distance')
              )

            agencies_dict = {}

            # Programs and agencies
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

            # Agencies
            for agency in agencies_queryset:
                state = agency.state
                city = agency.city
                if agency and agency.state:
                    state = agency.state.capitalize()

                if agency and agency.city:
                    city = agency.city.capitalize()

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
                        "programs": [],
                    }
                )

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
                },
                safe=False,
            )
        except Exception as e:
            logger.error("Search Error", e)
            return JsonResponse(
                {
                    "error": True,
                    "message": "Error getting results",
                }, status=200
            )


class EmergencyModeView(APIView):
    def get(self, request):
        try:
            app_settings = AppSettings.objects.first()
            if app_settings:
                return JsonResponse(
                    {
                        "emergency_mode": app_settings.emergency_mode,
                        "emergency_message": app_settings.emergency_message,
                    }, status=200
                )
        except Exception as e:
            logger.error("Error getting emergency mode info", e)
            return JsonResponse(
                {
                    "message": "Error getting emergency mode info",
                }, status=500
            )

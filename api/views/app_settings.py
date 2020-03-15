import logging

from django.db import transaction
from django.http import JsonResponse

from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from api.models.action_log import ActionLog

from api.models.app_settings import AppSettings

from api.models.agency import Agency
from api.models.agency import AgencyEmergencyQueue

from api.models.program import Program
from api.models.program import ProgramEmergencyQueue

logger = logging.getLogger(__name__)


@transaction.atomic
def process_emergency_off(user):
    # Agencies
    agencies = Agency.objects.filter(emergency_mode=True)
    for agency in agencies:
        # If agency is not in AgencyEmergencyQueue it means is a new agency
        # We should delete it from main api_agencies table and the request to add it should be in api_agency_queue
        try:
            agency_emergency = AgencyEmergencyQueue.objects.get(related_agency_id=agency.id)
            Agency.custom_update(
                user=user,
                agency=agency_emergency,
                agency_id=agency_emergency.related_agency_id,
                hilsc_verified=agency_emergency.hilsc_verified,
                emergency_mode=False
            )
            # Delete old backup record from AgencyEmergencyQueue
            agency_emergency.delete()
        except AgencyEmergencyQueue.DoesNotExist:
            agency.delete()

    # Programs
    programs = Program.objects.filter(emergency_mode=True)
    for program in programs:
        # If program is not in ProgramEmergencyQueue it means is a new program
        # We should delete it from main api_programs table and the request to add it should be in api_program_queue
        try:
            program_emergency = ProgramEmergencyQueue.objects.get(related_program_id=program.id)
            Program.custom_update(
                user=user,
                program=program_emergency,
                program_id=program_emergency.related_program_id,
                emergency_mode=False
            )

            # Delete old backup record from ProgramEmergencyQueue
            program_emergency.delete()
        except ProgramEmergencyQueue.DoesNotExist:
            program.delete()


class AppSettingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            if request.user and request.user.is_active and request.user.profile.is_admin:
                app_settings = AppSettings.objects.first()
                if app_settings:
                    return JsonResponse(
                        {
                            "emergency_mode": app_settings.emergency_mode,
                            "emergency_message": app_settings.emergency_message,
                        },
                        safe=False,
                    )
                else:
                    return JsonResponse(
                        {
                            "emergency_mode": False,
                        },
                        safe=False,
                    )
            raise Exception('User does not have permissions.')
        except Exception as e:
            logger.error("Error getting app settings", e)
            return JsonResponse(
                {
                    "error": True,
                    "message": "Error getting app settings.",
                }, status=500
            )

    def post(self, request):
        try:
            if request.user and request.user.is_active and request.user.profile.is_admin:
                app_settings = AppSettings.objects.first()
                if app_settings:
                    app_settings.emergency_mode = request.data.get("mode_state", None)

                    if not app_settings.emergency_mode:
                        # If it is turned off, we have to check for changes to rollback
                        process_emergency_off(user=request.user)
                
                    app_settings.emergency_message = request.data.get("emergency_message", None)
                    app_settings.save()
                else:
                    app_settings = AppSettings.objects.create(emergency_mode=True)

                # Log action
                ActionLog.objects.create(
                    info=app_settings.emergency_mode,
                    additional_info=["{}".format(app_settings.emergency_message)],
                    action="emergency mode",
                    model="settings",
                    created_by=request.user
                )

                return JsonResponse(
                    {
                        "emergency_mode": app_settings.emergency_mode,
                        "emergency_message": app_settings.emergency_message,
                    },
                    safe=False,
                )

            raise Exception('User does not have permissions.')
        except Exception as e:
            logger.error("Setting app settings error", e)
            return JsonResponse(
                {
                    "error": True,
                    "message": "Error getting app settings.",
                }, status=500
            )

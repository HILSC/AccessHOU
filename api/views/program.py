from django.db import transaction
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.core import serializers
from django.utils.text import slugify

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework import permissions
from rest_framework import authentication
from rest_framework.views import status
from rest_framework.response import Response

from api.models.program import Program
from api.models.program import ProgramQueue
from api.models.agency import Agency
from api.models.agency import AgencyQueue

import logging
import json
import re

logger=logging.getLogger(__name__)

class ProgramQueueView(APIView):
  permission_classes=(permissions.AllowAny,)

  @transaction.atomic
  def post(self, request, *args, **kwargs):
    """
    Save Program Queue
    """
    try:
      program_name=request.data.get("name", None)
      slug=slugify(program_name)

      # Agency
      agency = None
      agency_id = int(request.data.get('agency_id', 0))
      if agency_id > 0:
        agency = Agency.objects.get(id=agency_id)

      # Zip codes
      zip_codes = request.data.get('zip_codes', [])
      if type(zip_codes) is not list:
        zip_codes = list(request.data.get('zip_codes', []).split(","))
      
      program = ProgramQueue.objects.create(
        name=program_name,
        slug=slug,
        description=request.data.get("description", None),
        service_types=request.data.get("service_types", None),
        case_management_provided=request.data.get("case_management_provided", None),
        case_management_notes=request.data.get("case_management_notes", None),
        website=request.data.get("website", None),
        phone=request.data.get("phone", None),
        street=request.data.get('street', None),
        city=request.data.get('city', None),
        state=request.data.get('state', None),
        zip_code=request.data.get('zip_code', None),
        next_steps=request.data.get('next_steps', None),
        payment_service_cost=request.data.get('payment_service_cost', None),
        payment_options=request.data.get('payment_options', None),

        age_groups=request.data.get('age_groups', None),
        zip_codes=zip_codes,
        incomes_percent_poverty_level=request.data.get('incomes_percent_poverty_level', None),
        immigration_statuses=request.data.get('immigration_statuses', None),

        requires_enrollment_in=request.data.get('requires_enrollment_in', None),
        other_requirements=request.data.get('other_requirements', None),
        documents_required=request.data.get('documents_required', None),

        schedule=request.data.get('schedules', None),
        walk_in_schedule=request.data.get('walk_in_schedule', None),
        schedule_notes=request.data.get('schedule_notes', None),
        holiday_schedule=request.data.get('holiday_schedule', None),
        appointment_required=request.data.get('appointment_required', None),
        appointment_notes=request.data.get('appointment_notes', None),

        service_same_day_intake=request.data.get('service_same_day_intake', None),
        intake_notes=request.data.get('intake_notes', None),

        languages=request.data.get('languages', None),

        crisis=request.data.get('crisis', None),
        disaster_recovery=request.data.get('disaster_recovery', None),
        transportation=request.data.get('transportation', None),
        client_consult=request.data.get('client_consult', None),

        agency=agency,

        requested_by_name=request.data.get('requested_by_name', None),
        requested_by_email=request.data.get('requested_by_email', None),
        action = 'add'
      )

      return JsonResponse(
        {
          'id': program.id,
          'slug': program.slug,
          'name': program.name,
          'new': True
        }
      )
    except Exception:
      logger.error('Error creating a new program')
      return JsonResponse(
          {
            'error': "Error: Program cannot be created.",
          },
          status=500
        )

class ProgramView(APIView):
  permission_classes=(permissions.AllowAny,)

  def get(self, request, property_name, property_value):
    program = None
    try:
      kw = {property_name:property_value}
      program = Program.objects.get(**kw)
    except ObjectDoesNotExist:
      logger.error('Is not in programs table')

    if program == None:
      try:
        program = ProgramQueue.objects.get(**kw)
      except:
        logger.error('Is not in programs queue table')
        return JsonResponse(
          {
            'message': "Program with {} {} doesn't exists.".format(property_name, property_value),
          }
        )

    return JsonResponse(model_to_dict(program), safe=False)

  @transaction.atomic
  def post(self, request, *args, **kwargs):
    """
    Save Program Queue
    """
    try:
      program_name = request.data.get("name", None)
      slug = slugify(program_name)

      # Agency
      agency = None
      agency_id = int(request.data.get('agency_id', 0))
      agency = Agency.objects.get(id=agency_id)

      # Zip codes
      zip_codes = request.data.get('zip_codes', [])
      if type(zip_codes) is not list:
        zip_codes = list(request.data.get('zip_codes', []).split(","))
      
      program = Program.objects.create(
        name=program_name,
        slug=slug,
        description=request.data.get("description", None),
        service_types=request.data.get("service_types", None),
        case_management_provided=request.data.get("case_management_provided", None),
        case_management_notes=request.data.get("case_management_notes", None),
        website=request.data.get("website", None),
        phone=request.data.get("phone", None),
        street=request.data.get('street', None),
        city=request.data.get('city', None),
        state=request.data.get('state', None),
        zip_code=request.data.get('zip_code', None),
        next_steps=request.data.get('next_steps', None),
        payment_service_cost=request.data.get('payment_service_cost', None),
        payment_options=request.data.get('payment_options', None),

        age_groups=request.data.get('age_groups', None),
        zip_codes=zip_codes,
        incomes_percent_poverty_level=request.data.get('incomes_percent_poverty_level', None),
        immigration_statuses=request.data.get('immigration_statuses', None),

        requires_enrollment_in=request.data.get('requires_enrollment_in', None),
        other_requirements=request.data.get('other_requirements', None),
        documents_required=request.data.get('documents_required', None),

        schedule=request.data.get('schedules', None),
        walk_in_schedule=request.data.get('walk_in_schedule', None),
        schedule_notes=request.data.get('schedule_notes', None),
        holiday_schedule=request.data.get('holiday_schedule', None),
        appointment_required=request.data.get('appointment_required', None),
        appointment_notes=request.data.get('appointment_notes', None),

        service_same_day_intake=request.data.get('service_same_day_intake', None),
        intake_notes=request.data.get('intake_notes', None),

        languages=request.data.get('languages', None),

        crisis=request.data.get('crisis', None),
        disaster_recovery=request.data.get('disaster_recovery', None),
        transportation=request.data.get('transportation', None),
        client_consult=request.data.get('client_consult', None),

        agency=agency
      )

      return JsonResponse(
        {
          'id': program.id,
          'slug': program.slug,
          'name': program.name,
          'new': True
        }
      )
    except Exception:
      logger.error('Error creating a new program')
      return JsonResponse(
          {
            'error': "Error: Program cannot be created.",
          },
          status=500
        )
  

class ProgramListView(APIView):
  permission_classes=(permissions.AllowAny,)

  def get(self, request, property_name, property_value):
    programs = []
    program_list = []

    try:
      if property_value != 'null':

        if property_name in ['id', 'agency_id']:
          kw = {property_name:int(property_value)}
        else:
          kw = {'{}__icontains'.format(property_name):property_value}

        programs = Program.objects.filter(**kw)[:10]
        for program in programs:
          program_list.append(model_to_dict(program))

      return JsonResponse(program_list, safe=False)
    except ObjectDoesNotExist:
      logger.error('Program does not exists.')
      return JsonResponse(
          {
            'message': "Program with {} {} doesn't exists.".format(property_name, property_value),
          }
        )

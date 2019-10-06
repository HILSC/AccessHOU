from django.db import transaction
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.core import serializers
from django.utils.text import slugify
from django.forms.models import model_to_dict

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework import permissions
from rest_framework import authentication
from rest_framework.views import status
from rest_framework.response import Response

from api.models.agency import Agency
from api.models.agency import AgencyQueue

from api.models.program import Program

import logging
import json
import re

logger=logging.getLogger(__name__)

def migrateOldProgramsToNewPrograms():
  from api.models.oldprogram import OldPrograms
  from api.models.agency import Agency
  from api.models.program import Program

  agencies = Agency.objects.all()

  try:
    for agency in agencies:
      old_programs = OldPrograms.objects.filter(agency_id=agency.old_id)
      for old_program in old_programs:

        website = old_program.website
        if old_program.website == '' or old_program.website == None:
          website = agency.website

        street = old_program.physical_address
        if old_program.physical_address == '' or old_program.physical_address == None:
          street = agency.street

        next_steps = old_program.next_steps
        if old_program.next_steps == '' or old_program.next_steps == None:
          next_steps = agency.next_steps

        payment_options = old_program.fee_structure
        if old_program.fee_structure == '' or old_program.fee_structure == None:
          payment_options = agency.payment_options

        age_groups = old_program.age_eligibility
        if old_program.age_eligibility == '' or old_program.age_eligibility == None:
          age_groups = agency.age_groups

        zip_codes = old_program.zipcode_eligibility
        if old_program.zipcode_eligibility == '' or old_program.zipcode_eligibility == None:
          zip_codes = agency.zip_codes

        immigration_statuses = old_program.immigration_status
        if old_program.immigration_status == '' or old_program.immigration_status == None:
          immigration_statuses = agency.immigration_statuses

        schedule = old_program.schedule
        if old_program.schedule == '' or old_program.schedule == None:
          schedule = agency.schedule

        schedule_notes = old_program.schedule_notes
        if old_program.schedule_notes == '' or old_program.schedule_notes == None:
          schedule_notes = agency.schedule_notes

        holiday_schedule = old_program.holiday_schedule
        if old_program.holiday_schedule == '' or old_program.holiday_schedule == None:
          holiday_schedule = agency.holiday_schedule

        languages = old_program.frontline_languages
        if old_program.frontline_languages == '' or old_program.frontline_languages == None:
          languages = agency.languages

        appointment_required = old_program.appointment_required
        if appointment_required in ['Yes', 'yes', 'y', 'Y']:
          appointment_required = True
        elif appointment_required in ['No', 'no', 'n', 'N']:
          appointment_required = False
        else:
          appointment_required = None

        service_available_intake = old_program.service_available_intake
        if service_available_intake in ['Yes', 'yes', 'y', 'Y']:
          service_available_intake = True
        elif service_available_intake in ['No', 'no', 'n', 'N']:
          service_available_intake = False
        else:
          service_available_intake = None
        
        disaster_only = old_program.disaster_only
        if disaster_only in ['Yes', 'yes', 'y', 'Y']:
          disaster_only = True
        elif disaster_only in ['No', 'no', 'n', 'N']:
          disaster_only = False
        else:
          disaster_only = None

        consultation_opportunity = old_program.consultation_opportunity
        if consultation_opportunity in ['Yes', 'yes', 'y', 'Y']:
          consultation_opportunity = True
        elif consultation_opportunity in ['No', 'no', 'n', 'N']:
          consultation_opportunity = False
        else:
          consultation_opportunity = None

        Program.objects.create(
          name=old_program.name,
          slug=slugify(old_program.name),
          description=old_program.description,
          service_types=old_program.service_type,
          website=website,
          phone=agency.phone,
          street=street,
          
          next_steps=next_steps,
          payment_service_cost=old_program.service_cost,
          payment_options=payment_options,

          age_groups=age_groups,
          zip_codes=zip_codes,

          incomes_percent_poverty_level=old_program.income_eligibility,
          immigration_statuses=immigration_statuses,
          requires_enrollment_in=old_program.other_program_enrollment,

          other_requirements=old_program.other_eligibility,
          schedule=schedule,

          schedule_notes=schedule_notes,
          holiday_schedule=holiday_schedule,

          appointment_required=appointment_required,
          appointment_notes=old_program.appointment_required_notes,
          documents_required=old_program.documents_required,
          service_same_day_intake=service_available_intake,

          intake_notes=old_program.service_available_intake_notes,

          languages=languages,

          crisis=old_program.crisis_services_offered,
          disaster_recovery=disaster_only,
          transportation=old_program.transportation,
          client_consult=consultation_opportunity,

          agency=agency
        )
  except Exception as e:
    print(e)

class AgencyQueueView(APIView):
  permission_classes=(permissions.AllowAny,)

  @transaction.atomic
  def post(self, request, *args, **kwargs):
    """
    Save Agency Queue
    """
    try:
      agency_name=request.data.get("name", None)
      slug=slugify(agency_name)
      
      # Verify if agency exists with that slug
      if Agency.objects.filter(slug=slug).exists() or AgencyQueue.objects.filter(slug=slug).exists():
        return JsonResponse(
          {
            'error': "An Agency with that name already exists.",
          },
          status=400
        )

      # Zip codes
      zip_codes = list(request.data.get('zip_codes', '').split(","))
      
      agency=AgencyQueue.objects.create(
        name=agency_name,
        slug=slug,
        phone=request.data.get("phone", None),
        website=request.data.get("website", None),
        street=request.data.get('street', None),
        city=request.data.get('city', None),
        state=request.data.get('state', None),
        zip_code=request.data.get('zip_code', None),
        next_steps=request.data.get('next_steps', None),
        payment_options=request.data.get('payment_options', None),

        age_groups=request.data.get('age_groups', None),
        zip_codes=zip_codes,
        gender=request.data.get('gender', None),
        immigration_statuses=request.data.get('immigration_statuses', None),

        accepted_ids_current=request.data.get('accepted_ids_current', None),
        accepted_ids_expired=request.data.get('accepted_ids_expired', None),
        notes=request.data.get('notes', None),
        proof_of_address=request.data.get('proof_of_address', None),

        schedule=request.data.get('schedules', None),
        schedule_notes=request.data.get('schedule_notes', None),
        holiday_schedule=request.data.get('holiday_schedule', None),

        languages=request.data.get('languages', None),
        documents_languages=request.data.get('documents_languages', None),
        website_languages=request.data.get('website_languages', None),
        frontline_staff_languages=request.data.get('frontline_staff_languages', None),
        interpretations_available=request.data.get('interpretations_available', None),

        assistance_with_forms=True if request.data.get('assistance_with_forms', False) else False,
        visual_aids=True if request.data.get('visual_aids', False) else False,
        ada_accessible=True if request.data.get('ada_accessible', False) else False,

        response_requests=True if request.data.get('response_requests', False) else False,
        cultural_training=request.data.get('cultural_training', None),
        
        requested_by_name=request.data.get('requested_by_name', None),
        requested_by_email=request.data.get('requested_by_email', None),
        action='add'
      )

      return JsonResponse(
        {
          'id': agency.id,
          'slug': agency.slug,
          'name': agency.name,
          'new': True
        }
      )
    except Exception:
      logger.error('Error creating a new agency')
      return JsonResponse(
          {
            'error': "Agency cannot be created. Please try again!",
          },
          status=500
        )
  
class AgencyQueueListView(APIView):
  permission_classes=(permissions.AllowAny,)

  def get(self, request):
    pass

class AgencyView(APIView):
  permission_classes=(permissions.AllowAny,)

  def get(self, request, property_name, property_value):
    agency = None
    try:
      kw = {property_name:property_value}
      agency = Agency.objects.get(**kw)
    except ObjectDoesNotExist:
      logger.error('Is not in Agency table')

    if agency == None:
      try:
        agency = AgencyQueue.objects.get(**kw)
      except:
        logger.error('Is not in Agency Queue table')
        return JsonResponse(
          {
            'message': "Agency with {} {} doesn't exists.".format(property_name, property_value),
          }
        )

    agency_dict = model_to_dict(agency)
    agency_programs = Program.objects.filter(agency_id=agency.id)
    agency_program_list = []
    for program in agency_programs:
      agency_program_list.append(model_to_dict(program))

    agency_dict['programs'] = agency_program_list
    return JsonResponse(agency_dict, safe=False)

  @transaction.atomic
  def post(self, request, *args, **kwargs):
    """
    Save Agency
    """
    try:
      agency_name = request.data.get("name", None)
      slug = slugify(agency_name)

      # Verify if agency exists with that slug
      if Agency.objects.filter(slug=slug).exists():
        return JsonResponse(
          {
            'error': "An Agency with that name already exists.",
          },
          status=400
        )

      # Zip codes list
      zip_codes = list(request.data.get('zip_codes', '').split(","))

      # If user is logged in, this agency doesn't have to go to the queue.
      if request.user:
        agency=Agency.objects.create(
          name=agency_name,
          slug=slug,
          phone=request.data.get("phone", None),
          website=request.data.get("website", None),
          street=request.data.get('street', None),
          city=request.data.get('city', None),
          state=request.data.get('state', None),
          zip_code=request.data.get('zip_code', None),
          next_steps=request.data.get('next_steps', None),
          payment_options=request.data.get('payment_options', None),

          age_groups=request.data.get('age_groups', None),
          zip_codes=zip_codes,
          gender=request.data.get('gender', None),
          immigration_statuses=request.data.get('immigration_statuses', None),

          accepted_ids_current=request.data.get('accepted_ids_current', None),
          accepted_ids_expired=request.data.get('accepted_ids_expired', None),
          notes=request.data.get('notes', None),
          proof_of_address=request.data.get('proof_of_address', None),

          schedule=request.data.get('schedules', None),
          schedule_notes=request.data.get('schedule_notes', None),
          holiday_schedule=request.data.get('holiday_schedule', None),

          languages=request.data.get('languages', None),
          documents_languages=request.data.get('documents_languages', None),
          website_languages=request.data.get('website_languages', None),
          frontline_staff_languages=request.data.get('frontline_staff_languages', None),
          interpretations_available=request.data.get('interpretations_available', None),

          assistance_with_forms=True if request.data.get('assistance_with_forms', False) else False,
          visual_aids=True if request.data.get('visual_aids', False) else False,
          ada_accessible=True if request.data.get('ada_accessible', False) else False,

          response_requests=True if request.data.get('response_requests', False) else False,
          cultural_training=request.data.get('cultural_training', None),
          
          created_by=request.user
        )

      return JsonResponse(
        {
          'id': agency.id,
          'slug': agency.slug,
          'name': agency.name,
          'new': True
        }
      )
    except Exception:
      logger.error('Error creating a new agency')
      return JsonResponse(
          {
            'error': "Agency cannot be created. Please try again!",
          },
          status=500
        )

class AgencyListView(APIView):
  permission_classes=(permissions.AllowAny,)

  def get(self, request, property_name, property_value):
    agencies = []

    try:
      if property_value != 'null':
        kw = {'{}__icontains'.format(property_name):property_value}
        agencies = Agency.objects.filter(**kw)[:10]
      else:
        agencies = Agency.objects.all().order_by('-updated_at', '-created_at', 'name')[:15]

      agency_list = []
      for agency in agencies:
        agency_list.append(model_to_dict(agency))

      return JsonResponse(agency_list, safe=False)
    except ObjectDoesNotExist:
      logger.error('Agency does not exists.')
      return JsonResponse(
          {
            'message': "Agency with {} {} doesn't exists.".format(property_name, property_value),
          }
        )

from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.postgres.fields import JSONField
from django.contrib.auth.models import User
from django.contrib import admin

from api.models.base import Base
from api.models.agency import Agency


class Program(Base):
  """
  Program
  """
  # General
  name = models.CharField(max_length=250, null=False)
  slug = models.CharField(max_length=350, null=False)
  description =  models.TextField(null=True)
  service_types = ArrayField(models.CharField(max_length=250), null=True)
  case_management_provided = models.BooleanField(
    default=False,
    help_text="Is case management provided?",
    null=True
  ) 
  case_management_notes = models.TextField(null=True)
  website = models.CharField(max_length=200, null=True)
  phone = models.CharField(max_length=15, null=True)
  street = models.CharField(max_length=250, null=True)
  city = models.CharField(max_length=100, null=True)
  state = models.CharField(max_length=100, null=True)
  zip_code = models.CharField(max_length=5, null=True)
  next_steps = models.TextField(null=True)
  payment_service_cost =  models.TextField(null=True)
  payment_options = models.TextField(null=True)

  # Eligibility
  age_groups = ArrayField(models.CharField(max_length=250), null=True)
  zip_codes = ArrayField(models.CharField(max_length=500), null=True)
  incomes_percent_poverty_level = models.CharField(max_length=5, null=True)
  immigration_statuses = ArrayField(models.CharField(max_length=250), null=True)
  
  # Requirements
  requires_enrollment_in = models.TextField(null=True)
  other_requirements = models.TextField(null=True)
  documents_required = models.TextField(null=True)
  appointment_required = models.BooleanField(
    default=False,
    help_text="Appointment required?",
    null=True
  )
  appointment_notes = models.TextField(null=True)

  # Schedule
  schedule = JSONField(null=True)
  walk_in_schedule = JSONField(null=True)
  schedule_notes = models.TextField(null=True)
  holiday_schedule = models.TextField(null=True)
  
  # Intake
  service_same_day_intake = models.BooleanField(
    default=False,
    help_text="Are services available same day as intake??",
    null=True
  )
  intake_notes = models.TextField(null=True)

  # Languages
  languages = ArrayField(models.CharField(max_length=45), null=True)

  # Services
  crisis = ArrayField(models.CharField(max_length=250), null=True)
  disaster_recovery = models.BooleanField(
    default=False,
    help_text="Disaster recovery?",
    null=True
  )
  transportation = models.TextField(null=True)
  client_consult = models.BooleanField(
    default=False,
    help_text="Client consult before completing paperwork",
    null=True
  )

  # Agency
  agency = models.ForeignKey(
    Agency,
    on_delete=models.CASCADE,
    related_name="related_agency_%(class)s",
    null=True
  )

  # Log
  created_by = models.ForeignKey(
    User, on_delete=models.CASCADE,
    related_name="created_by_%(class)s",
    null=True
  )

  updated_by = models.ForeignKey(
    User,
    on_delete=models.CASCADE,
    related_name="updated_by_%(class)s",
    null=True
  )

  def __str__(self):
    return self.name

  class Meta:
    db_table = "api_programs"
    verbose_name = "Program"
    verbose_name_plural = "Programs"
    ordering = ['agency', 'name']


class ProgramQueue(Base):
  """
  Program Queue
  """
  # General
  name = models.CharField(max_length=250, null=False)
  slug = models.CharField(max_length=350, null=False)
  description =  models.TextField(null=True)
  service_types = ArrayField(models.CharField(max_length=250), null=True)
  case_management_provided = models.BooleanField(
    default=False,
    help_text="Is case management provided?",
    null=True
  ) 
  case_management_notes = models.TextField(null=True)
  website = models.CharField(max_length=200, null=True)
  phone = models.CharField(max_length=15, null=True)
  street = models.CharField(max_length=250, null=True)
  city = models.CharField(max_length=100, null=True)
  state = models.CharField(max_length=100, null=True)
  zip_code = models.CharField(max_length=5, null=True)
  next_steps = models.TextField(null=True)
  payment_service_cost =  models.TextField(null=True)
  payment_options = models.TextField(null=True)

  # Eligibility
  age_groups = ArrayField(models.CharField(max_length=250), null=True)
  zip_codes = ArrayField(models.CharField(max_length=500), null=True)
  incomes_percent_poverty_level = models.CharField(max_length=5, null=True)
  immigration_statuses = ArrayField(models.CharField(max_length=250), null=True)
  
  # Requirements
  requires_enrollment_in = models.TextField(null=True)
  other_requirements = models.TextField(null=True)
  documents_required = models.TextField(null=True)

  # Schedule
  schedule = JSONField(null=True)
  walk_in_schedule = JSONField(null=True)
  schedule_notes = models.TextField(null=True)
  holiday_schedule = models.TextField(null=True)
  appointment_required = models.BooleanField(
    default=False,
    help_text="Appointment required?",
    null=True
  )
  appointment_notes = models.TextField(null=True)

  # Intake
  service_same_day_intake = models.BooleanField(
    default=False,
    help_text="Are services available same day as intake??",
    null=True
  )
  intake_notes = models.TextField(null=True)

  # Languages
  languages = ArrayField(models.CharField(max_length=45), null=True)

  # Services
  crisis = ArrayField(models.CharField(max_length=250), null=True)
  disaster_recovery = models.BooleanField(
    default=False,
    help_text="Disaster recovery?",
    null=True
  )
  transportation = models.TextField(null=True)
  client_consult = models.BooleanField(
    default=False,
    help_text="Client consult before completing paperwork",
    null=True
  )

  # Agency
  agency = models.ForeignKey(
    Agency,
    on_delete=models.CASCADE,
    related_name="related_agency_%(class)s",
    null=True
  )

  action = models.CharField(max_length=50, null=False)
  verified = models.BooleanField(default=False, null=True)
  requested_by_name = models.CharField(max_length=100, null=True)
  requested_by_email = models.CharField(max_length=150, null=False)

  def __str__(self):
    return self.name

  class Meta:
    db_table = "api_program_queue"
    ordering = ['agency', 'name']

from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.postgres.fields import JSONField
from django.contrib.auth.models import User
from django.contrib import admin

from api.models.base import Base


class Agency(Base):
  """
  Agency
  """
  # General
  name = models.CharField(max_length=250, null=False)
  slug = models.CharField(max_length=350, null=False)
  website = models.CharField(max_length=200, null=True)
  phone = models.CharField(max_length=15, null=True)
  street = models.CharField(max_length=250, null=True)
  city = models.CharField(max_length=100, null=True)
  state = models.CharField(max_length=100, null=True)
  zip_code = models.CharField(max_length=5, null=True)
  next_steps = models.TextField(null=True)
  payment_options = models.TextField(null=True)

  # Eligibility
  age_groups = ArrayField(models.CharField(max_length=250), null=True)
  zip_codes = ArrayField(models.CharField(max_length=500), null=True)
  gender = models.CharField(max_length=50, null=True)
  immigration_statuses = ArrayField(models.CharField(max_length=250), null=True)

  # Requirements
  accepted_ids_current = ArrayField(models.CharField(max_length=250), null=True)
  accepted_ids_expired = ArrayField(models.CharField(max_length=250), null=True)
  notes = models.TextField(null=True)
  proof_of_address = models.CharField(max_length=250, null=True)

  # Schedule
  schedule = JSONField(null=True)
  schedule_notes = models.TextField(null=True)
  holiday_schedule = models.TextField(null=True)

  # Languages
  languages = ArrayField(models.CharField(max_length=45), null=True)
  documents_languages = ArrayField(models.CharField(max_length=45), null=True)
  website_languages = ArrayField(models.CharField(max_length=45), null=True)
  frontline_staff_languages = ArrayField(models.CharField(max_length=45), null=True)
  interpretations_available = ArrayField(models.CharField(max_length=45), null=True)

  # Services
  assistance_with_forms = models.BooleanField(
    default=False,
    help_text="Assistance to fill out intake forms",
    null=True
  ) 
  visual_aids = models.BooleanField(
    default=False,
    help_text="Visual aids for low-literacy clients",
    null=True
  )
  ada_accessible = models.BooleanField(default=False, null=True)

  # Policies
  response_requests = models.BooleanField(
    default=False,
    help_text="Response to Immigrations and Custom Enforcement requests",
    null=True
  )
  cultural_training = models.CharField(
    max_length=250,
    help_text="Staff cultural competency/effectiveness training?",
    null=True
  )

  # Verified
  hilsc_verified = models.BooleanField(default=False, null=True)

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

  old_id = models.CharField(
    max_length=255,
    help_text="Old needhou i",
    null=True
  )

  def __str__(self):
    return self.name

  class Meta:
    db_table = "api_agencies"
    verbose_name = "Agency"
    verbose_name_plural = "Agencies"
    ordering = ['name']


class AgencyQueue(Base):
  """
  Agency Queue
  """
  # General
  name = models.CharField(max_length=250, null=False)
  slug = models.CharField(max_length=350, null=False)
  website = models.CharField(max_length=200, null=True)
  phone = models.CharField(max_length=15, null=True)
  street = models.CharField(max_length=250, null=True)
  city = models.CharField(max_length=100, null=True)
  state = models.CharField(max_length=100, null=True)
  zip_code = models.CharField(max_length=5, null=True)
  next_steps = models.TextField(null=True)
  payment_options = models.TextField(null=True)

  # Eligibility
  age_groups = ArrayField(models.CharField(max_length=250), null=True)
  zip_codes = ArrayField(models.CharField(max_length=250), null=True)
  gender = models.CharField(max_length=50, null=True)
  immigration_statuses = ArrayField(models.CharField(max_length=250), null=True)

  # Requirements
  accepted_ids_current = ArrayField(models.CharField(max_length=250), null=True)
  accepted_ids_expired = ArrayField(models.CharField(max_length=250), null=True)
  notes = models.TextField(null=True)
  proof_of_address = models.CharField(max_length=250, null=True)

  # Schedule
  schedule = JSONField(null=True)
  schedule_notes = models.TextField(null=True)
  holiday_schedule = models.TextField(null=True)

  # Languages
  languages = ArrayField(models.CharField(max_length=45), null=True)
  documents_languages = ArrayField(models.CharField(max_length=45), null=True)
  website_languages = ArrayField(models.CharField(max_length=45), null=True)
  frontline_staff_languages = ArrayField(models.CharField(max_length=45), null=True)
  interpretations_available = ArrayField(models.CharField(max_length=45), null=True)

  # Services
  assistance_with_forms = models.BooleanField(
    default=False,
    help_text="Assistance to fill out intake forms",
    null=True
  ) 
  visual_aids = models.BooleanField(
    default=False,
    help_text="Visual aids for low-literacy clients",
    null=True
  )
  ada_accessible = models.BooleanField(default=False, null=True)

  # Policies
  response_requests = models.BooleanField(
    default=False,
    help_text="Response to Immigrations and Custom Enforcement requests",
    null=True
  )
  cultural_training = models.CharField(
    max_length=250,
    help_text="Staff cultural competency/effectiveness training?",
    null=True
  )

  action = models.CharField(max_length=50, null=False)
  hilsc_verified = models.BooleanField(default=False, null=True)
  requested_by_name = models.CharField(max_length=100, null=True)
  requested_by_email = models.CharField(max_length=150, null=False)
  related_agency = models.ForeignKey(
    Agency,
    on_delete=models.CASCADE,
    related_name="related_agency_%(class)s",
    null=True
  )

  def __str__(self):
    return self.name

  class Meta:
    db_table = "api_agency_queue"
    ordering = ['name']

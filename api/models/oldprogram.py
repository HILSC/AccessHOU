# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class OldPrograms(models.Model):
    agency_id = models.CharField(max_length=255)
    id = models.CharField(max_length=255)
    name = models.TextField()
    description = models.TextField()
    physical_address = models.TextField()
    ada = models.TextField()
    application_process = models.TextField()
    documents_required = models.TextField()
    fee_structure = models.TextField()
    coverage_area = models.TextField()
    service_type = models.TextField(blank=True, null=True)  # This field type is a guess.
    last_updated = models.DateTimeField(blank=True, null=True)
    alternative_name = models.TextField()
    website = models.TextField()
    appointment_required = models.TextField()
    accepting_clients = models.TextField()
    transportation = models.TextField()
    latitude = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    longitude = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    holiday_schedule = models.TextField()
    service_area = models.TextField()
    next_steps = models.TextField()
    waitlist_wait = models.TextField()
    other_program_enrollment = models.TextField()
    other_eligibility = models.TextField()
    id_accepted_notes = models.TextField()
    proof_address = models.TextField()
    appointment_required_notes = models.TextField()
    service_available_intake = models.TextField()
    service_available_intake_notes = models.TextField()
    schedule_notes = models.TextField()
    document_assistance = models.TextField()
    visual_aids_offered = models.TextField()
    consultation_opportunity = models.TextField()
    enforcement_request_policy = models.TextField()
    cultural_competency_offered = models.TextField()
    zipcode_eligibility = models.TextField(blank=True, null=True)  # This field type is a guess.
    age_eligibility = models.TextField(blank=True, null=True)  # This field type is a guess.
    id_accepted_current = models.TextField(blank=True, null=True)  # This field type is a guess.
    website_languages = models.TextField(blank=True, null=True)  # This field type is a guess.
    frontline_languages = models.TextField(blank=True, null=True)  # This field type is a guess.
    interpretation_offered = models.TextField(blank=True, null=True)  # This field type is a guess.
    crisis_services_offered = models.TextField(blank=True, null=True)  # This field type is a guess.
    document_languages = models.TextField(blank=True, null=True)  # This field type is a guess.
    immigration_status = models.TextField(blank=True, null=True)  # This field type is a guess.
    income_eligibility = models.TextField()
    id_accepted_expired = models.TextField(blank=True, null=True)  # This field type is a guess.
    gender_eligibility = models.TextField()
    schedule = models.TextField(blank=True, null=True)  # This field type is a guess.
    service_cost = models.TextField()
    source = models.TextField()
    a2s_verified = models.BooleanField(blank=True, null=True)
    disaster_only = models.BooleanField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'old_programs'

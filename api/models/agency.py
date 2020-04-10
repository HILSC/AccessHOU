from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.postgres.fields import JSONField
from django.contrib.auth.models import User
from django.contrib import admin
from django.utils.timezone import now

from api.models.base import Base


class AgencyBase(Base):
    # General
    name = models.CharField(max_length=250, null=False, blank=False)
    slug = models.CharField(max_length=350, null=False, blank=False)
    website = models.CharField(max_length=200, null=True)
    phone = models.CharField(max_length=15, null=True, blank=False)
    street = models.CharField(max_length=250, null=True)
    city = models.CharField(max_length=100, null=True)
    state = models.CharField(max_length=100, null=True)
    zip_code = models.CharField(max_length=5, null=True)
    geocode = JSONField(null=True)
    next_steps = models.TextField(null=True)
    payment_options = models.TextField(null=True)

    # Eligibility
    age_groups = ArrayField(models.CharField(max_length=250), null=True)
    zip_codes = models.CharField(max_length=500, null=True)
    gender = models.CharField(max_length=50, null=True)
    immigration_statuses = ArrayField(models.CharField(max_length=250), null=True)

    # Requirements
    accepted_ids_current = ArrayField(models.CharField(max_length=250), null=True)
    accepted_ids_expired = ArrayField(models.CharField(max_length=250), null=True)
    notes = models.TextField(null=True)
    proof_of_address = ArrayField(models.CharField(max_length=250, null=True), default=list)

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
    assistance_with_forms = models.CharField(
        max_length=5, help_text="Assistance to fill out intake forms", null=True
    )
    visual_aids = models.CharField(
        max_length=5, help_text="Visual aids for low-literacy clients", null=True
    )
    ada_accessible = models.CharField(max_length=5, null=True)

    # Policies
    response_requests = models.CharField(
        max_length=5,
        help_text="Response to Immigrations and Custom Enforcement requests",
        null=True,
    )
    cultural_training = models.CharField(
        max_length=250,
        help_text="Staff cultural competency/effectiveness training?",
        null=True,
    )

    # Verified
    hilsc_verified = models.BooleanField(default=False, null=True)

    class Meta:
        abstract = True


class Agency(AgencyBase):
    # Log
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="created_by_%(class)s", null=True
    )

    updated_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="updated_by_%(class)s", null=True
    )

    # Emergency Mode
    emergency_mode = models.BooleanField(default=False, null=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "api_agencies"
        verbose_name = "Agency"
        verbose_name_plural = "Agencies"
        ordering = ["name"]

    def custom_create(user, agency=None, hilsc_verified=False, emergency_mode=True):
        if agency:
            new_agency = Agency.objects.create(
                name=agency.name,
                slug=agency.slug,
                website=agency.website,
                phone=agency.phone,
                
                # Address
                street=agency.street,
                city=agency.city,
                state=agency.state,
                zip_code=agency.zip_code,
                geocode=agency.geocode,

                next_steps=agency.next_steps,
                payment_options=agency.payment_options,

                # Eligibility
                age_groups=agency.age_groups,
                zip_codes=agency.zip_codes,
                gender=agency.gender,
                immigration_statuses=agency.immigration_statuses,

                # Requirements
                accepted_ids_current=agency.accepted_ids_current,
                accepted_ids_expired=agency.accepted_ids_expired,
                notes=agency.notes,
                proof_of_address=agency.proof_of_address,

                # Schedule
                schedule=agency.schedule,
                schedule_notes=agency.schedule_notes,
                holiday_schedule=agency.holiday_schedule,

                # Languages
                languages=agency.languages,
                documents_languages=agency.documents_languages,
                website_languages=agency.website_languages,
                frontline_staff_languages=agency.frontline_staff_languages,
                interpretations_available=agency.interpretations_available,

                # Services
                assistance_with_forms=agency.assistance_with_forms,
                visual_aids=agency.visual_aids,
                ada_accessible=agency.ada_accessible,

                # Policies
                response_requests=agency.response_requests,
                cultural_training=agency.cultural_training,

                # Verified
                hilsc_verified=hilsc_verified,

                emergency_mode=emergency_mode
            )

            if user:
                new_agency.created_by = user
                new_agency.save()

            return new_agency


    def custom_update(user, agency=None, agency_id=None, hilsc_verified=False, emergency_mode=True):
        if agency and agency_id:
            updated_agency, created = Agency.objects.update_or_create(
                id=agency_id,
                defaults={
                    "name": agency.name,
                    "slug": agency.slug,
                    "website": agency.website,
                    "phone": agency.phone,
                    
                    # Address
                    "street": agency.street,
                    "city": agency.city,
                    "state": agency.state,
                    "zip_code": agency.zip_code,
                    "geocode": agency.geocode,

                    "next_steps": agency.next_steps,
                    "payment_options": agency.payment_options,

                    # Eligibility
                    "age_groups": agency.age_groups,
                    "zip_codes": agency.zip_codes,
                    "gender": agency.gender,
                    "immigration_statuses": agency.immigration_statuses,

                    # Requirements
                    "accepted_ids_current": agency.accepted_ids_current,
                    "accepted_ids_expired": agency.accepted_ids_expired,
                    "notes": agency.notes,
                    "proof_of_address": agency.proof_of_address,

                    # Schedule
                    "schedule": agency.schedule,
                    "schedule_notes": agency.schedule_notes,
                    "holiday_schedule": agency.holiday_schedule,

                    # Languages
                    "languages": agency.languages,
                    "documents_languages": agency.documents_languages,
                    "website_languages": agency.website_languages,
                    "frontline_staff_languages": agency.frontline_staff_languages,
                    "interpretations_available": agency.interpretations_available,

                    # Services
                    "assistance_with_forms": agency.assistance_with_forms,
                    "visual_aids": agency.visual_aids,
                    "ada_accessible": agency.ada_accessible,

                    # Policies
                    "response_requests": agency.response_requests,
                    "cultural_training": agency.cultural_training,

                    "hilsc_verified": hilsc_verified,

                    "emergency_mode": emergency_mode,

                    "updated_at": now,
                },
            )

            if user:
                updated_agency.updated_by = user
                updated_agency.save()


class AgencyQueue(AgencyBase):
    action = models.CharField(max_length=50, null=False)
    requested_by_name = models.CharField(max_length=100, null=True, default=None)
    requested_by_email = models.CharField(max_length=150, null=False)
    related_agency = models.ForeignKey(
        Agency,
        on_delete=models.CASCADE,
        related_name="related_agency_%(class)s",
        default=None,
        null=True,
    )

    # Emergency Mode
    emergency_mode = models.BooleanField(default=False, null=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "api_agency_queue"
        ordering = ["name"]


class AgencyEmergencyQueue(AgencyBase):
    related_agency = models.ForeignKey(
        Agency,
        on_delete=models.CASCADE,
        related_name="related_agency_%(class)s",
        default=None,
        null=True,
    )

    def __str__(self):
        return self.name

    class Meta:
        db_table = "api_agency_emergency_queue"
        ordering = ["name"]

    def custom_create(agency=None):
        if agency:
            # Need to validate if the original agency already exists in emergency
            # to avoid creating it again
            agency_emergency = None
            try:
                agency_emergency = AgencyEmergencyQueue.objects.get(related_agency_id=agency.id)
            except AgencyEmergencyQueue.DoesNotExist:
                pass

            if not agency_emergency:
                AgencyEmergencyQueue.objects.create(
                    name=agency.name,
                    slug=agency.slug,

                    phone=agency.phone,
                    website=agency.website,

                    # Address
                    street=agency.street,
                    city=agency.city,
                    state=agency.state,
                    zip_code=agency.zip_code,
                    geocode=agency.geocode,

                    next_steps=agency.next_steps,
                    payment_options=agency.payment_options,

                    # Eligibility
                    age_groups=agency.age_groups,
                    zip_codes=agency.zip_codes,
                    gender=agency.gender,
                    immigration_statuses=agency.immigration_statuses,

                    # Requirements
                    accepted_ids_current=agency.accepted_ids_current,
                    accepted_ids_expired=agency.accepted_ids_expired,
                    notes=agency.notes,
                    proof_of_address=agency.proof_of_address,

                    # Schedule
                    schedule=agency.schedule,
                    schedule_notes=agency.schedule_notes,
                    holiday_schedule=agency.holiday_schedule,
                    
                    # Languages
                    languages=agency.languages,
                    documents_languages=agency.documents_languages,
                    website_languages=agency.website_languages,
                    frontline_staff_languages=agency.frontline_staff_languages,
                    interpretations_available=agency.interpretations_available,

                    # Services
                    assistance_with_forms=agency.assistance_with_forms,
                    visual_aids=agency.visual_aids,
                    ada_accessible=agency.ada_accessible,

                    # Policies
                    response_requests=agency.response_requests,
                    cultural_training=agency.cultural_training,

                    # Verified
                    hilsc_verified=agency.hilsc_verified,

                    related_agency=agency
                )

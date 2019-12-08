from django.db import models
from django.db.models import Q
from django.contrib.postgres.fields import ArrayField
from django.contrib.postgres.fields import JSONField
from django.contrib.auth.models import User
from django.contrib import admin
from django.utils.timezone import now

from api.models.base import Base
from api.models.agency import Agency


class ProgramBase(Base):
    # General
    name = models.CharField(max_length=250, null=False)
    slug = models.CharField(max_length=350, null=False)
    description = models.TextField(null=True)
    service_types = ArrayField(models.CharField(max_length=250), null=True)
    case_management_provided = models.CharField(
        max_length=5, help_text="Is case management provided?", null=True
    )
    case_management_notes = models.TextField(null=True)
    website = models.CharField(max_length=200, null=True)
    phone = models.CharField(max_length=15, null=True)

    # Address
    street = models.CharField(max_length=250, null=True)
    city = models.CharField(max_length=100, null=True)
    state = models.CharField(max_length=100, null=True)
    zip_code = models.CharField(max_length=5, null=True)
    geocode = JSONField(null=True)

    next_steps = models.TextField(null=True)
    payment_service_cost = models.TextField(null=True)
    payment_options = models.TextField(null=True)

    # Eligibility
    age_groups = ArrayField(models.CharField(max_length=250), null=True)
    zip_codes = models.CharField(max_length=500, null=True)
    incomes_percent_poverty_level = models.IntegerField(null=True)
    immigration_statuses = ArrayField(models.CharField(max_length=250), null=True)

    # Requirements
    requires_enrollment_in = models.TextField(null=True)
    other_requirements = models.TextField(null=True)
    documents_required = models.TextField(null=True)
    appointment_required = models.CharField(
        max_length=5, help_text="Appointment required?", null=True
    )
    appointment_notes = models.TextField(null=True)

    # Schedule
    schedule = JSONField(null=True)
    walk_in_schedule = JSONField(null=True)
    schedule_notes = models.TextField(null=True)
    holiday_schedule = models.TextField(null=True)

    # Intake
    service_same_day_intake = models.CharField(
        max_length=5, help_text="Are services available same day as intake??", null=True
    )
    intake_notes = models.TextField(null=True)

    # Languages
    languages = ArrayField(models.CharField(max_length=45), null=True)

    # Services
    crisis = ArrayField(models.CharField(max_length=250), null=True)
    disaster_recovery = models.CharField(
        max_length=5, help_text="Disaster recovery?", null=True
    )
    transportation = models.TextField(null=True)
    client_consult = models.CharField(
        max_length=5, help_text="Client consult before completing paperwork", null=True
    )

    # Agency
    agency = models.ForeignKey(
        Agency,
        on_delete=models.CASCADE,
        related_name="related_agency_%(class)s",
        null=True,
    )

    immigration_accessibility_profile = models.BooleanField(default=False, null=True)

    class Meta:
        abstract = True

class Program(ProgramBase):
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
        db_table = "api_programs"
        verbose_name = "Program"
        verbose_name_plural = "Programs"
        ordering = ["agency", "name"]

    def custom_create(user, program=None, emergency_mode=True):
        if program:
            new_program = Program.objects.create(
                # General
                name=program.name,
                slug=program.slug,
                description=program.description,
                service_types=program.service_types,
                case_management_provided=program.case_management_provided,
                case_management_notes=program.case_management_notes,
                website=program.website,
                phone=program.phone,

                # Address
                street=program.street,
                city=program.city,
                state=program.state,
                zip_code=program.zip_code,
                geocode=program.geocode,

                next_steps=program.next_steps,
                payment_service_cost=program.payment_service_cost,
                payment_options=program.payment_options,

                # Eligibility
                age_groups=program.age_groups,
                zip_codes=program.zip_codes,
                incomes_percent_poverty_level=program.incomes_percent_poverty_level,
                immigration_statuses=program.immigration_statuses,

                # Requirements
                requires_enrollment_in=program.requires_enrollment_in,
                other_requirements=program.other_requirements,
                documents_required=program.documents_required,
                appointment_required=program.appointment_required,
                appointment_notes=program.appointment_notes,

                # Schedule
                schedule=program.schedule,
                walk_in_schedule=program.walk_in_schedule,
                schedule_notes=program.schedule_notes,
                holiday_schedule=program.holiday_schedule,
                
                # Intake
                service_same_day_intake=program.service_same_day_intake,
                intake_notes=program.intake_notes,

                # Languages 
                languages=program.languages,

                # Services
                crisis=program.crisis,
                disaster_recovery=program.disaster_recovery,
                transportation=program.transportation,
                client_consult=program.client_consult,

                immigration_accessibility_profile=program.immigration_accessibility_profile,

                agency=program.agency,
                emergency_mode=emergency_mode,
            )

            if user:
                new_program.created_by = user
                new_program.save()

            return new_program

    def custom_update(user, program=None, program_id=None, emergency_mode=True):
        if program and program_id:
            updated_program, created = Program.objects.update_or_create(
                id=program_id,
                defaults={
                    # General
                    "name": program.name,
                    "slug": program.slug,
                    "description": program.description,
                    "service_types": program.service_types,
                    "case_management_provided": program.case_management_provided,
                    "case_management_notes": program.case_management_notes,
                    "website": program.website,
                    "phone": program.phone,

                    # Address
                    "street": program.street,
                    "city": program.city,
                    "state": program.state,
                    "zip_code": program.zip_code,
                    "geocode": program.geocode,

                    "next_steps": program.next_steps,
                    "payment_service_cost": program.payment_service_cost,
                    "payment_options": program.payment_options,

                    # Eligibility
                    "age_groups": program.age_groups,
                    "zip_codes": program.zip_codes,
                    "incomes_percent_poverty_level": program.incomes_percent_poverty_level,
                    "immigration_statuses": program.immigration_statuses,

                    # Requirements
                    "requires_enrollment_in": program.requires_enrollment_in,
                    "other_requirements": program.other_requirements,
                    "documents_required": program.documents_required,
                    "appointment_required": program.appointment_required,
                    "appointment_notes": program.appointment_notes,

                    # Schedule
                    "schedule": program.schedule,
                    "walk_in_schedule": program.walk_in_schedule,
                    "schedule_notes": program.schedule_notes,
                    "holiday_schedule": program.holiday_schedule,
                    
                    # Intake
                    "service_same_day_intake": program.service_same_day_intake,
                    "intake_notes": program.intake_notes,

                    # Language
                    "languages": program.languages,

                    # Services
                    "crisis": program.crisis,
                    "disaster_recovery": program.disaster_recovery,
                    "transportation": program.transportation,
                    "client_consult": program.client_consult,

                    "immigration_accessibility_profile":program.immigration_accessibility_profile,

                    "emergency_mode": emergency_mode,
                    "updated_at": now,
                },
            )

            if user:
                updated_program.updated_by = user
                updated_program.save()



class ProgramQueue(ProgramBase):
    action = models.CharField(max_length=50, null=False)
    requested_by_name = models.CharField(max_length=100, null=True)
    requested_by_email = models.CharField(max_length=150, null=False)
    related_program = models.ForeignKey(
        Program,
        on_delete=models.CASCADE,
        related_name="related_program_%(class)s",
        default=None,
        null=True,
    )

    # Emergency Mode
    emergency_mode = models.BooleanField(default=False, null=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "api_program_queue"
        ordering = ["agency", "name"]


class ProgramEmergencyQueue(ProgramBase):
    # Program
    related_program = models.ForeignKey(
        Program,
        on_delete=models.CASCADE,
        related_name="related_program_%(class)s",
        default=None,
        null=True,
    )

    def __str__(self):
        return self.name

    class Meta:
        db_table = "api_program_emergency_queue"
        ordering = ["agency", "name"]

    def custom_create(program=None):
        if program:
            # Need to validate if the original program already exists in emergency
            # to avoid creating it again
            program_emergency = None
            try:
                program_emergency = ProgramEmergencyQueue.objects.get(related_program_id=program.id)
            except ProgramEmergencyQueue.DoesNotExist:
                pass

            if not program_emergency:
                ProgramEmergencyQueue.objects.create(
                    # General
                    name=program.name,
                    slug=program.slug,
                    description=program.description,
                    service_types=program.service_types,
                    case_management_provided=program.case_management_provided,
                    case_management_notes=program.case_management_notes,
                    website=program.website,
                    phone=program.phone,

                    # Address
                    street=program.street,
                    city=program.city,
                    state=program.state,
                    zip_code=program.zip_code,
                    geocode=program.geocode,

                    next_steps=program.next_steps,
                    payment_service_cost=program.payment_service_cost,
                    payment_options=program.payment_options,

                    # Eligibility
                    age_groups=program.age_groups,
                    zip_codes=program.zip_codes,
                    incomes_percent_poverty_level=program.incomes_percent_poverty_level,
                    immigration_statuses=program.immigration_statuses,

                    # Requirements
                    requires_enrollment_in=program.requires_enrollment_in,
                    other_requirements=program.other_requirements,
                    documents_required=program.documents_required,
                    appointment_required=program.appointment_required,
                    appointment_notes=program.appointment_notes,

                    # Schedule
                    schedule=program.schedule,
                    walk_in_schedule=program.walk_in_schedule,
                    schedule_notes=program.schedule_notes,
                    holiday_schedule=program.holiday_schedule,

                    # Intake
                    service_same_day_intake=program.service_same_day_intake,
                    intake_notes=program.intake_notes,

                    # Language
                    languages=program.languages,

                    # Services
                    crisis=program.crisis,
                    disaster_recovery=program.disaster_recovery,
                    transportation=program.transportation,
                    client_consult=program.client_consult,

                    agency=program.agency,

                    related_program=program,

                    immigration_accessibility_profile=program.immigration_accessibility_profile
                )

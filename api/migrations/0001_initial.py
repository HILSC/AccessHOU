# Generated by Django 2.2.5 on 2019-10-13 17:54

from django.conf import settings
import django.contrib.postgres.fields
import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Agency',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now_add=True)),
                ('name', models.CharField(max_length=250)),
                ('slug', models.CharField(max_length=350)),
                ('website', models.CharField(max_length=200, null=True)),
                ('phone', models.CharField(max_length=15, null=True)),
                ('street', models.CharField(max_length=250, null=True)),
                ('city', models.CharField(max_length=100, null=True)),
                ('state', models.CharField(max_length=100, null=True)),
                ('zip_code', models.CharField(max_length=5, null=True)),
                ('next_steps', models.TextField(null=True)),
                ('payment_options', models.TextField(null=True)),
                ('age_groups', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=250), null=True, size=None)),
                ('zip_codes', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=500), null=True, size=None)),
                ('gender', models.CharField(max_length=50, null=True)),
                ('immigration_statuses', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=250), null=True, size=None)),
                ('accepted_ids_current', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=250), null=True, size=None)),
                ('accepted_ids_expired', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=250), null=True, size=None)),
                ('notes', models.TextField(null=True)),
                ('proof_of_address', models.CharField(max_length=250, null=True)),
                ('schedule', django.contrib.postgres.fields.jsonb.JSONField(null=True)),
                ('schedule_notes', models.TextField(null=True)),
                ('holiday_schedule', models.TextField(null=True)),
                ('languages', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=45), null=True, size=None)),
                ('documents_languages', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=45), null=True, size=None)),
                ('website_languages', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=45), null=True, size=None)),
                ('frontline_staff_languages', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=45), null=True, size=None)),
                ('interpretations_available', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=45), null=True, size=None)),
                ('assistance_with_forms', models.BooleanField(default=False, help_text='Assistance to fill out intake forms', null=True)),
                ('visual_aids', models.BooleanField(default=False, help_text='Visual aids for low-literacy clients', null=True)),
                ('ada_accessible', models.BooleanField(default=False, null=True)),
                ('response_requests', models.BooleanField(default=False, help_text='Response to Immigrations and Custom Enforcement requests', null=True)),
                ('cultural_training', models.CharField(help_text='Staff cultural competency/effectiveness training?', max_length=250, null=True)),
                ('hilsc_verified', models.BooleanField(default=False, null=True)),
                ('old_id', models.CharField(help_text='Old needhou i', max_length=255, null=True)),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='created_by_agency', to=settings.AUTH_USER_MODEL)),
                ('updated_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='updated_by_agency', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Agency',
                'verbose_name_plural': 'Agencies',
                'db_table': 'api_agencies',
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='Language',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now_add=True)),
                ('name', models.CharField(max_length=250)),
            ],
            options={
                'verbose_name': 'Language',
                'verbose_name_plural': 'Languages',
                'db_table': 'api_languages',
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='Program',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now_add=True)),
                ('name', models.CharField(max_length=250)),
                ('slug', models.CharField(max_length=350)),
                ('description', models.TextField(null=True)),
                ('service_types', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=250), null=True, size=None)),
                ('case_management_provided', models.BooleanField(default=False, help_text='Is case management provided?', null=True)),
                ('case_management_notes', models.TextField(null=True)),
                ('website', models.CharField(max_length=200, null=True)),
                ('phone', models.CharField(max_length=15, null=True)),
                ('street', models.CharField(max_length=250, null=True)),
                ('city', models.CharField(max_length=100, null=True)),
                ('state', models.CharField(max_length=100, null=True)),
                ('zip_code', models.CharField(max_length=5, null=True)),
                ('next_steps', models.TextField(null=True)),
                ('payment_service_cost', models.TextField(null=True)),
                ('payment_options', models.TextField(null=True)),
                ('age_groups', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=250), null=True, size=None)),
                ('zip_codes', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=500), null=True, size=None)),
                ('incomes_percent_poverty_level', models.CharField(max_length=5, null=True)),
                ('muc_requirements', models.CharField(max_length=5, null=True)),
                ('immigration_statuses', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=250), null=True, size=None)),
                ('requires_enrollment_in', models.TextField(null=True)),
                ('other_requirements', models.TextField(null=True)),
                ('documents_required', models.TextField(null=True)),
                ('appointment_required', models.BooleanField(default=False, help_text='Appointment required?', null=True)),
                ('appointment_notes', models.TextField(null=True)),
                ('schedule', django.contrib.postgres.fields.jsonb.JSONField(null=True)),
                ('walk_in_schedule', django.contrib.postgres.fields.jsonb.JSONField(null=True)),
                ('schedule_notes', models.TextField(null=True)),
                ('holiday_schedule', models.TextField(null=True)),
                ('service_same_day_intake', models.BooleanField(default=False, help_text='Are services available same day as intake??', null=True)),
                ('intake_notes', models.TextField(null=True)),
                ('languages', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=45), null=True, size=None)),
                ('crisis', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=250), null=True, size=None)),
                ('disaster_recovery', models.BooleanField(default=False, help_text='Disaster recovery?', null=True)),
                ('transportation', models.TextField(null=True)),
                ('client_consult', models.BooleanField(default=False, help_text='Client consult before completing paperwork', null=True)),
                ('agency', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='related_agency_program', to='api.Agency')),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='created_by_program', to=settings.AUTH_USER_MODEL)),
                ('updated_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='updated_by_program', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Program',
                'verbose_name_plural': 'Programs',
                'db_table': 'api_programs',
                'ordering': ['agency', 'name'],
            },
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now_add=True)),
                ('name', models.CharField(blank=True, max_length=100, null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='userprofile', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'UserProfle',
                'verbose_name_plural': 'UserProfiles',
                'db_table': 'api_user_profiles',
            },
        ),
        migrations.CreateModel(
            name='ProgramQueue',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now_add=True)),
                ('name', models.CharField(max_length=250)),
                ('slug', models.CharField(max_length=350)),
                ('description', models.TextField(null=True)),
                ('service_types', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=250), null=True, size=None)),
                ('case_management_provided', models.BooleanField(default=False, help_text='Is case management provided?', null=True)),
                ('case_management_notes', models.TextField(null=True)),
                ('website', models.CharField(max_length=200, null=True)),
                ('phone', models.CharField(max_length=15, null=True)),
                ('street', models.CharField(max_length=250, null=True)),
                ('city', models.CharField(max_length=100, null=True)),
                ('state', models.CharField(max_length=100, null=True)),
                ('zip_code', models.CharField(max_length=5, null=True)),
                ('next_steps', models.TextField(null=True)),
                ('payment_service_cost', models.TextField(null=True)),
                ('payment_options', models.TextField(null=True)),
                ('age_groups', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=250), null=True, size=None)),
                ('zip_codes', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=500), null=True, size=None)),
                ('incomes_percent_poverty_level', models.CharField(max_length=5, null=True)),
                ('muc_requirements', models.CharField(max_length=5, null=True)),
                ('immigration_statuses', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=250), null=True, size=None)),
                ('requires_enrollment_in', models.TextField(null=True)),
                ('other_requirements', models.TextField(null=True)),
                ('documents_required', models.TextField(null=True)),
                ('schedule', django.contrib.postgres.fields.jsonb.JSONField(null=True)),
                ('walk_in_schedule', django.contrib.postgres.fields.jsonb.JSONField(null=True)),
                ('schedule_notes', models.TextField(null=True)),
                ('holiday_schedule', models.TextField(null=True)),
                ('appointment_required', models.BooleanField(default=False, help_text='Appointment required?', null=True)),
                ('appointment_notes', models.TextField(null=True)),
                ('service_same_day_intake', models.BooleanField(default=False, help_text='Are services available same day as intake??', null=True)),
                ('intake_notes', models.TextField(null=True)),
                ('languages', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=45), null=True, size=None)),
                ('crisis', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=250), null=True, size=None)),
                ('disaster_recovery', models.BooleanField(default=False, help_text='Disaster recovery?', null=True)),
                ('transportation', models.TextField(null=True)),
                ('client_consult', models.BooleanField(default=False, help_text='Client consult before completing paperwork', null=True)),
                ('action', models.CharField(max_length=50)),
                ('verified', models.BooleanField(default=False, null=True)),
                ('requested_by_name', models.CharField(max_length=100, null=True)),
                ('requested_by_email', models.CharField(max_length=150)),
                ('agency', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='related_agency_programqueue', to='api.Agency')),
                ('related_program', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='related_program_programqueue', to='api.Program')),
            ],
            options={
                'db_table': 'api_program_queue',
                'ordering': ['agency', 'name'],
            },
        ),
        migrations.CreateModel(
            name='AgencyQueue',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now_add=True)),
                ('name', models.CharField(max_length=250)),
                ('slug', models.CharField(max_length=350)),
                ('website', models.CharField(max_length=200, null=True)),
                ('phone', models.CharField(max_length=15, null=True)),
                ('street', models.CharField(max_length=250, null=True)),
                ('city', models.CharField(max_length=100, null=True)),
                ('state', models.CharField(max_length=100, null=True)),
                ('zip_code', models.CharField(max_length=5, null=True)),
                ('next_steps', models.TextField(null=True)),
                ('payment_options', models.TextField(null=True)),
                ('age_groups', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=250), null=True, size=None)),
                ('zip_codes', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=250), null=True, size=None)),
                ('gender', models.CharField(max_length=50, null=True)),
                ('immigration_statuses', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=250), null=True, size=None)),
                ('accepted_ids_current', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=250), null=True, size=None)),
                ('accepted_ids_expired', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=250), null=True, size=None)),
                ('notes', models.TextField(null=True)),
                ('proof_of_address', models.CharField(max_length=250, null=True)),
                ('schedule', django.contrib.postgres.fields.jsonb.JSONField(null=True)),
                ('schedule_notes', models.TextField(null=True)),
                ('holiday_schedule', models.TextField(null=True)),
                ('languages', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=45), null=True, size=None)),
                ('documents_languages', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=45), null=True, size=None)),
                ('website_languages', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=45), null=True, size=None)),
                ('frontline_staff_languages', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=45), null=True, size=None)),
                ('interpretations_available', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=45), null=True, size=None)),
                ('assistance_with_forms', models.BooleanField(default=False, help_text='Assistance to fill out intake forms', null=True)),
                ('visual_aids', models.BooleanField(default=False, help_text='Visual aids for low-literacy clients', null=True)),
                ('ada_accessible', models.BooleanField(default=False, null=True)),
                ('response_requests', models.BooleanField(default=False, help_text='Response to Immigrations and Custom Enforcement requests', null=True)),
                ('cultural_training', models.CharField(help_text='Staff cultural competency/effectiveness training?', max_length=250, null=True)),
                ('action', models.CharField(max_length=50)),
                ('hilsc_verified', models.BooleanField(default=False, null=True)),
                ('requested_by_name', models.CharField(max_length=100, null=True)),
                ('requested_by_email', models.CharField(max_length=150)),
                ('related_agency', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='related_agency_agencyqueue', to='api.Agency')),
            ],
            options={
                'db_table': 'api_agency_queue',
                'ordering': ['name'],
            },
        ),
    ]

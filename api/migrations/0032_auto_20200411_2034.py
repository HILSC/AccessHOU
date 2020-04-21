# Generated by Django 2.2.5 on 2020-04-11 20:34

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0031_publicactionlog'),
    ]

    operations = [
        migrations.AddField(
            model_name='agency',
            name='proof_of_address_second',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=250, null=True), default=list, size=None),
        ),
        migrations.AddField(
            model_name='agencyemergencyqueue',
            name='proof_of_address_second',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=250, null=True), default=list, size=None),
        ),
        migrations.AddField(
            model_name='agencyqueue',
            name='proof_of_address_second',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=250, null=True), default=list, size=None),
        ),
    ]
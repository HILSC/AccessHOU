# Generated by Django 2.2.5 on 2019-11-10 19:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0018_auto_20191110_0016'),
    ]

    operations = [
        migrations.AddField(
            model_name='role',
            name='HILSC_verified',
            field=models.BooleanField(default=False, null=True),
        ),
        migrations.AddField(
            model_name='role',
            name='add_advocacy_reports',
            field=models.BooleanField(default=False, null=True),
        ),
        migrations.AddField(
            model_name='role',
            name='approve_queue',
            field=models.BooleanField(default=False, null=True),
        ),
        migrations.AddField(
            model_name='role',
            name='skip_queue',
            field=models.BooleanField(default=False, null=True),
        ),
    ]

# Generated by Django 2.2.5 on 2020-02-15 18:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0025_advocacyreport'),
    ]

    operations = [
        migrations.AddField(
            model_name='role',
            name='view_advocacy_reports',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='role',
            name='HILSC_verified',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='role',
            name='add_advocacy_reports',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='role',
            name='approve_queue',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='role',
            name='name',
            field=models.CharField(blank=True, default=False, max_length=100),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='role',
            name='skip_queue',
            field=models.BooleanField(default=False),
        ),
    ]
# Generated by Django 2.2.5 on 2020-02-16 05:38

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0029_auto_20200216_0529'),
    ]

    operations = [
        migrations.AlterField(
            model_name='advocacyreport',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]

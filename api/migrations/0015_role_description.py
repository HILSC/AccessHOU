# Generated by Django 2.2.5 on 2019-11-09 23:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_auto_20191109_2233'),
    ]

    operations = [
        migrations.AddField(
            model_name='role',
            name='description',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
    ]

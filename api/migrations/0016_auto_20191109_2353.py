# Generated by Django 2.2.5 on 2019-11-09 23:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_role_description'),
    ]

    operations = [
        migrations.RenameField(
            model_name='profile',
            old_name='name',
            new_name='agency',
        ),
    ]
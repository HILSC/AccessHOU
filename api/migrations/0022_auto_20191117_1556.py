# Generated by Django 2.2.5 on 2019-11-17 15:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0021_auto_20191117_1448'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='programemergencyqueue',
            name='created_by',
        ),
        migrations.RemoveField(
            model_name='programemergencyqueue',
            name='updated_by',
        ),
        migrations.AlterField(
            model_name='programemergencyqueue',
            name='related_program',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='related_program_programemergencyqueue', to='api.Program'),
        ),
        migrations.AlterField(
            model_name='programqueue',
            name='related_program',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='related_program_programqueue', to='api.Program'),
        ),
    ]
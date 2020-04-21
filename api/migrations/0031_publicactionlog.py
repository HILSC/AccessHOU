# Generated by Django 2.2.5 on 2020-04-10 17:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0030_auto_20200216_0538'),
    ]

    operations = [
        migrations.CreateModel(
            name='PublicActionLog',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now_add=True)),
                ('entity_slug', models.CharField(max_length=350)),
                ('action', models.CharField(max_length=45)),
                ('model', models.CharField(max_length=45)),
                ('requested_by_name', models.CharField(default=None, max_length=100, null=True)),
                ('requested_by_email', models.CharField(max_length=150)),
            ],
            options={
                'db_table': 'api_public_actions_logs',
            },
        ),
    ]
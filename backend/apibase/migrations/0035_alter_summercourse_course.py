# Generated by Django 5.0.2 on 2025-07-05 15:01

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apibase', '0034_summercourse_summerstudentselection'),
    ]

    operations = [
        migrations.AlterField(
            model_name='summercourse',
            name='course',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='summer_courses', to='apibase.course'),
        ),
    ]

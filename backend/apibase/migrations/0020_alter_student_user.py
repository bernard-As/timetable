# Generated by Django 5.0.2 on 2024-10-03 09:35

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apibase', '0019_remove_advisor_lecturer_advisor_user_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='student',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, parent_link=True, to='apibase.users'),
        ),
    ]

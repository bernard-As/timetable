# Generated by Django 5.0.2 on 2024-10-13 19:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('apibase', '0025_alter_student_coursegroup'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='schedule',
            name='type',
        ),
    ]

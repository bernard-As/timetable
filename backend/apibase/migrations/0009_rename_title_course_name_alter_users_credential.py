# Generated by Django 5.0.2 on 2024-09-17 18:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apibase', '0008_remove_users_department_remove_users_faculty'),
    ]

    operations = [
        migrations.RenameField(
            model_name='course',
            old_name='title',
            new_name='name',
        ),
        migrations.AlterField(
            model_name='users',
            name='credential',
            field=models.CharField(choices=[('SYSADM', 'SystemAdmin'), ('PADM', 'PlatformAdmin'), ('VR', 'ViceRector'), ('AD', 'Advisor'), ('HOD', 'HeadOfDepartment'), ('OT', 'Other')], default='OT', max_length=255),
        ),
    ]

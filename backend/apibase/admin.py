from django.contrib import admin
from django.apps import apps
# admin.py
from .models import *

class StudentAdmin(admin.ModelAdmin):
    list_display = ( 'studentId',)  # specify the fields to display
    fields = ('user__email', 'studentId')  # specify the fields to display in the detail, create, and update views
    search_fields = ('user__email', 'studentId')
admin.site.register(Student, StudentAdmin)



# Get a list of all installed models
models = apps.get_models()

# Register only the models that are not already registered
for model in models:
    if not admin.site.is_registered(model):
        admin.site.register(model)

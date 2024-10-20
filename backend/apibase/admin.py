from django.contrib import admin
from django.apps import apps
# admin.py
from .models import *

class StudentAdmin(admin.ModelAdmin):
    list_display = ( 'studentId',)  # specify the fields to display
    fields = ('studentId','coursegroup')  # specify the fields to display in the detail, create, and update views
    search_fields = ('user__email', 'studentId')
admin.site.register(Student, StudentAdmin)


class CourseAdmin(admin.ModelAdmin):
    list_display = ( 'code','name')  # specify the fields to display
    fields = ('code', 'name')  # specify the fields to display in the detail, create, and update views
    search_fields = ('code', 'name')
admin.site.register(Course, CourseAdmin)


# class CourseGroupAdmin(admin.ModelAdmin):
#     list_display = ( 'course__code','course__name')  # specify the fields to display
#     # fields = ('course__code', 'course__name')  # specify the fields to display in the detail, create, and update views
#     # search_fields = ('course__code', 'course__name')
# admin.site.register(Coursegroup, CourseGroupAdmin)
# Get a list of all installed models
models = apps.get_models()

# Register only the models that are not already registered
for model in models:
    if not admin.site.is_registered(model):
        admin.site.register(model)

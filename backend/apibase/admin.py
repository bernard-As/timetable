import django_filters
from django.contrib import admin
from django.apps import apps
# admin.py
from .models import *
from django.utils.translation import gettext_lazy as _
from django import forms



class UsersAdmin(admin.ModelAdmin):
    list_display = ( 'email',)  # specify the fields to display
    # fields = ('studentId','coursegroup')  # specify the fields to display in the detail, create, and update views
    search_fields = ('user__email',)
admin.site.register(Users, UsersAdmin)

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


class CourseSemesterAdmin(admin.ModelAdmin):
    search_fields = ('program__name', 'semester__year', 'semester__season', 'semester_num')
    list_filter = (
        'program',
        'semester',
    )
admin.site.register(CourseSemester, CourseSemesterAdmin)


class CourseGroupCourseSemesterFilter(admin.SimpleListFilter):
    title = _('Course Group Course Semester')
    parameter_name = 'course_semester'

    def lookups(self, request, model_admin):
        return []  # Empty because we want a text input, not a dropdown

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(
                course_semester__program__name__icontains=self.value(),
                course_semester__semester__year__icontains=self.value(),
                course_semester__semester__season__icontains=self.value(),
            )
        return queryset

    def choices(self, changelist):
        return []  # Remove the default dropdown options



class CourseGroupAdmin(admin.ModelAdmin):
    search_fields = (
    'course__name',
    'course__code',
    'lecturer__user__first_name',   # Access user’s name via Lecturer
    'lecturer__user__last_name',   # Access user’s name via Lecturer
    'lecturer__user__email',  # Access user’s email via Lecturer
)

    list_filter = (
        'course_semester__semester',
        'course_semester__program',
        'course_semester',
        'course',
        'lecturer',
    ) 
admin.site.register(Coursegroup, CourseGroupAdmin)

# Get a list of all installed models
models = apps.get_models()

# Register only the models that are not already registered
for model in models:
    if not admin.site.is_registered(model):
        admin.site.register(model)

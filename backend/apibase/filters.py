import django_filters

from apibase.models import Coursegroup

class CourseGroupFilter(django_filters.FilterSet):
    course_field = django_filters.CharFilter(field_name=('course__title', 'course__code'), lookup_expr='icontains')
    class Meta:
        model = Coursegroup
        fields = ['description']
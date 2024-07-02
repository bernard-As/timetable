
from core.models import *


def renew_x_index():
    """Renew the index of each model. over 10"""
    ZIndex.objects.all().delete()
    ZIndex.objects.create(field='faculty', index=4)
    ZIndex.objects.create(field='department', index=3)
    ZIndex.objects.create(field='program', index=3)
    ZIndex.objects.create(field='semester', index=10)
    ZIndex.objects.create(field='semester_course', index=9)
    ZIndex.objects.create(field='activity_type', index=10)
    ZIndex.objects.create(field='course', index=10)
    ZIndex.objects.create(field='student_group', index=7)
    ZIndex.objects.create(field='lecturer', index=9)
    ZIndex.objects.create(field='title', index=6)

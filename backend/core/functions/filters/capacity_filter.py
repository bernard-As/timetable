from django.db.models import F, Value
from django.db.models.functions import Abs
from core.models import *


def capacity_filter_filler():
    """
    filter the room and sort the capacity usability 
    
    """
    capacity_index = ZIndex.objects.get(field='capacity').index
    course_groups = CourseGroupC.objects.all()
    for course_group in course_groups:
        rm,_ = CourseGroupRoom.objects.get_or_create(course_group=course_group.pk,z_index=-1*capacity_index)
        ordered_rooms = get_rooms_ordered_by_proximity(course_group.capacity)
        for room in ordered_rooms:
            rm.use_room.add(room)
            
    


def get_rooms_ordered_by_proximity(capacity):
    """
    best choices are the closest one 
    +- but + for preferences and - if less than 10
    """
    
    rooms_ordered_by_proximity = (
        RoomC
        .objects
        .filter(common_c__status=True)
        .annotate(proximity=Abs(F('room__capacity') - Value(capacity)))
        .order_by('proximity')
    )
    return rooms_ordered_by_proximity

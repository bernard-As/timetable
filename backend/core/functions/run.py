
from core.models import *


def runcore():
    # getting alll the coursegroup attached with the roms
    course_group_rooms = CourseGroupRoom.objects.filter(status = True)
    for course_group_room in course_group_rooms:
        if not course_group_room.status and not CIATBS(course_group_room.course_group.pk): 
            continue
        verifying_rooms(course_group_room.pk)
        
        use_rooms = course_group_room.use_room.all()
        for use_room in use_rooms:
            usable_room_frames = use_room.room.room_frames.filter(status=True).orderby('backtrack_count')
        for room_frame in usable_room_frames:
            
               

    pass

def CIATBS(couse_group_id):
    # checking if the course group is allow to be set
    course_group = CourseGroupC.objects.get(id = couse_group_id)
    if course_group.common_c.status and course_group.course_group.status: # type: ignore
        return True
    else: 
        return False
    
def verifying_rooms(course_group_room_id):
    """
        Verifying if all room attached to the course group are valid
    """
    course_group_room = CourseGroupRoom.objects.get(id = course_group_room_id)
    rooms = course_group_room.use_room.all()
    for use_room in rooms: 
        if not use_room.status or not use_room.room.status:
            course_group_room.use_room.remove(use_room)

    course_group_room.save()

def get_usable_room_frame(course_group_room_id):
    course_group_room = CourseGroupRoom.objects.get(id = course_group_room_id)
    use_rooms = course_group_room.use_room.all()
    frame_to_escape = []
    for use_room in use_rooms:
        room_frames = use_room.room.room_frames
        for room_frame in room_frames:
            

    
    
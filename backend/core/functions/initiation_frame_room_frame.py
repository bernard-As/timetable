
from core.models import *


def initiation_frame_room_frame():
    """
        prefilling frame and room_frame
    """
    day_time_frames = DayTimeFrame.objects.all()
    rooms = RoomC.objects.all()
    for dtf in day_time_frames:
        f = Frame.objects.create(day_time_frame = dtf)
        for room in rooms:
            RoomFrame.objects.get_or_create(room = room.pk, frame = f.pk)

    
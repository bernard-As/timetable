
from core.models import *


def initiation_frame_room_frame():
    """
        prefilling frame and room_frame
    """
    day_time_frames = DayTimeFrame.objects.all()
    room_frames = RoomFrame.objects.all()
    for room_frame in room_frames:
        for dtf in day_time_frames:
            f = Frame.objects.create(day_time_frame = dtf)
            room_frame.frame.add(f)
        room_frame.save()
    
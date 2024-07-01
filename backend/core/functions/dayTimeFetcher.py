
from core.models import *


def day_time_fetcher():
    """
        update the day, time, dayTime models
    """

    sys = SysSeting.objects.create()
    generate_time_frames(sys)
    day_frame_default(sys)
    day_time_frame_default()

    
def generate_time_frames(sys):
    for i in range(0,2499,sys['time_rate']):
        if i > sys['end_time'] or i < sys['start_time']:
            continue
        TimeFrame.objects.create(time=i)

def day_frame_default(sys):
    for i in range(0,7):
        off_days = sys['exept_day'].split(',')
        if i in off_days:
            continue
        DayFrame.objects.create(day=i)
        
def day_time_frame_default():
    time_frames = TimeFrame.objects.all()
    day_frames = DayFrame.objects.all()
    for time in time_frames:
        for day in day_frames:
            DayTimeFrame.objects.create(day=day, time=time)


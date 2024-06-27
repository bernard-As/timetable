
from core.models import SysSeting, TimeFrame


def day_time_fetcher():
    """
        update the day, time, dayTime models
    """

    time_rate = SysSeting.objects.create()

    
def generate_time_frames(time_rate):
    for i in range(0,2499,time_rate):
        TimeFrame.objects.create(time=i)
        
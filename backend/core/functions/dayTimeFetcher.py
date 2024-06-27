
from core.models import SysSeting


def day_time_fetcher():
    """
        update the day, time, dayTime models
    """

    time_rate = SysSeting.objects.create()
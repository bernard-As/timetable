from core.functions.initiation_frame_room_frame import initiation_frame_room_frame
from core.functions.run import runcore
from core.functions.filters.capacity_filter import capacity_filter_filler
from core.functions.dayTimeFetcher import day_time_fetcher
from core.functions.z_index import renew_x_index
from core.functions.clear import clearer
from core.functions.refiller import refiller
from .models import *

def Main ():
    """Core system Logic Laucher
    0->Clear
    1->Fille the core objects
    """
    print("Welcome to the Student Management System")
    clearer()
    refiller()
    day_time_fetcher()
    renew_x_index()
    capacity_filter_filler()
    initiation_frame_room_frame()
    runcore()
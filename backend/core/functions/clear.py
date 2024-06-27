
from core.models import *


def clearer():
    """
        Clear all existing objects
    """
    title_clear()
    building_clear()
    floor_clear()
    room_clear()
    room_feature_clear()
    semester_clear()
    faculty_clear()
    department_clear()
    program_clear()
    course_semester_clear()
    lecturer_clear()
    activity_type_clear()
    course_clear()
    course_group_clear()
    day_time_clear()
def title_clear():
    TitleC.objects.all().delete()

def building_clear():
    BuildingC.objects.all().delete()

def floor_clear():
    FloorC.objects.all().delete()

def room_feature_clear():
    RoomFeaturesC.objects.all().delete()

def room_clear():
    RoomC.objects.all().delete()

def semester_clear():
    SemesterC.objects.all().delete()

def faculty_clear():
    FacultyC.objects.all().delete()

def department_clear():
    DepartmentC.objects.all().delete()

def program_clear():
    ProgramC.objects.all().delete()

def course_semester_clear():
    CourseSemesterC.objects.all().delete()

def lecturer_clear():
    LecturerC.objects.all().delete()

def activity_type_clear():
    ActivityTypeC.objects.all().delete()

def course_clear():
    CourseC.objects.all().delete()

def course_group_clear():
    CourseGroupC.objects.all().delete()

def day_time_clear():
    DayTimeFrame.objects.all().delete()
    TimeFrame.objects.all().delete()
    DayFrame.objects.all().delete()
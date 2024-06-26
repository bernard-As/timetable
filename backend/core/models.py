from django.db import models

from apibase.models import *

"""C infront stand for core to avoid confusion in imports"""
class SysSeting(models.Model):
    """
    Informations For the system requirement 
    ->will always use the last row for settings
    ->Basic system in minute base [1h=100,30min=50,1h15min=125]
    ->PreferenceImpact holds record about the preferences that impact the object
    ->Z-Index for How deep can it be use depanding on the other (for Euristc Algorithm)
    ->impact_status is use to know if it current frame is to be remove or take more in consideration

    **event_time modifications will be Impact on frames **
    Next time: fuctions for filling the objects and logic to make the system numeriacal 
    """
    time_rate = models.IntegerField(default=50)
    run_time_semesters = models.ManyToManyField(Semester,help_text='Semester to take in consideration')

class CommonC(models.Model):
    """
    Common Model for all models
    """
    status = models.BooleanField()
    preference_impact = models.ManyToManyField(Preference,related_name='CommonC')
    z_index = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



class TimeFrame(models.Model):
    time = models.SmallIntegerField()
    common_c = models.ForeignKey(CommonC,on_delete=models.CASCADE,related_name='time_frame')
    

class DayFrame(models.Model):
    day = models.IntegerField()    
    common_c = models.ForeignKey(CommonC,on_delete=models.CASCADE,related_name='day_frame')
    

class DayTimeFrame(models.Model):
    day_frame = models.ForeignKey(DayFrame,on_delete=models.CASCADE)
    time_frame = models.ForeignKey(TimeFrame,on_delete=models.CASCADE)
    common_c = models.ForeignKey(CommonC,on_delete=models.CASCADE,related_name='day_time_frame')

class Frame(models.Model):
    day_frame = models.ForeignKey(DayFrame,on_delete=models.CASCADE)
    time_frame = models.ForeignKey(TimeFrame,on_delete=models.CASCADE)
    day_time_frame = models.ForeignKey(DayTimeFrame,on_delete=models.CASCADE)
    common_c = models.ForeignKey(CommonC,on_delete=models.CASCADE,related_name='frame')

class TitleC(models.Model):
    title = models.OneToOneField(Title, on_delete=models.CASCADE)
    common_c = models.ForeignKey(CommonC,on_delete=models.CASCADE,related_name='title_c')
    frame = models.ManyToManyField(Frame,)

class BuildingC(models.Model):
    building = models.OneToOneField(Building,on_delete=models.SET_NULL,null=True,related_name='building_c')
    frame = models.ManyToManyField(Frame,)
    common_c = models.ForeignKey(CommonC,on_delete=models.CASCADE,related_name='building_c_frame')

class FloorC(models.Model):
    floor = models.OneToOneField(Floor,on_delete=models.SET_NULL,null=True,related_name='floor_c')
    building = models.ForeignKey(BuildingC,on_delete=models.CASCADE,related_name='floor_c_building')
    frame = models.ManyToManyField(Frame,)
    common_c = models.ForeignKey(CommonC,on_delete=models.CASCADE,related_name='floor_c_frame')

class RoomFeaturesC(models.Model):
    room_feature = models.OneToOneField(RoomFeatures,on_delete=models.SET_NULL,null=True,related_name='room_feature_c')
    common_c = models.ForeignKey(CommonC,on_delete=models.CASCADE,related_name='room_c_frame')

class RoomC(models.Model):
    room = models.OneToOneField(Room,on_delete=models.SET_NULL,null=True,related_name='room_c')
    floor = models.ForeignKey(FloorC,on_delete=models.CASCADE, related_name='room_c_floor')
    room_feature = models.ManyToManyField(RoomFeaturesC)
    frame = models.ManyToManyField(Frame,)
    common_c = models.ForeignKey(CommonC,on_delete=models.CASCADE,related_name='room_c_frame')

class FacultyC(models.Model):
    faculty = models.OneToOneField(Faculty,on_delete=models.SET_NULL,null=True,related_name='faculty_c')
    frame = models.ManyToManyField(Frame)
    common_c = models.ForeignKey(CommonC,on_delete=models.CASCADE,related_name='faculty_c_frame')

class DepartmentC(models.Model):
    department = models.OneToOneField(Department,on_delete=models.SET_NULL,null=True,related_name='department_c')
    faculty = models.ForeignKey(FacultyC,on_delete=models.CASCADE,related_name='department_c_faculty')
    frame = models.ManyToManyField(Frame)
    common_c = models.ForeignKey(CommonC,on_delete=models.CASCADE,related_name='department_c_frame')

class ProgramC(models.Model):
    program = models.OneToOneField(Program,on_delete=models.SET_NULL,null=True,related_name='program_c')
    frame = models.ManyToManyField(Frame,)
    department = models.ForeignKey(DepartmentC,on_delete=models.CASCADE, related_name='program_c_department')
    common_c = models.ForeignKey(CommonC,on_delete=models.CASCADE,related_name='program_c_frame')

class SemesterC(models.Model):
    semester = models.OneToOneField(Semester,on_delete=models.SET_NULL,null=True,related_name='semester_c')
    frame = models.ManyToManyField(Frame,)
    common_c = models.ForeignKey(CommonC,on_delete=models.CASCADE,related_name='semester_c_frame')

class CourseSemesterC(models.Model):
    course_semester = models.OneToOneField(CourseSemester,on_delete=models.SET_NULL,null=True,related_name='course_semester_c')
    frame = models.ManyToManyField(Frame,)
    semester = models.ForeignKey(SemesterC,on_delete=models.CASCADE)
    program = models.ForeignKey(ProgramC,on_delete=models.CASCADE,related_name='course_semester_c_program')
    common_c = models.ForeignKey(CommonC,on_delete=models.CASCADE,related_name='course_semester_c_frame')

class LecturerC(models.Model):
    lecturer = models.OneToOneField(Lecturer,on_delete=models.SET_NULL,null=True,related_name='lecturer_c')
    frame = models.ManyToManyField(Frame,)
    common_c = models.ForeignKey(CommonC,on_delete=models.CASCADE,related_name='lecturer_c_frame')

class ActivityTypeC(models.Model):
    activity_type = models.OneToOneField(ActivityType,on_delete=models.CASCADE)
    frame = models.ManyToManyField(Frame)
    common_c = models.ForeignKey(CommonC,on_delete=models.CASCADE,related_name='lecturer_c_frame')

    
class CourseC(models.Model):
    course = models.OneToOneField(Course,on_delete=models.SET_NULL,null=True,related_name='course_c')
    frame = models.ManyToManyField(Frame,)
    common_c = models.ForeignKey(CommonC,on_delete=models.CASCADE,related_name='course_c_frame')

class CourseGroupC(models.Model):
    course_group = models.OneToOneField(Coursegroup,on_delete=models.SET_NULL,null=True,related_name='course_group_c')
    course = models.ForeignKey(CourseC, on_delete=models.CASCADE,related_name='course_group_c_course')
    extra_session_of = models.ManyToManyField('self')
    lecturer = models.ForeignKey(LecturerC,on_delete=models.CASCADE,related_name='course_group_c_lecturer')
    frame = models.ManyToManyField(Frame,)
    merged_with = models.ManyToManyField('self')
    activitytype = models.ManyToManyField(ActivityTypeC)
    prerequisites = models.ManyToManyField(CourseC, related_name='requiredCourseC')
    course_semester = models.ManyToManyField(CourseSemesterC)
    common_c = models.ForeignKey(CommonC,on_delete=models.CASCADE,related_name='course_group_c_frame')

class StudentGroupC(models.Model):
    student_group = models.OneToOneField(StudentGroup,on_delete=models.CASCADE)
    course_group = models.ManyToManyField(CourseGroupC)
    frame = models.ManyToManyField(Frame,)
    common_c = models.ForeignKey(CommonC,on_delete=models.CASCADE,related_name='course_c_frame')


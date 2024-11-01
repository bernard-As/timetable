import re
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.contrib.auth.management import create_permissions as django_create_permissions
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.apps import apps
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.db.models import Q
from django.core.exceptions import ValidationError


class Title(models.Model):
    """Possible titles of users"""
    name = models.CharField(max_length=101)
    shortname = models.CharField(max_length=20,null=True)
    status = models.BooleanField(default=True)
    def __str__(self):
        return self.name + " - " + self.shortname
class General(models.Model):
    """General information about the system."""
    description = models.TextField(null=True)
    status = models.BooleanField(null=True)
    state_description = models.TextField(null=True, help_text= 'Reason for the status to be true or false')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.description
class Start(models.Model):
    """Start Time"""
    data = models.SmallIntegerField(null=False)
    description = models.TextField(null=True)
    general = models.ForeignKey(General, on_delete=models.CASCADE, null = True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class End(models.Model):
    """End Time"""
    data = models.SmallIntegerField(null=False)
    description = models.TextField(null=True)
    general = models.ForeignKey(General, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
class EventTime(models.Model):
    """Start and End Time Day/Date is the setting entered by the preference setter""" 
    start = models.ForeignKey(Start, on_delete=models.CASCADE,null=True)
    end = models.ForeignKey(End,on_delete=models.SET_NULL,null=True)
    date = models.IntegerField()
    source = models.BigIntegerField(null=True)
    origin = models.CharField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def save(self, *args, **kwargs):
        self.updated_at = timezone.now()
        super().save(*args, **kwargs)

class Semester(models.Model):
    """A semester in the academic calendar of UTD."""
    SEMESTER_CHOICES = (('SPRING', 'Spring'),
                        ('FALL','Fall'),
                        ('SUMMER', 'Summer'))
    year = models.CharField(max_length=10,default="2023-2024")
    season = models.CharField(max_length=6, choices=SEMESTER_CHOICES)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        unique_together = ("year", "season")
    def __str__(self):
        return self.season+ " - "+self.year
class Building(models.Model):
    """Building """
    name = models.CharField(max_length=500)
    code = models.CharField(max_length=50,unique=True)
    latitude = models.FloatField(default=0)
    longitude = models.FloatField(default=0)
    status = models.BooleanField()
    state_description = models.TextField(null=True,blank=True)
    class Meta:
        unique_together = ("name", "code")
    def __str__(self):
        return self.name+ " - "+self.code

class Floor(models.Model):
    """Floors in a building."""
    floor_number = models.SmallIntegerField(default=0)
    building = models.ForeignKey(Building, on_delete=models.CASCADE)
    status = models.BooleanField()
    state_description = models.TextField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('building', 'floor_number')

    def __str__(self):
        return "Floor: " + str(self.floor_number)+ " - "+self.building.code
class RoomFeatures(models.Model):
    """Room Features"""   
    name = models.CharField(max_length=500)
    status = models.BooleanField()
    state_description = models.TextField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.name

class Room(models.Model):
    """Room in a floor of a building."""
    ROOM_TYPES = [
        ("LEC", "Lecture"),
        ("LAB", "Lab"),
        ("SEM", "Seminar"),
        ("STU", "Studio"),
        ("WOR", "Workshop"),
        ("OFF", "Office"),
        ("OTH", "Other")
        ]
    code = models.CharField(max_length=20)
    floor = models.ForeignKey(Floor, on_delete=models.CASCADE)
    description = models.CharField(max_length=1000, null=True,blank=True)
    capacity = models.PositiveIntegerField(default=0)
    exm_capacity = models.PositiveIntegerField(default=0)
    usable_for_exm = models.BooleanField(default=True,help_text="if the room can be use for exam")
    latitude = models.FloatField(default=0)
    longitude = models.FloatField(default=0)
    room_type = models.CharField(max_length=4, choices=ROOM_TYPES)
    room_feature = models.ManyToManyField(RoomFeatures,blank=True)
    status = models.BooleanField()
    state_description = models.TextField(blank=True, null = True)
    created_at = models.DateTimeField(auto_created=True, default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.code + ' ' + str(self.floor.floor_number) + 'Capacity: '+ str(self.capacity) 

    # def room_timetable(self,room):
    #         """Get the room timetable in the runtime"""
    #         timetable = Slot.objects.filter(Room_runtime=room,status=True)
    #         return timetable
class Faculty(models.Model):
    """A faculty at UTD."""
    name = models.CharField(max_length=1000)
    shortname = models.CharField(max_length=30)
    color = models.CharField(max_length=7, blank=True)  # e.g., '#ffcc00'
    icon = models.ImageField(upload_to='faculty/', blank=True)
    status = models.BooleanField(default=True)
    description =  models.CharField(max_length=5000, blank=True)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)
    def __str__(self):
        return self.name + ' ' + self.shortname 
class Department(models.Model):
    """A department under a faculty at UTD."""
    name = models.CharField(max_length=1000, unique=True)
    shortname = models.CharField(max_length=30,unique=True)
    color = models.CharField(max_length=7, blank=True)
    icon = models.ImageField(upload_to='departements/',null=True,blank=True)
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE)
    status = models.BooleanField(default=True)
    description =  models.CharField(max_length=5000, blank=True)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)
    class Meta:
        unique_together = ('name', 'shortname')
    def __str__(self):
        return self.name + ' ' + self.shortname 

class Program(models.Model):
    """A program under a department at UTD."""
    name = models.CharField(max_length=1000)
    shortname = models.CharField(max_length=50)
    color = models.CharField(max_length=7, blank=True)
    icon = models.ImageField(upload_to='programs/',blank=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE,null=True)
    status = models.BooleanField(default=True)
    description =  models.CharField(max_length=5000, blank=True)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)
    def __str__(self):
        return self.name + ' ' + self.shortname 
class CourseSemester(models.Model):
    """Semesters from programs"""
    program = models.ForeignKey(Program, on_delete=models.CASCADE,blank=True)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
    semester_num = models.SmallIntegerField()
    description =  models.CharField(max_length=5000, blank=True)
    status = models.BooleanField(default=True)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)
    class Meta:
        unique_together = ('program', 'semester','semester_num')
    def __str__(self):
        return 'Semester: '+str(self.semester_num)+ ' Program: '+ self.program.shortname + 'Department: ' + self.program.department.shortname
class Users(User):
    CRED_TYPE = [
        ("SYSADM", "SystemAdmin"),
        ("PADM", "PlatformAdmin"),
        ("VR", "ViceRector"),
        ("AD", "Advisor"),
        ("HOD", "HeadOfDepartment"),
        ("ASS", "Assistant"),
        ("OT","Other")
        ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, parent_link=True, )
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True)
    title = models.ForeignKey(Title, null=True, blank=False, on_delete=models.SET_NULL)
    deleted = models.BooleanField(default=False)
    program = models.ManyToManyField(Program)
    credential = models.CharField(max_length=255,choices=CRED_TYPE, default='OT')
    def __str__(self):
        return self.user.email+ '_ '+ self.credential
#***************Second to run**/**************************#
    

class Lecturer(models.Model):
    """Lecturers under faculties"""
    # user = models.OneToOneField(User, on_delete=models.CASCADE, parent_link=True)
    user = models.OneToOneField(Users,on_delete=models.CASCADE)# type: ignore
    lecturerid = models.CharField(max_length=20,unique=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.user.user.email+ '_ '+ str(self.lecturerid)
    # @property
    # def get_lecture(self):
        # return self.user.first_name+ " "+self.user.last_name #type: ignore

class Advisor(models.Model):
    """Advisors under faculties"""
    user = models.ForeignKey(Users,on_delete=models.CASCADE, related_name='advisor')
    program = models.ManyToManyField(Program)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.user.user.email+ '_ '
                                                        

class OtherStaff(models.Model):
    """Other Staff (not students or lectures)"""
    user = models.OneToOneField(Users, on_delete=models.SET_NULL, null=True,parent_link=True)
    stafftype = models.CharField(max_length=100,null=True,blank=True) # e.g., administrator, visitor etc.
    created_at = models.DateTimeField(auto_now_add=True)

class ActivityType(models.Model):
    """Type of activities for each course"""
    name = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.BooleanField(default=True)
    def __str__(self):
        return self.name
class Course(models.Model):
    """A course offered by the university"""
    code = models.CharField(max_length=200, unique=True)
    name = models.TextField()
    description = models.TextField(blank=True)
    # waitinglist = models.PositiveSmallIntegerField(default=0)# when student passes the course
    other_staff = models.ManyToManyField(OtherStaff, blank=True)
    status = models.BooleanField(default=True)
    user = models.ForeignKey(Users, on_delete = models.SET_NULL, blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.code + ' '+ self.name
class Coursegroup(models.Model):
    """Groups for each course """
    course = models.ForeignKey(Course, on_delete=models.CASCADE,related_name='groups')
    extra_session_of = models.ManyToManyField('self',blank=True)# when there are some extra session that should be linked to the main session
    group_number = models.PositiveSmallIntegerField(default=1)
    lecturer = models.ForeignKey(Lecturer,on_delete=models.SET_NULL,null=True,related_name='course_lecturer')
    # assistant = models.ForeignKey(Users,blank=True,on_delete=models.SET_NULL,null=True)
    lecturer_assistant = models.ForeignKey(Lecturer,blank=True,related_name="Lecturer_Assisting",on_delete=models.SET_NULL,null=True)
    merged_with = models.ManyToManyField('self',blank=True) # foreign key of the main course where it is merged
    duration = models.TextField(null=True)
    current_capacity = models.PositiveSmallIntegerField(default=0)
    max_capacity = models.SmallIntegerField(default=0)
    activitytype = models.ManyToManyField(ActivityType)
    # registeredstudents = models.ManyToManyField(Student, through='Enrollment')
    prerequisites = models.ManyToManyField(Course, related_name='requiredCourse', blank=True)
    course_semester = models.ManyToManyField(CourseSemester)
    status = models.BooleanField(default=True)
    is_elective = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.course.code + ' Group: '+ str(self.group_number)+' by: '+self.lecturer.user.email
class Student(models.Model):
    """Students"""
    user = models.ForeignKey(Users,on_delete=models.SET_NULL, null=True,parent_link=True)  # type: ignore
    studentId = models.CharField(max_length=255,unique=True)
    advisor = models.ForeignKey(Advisor,on_delete=models.SET_NULL, null=True)
    coursegroup = models.ManyToManyField(Coursegroup,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.user.user.first_name+ '_ '+ str(self.studentId)
    
class StudentGroup(models.Model):
    student = models.ManyToManyField(Student, )
    coursegroup = models.ManyToManyField(Coursegroup, related_name='studentgroups')
    timespan = models.DateTimeField(auto_now_add=True)
    status = models.BooleanField()

class Assistant(models.Model):
    """Assistant """
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    coursegroup = models.ManyToManyField(Coursegroup)
    
    
class Day(models.Model):
    """Day of week (0-6 is Monday - Sunday) or full date as int"""
    data = models.IntegerField(null=False)
    description = models.TextField(null = True)
    general = models.ForeignKey(General, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Preference(models.Model):
    """Preferences set """
    ORIGIN_CHOICES  = [
        ("general", "general"),
        ("building", "building"),
        ("floor", "floor"),
        ("room", "room"),
        ("faculty", "faculty"),
        ("department", "department"),
        ("course_semester", "course_semester"),
        ("course", "course"),
        ("semester", "semester"),
        ("course", "course"),
        ("coursegroup", "coursegroup"),
        ("event_time", "event_time"),
        ("title", "title"),
        ("general", "general"),
        ]
    general = models.ManyToManyField(General, blank=True)
    building = models.ManyToManyField(Building, blank=True)
    lecturer = models.ManyToManyField(Lecturer, blank=True)
    floor = models.ManyToManyField(Floor, blank=True)
    room = models.ManyToManyField(Room, blank=True)
    faculty = models.ManyToManyField(Faculty, blank=True)
    department = models.ManyToManyField(Department, blank=True)
    program = models.ManyToManyField(Program, blank=True)
    course_semester = models.ManyToManyField(CourseSemester, blank=True)
    semester = models.ManyToManyField(Semester, blank=True)
    course = models.ManyToManyField(Course, blank=True)
    coursegroup = models.ManyToManyField(Coursegroup, blank=True)
    type = models.SmallIntegerField(default=0, help_text="To know the orientation for the pref wether it is positive, negative, or neutral")
    event_time = models.ManyToManyField(EventTime, blank=True)
    activity_type = models.ManyToManyField(ActivityType, blank=True)
    title = models.ManyToManyField(Title, blank=True)
    room_features = models.ManyToManyField(RoomFeatures,blank=True)
    position = models.IntegerField(null=True,help_text = 'Position of the preference in the owner order of preferences')
    description = models.TextField(null = True)
    start = models.CharField(null=True)
    end = models.CharField(null=True)
    date = models.DateField(null=True)
    status = models.BooleanField()
    user = models.ForeignKey(Users, on_delete=models.CASCADE, null=True, blank=True)
    origin = models.CharField(choices=ORIGIN_CHOICES,max_length=255)
    originId = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ScheduleType(models.Model):
    """Schedule type """
    name = models.CharField(max_length=255)
    can_std_view = models.BooleanField(default=False)
    can_lect_view = models.BooleanField(default=False)
    can_adv_view = models.BooleanField(default=False)
    can_hod_view = models.BooleanField(default=False)
    can_vcr_view = models.BooleanField(default=False)
    can_padm_view = models.BooleanField(default=False)
    can_system_view = models.BooleanField(default=False)
    can_asst_view = models.BooleanField(default=False)
    can_other_view = models.BooleanField(default=False)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.name
    

class Schedule(models.Model):
    """Schedule set """
    CHOISES = [
        ("Lecture", "Lecture"),
        ("Tutorial", "Tutorial"),
        ]
    user = models.ForeignKey(Users, on_delete=models.CASCADE, null=True, blank=True)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='schedule_room')
    coursegroup = models.ForeignKey(Coursegroup, on_delete=models.CASCADE, related_name='schedule_coursegroup')
    start = models.TimeField()
    end = models.TimeField()
    day = models.SmallIntegerField(blank=True,null=True)
    date = models.DateField(blank=True, null=True)
    type = models.ForeignKey(ScheduleType,on_delete=models.CASCADE)
    invigilator = models.ForeignKey(Lecturer, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.user.user.email + ' ' +self.room.code+' '+str(self.start)+' '+str(self.end)+' '+str(self.day)+str(self.date)
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['room', 'start', 'end', 'day', 'type'],
                name='unique_room_day_time_time'
            )
        ]

    def clean(self):
        # Ensure the end time is after the start time
        if self.end <= self.start:
            # return Response
            raise ValidationError('End time must be after the start time')

        # Check if the lecture overlaps with any other lecture in the same room
        overlapping_schedule = Schedule.objects.filter(
            room=self.room,
            type=self.type
        ).filter(
            Q(day=self.day) & Q(date=self.date) if self.date else Q(day=self.day)
        ).filter(
            Q(start__lt=self.end) & Q(end__gt=self.start)
        ).exclude(id=self.id)  # Exclude the current instance if updating

        if overlapping_schedule.exists():
            raise ValidationError('The schedule overlaps with another lecture in the same room.')

    def save(self, *args, **kwargs):
        self.clean()  # Run validation before saving
        super(Schedule, self).save(*args, **kwargs)

class SystemNews(models.Model):
    """System news """
    CHOISES = [
        ("sys", "system"),
        ("lect", "lecture"),
        ]
    title = models.CharField(max_length=255)
    content = models.TextField()
    type= models.CharField()
    type = models.CharField(max_length=255,choices=CHOISES, default='sys')
    created_by = models.ForeignKey(Users, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class AdminOperations(models.Model):
    class Meta:
        permissions = [
            ("view_adminoperationsP", "Can view admin operations"),
            ("edit_preferences_adminoperationsP","Can edit preferences of other users")
        ]


@receiver(post_migrate)
def create_predefined_instances(sender, **kwargs):
    ActivityType.objects.get_or_create(name='Classroom Lecture', description="A regular lecture In a regular classroom.")
    ActivityType.objects.get_or_create(name='Classroom Tutorial', description="A tutorial session.")
    ActivityType.objects.get_or_create(name='Studio Lecture', description="A regular lecture In a regular classroom.")
    ActivityType.objects.get_or_create(name='Studio Tutorial', description="A tutorial session.")
    ActivityType.objects.get_or_create(name='Computer Laboratory Lecture', description="A tutorial session.")
    ActivityType.objects.get_or_create(name='Computer Laboratory Tutorial', description="A tutorial session.")
    ActivityType.objects.get_or_create(name='Seminar', description="Seminar session.")
    ActivityType.objects.get_or_create(name='Seminar', description="Seminar session.")
    ActivityType.objects.get_or_create(name='Workshop', description="Workshop session.")
def create_permissions(sender, **kwargs):
    if sender.name == 'api':
        app_config = apps.get_app_config(sender.name)
        django_create_permissions(app_config, apps=apps, verbosity=0)

@receiver(post_migrate)
def create_groups_and_permissions(sender, **kwargs):

    # Create user groups
    site_admin, created = Group.objects.get_or_create(name='Administration of the site (Timetable managers)')
    rectorate, created = Group.objects.get_or_create(name='Accessing full timetable without editing in the main')
    head_dean, created = Group.objects.get_or_create(name='Accessing full timetable of their faculty, departement and program ')
    advisor, created = Group.objects.get_or_create(name='Be able to add student or/ and assign new courses')
    lecturer, created = Group.objects.get_or_create(name='view their timetable and manage attendance')
    assistant, created = Group.objects.get_or_create(name='view their timetable and manage attendance for extra_course')
    student, created = Group.objects.get_or_create(name='view their timetable')
    other_staff, created = Group.objects.get_or_create(name='view their timetable and orginize meetings through it')

    # Get content type for the relevant model(s)
    title_content_type = ContentType.objects.get_for_model(Title)
    view_permission = Permission.objects.get(codename='view_title', content_type=title_content_type)
    change_permission = Permission.objects.get(codename='change_title', content_type=title_content_type)
    add_permission = Permission.objects.get(codename='add_title', content_type=title_content_type)
    delete_permission = Permission.objects.get(codename='delete_title', content_type=title_content_type)
    # Assign permissions to the groups
    site_admin.permissions.add(view_permission,change_permission,add_permission,delete_permission)
    rectorate.permissions.add(view_permission,change_permission,add_permission,delete_permission)
    head_dean.permissions.add(view_permission,change_permission,add_permission,delete_permission)
    advisor.permissions.add(view_permission)
    lecturer.permissions.add(view_permission)
    assistant.permissions.add(view_permission)
    student.permissions.add(view_permission)
    other_staff.permissions.add(view_permission)




    _content_type = ContentType.objects.get_for_model(Users)
    view_permission = Permission.objects.get(codename='view_users', content_type=_content_type)
    change_permission = Permission.objects.get(codename='change_users', content_type=_content_type)
    add_permission = Permission.objects.get(codename='add_users', content_type=_content_type)
    delete_permission = Permission.objects.get(codename='delete_users', content_type=_content_type)

    site_admin.permissions.add(view_permission,change_permission,add_permission,delete_permission)
    rectorate.permissions.add(view_permission)
    head_dean.permissions.add(view_permission) 
    advisor.permissions.add(view_permission)
    lecturer.permissions.add(view_permission)
    assistant.permissions.add(view_permission)
    student.permissions.add(view_permission)
    other_staff.permissions.add(view_permission)


    _content_type = ContentType.objects.get_for_model(EventTime)
    view_permission = Permission.objects.get(codename='view_eventtime', content_type=_content_type)
    change_permission = Permission.objects.get(codename='change_eventtime', content_type=_content_type)
    add_permission = Permission.objects.get(codename='add_eventtime', content_type=_content_type)
    delete_permission = Permission.objects.get(codename='delete_eventtime', content_type=_content_type)

    site_admin.permissions.add(view_permission,change_permission,add_permission,delete_permission)
    


    _content_type = ContentType.objects.get_for_model(General)
    view_permission = Permission.objects.get(codename='view_general', content_type=_content_type)
    change_permission = Permission.objects.get(codename='change_general', content_type=_content_type)
    add_permission = Permission.objects.get(codename='add_general', content_type=_content_type)
    delete_permission = Permission.objects.get(codename='delete_general', content_type=_content_type)

    site_admin.permissions.add(view_permission,change_permission,add_permission,delete_permission)



    # Get content type for the relevant model(s)
    _content_type = ContentType.objects.get_for_model(Building)
    view_permission = Permission.objects.get(codename='view_building', content_type=_content_type)
    change_permission = Permission.objects.get(codename='change_building', content_type=_content_type)
    add_permission = Permission.objects.get(codename='add_building', content_type=_content_type)
    delete_permission = Permission.objects.get(codename='delete_building', content_type=_content_type)
    # Assign permissions to the groups
    site_admin.permissions.add(view_permission,change_permission,add_permission,delete_permission)
    rectorate.permissions.add(view_permission)
    head_dean.permissions.add(view_permission)
    advisor.permissions.add(view_permission)
    lecturer.permissions.add(view_permission)
    assistant.permissions.add(view_permission)
    student.permissions.add(view_permission)



    # Get content type for the relevant model(s)
    _content_type = ContentType.objects.get_for_model(Floor)
    view_permission = Permission.objects.get(codename='view_floor', content_type=_content_type)
    change_permission = Permission.objects.get(codename='change_floor', content_type=_content_type)
    add_permission = Permission.objects.get(codename='add_floor', content_type=_content_type)
    delete_permission = Permission.objects.get(codename='delete_floor', content_type=_content_type)
    # Assign permissions to the groups
    site_admin.permissions.add(view_permission,change_permission,add_permission,delete_permission)
    rectorate.permissions.add(view_permission)
    head_dean.permissions.add(view_permission)
    advisor.permissions.add(view_permission)
    lecturer.permissions.add(view_permission)
    assistant.permissions.add(view_permission)
    student.permissions.add(view_permission)

    # Get content type for the relevant model(s)
    _content_type = ContentType.objects.get_for_model(Floor)
    view_permission = Permission.objects.get(codename='view_floor', content_type=_content_type)
    change_permission = Permission.objects.get(codename='change_floor', content_type=_content_type)
    add_permission = Permission.objects.get(codename='add_floor', content_type=_content_type)
    delete_permission = Permission.objects.get(codename='delete_floor', content_type=_content_type)
    # Assign permissions to the groups
    site_admin.permissions.add(view_permission,change_permission,add_permission,delete_permission)
    rectorate.permissions.add(view_permission)
    head_dean.permissions.add(view_permission)
    advisor.permissions.add(view_permission)
    lecturer.permissions.add(view_permission)
    assistant.permissions.add(view_permission)
    student.permissions.add(view_permission)

    custom_permission = Permission.objects.get(codename = 'edit_preferences_adminoperationsP')
    site_admin.permissions.add(custom_permission)


    # Get content type for the relevant model(s)
    _content_type = ContentType.objects.get_for_model(Lecturer)
    view_permission = Permission.objects.get(codename='view_lecturer', content_type=_content_type)
    change_permission = Permission.objects.get(codename='change_lecturer', content_type=_content_type)
    add_permission = Permission.objects.get(codename='add_lecturer', content_type=_content_type)
    delete_permission = Permission.objects.get(codename='delete_lecturer', content_type=_content_type)
    # Assign permissions to the groups
    site_admin.permissions.add(view_permission,change_permission,add_permission,delete_permission)
    rectorate.permissions.add(view_permission,change_permission,add_permission)
    head_dean.permissions.add(view_permission,change_permission,add_permission)
    advisor.permissions.add(view_permission)
    lecturer.permissions.add(view_permission)
    assistant.permissions.add(view_permission)
    student.permissions.add(view_permission)


    # Get content type for the relevant model(s)
    _content_type = ContentType.objects.get_for_model(Student)
    view_permission = Permission.objects.get(codename='view_student', content_type=_content_type)
    change_permission = Permission.objects.get(codename='change_student', content_type=_content_type)
    add_permission = Permission.objects.get(codename='add_student', content_type=_content_type)
    delete_permission = Permission.objects.get(codename='delete_student', content_type=_content_type)
    # Assign permissions to the groups
    site_admin.permissions.add(view_permission,change_permission,add_permission,delete_permission)
    rectorate.permissions.add(view_permission,change_permission,add_permission)
    head_dean.permissions.add(view_permission,change_permission,add_permission)
    advisor.permissions.add(view_permission,change_permission,add_permission)
    lecturer.permissions.add(view_permission)
    assistant.permissions.add(view_permission)
    student.permissions.add(view_permission)
    
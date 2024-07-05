from ..models import *
from apibase.models import *
from ..utils import logger
def refiller():
    """
    1->Title 
    2->Building
    3->Floor
    4->RoomFeature
    5->Room
    6->Semester
    7->Faculty
    8->Department
    9->Program
    10->Course Semester
    11->Lecturer
    12->activity Type
    ->course
    ->CourseGroup
    ->
    """
    logger("Refilling...")
    title_ref()
    building_ref()
    floor_ref()
    room_feature_ref()
    room_ref()
    semester_ref()
    faculty_ref()
    department_ref()
    program_ref()
    course_semster_ref()
    lecturer_ref()
    activity_type_ref()
    course_ref()
    course_group_ref()

    logger("Refilling Done...")

def title_ref():
    logger("Title Refilling...")
    titles = Title.objects.all()
    for title in titles:
        if(not TitleC.objects.filter(title==title).exists()):
            if title.status:
                TitleC.objects.create(title=title)  
    logger("Title Refilled",1)

def building_ref():
    logger("Building Refilling...")
    buildings = Building.objects.all()
    for building in buildings:
        if(not BuildingC.objects.filter(building==building).exists()):
            if building.status:
                BuildingC.objects.create(building=building)
    logger("Building Refilled",1)

def floor_ref():
    logger("Floor Refilling...")
    floors = Floor.objects.all()

    for floor in floors:
        if(not FloorC.objects.filter(floor=floor).exists()):
            buildingc=BuildingC.objects.filter(building=floor.building)

            if floor.status and buildingc.exists():
                FloorC.objects.create(floor=floor, building=buildingc)

    logger("Floor Refilled",1)

def room_feature_ref():
    logger("Room Feature Refilling...")
    room_features = RoomFeatures.objects.all()
    for room_feature in room_features:
        if(not RoomFeaturesC.objects.filter(room_features=room_feature).exists()):
            if room_feature.status:
                RoomFeaturesC.objects.create(room_features=room_feature)
    logger("Room Feature Refilled",1)

def room_ref():
    logger("Room Refilling...")
    rooms = Room.objects.all()
    for room in rooms:
        if(not RoomC.objects.filter(room=room)):
            room_feature_c = RoomFeaturesC.objects.filter(room_feature=room.room_feature)
            room_floor_c = FloorC.objects.filter(floor=room.floor)
            if room.status and room_floor_c.exists() and room_feature_c.exists():
                r = RoomC.objects.create(room=room,floor=room_floor_c,room_feature=room_feature_c)
    logger("Room Refilled",1)

def semester_ref():
    logger("Semester Refilling...")
    semesters = Semester.objects.all()
    for semester in semesters:
        if(not SemesterC.objects.filter(semester=semester)):
            if semester.status:
                SemesterC.objects.create(semester=semester)
    logger("Semester Refilled")

def faculty_ref():
    logger("Faculty Refilling...")
    faculties = Faculty.objects.all()
    for faculty in faculties:
        if(not FacultyC.objects.filter(faculty=faculty)):
            if faculty.status:
                FacultyC.objects.create(faculty=faculty)
    logger("Faculty Refilled",1)

def department_ref():
    logger("Department Refilling...")
    departments = Department.objects.all()
    for department in departments:
        if(not DepartmentC.objects.filter(department=department).exists()):
            if department.status and FacultyC.objects.filter(faculty=department.faculty):
                DepartmentC.objects.create(department=department)
    logger("Department Refilled",1)

def program_ref():
    logger("Program Refilling...")
    programs = Program.objects.all()
    for program in programs:
        department_c = DepartmentC.objects.filter(department=program.department)
        if(department_c.exists() and program.status):
            ProgramC.objects.get_or_create(program=program,department=department_c)
            logger("New programC created",2)
    logger("Program refilled",1)

def course_semster_ref():
    logger("Course Semester Refilling...")
    course_semesters = CourseSemester.objects.all()
    for course_semester in course_semesters:
        programc = ProgramC.objects.filter(program=course_semester.program)
        if(programc.exists() and course_semester.status):
            CourseSemesterC.objects.get_or_create(course_semester=course_semester,program=programc)
            logger("New Course Group")
    logger("Course Semester Refilled",1)

def lecturer_ref():
    logger("Lecturer Refilling...")
    lecturers = Lecturer.objects.all()
    for lecturer in lecturers:
        if(not LecturerC.objects.filter(lecturer=lecturer).exists() and lecturer.user):
            LecturerC.objects.create(lecturer=lecturer)
            logger("New Lecturer created",2)
    logger("Lecturer, Reffiled")

def activity_type_ref():
    logger("Activity Type Refilling...")
    activity_types = ActivityType.objects.all()
    for activity_type in activity_types:
        if(activity_type.status):
            ActivityTypeC.objects.get_or_create(activity_type=activity_type)
    logger("Activity Type Refilled",1)

def course_ref():
    logger("Course Refilling...")
    courses = Course.objects.all()
    for course in courses:
        if(course.status):
            CourseC.objects.get_or_create(course=course)

def course_group_ref():
    logger("Course Group Refilling...")
    course_groups = Coursegroup.objects.all()
    for course_group in course_groups:
        coursec = CourseC.objects.filter(course=course_group.course)
        lecturerc = LecturerC.objects.filter(lecturer=course_group.lecturer)
        if(coursec.exists() and course_group.status):
            newCourseGroup,_ = CourseGroupC.objects.get_or_create(
                course_group=course_group.pk,
                course=coursec,
                lecturer = lecturerc,
                capacity = course_group.max_capacity
            )
            newCourseGroup.extra_session_of.set([CourseGroupC.objects.get(id=extra_session.id) for extra_session in newCourseGroup.course_group.extra_session_of])
            newCourseGroup.merged_with.set([CourseGroupC.objects.get(id=m.id) for m in newCourseGroup.course_group.merged_with])
            newCourseGroup.activitytype.set([ActivityTypeC.objects.get(id=a.id) for a in newCourseGroup.course_group.activitytype])
            newCourseGroup.prerequisites.set([CourseGroupC.objects.get(id=m.id) for m in newCourseGroup.course_group.prerequisites])
            newCourseGroup.course_semester.set([CourseSemesterC.objects.get(id=m.id) for m in newCourseGroup.course_group.course_semester])

def student_group_ref():
    logger("Student Group Refilling...")
    student_groups = StudentGroup.objects.all()
    for student_group in student_groups:
        if student_group.status:
            studentGroupC,_ = StudentGroupC.objects.get_or_create(student_group = student_group)
# serializers.py
from rest_framework import serializers
from apibase.models import *
from django.contrib.auth.models import User,Group,Permission

class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True, required = False)
    


class TitleSerializer(serializers.ModelSerializer):
    id=serializers.IntegerField(read_only=True)
    class Meta:
        model = Title
        fields = '__all__'
                                                                                 
class UsersSerializer(serializers.ModelSerializer):
    id=serializers.IntegerField(read_only=True)
    class Meta:
        model = Users
        fields = ['first_name','last_name','email','profile_picture','program','id','title']

class GroupSerializer(serializers.ModelSerializer):
    id=serializers.IntegerField(read_only=True)
    class Meta:
        model = Group
        fields = '__all__'

class PermissionSerializer(serializers.ModelSerializer):
    id=serializers.IntegerField(read_only=True)
    class Meta:
        model = Permission
        fields = '__all__'

class GeneralSerializer(serializers.ModelSerializer):
    id=serializers.IntegerField(read_only=True)
    class Meta:
        model = General
        fields = '__all__'

class SemesterSerializer(serializers.ModelSerializer):
    id=serializers.IntegerField(read_only=True)
    class Meta:
        model = Semester
        fields = '__all__'
    
class BuildingSerializer(serializers.ModelSerializer):
    id=serializers.IntegerField(read_only=True)
    class Meta:
        model = Building
        fields = '__all__'

class FloorSerializer(serializers.ModelSerializer):
    id=serializers.IntegerField(read_only=True)
    class Meta:
        model = Floor
        fields = '__all__'

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'

class FacultySerializer(serializers.ModelSerializer):
    id=serializers.IntegerField(read_only=True)
    class Meta:
        model = Faculty
        fields = '__all__'

class DepartmentSerializer(serializers.ModelSerializer):
    id=serializers.IntegerField(read_only=True)
    class Meta:
        model = Department
        fields = '__all__'
class ProgramSerializer(serializers.ModelSerializer):
    id=serializers.IntegerField(read_only=True)
    class Meta:
        model = Program
        fields = '__all__'

class CourseSemesterSerializer(serializers.ModelSerializer):
    id=serializers.IntegerField(read_only=True)
    class Meta:
        model = CourseSemester
        fields = '__all__'
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if not instance.semester.is_current:
            return None
        return representation

# Second run turn 
class ActivitytypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityType
        fields = '__all__'

class LecturerSerializer(serializers.ModelSerializer):
    password = serializers.FileField(read_only=True)
    id=serializers.IntegerField(read_only=True)
    class Meta:
        model = Lecturer
        fields = '__all__'

class StudentSerializer(serializers.ModelSerializer):
    password = serializers.FileField(read_only=True)
    id=serializers.IntegerField(read_only=True)
    class Meta:
        model = Student
        fields = '__all__'
    
class OtherStaffSerializer(serializers.ModelSerializer):
    # password = serializers.CharField(read_only=True)
    # id=serializers.IntegerField(read_only=True)   
    class Meta:
        model = OtherStaff
        fields = '__all__'
    
class CourseGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coursegroup
        fields = '__all__'
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if not instance.course_semester.filter(semester__is_current=True).exists():
            return None
        return representation
class CourseSerializer(serializers.ModelSerializer):
    coursegroup_set = CourseGroupSerializer(many=True, read_only=True)
    class Meta:
        model = Course
        fields = '__all__'

class PreferenceSerializer(serializers.ModelSerializer):
    user = serializers.ImageField(required = False)
    class Meta:
        model = Preference
        fields = '__all__'

class EventTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventTime
        fields = '__all__'

class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = '__all__'
        read_only_fields = ['user']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if not instance.coursegroup.course_semester.filter(semester__is_current=True).exists():
            return None
        return representation

class ScheduleTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleType
        fields = '__all__'


class SystemNewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemNews
        fields = '__all__'
        
class AdvisorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Advisor
        fields = '__all__'

class AssistantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assistant
        fields = '__all__'

class StudentScanSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentScan
        fields = '__all__'

class SummerCourseSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    code = serializers.SerializerMethodField()
    department = serializers.SerializerMethodField()
    student_count = serializers.SerializerMethodField()
    class Meta:
        model = SummerCourse
        fields = '__all__'

    def get_name(self, obj):
        return obj.course.name if obj.course else None
    def get_code(self, obj):
        return obj.course.code if obj.course else None
    def get_student_count(self, obj):
        return obj.summer_student_selection.count() if obj.summer_student_selection else 0
    def get_department(self, obj):
        return obj.course.groups.first().course_semester.first().program.department.name if obj.course and obj.course.groups.exists() and obj.course.groups.first().course_semester.exists() else None
class SummerStudentSelectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SummerStudentSelection
        fields = '__all__'
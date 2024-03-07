# serializers.py
from rest_framework import serializers
from apibase.models import *
from django.contrib.auth.models import User,Group,Permission

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True, required = False)
    
class ActivitytypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityType
        fields = '__all__'

class TitleSerializer(serializers.ModelSerializer):
    id=serializers.IntegerField(read_only=True)
    class Meta:
        model = Title
        fields = '__all__'
                                                                                 
class UsersSerializer(serializers.ModelSerializer):
    id=serializers.IntegerField(read_only=True)
    class Meta:
        model = Users
        fields = '__all__'

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
    
class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class CourseGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coursegroup
        fields = '__all__'


from rest_framework import viewsets
from apibase.serializers import *
from django.contrib.auth.models import User,Group, Permission
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import authentication_classes, permission_classes
# from knox.auth import TokenAuthentication
from rest_framework.response import Response 
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password
from django.core.serializers import serialize
from rest_framework.renderers import JSONRenderer, BrowsableAPIRenderer

from rest_framework.decorators import api_view, renderer_classes
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])

class TitleViewSet (viewsets.ModelViewSet):
    queryset = Title.objects.all()
    serializer_class = TitleSerializer
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])

class UserGroupPermission(APIView):
    authentication_classes = ([TokenAuthentication])
    permission_classes = ([IsAuthenticated]) 
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

    def getGP(self,request):
        user_id = request.data.userId
        user = User.objects.get(id=user_id)
        if(not user.has_perm('edit_preferences_adminoperationsP')):
            return Response({"message":"You don't have the permissions to access this data"},401)
        groups = user.groups.all()
        permissions = user.permissions.all() # type: ignore
        group_permissions = set()
        # Collect permissions from each group
        for group in groups:
            group_permissions.update(group.permissions.all())

        permissions_not_in_groups = permissions.difference(group_permissions)

        all_group = Group.objects.all()
        all_permission = Permission.objects.all()
        return Response({
            "permissions":list(permissions),
            "groups": list(groups),
            "extra_permission":list(permissions_not_in_groups),
            'all_groups': list(all_group),
            'all_permissions': list(all_permission)
        })
    @api_view(['GET'])
    def get_groups_and_permissions(self, **request):
        try:
            serializer = GroupSerializer(Group.objects.all(), many=True)
            serializerPerm = PermissionSerializer(Permission.objects.all(), many=True)

            return Response({
                'groups':serializer.data,
                'permissions':serializerPerm.data
                }, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

class UserViewSet (viewsets.ModelViewSet):
    authentication_classes = ([TokenAuthentication])
    permission_classes = ([IsAuthenticated]) 
    queryset = Users.objects.all()
    serializer_class = UsersSerializer
    def create(self, request, *args, **kwargs):
        hash_pwd = make_password(request.data.get('password'))
        request.data['password'] = hash_pwd
        request.data['username'] = request.data['username'].replace(" ","")
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)
    def destroy(self, request, *args, **kwargs):
        obj = self.get_object()
        print(obj.deleted)
        obj.deleted = True 
        obj.save()
        return Response(200)
class GeneralViewSet (viewsets.ModelViewSet):
    queryset = General.objects.all()
    serializer_class = GeneralSerializer
class SemesterViewSet (viewsets.ModelViewSet):
    queryset = Semester.objects.all()
    serializer_class = SemesterSerializer
class BuildingViewSet(viewsets.ModelViewSet):
    queryset = Building.objects.all()
    serializer_class = BuildingSerializer
class FloorViewSet(viewsets.ModelViewSet):
    queryset = Floor.objects.all().order_by("building")
    serializer_class = FloorSerializer
class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all().order_by("floor")
    serializer_class = RoomSerializer

class FacultyViewSet(viewsets.ModelViewSet):
    queryset = Faculty.objects.all()
    serializer_class = FacultySerializer

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

class ProgramViewSet(viewsets.ModelViewSet):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer

class CourseSemesterViewSet(viewsets.ModelViewSet):
    queryset = CourseSemester.objects.all()
    serializer_class = CourseSemesterSerializer
class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class LecturerViewSet(viewsets.ModelViewSet):
    queryset = Lecturer.objects.all()
    serializer_class = LecturerSerializer

    def create(self, request, *args, **kwargs):
        title=Title.objects.get(id=request.data['title'])
        faculties = [Faculty.objects.get(id=fac) for fac in request.data['faculty']if fac!='']
        department = [Department.objects.get(id=dep) for dep in request.data['department']if dep!='']
        program = [Program.objects.get(id=prog) for prog in request.data['program']if prog!='']
        userData = {
            'username':request.data['username'], 
            'password':make_password(request.data['password']),
            'first_name':request.data['first_name'],
            'last_name':request.data['last_name'],
            'email':request.data['email'],
            'title':title,
            'is_active':request.data['is_active']
        }
        user_lecturer = Users()
        user_lecturer.__dict__.update(userData)
        user_lecturer.title = title
        user_lecturer.save()
        user_lecturer.faculty.set(faculties)
        user_lecturer.department.set(department)
        user_lecturer.program.set(program)
        user_lecturer.save()
        lecturer_group = Group.objects.get(id=request.data['group'])
        user_lecturer.groups.add(lecturer_group)
        request.data['user'] = user_lecturer.id # type: ignore
        return super().create(request, *args, **kwargs)
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serialized_data = self.get_serializer(queryset, many=True).data
        modified_data = [self.modify_data(item) for item in serialized_data] # type: ignore
        return Response(modified_data,200)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serialized_data = self.get_serializer(instance).data
        modified_data = self.modify_data(serialized_data)
        return Response(modified_data)

    def update(self, request, *args, **kwargs):
        title=Title.objects.get(id=request.data['title'])
        group = Group.objects.filter(id=request.data['group'])
        permissions  = Permission.objects.filter(id__in=request.data['user_permissions'])
        faculties = [Faculty.objects.get(id=fac) for fac in request.data['faculty']if fac!='']
        department = [Department.objects.get(id=dep) for dep in request.data['department']if dep!='']
        program = [Program.objects.get(id=prog) for prog in request.data['program']if prog!='']

        userData = {
            'first_name':request.data['first_name'],
            'last_name':request.data['last_name'],
            'email':request.data['email'],
            'title':title,
            'is_active':request.data['is_active']
            # 'group':group,
            # 'user_permissions':request.data['user_permissions'],
        }
        related_user = Users.objects.get(user=request.data['user'])
        for key, value in userData.items():
            setattr(related_user, key, value)
        related_user.user_permissions.clear()
        related_user.faculty.clear()
        related_user.department.clear()
        related_user.program.clear()
        related_user.save()
        related_user.groups.set(group)
        related_user.user_permissions.set(permissions)
        related_user.department.set(department)
        related_user.faculty.set(faculties)
        related_user.program.set(program)
        related_user.save()
        return super().update(request,*args,**kwargs)

    def modify_data(self, item):
        related_user = Users.objects.get(id=item["user"])
        item['first_name'] = related_user.first_name
        item['last_name'] = related_user.last_name
        item['email'] = related_user.email
        item['status'] = related_user.is_active
        title_serializer = TitleSerializer(related_user.title).data
        item['title'] = title_serializer['id'] # type: ignore
        # item['group'] = [GroupSerializer(seri).data for  seri in related_user.groups.all()] # type: ignore
        item['group'] = GroupSerializer(related_user.groups.all()[0]).data['id'] # type: ignore
        item['user_permissions'] = [GroupSerializer(seri).data for  seri in related_user.user_permissions.all()]
        item['faculty']=[FacultySerializer(fac).data['id'] for fac in related_user.faculty.all()] # type: ignore
        item['department']=[DepartmentSerializer(dep).data['id'] for dep in related_user.department.all()] # type: ignore
        item['program']=[ProgramSerializer(prog).data['id'] for prog in related_user.program.all()] # type: ignore
        return item

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    def create(self, request, *args, **kwargs):
        faculties = [Faculty.objects.get(id=fac) for fac in request.data['faculty']if fac!='']
        department = [Department.objects.get(id=dep) for dep in request.data['department']if dep!='']
        program = [Program.objects.get(id=prog) for prog in request.data['program']if prog!='']
        userData = {
            'username':request.data['username'], 
            'password':make_password(request.data['password']),
            'first_name':request.data['first_name'],
            'last_name':request.data['last_name'],
            'email':request.data['email'],
            'is_active':request.data['status']
        }
        try:
            if(User.objects.get(username=request.data['username'])):
                return Response( {'error':'Username already exists.'}, status=409 )
        except:
            pass
        user_student = Users()
        user_student.__dict__.update(userData)
        user_student.save()
        user_student.faculty.set(faculties)
        user_student.department.set(department)
        user_student.program.set(program)
        user_student.save()
        student_group = Group.objects.get(id=request.data['group'])
        user_student.groups.add(student_group)
        request.data['user'] = user_student.id # type: ignore
        return super().create(request, *args, **kwargs)
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serialized_data = self.get_serializer(queryset, many=True).data
        modified_data = [self.modify_data(item) for item in serialized_data] # type: ignore
        return Response(modified_data,200)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serialized_data = self.get_serializer(instance).data
        modified_data = self.modify_data(serialized_data)
        return Response(modified_data)

    def update(self, request, *args, **kwargs):
        group = Group.objects.filter(id=request.data['group'])
        permissions  = Permission.objects.filter(id__in=request.data['user_permissions'])
        faculties = [Faculty.objects.get(id=fac) for fac in request.data['faculty']if fac!='']
        department = [Department.objects.get(id=dep) for dep in request.data['department']if dep!='']
        program = [Program.objects.get(id=prog) for prog in request.data['program']if prog!='']

        userData = {
            'first_name':request.data['first_name'],
            'last_name':request.data['last_name'],
            'email':request.data['email'],
            'is_active':request.data['status']
            # 'group':group,
            # 'user_permissions':request.data['user_permissions'],
        }
        related_user = Users.objects.get(user=request.data['user'])
        for key, value in userData.items():
            setattr(related_user, key, value)
        related_user.user_permissions.clear()
        related_user.faculty.clear()
        related_user.department.clear()
        related_user.program.clear()
        related_user.save()
        related_user.groups.set(group)
        related_user.user_permissions.set(permissions)
        related_user.department.set(department)
        related_user.faculty.set(faculties)
        related_user.program.set(program)
        related_user.save()
        return super().update(request,*args,**kwargs)


    def modify_data(self, item):
        related_user = Users.objects.get(id=item["user"])
        item['first_name'] = related_user.first_name
        item['last_name'] = related_user.last_name
        item['email'] = related_user.email
        item['status'] = related_user.is_active
        item['group'] = GroupSerializer(related_user.groups.all()[0]).data['id'] # type: ignore
        item['user_permissions'] = [GroupSerializer(seri).data for  seri in related_user.user_permissions.all()]
        item['faculty']=[FacultySerializer(fac).data['id'] for fac in related_user.faculty.all()] # type: ignore
        item['department']=[DepartmentSerializer(dep).data['id'] for dep in related_user.department.all()] # type: ignore
        item['program']=[ProgramSerializer(prog).data['id'] for prog in related_user.program.all()] # type: ignore
        return item
class OtherStaffViewSet(viewsets.ModelViewSet):
    queryset = OtherStaff.objects.all()
    serializer_class = OtherStaffSerializer

    def create(self, request, *args, **kwargs):
        faculties = [Faculty.objects.get(id=fac) for fac in request.data.get('faculty', []) if fac !='']
        department = [Department.objects.get(id=dep) for dep in request.data['department']if dep!='']
        program = [Program.objects.get(id=prog) for prog in request.data['program']if prog!='']
        userData = {
            'username':request.data['username'], 
            'password':make_password(request.data['password']),
            'first_name':request.data['first_name'],
            'last_name':request.data['last_name'],
            'email':request.data['email'],
            'is_active':request.data['status']
        }
        try:
            if(User.objects.get(username=request.data['username'])):
                return Response( {'error':'Username already exists.'}, status=409 )
        except:
            pass
        user_student = Users()
        user_student.__dict__.update(userData)
        user_student.save()
        user_student.faculty.set(faculties)
        user_student.department.set(department)
        user_student.program.set(program)
        user_student.save()
        if  request.data['group'] is not None:
            student_group = Group.objects.get(id=request.data['group'])
            user_student.groups.add(student_group)
        request.data['user'] = user_student.id # type: ignore
        del request.data['password']
        request.data['stafftype'] = 'dfew'
        return super().create(request, *args, **kwargs)
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serialized_data = self.get_serializer(queryset, many=True).data
        modified_data = [self.modify_data(item) for item in serialized_data] # type: ignore
        return Response(modified_data,200)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serialized_data = self.get_serializer(instance).data
        modified_data = self.modify_data(serialized_data)
        return Response(modified_data)

    def update(self, request, *args, **kwargs):
        group = Group.objects.filter(id=request.data['group'])
        permissions  = Permission.objects.filter(id__in=request.data['user_permissions'])
        faculties = [Faculty.objects.get(id=fac) for fac in request.data['faculty']if fac!='']
        department = [Department.objects.get(id=dep) for dep in request.data['department']if dep!='']
        program = [Program.objects.get(id=prog) for prog in request.data['program']if prog!='']

        userData = {
            'first_name':request.data['first_name'],
            'last_name':request.data['last_name'],
            'email':request.data['email'],
            'is_active':request.data['status']
            # 'group':group,
            # 'user_permissions':request.data['user_permissions'],
        }
        related_user = Users.objects.get(user=request.data['user'])
        for key, value in userData.items():
            setattr(related_user, key, value)
        related_user.user_permissions.clear()
        related_user.faculty.clear()
        related_user.department.clear()
        related_user.program.clear()
        related_user.save()
        related_user.groups.set(group)
        related_user.user_permissions.set(permissions)
        related_user.department.set(department)
        related_user.faculty.set(faculties)
        related_user.program.set(program)
        related_user.save()
        return super().update(request,*args,**kwargs)


    def modify_data(self, item):
        related_user = Users.objects.get(id=item["user"])
        item['first_name'] = related_user.first_name
        item['last_name'] = related_user.last_name
        item['email'] = related_user.email
        item['status'] = related_user.is_active
        groups = related_user.groups.all()
        if groups:
            item['group'] = GroupSerializer(groups[0]).data.get('id')  # Use .get() to avoid potential KeyError
        else:
            item['group'] = None  # Or handle the case when there are no groups in a way that fits your requirements

        item['user_permissions'] = [GroupSerializer(seri).data for  seri in related_user.user_permissions.all()]
        item['faculty']=[FacultySerializer(fac).data['id'] for fac in related_user.faculty.all()] # type: ignore
        item['department']=[DepartmentSerializer(dep).data['id'] for dep in related_user.department.all()] # type: ignore
        item['program']=[ProgramSerializer(prog).data['id'] for prog in related_user.program.all()] # type: ignore
        return item
    
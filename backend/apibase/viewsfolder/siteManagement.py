from datetime import datetime
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
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
from rest_framework import status
from rest_framework.decorators import api_view, renderer_classes
import copy

from apibase.viewsfolder.fns import shedule_modify_data

@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])

class TitleViewSet (viewsets.ModelViewSet):
    queryset = Title.objects.all()
    serializer_class = TitleSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name','shortname']

     
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
    filter_backends = [filters.SearchFilter]
    search_fields = ['user__first_name','user__last_name','title']

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
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = General.objects.all()
    serializer_class = GeneralSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['description','state_description']


class SemesterViewSet (viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Semester.objects.all()
    serializer_class = SemesterSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['year','season']

class BuildingViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Building.objects.all()
    serializer_class = BuildingSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name','code','latitude','longitude','state_description']

class FloorViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Floor.objects.all().order_by("building")
    serializer_class = FloorSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['floor_number','state_description','building__name','building__code','building__latitude','building__longitude']

class RoomViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Room.objects.all().order_by("floor")
    serializer_class = RoomSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        'code',
        'description',
        'capacity',
        'room_type',
        'floor__floor_number',
        'floor__state_description',
        'floor__building__name',
        'floor__building__code',
        'floor__building__latitude',
        'floor__building__longitude',
        'state_description',
        ]
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
    
    def modify_data(self, item):
        floor = Floor.objects.get(pk=item['floor'])
        item['floor_num'] = floor.floor_number
        item['building'] = floor.building.name
        return item

class FacultyViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    queryset = Faculty.objects.all()
    serializer_class = FacultySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name','shortname','color','description']


class ActivityTypeViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = ActivityType.objects.all()
    serializer_class = ActivitytypeSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name','description']

class DepartmentViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name','shortname','color','description','faculty__name','faculty__shortname','faculty__color']

class ProgramViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        'name',
        'shortname',
        'color',
        'description',
        'department__name',
        'department__shortname',
        'department__color',
        'department__description',
        'department__faculty__name',
        'department__faculty__shortname',
        'department__faculty__color'
    ]

class CourseSemesterViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = CourseSemester.objects.all()
    serializer_class = CourseSemesterSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        'semester_num',
        'description',
        'program__name',
        'program__shortname',
        'program__color',
        'program__description',
        'program__department__faculty__name',
        'program__department__faculty__shortname',
        'program__department__faculty__color',
        'program__department__name',
        'program__department__shortname',
        'program__department__color'
    ]


class GroupViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class AssistantView(viewsets.ModelViewSet):
    authentication_classes = ([TokenAuthentication])
    permission_classes = ([IsAuthenticated]) 
    queryset = Assistant.objects.all()
    serializer_class = AssistantSerializer
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
    
    def modify_data(self, item):
        related_user = Student.objects.get(id=item["student"])
        item['first_name'] = related_user.user.user.first_name
        item['last_name'] = related_user.user.user.last_name
        item['email'] = related_user.user.user.email
        item['studentId'] = related_user.studentId
        item['status'] = related_user.user.user.is_active
        title_serializer = TitleSerializer(related_user.user.title).data
        item['title'] = title_serializer['shortname'] # type: ignore
        # item['group'] = [GroupSerializer(seri).data for  seri in related_user.groups.all()] # type: ignore
        # item['group'] = GroupSerializer(related_user.groups.all()[0]).data['id'] # type: ignore
        # item['user_permissions'] = [GroupSerializer(seri).data for  seri in related_user.user_permissions.all()]
        item['program']=[ProgramSerializer(prog).data['id'] for prog in related_user.user.program.all()] # type: ignore
        return item

class LecturerViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Lecturer.objects.all()
    serializer_class = LecturerSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        'user__first_name',
        'user__last_name',
        'user__email',
        'user__title__name',
        'user__title__shortname',
    ]

    def create(self, request, *args, **kwargs):
        title=Title.objects.get(id=request.data['title'])
        program = [Program.objects.get(id=prog) for prog in request.data['program']if prog!='']
        userData = {
            'username':request.data['username'], 
            'password':make_password(request.data['password']),
            'first_name':request.data['first_name'],
            'last_name':request.data['last_name'],
            'email':request.data['email'],
            'title':title,
            'is_active':request.data['status'],
            'credential':request.data['credential']
        }
        user_lecturer = Users()
        user_lecturer.__dict__.update(userData)
        user_lecturer.title = title
        user_lecturer.save()
        user_lecturer.program.set(program)
        user_lecturer.save()
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
        # group = Group.objects.filter(id=request.data['group'])
        permissions  = Permission.objects.filter(id__in=request.data['user_permissions'])
        faculties = [Faculty.objects.get(id=fac) for fac in request.data['faculty']if fac!='']
        department = [Department.objects.get(id=dep) for dep in request.data['department']if dep!='']
        program = [Program.objects.get(id=prog) for prog in request.data['program']if prog!='']

        userData = {
            'username':request.data['username'],
            'first_name':request.data['first_name'],
            'last_name':request.data['last_name'],
            'email':request.data['email'],
            'title':title,
            'is_active':request.data['status'],
            'credential':request.data['credential']

            # 'group':group,
            # 'user_permissions':request.data['user_permissions'],
        }
        related_user = Users.objects.get(user=request.data['user'])
        for key, value in userData.items():
            setattr(related_user, key, value)
        related_user.user_permissions.clear()
        related_user.program.clear()
        related_user.save()
        related_user.groups.set(group)
        related_user.user_permissions.set(permissions)
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
        # item['group'] = GroupSerializer(related_user.groups.all()[0]).data['id'] # type: ignore
        # item['user_permissions'] = [GroupSerializer(seri).data for  seri in related_user.user_permissions.all()]
        item['program']=[ProgramSerializer(prog).data['id'] for prog in related_user.program.all()] # type: ignore
        return item

class StudentViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        'user__first_name',
        'user__last_name',
        'user__email',
        # 'user__title',
    ]

    def create(self, request, *args, **kwargs):
        # program = Program.objects.get(id=request.data['program'])
        userData = {
            'username':request.data['email'], 
            'password':make_password(str(request.data['studentId'])),
            'first_name':request.data['first_name'],
            'last_name':request.data['last_name'],
            'email':request.data['email'],
            'is_active':request.data['status'],
            'program':request.data['program']
        }
        try:
            if(User.objects.get(username=request.data['username'])):
                return Response( {'error':'Username already exists.'}, status=409 )
        except:
            pass
        user_student = Users()
        user_student.__dict__.update(userData)
        user_student.save()
        # user_student.program = program
        user_student.save()
        # student_group = Group.objects.get(id=request.data['group'])
        # user_student.groups.add(student_group)
        try:
            existingStudent = Student.objects.get(studentId=request.data['studentId'])
            existingStudent.delete()
        except:
            pass
        studentData  ={
            'user':user_student,
            'studentId':request.data['studentId'],
            'advisor':Advisor.objects.filter(user=request.user.pk).last(),
        }
        request.data['user'] = user_student # type: ignore
        std = Student.objects.create(**studentData)
        # std = super().create(request, *args, **kwargs)
        std.coursegroup.set([Coursegroup.objects.get(id=prog) for prog in request.data['coursegroup']if prog!='']
)
        print(std)
        return Response({'message':'created'},201)
    
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
        # group = Group.objects.filter(id=request.data['group'])
        # permissions  = Permission.objects.filter(id__in=request.data['user_permissions'])
        # faculties = [Faculty.objects.get(id=fac) for fac in request.data['faculty']if fac!='']
        # department = [Department.objects.get(id=dep) for dep in request.data['department']if dep!='']
        program = [request.data['program']]
        coursegroup = [Coursegroup.objects.get(pk=c) for c in request.data['coursegroup']]
        userData = {
            'username':request.data['email'], 
            # 'password':make_password(str(request.data['studentId'])),
            'first_name':request.data['first_name'],
            'last_name':request.data['last_name'],
            'email':request.data['email'],
            'is_active':request.data['status'],
            'program':request.data['program']
        }
        id = request.data['id']
        std = Student.objects.get(pk=id)
        related_user = Users.objects.get(pk=std.user.pk)
        related_user.__dict__.update(userData)
        # for key, value in userData.items():
        #     setattr(related_user, key, value)
        # related_user.program.clear()
        # related_user.save()
        # related_user.program.set(program)
        # related_user.save()
        std.coursegroup.clear()
        std.save()
        std.coursegroup.set(coursegroup)
        std.save()


        return super().update(request,*args,**kwargs)

    def modify_data(self, item):
        related_user = Users.objects.get(id=item["user"])
        item['username'] = related_user.username
        item['first_name'] = related_user.first_name
        item['last_name'] = related_user.last_name
        item['email'] = related_user.email
        item['status'] = related_user.is_active
        # item['group'] = GroupSerializer(related_user.groups.all()[0]).data['id'] # type: ignore
        # item['user_permissions'] = [GroupSerializer(seri).data for  seri in related_user.user_permissions.all()]
        # item['faculty']=[FacultySerializer(fac).data['id'] for fac in related_user.faculty.all()] # type: ignore
        # item['department']=[DepartmentSerializer(dep).data['id'] for dep in related_user.department.all()] # type: ignore
        item['program']=[ProgramSerializer(prog).data['id'] for prog in related_user.program.all()] # type: ignore
        return item

    def get_short_list(self):
        data = Student.objects.all()
        short_data = []
        for item in data:
            short_data.append({
                'first_name': item.user.first_name,
                'last_name': item.user.last_name,
                'user': item.user.id,
                'studentId': item.studentId,
            })
        return Response({'users':short_data},status=status.HTTP_200_OK) 

class OtherStaffViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = OtherStaff.objects.all()
    serializer_class = OtherStaffSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        'user__first_name',
        'user__last_name',
        'user__email',
        'user__title',
        'stafftype',
    ]

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
        related_user.program.clear()
        related_user.save()
        related_user.groups.set(group)
        related_user.user_permissions.set(permissions)
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

class CourseViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title','code','description','other_staff__user__first_name','other_staff__user__last_name'] 

    def create(self, request, *args, **kwargs):
        try:
            request.data['user'] = Users.objects.get(user=request.user.id)
            course = Course.objects.get(code = request.data['code'])
            # course.__setattr__(**request)
        except:
            super().create(request,*args,**kwargs)
            course = Course.objects.get(code = request.data['code'])

        for groupInt in request.data['groups']:

            if Coursegroup.objects.filter(course = course, group_number = groupInt['group_number']).exists():
                continue

            lecturer = Lecturer.objects.filter(pk=groupInt['lecturer']).exists()
            if(lecturer == True):
                lecturer = Lecturer.objects.get(id=groupInt.pop('lecturer'))
            else:
                return Response({'message': 'Please select a lecturer for the group '+ groupInt['group_number']},200)
            assistant = Student.objects.get(id=groupInt.pop('assistant','')) if hasattr(groupInt,'assistant') else  None
            lecturer_assistant = Lecturer.objects.get(id=groupInt.pop('lecturer_assistant','')) if hasattr(groupInt,'lecturer_assistant') else  None

            group = {
                'course': course,
                'lecturer': lecturer,
                'assistant': assistant,
                'lecturer_assistant': lecturer_assistant,
                'duration': groupInt['duration'] if  "duration" in groupInt else 2,
                'max_capacity': groupInt['max_capacity'] if 'max_capacity' in groupInt else 20,
                'group_number':groupInt['group_number'],
                'status':groupInt['status'] if 'status' in groupInt else True,
                'is_elective':groupInt['is_elective'] if 'elective' in groupInt else  False,
                'description' : groupInt['description'] if 'description' in groupInt else ''
            }
            
            course_group = Coursegroup.objects.create(**group)
            try:
                course_group.extra_session_of.set([Coursegroup.objects.get(id=c).id for c in  groupInt.pop('extra_session_of','')])
            except:
                print()
            try:
                for m in groupInt['merged_with']:
                    cm = Coursegroup.objects.get(pk=m).merged_with.add(course_group.pk)
                    # cm.save()
                course_group.merged_with.set([Coursegroup.objects.get(id=c) for c in  groupInt.pop('merged_with')])
            except:
                print('fail with the merge')
            try:
                course_group.activitytype.set([ActivityType.objects.get(id=ac) for ac in groupInt['activitytype']])
            except:
                print()
                
            try:
                course_group.prerequisites.set([Course.objects.get(id=c) for c in  groupInt.pop('prerequisites','')])
            except:
                print()
                
            try:
                course_group.course_semester.set([CourseSemester.objects.get(id=c) for c in  groupInt.pop('course_semester', '')])
            except:
                print()
                
        return Response({'message':'course group created successfully '},200)

    def update(self, request, *args, **kwargs):
        try:
            request.data['user'] = Users.objects.filter(user=request.user.id).first()
            course = Course.objects.get(pk = request.data['id'])
        except:
            return Response({'message':'Error when retreiving the course data'},400)
        super().update(request, *args, **kwargs)
        print(request.data['groups'])
        for groupInt in request.data['groups']:
            try:
                current_group = Coursegroup.objects.filter(course = course.id, pk = groupInt['id']).first()
            except:
                continue 
            lecturer = Lecturer.objects.filter(pk=groupInt['lecturer']).exists()
            if(lecturer == True):
                lecturer = Lecturer.objects.get(id=groupInt.pop('lecturer'))
            else:
                return Response({'message': 'Please select a lecturer for the group '+ groupInt['group_number']},200)
            assistant = Student.objects.get(id=groupInt.pop('assistant')) if groupInt['assistant'] else  None
            lecturer_assistant = Lecturer.objects.get(id=groupInt.pop('lecturer_assistant')) if groupInt['lecturer_assistant'] else None

            group = {
                'course': course,
                'lecturer': lecturer,
                'assistant': assistant,
                'lecturer_assistant': lecturer_assistant,
                'duration': groupInt['duration'] if  "duration" in groupInt else 2,
                'max_capacity': groupInt['max_capacity'] if 'max_capacity' in groupInt else 20,
                'group_number':groupInt['group_number'],
                'status':groupInt['status'] if 'status' in groupInt else True,
                'is_elective':groupInt['is_elective'] if 'elective' in groupInt else  False,
                'description' : groupInt['description'] if 'description' in groupInt else ''
            }
            for key, value in group.items():
                setattr(current_group, key, value)
            # current_group.__setattr__(group)
            current_group.extra_session_of.set([Coursegroup.objects.get(id=c).id for c in  groupInt.pop('extra_session_of','')])
            current_group.merged_with.set([Coursegroup.objects.get(id=c) for c in  groupInt.pop('merged_with','')])
            current_group.activitytype.set([ActivityType.objects.get(id=ac) for ac in groupInt['activitytype']])
            current_group.prerequisites.set([Course.objects.get(id=c) for c in  groupInt.pop('prerequisites','')])
            current_group.course_semester.set([CourseSemester.objects.get(id=c) for c in  groupInt.pop('course_semester', '')])
            current_group.save()
        return Response({'message':'course updated successfully'},200)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serialized_data = self.get_serializer(instance).data
        modified_data = self.modify_data(serialized_data)
        return Response(modified_data)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serialized_data = self.get_serializer(queryset, many=True).data
        modified_data = [self.modify_data(item) for item in serialized_data] # type: ignore
        return Response(modified_data,200)

    def modify_data(self, item):
        """Adds additional data to the response"""
        coursegroups = Coursegroup.objects.filter(course = Course.objects.get(pk=item['id']))
        item['num_group'] =  len(coursegroups)
        try:
            item['user_name'] =  Users.objects.get(pk=item['user']).first_name+' '+Users.objects.get(pk=item['user']).last_name
        except:
            item['user_name'] = 'Unknow'
        
            for index, cg in enumerate(item['coursegroup']):
                course_semester_ids = cg.get('course_semester')  # Get the 'course_semester' field from the current dictionary
                if course_semester_ids is not None:
                    related_programs = CourseSemester.objects.filter(id__in=course_semester_ids).values_list('program__pk', flat=True)
                    item['coursegroup_set'][index]['program'] = list(related_programs)
                    related_department = CourseSemester.objects.filter(id__in=course_semester_ids).values_list('department__pk', flat=True)
                    item['coursegroup_set'][index]['department'] = list(related_department)
                    more_fac = Department.objects.filter(id__in=related_department).values_list('faculty__pk', flat=True)
                    item['coursegroup_set'][index]['faculty'] = list(more_fac)
                    uniSemester = CourseSemester.objects.filter(id__in=course_semester_ids).values_list('semester__pk', flat=True)
                    item['coursegroup_set'][index]['uniSemes'] = list(uniSemester)

        return item

class CourseGroupViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Coursegroup.objects.all()
    serializer_class = CourseGroupSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        'description',
        'duration',
        'current_capacity',
        'max_capacity',
        'group_number',
        'course__name',
        'course__code',
        'course__description',
        'course__created_at',
        'lecturer__user__first_name',
        'lecturer__user__last_name',
        'lecturer__user__email',
        # 'assistant__user__first_name',
        # 'assistant__user__last_name',
        'lecturer_assistant__user__first_name',
        'lecturer_assistant__user__last_name',
        'course_semester__semester__year',
        'course_semester__semester__season',
        'course_semester__program__name',
        'course_semester__program__shortname',
    ] 

    # search_fields = ['*'] 
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

    def modify_data(self, item):
        course = Course.objects.get(pk=item['course'])
        item['code'] = course.code
        item['name'] = course.name

        lecturer = Lecturer.objects.get(pk=item['lecturer'])
        lectTitle = lecturer.user.title.shortname
        item['lect']= {
            'first_name': lecturer.user.first_name,
            'last_name': lecturer.user.last_name,
            'email': lecturer.user.email,
            'title': lectTitle
        }
        return item
    
class PreferenceViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Preference.objects.all().order_by('id')
    serializer_class = PreferenceSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        'description',
        'general__description',
        'building__name',
        'building__code',
        'building__latitude',
        'building__longitude',
        'building__state_description',
        'floor__floor_number',
        'floor__state_description',
        'room__code',
        'room__description',
        'room__capacity',
        'room__room_type',
        'faculty__name',
        'faculty__shortname',
        'faculty__color',
        'faculty__description',
        'department__color',
        'department__shortname',
        'department__name',
        'program__color',
        'program__shortname',
        'program__name',
        'course_semester__semester_num',
        'course_semester__description',
        'semester__year',
        'semester__season',
        'course__title',
        'course__code',
        'course__description',
        'course__other_staff__user__first_name',
        'course__other_staff__user__last_name',
        'coursegroup__description',
        'coursegroup__duration',
        'coursegroup__current_capacity',
        'coursegroup__max_capacity',
        'coursegroup__group_number',
        'coursegroup__course__title',
        'coursegroup__course__code',
        'coursegroup__course__description',
        'coursegroup__course__created_at',
        'coursegroup__lecturer__user__first_name',
        'coursegroup__lecturer__user__last_name',
        'coursegroup__assistant__user__first_name',
        'coursegroup__assistant__user__last_name',
        'coursegroup__lecturer_assistant__user__first_name',
        'coursegroup__lecturer_assistant__user__last_name',
        'coursegroup__course_semester__semester__year',
        'coursegroup__course_semester__semester__season',
        'coursegroup__course_semester__program__name',
        'coursegroup__course_semester__program__shortname',
        'coursegroup__course_semester__department__name',
        'coursegroup__course_semester__department__shortname',
        'coursegroup__course_semester__faculty__name',
        'coursegroup__course_semester__faculty__shortname',
        'event_time__start',
        'event_time__end',
        'event_time__date',
        'title__name',
        'title__shortname',
        'title__description',
        'user__user__first_name',
        'user__user__last_name',
        'user__user__email',
        'user__title__name',
        'user__title__shortname',
    ]

    def create(self, request, *args, **kwargs):
        if Users.objects.filter(user=request.user.id).exists():
            request.data['user'] = Users.objects.filter(user=request.user.id).id
            if not hasattr(request.data,'position'):
                request.data['position'] = Users.objects.filter(user=request.user.id).first().preference_set.count()
        if not hasattr(request.data, 'status'):
            request.data['status'] = True
            print(hasattr(request.data, 'start'))
        if 'start' in request.data:
            request.data['start'] = datetime.fromisoformat(request.data['start'][:-1]).strftime('%H:%M')
        if 'date' in request.data:
            request.data['date'] = datetime.fromisoformat(request.data['date'][:-1]).strftime('%Y-%m-%d')
            
        return super().create(request, *args, **kwargs)

class EventTimeViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = EventTime.objects.all().order_by('id')
    serializer_class = EventTimeSerializer
    filter_backends = (filters.SearchFilter, filters.OrderingFilter)
    search_fields = [
        'start',
        'end',
        'date',
    ]

class ScheduleViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Schedule.objects.all().order_by('id')
    serializer_class = ScheduleSerializer
    filter_backends = (filters.SearchFilter, filters.OrderingFilter)
    search_fields = [
        'room__code',
        'coursegroup__course__name',
        'start',
        'end',
        'date',
        'day',
    ]

    def perform_create(self, serializer):
        # Attach the current user (from the request) to the schedule
        user = Users.objects.get(user=self.request.user.id)

        # Get the main coursegroup and the list of merged courses
        coursegroup = self.request.data['coursegroup']
        merged_courses = Coursegroup.objects.get(pk=coursegroup).merged_with.all()

        # Save the main coursegroup entry
        serializer.save(user=user, coursegroup=Coursegroup.objects.get(pk=coursegroup))

        # Loop through merged courses and create entries for each merged coursegroup
        for mc in merged_courses:
            # Create a deep copy of request data
            data_copy = copy.deepcopy(self.request.data)

            # Update the coursegroup in the copied data
            data_copy['coursegroup'] = mc.id

            # Use the updated data to save the serializer
            serializer.save(user=user, coursegroup=Coursegroup.objects.get(pk=data_copy['coursegroup']))


    def perform_update(self, serializer):
        user = Users.objects.get(user=self.request.user.id)
        # If you want to update the user as well (for updates)
        serializer.save(user=user)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serialized_data = self.get_serializer(queryset, many=True).data
        modified_data = [self.modify_data(item) for item in serialized_data] # type: ignore
        return Response(modified_data,200)
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serialized_data = self.get_serializer(instance).data
        modified_data = shedule_modify_data(serialized_data)
        return Response(modified_data)



class ScheduleTypeViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = ScheduleType.objects.all().order_by('id')
    serializer_class = ScheduleTypeSerializer
    filter_backends = (filters.SearchFilter, filters.OrderingFilter)
    search_fields = [
        'name',
        'created_at',
    ]
    def get_queryset(self):
        return ScheduleType.objects.filter(status=True)

    def get_queryset(self):
        return ScheduleType.objects.filter(status=True)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serialized_data = self.get_serializer(queryset, many=True).data
        modified_data = [self.modify_data(item) for item in serialized_data] # type: ignore
        return Response(modified_data,200)
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serialized_data = self.get_serializer(instance).data
        modified_data = shedule_modify_data(serialized_data)
        return Response(modified_data)
    def modify_data(self, item):
        item['value'] = item['id']
        item['label'] = item['name']
        return item
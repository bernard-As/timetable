from rest_framework.response import Response 
from rest_framework.views import APIView
from rest_framework import viewsets, filters, status
from rest_framework import generics
from django.utils import timezone
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.views import APIView

from apibase.models import *
from apibase.serializers import *
from apibase.viewsfolder.fns import canScheduleDisplay, shedule_modify_data
from apibase.viewsfolder.tableScan import scanTable

# generics
class ViewSchedule(APIView):
    authentication_classes = ([TokenAuthentication])
    permission_classes =( [IsAuthenticated] )
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer

    def post(self, request):
        user = request.user
        try:
            model = request.data['model']
            id = request.data['id']
        except KeyError:
            return Response({'error': 'Invalid request'}, status=400)

        toReturn = []
        if model == 'room':
            toReturn = Schedule.objects.filter(room=id)

        elif model == 'lecturer':
            lectCourses = Coursegroup.objects.filter(lecturer=id)
            for c in lectCourses:
                schedules = Schedule.objects.filter(coursegroup=c.id)
                toReturn.extend(schedules)  # Extend the list with schedules
            invigilationShc = Schedule.objects.filter(invigilator=id,type=5)
            schedule_ids = {schedule.id for schedule in toReturn}
            
            # Add invigilation schedules that are not already in the toReturn list
            for invigilation in invigilationShc:
                if invigilation.id not in schedule_ids:
                    toReturn.append(invigilation)
                        # toReturn.extend(invigilationShc) 
            
        
        elif model == 'course':
            toReturn = Schedule.objects.filter(coursegroup=id)

        elif model == 'my_shedule':
            user = request.user
            try:
                lecturer = Lecturer.objects.filter(user=user.pk)
                isLecturer = True
            except:
                isLecturer = False

            if(isLecturer):
                lectCourses = Coursegroup.objects.filter(lecturer = user.id)
                toReturn = Schedule.objects.filter(coursegroup__lecturer__user=user)
        elif model == 'faculty':
            toReturn = Schedule.objects.filter(coursegroup__course_semester__program__department__faculty=request.data['id']).distinct()
        elif model == 'department':
            toReturn = Schedule.objects.filter(coursegroup__course_semester__program__department=request.data['id']).distinct()
        elif model == 'program':
            toReturn = Schedule.objects.filter(coursegroup__course_semester__program=request.data['id']).distinct()
        elif model == 'semester':
            toReturn = Schedule.objects.filter(coursegroup__course_semester=request.data['id']).distinct()
        elif model == 'student':
            # Get the student's course groups (assuming it's a ManyToManyField)
            student = Student.objects.get(pk=id)
            stdCourses = student.coursegroup.all()  # Use .all() to get the related course groups
            if stdCourses.exists():  # Check if any course groups are available
                for c in stdCourses:
                    schedules = Schedule.objects.filter(coursegroup=c.id)
                    toReturn.extend(schedules)  

            ##Check if assistant if assign 
            try:
                assistant = Assistant.objects.get(student=student.pk)
                stdCourses = assistant.coursegroup.all()
                if stdCourses.exists():  # Check if any course groups are available
                    for c in stdCourses:
                        schedules = Schedule.objects.filter(coursegroup=c.id,type=2)
                        toReturn.extend(schedules)
            except:
                pass
        elif model == 'assistant':
            # Get the student's course groups (assuming it's a ManyToManyField)
            student = Assistant.objects.get(pk=id)

            stdCourses = student.coursegroup.all()  
            if stdCourses.exists():  # Check if any course groups are available
                for c in stdCourses:
                    schedules = Schedule.objects.filter(coursegroup=c.id,type=2)
                    toReturn.extend(schedules)
            if student.student.coursegroup.exists():  # Check if any course groups are available
                for c in student.student.coursegroup.all():
                    schedules = Schedule.objects.filter(coursegroup=c.id)
                    toReturn.extend(schedules)
        elif model == 'complete':
            toReturn = Schedule.objects.all().distinct()
        # Serialize the data
        R = []
        for schedule in toReturn:
            canDisplay = canScheduleDisplay(user.pk,schedule.pk)
            if (canDisplay):
                R.extend([schedule])

            print(R)
        serializer = ScheduleSerializer(R, many=True)
        modified_data = [shedule_modify_data(item) for item in serializer.data if item != None] # type: ignore
        return Response(modified_data)

class MySchedule(APIView):
    authentication_classes = ([TokenAuthentication])
    permission_classes = ([IsAuthenticated])

    def get(self, request):
        user = request.user
        isLecturer = False
        toReturn = []
        try:
            # Check if the user is a lecturer
            isLecturer = Lecturer.objects.filter(user=user.pk).exists()
        except Exception as e:
            print(f"Error checking lecturer status: {e}")
            isLecturer = False
        
        if isLecturer:
            # Fetch schedules for lecturer
            toReturn.extend(Schedule.objects.filter(coursegroup__lecturer__user=user.pk))
            invigilationShc = Schedule.objects.filter(invigilator__user=user.pk,type=5)
            schedule_ids = {schedule.id for schedule in toReturn}
            # return Response({"error": Users.objects.get(pk=user.pk).credential}, status=404)
            
            # Add invigilation schedules that are not already in the toReturn list
            x = []
            for invigilation in invigilationShc:
                if invigilation.id not in schedule_ids:
                    toReturn.append(invigilation)
                    pass
        else:
            try:
                # Fetch the student object based on the user
                student = Student.objects.get(user=user.pk)
                # Ensure `coursegroup` is a queryset/list
                coursegroups = student.coursegroup.all()  # assuming coursegroup is a ManyToMany field
                toReturn.extend(Schedule.objects.filter(coursegroup__in=coursegroups))
                try:
                    assistant = Assistant.objects.get(student=student.pk)
                    stdCourses = assistant.coursegroup.all()
                    if stdCourses.exists():  # Check if any course groups are available
                        for c in stdCourses:
                            schedules = Schedule.objects.filter(coursegroup=c.id,type=2)
                            toReturn.extend(schedules)
                except:
                    pass
            except Student.DoesNotExist:
                return Response({"error": "Student not found"}, status=404)
            except Exception as e:
                return Response({"error": str(e)}, status=400)
        R = []
        for schedule in toReturn:
            if schedule==None:
                continue
            canDisplay = canScheduleDisplay(user.pk,schedule.pk)
            if (canDisplay):
                R.extend([schedule])
        serializer = ScheduleSerializer(R, many=True)
        modified_data = [shedule_modify_data(item) for item in serializer.data if item !=None] # type: ignore
        return Response(modified_data)


class SystemNewsView(viewsets.ModelViewSet):
    authentication_classes = []
    permission_classes = []
    queryset = SystemNews.objects.all()
    serializer_class = SystemNewsSerializer
    

class UpcomingScheduleView(generics.ListAPIView):
    serializer_class = ScheduleSerializer
    authentication_classes = []
    permission_classes = []

    def get_queryset(self):
        # Get the current date and time
        now = timezone.now()

        # Get the current day of the week (1=Monday, 7=Sunday)
        current_day = now.weekday() + 1  # weekday() returns 0 for Monday, so we add 1
        if current_day == 7:
            current_day = 1
        # Filter schedules that:
        # 1. Have a future date OR
        # 2. Are scheduled for today or in the future based on the `day` field (Mon=1, Sun=7)
        toReturn = Schedule.objects.filter(
            Q(date__gt=now.date()) |  # Future dates
            Q(date=now.date(), start__gte=now.time()) |  # Today's schedules after the current time
            Q(day__gte=current_day)  # Schedules based on the day field (today or future days)
        ).order_by('date', 'day', 'start')[:15]
        R = []
        for schedule in toReturn:
            if schedule == None:
                continue
            canDisplay = canScheduleDisplay(None,schedule.pk)
            if (canDisplay):
                R.extend([schedule])
        return R

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        modified_data = [shedule_modify_data(item) for item in serializer.data if item!=None] 
        return Response(modified_data)

class MyUpcomingScheduleView(generics.ListAPIView):
    serializer_class = ScheduleSerializer
    authentication_classes = ([TokenAuthentication])
    permission_classes = ([IsAuthenticated])

    def get_queryset(self):
        # Get the current date and time
        now = timezone.now()

        # Get the current day of the week (1=Monday, 7=Sunday)
        current_day = now.weekday() + 1  # weekday() returns 0 for Monday, so we add 1
        if current_day == 7:
            current_day = 1
        # Filter schedules that:
        # 1. Have a future date OR
        # 2. Are scheduled for today or in the future based on the `day` field (Mon=1, Sun=7)
        user = Users.objects.get(user=self.request.user)
        myCourses = []
        if(Student.objects.filter(user=user.pk).exists()):
            myCourses = Student.objects.get(user=user.pk).coursegroup.all()
        elif (Lecturer.objects.filter(user=user.pk).exists()):
            myCourses = Coursegroup.objects.filter(lecturer__user=user)
        # print(myCourses)
        toReturn =Schedule.objects.filter(
            (
                Q(date__gt=now.date()) |  # Future dates
                Q(date=now.date(), start__gte=now.time()) |  # Today's schedules after the current time
                Q(day__gte=current_day)  # Schedules based on the day field (today or future days)
            ) & Q(coursegroup__in=myCourses)  # Filter by user's courses
        ).order_by('date', 'day', 'start')[:15] 
        R = []
        for schedule in toReturn:
            if schedule == None:
                continue
            canDisplay = canScheduleDisplay(user.pk,schedule.pk)
            if (canDisplay):
                R.extend([schedule])

        return R
        

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        modified_data = [shedule_modify_data(item) for item in serializer.data if item!=None] # type: ignore
        return Response(modified_data)

class FreeModel(APIView):
    authentication_classes =[]
    permission_classes = []
    # Mapping models and serializers
    MODEL_SERIALIZER_MAP = {
        'building': (Building, BuildingSerializer),
        'room': (Room, RoomSerializer),
        'schedule': (Schedule, ScheduleSerializer),
        'systemnews': (SystemNews, SystemNewsSerializer),
        'floor': (Floor, FloorSerializer),
        'faculty': (Faculty, FacultySerializer),
        'department': (Department, DepartmentSerializer),
        'program': (Program, ProgramSerializer),
        'semester': (Semester, SemesterSerializer),
        'title': (Title, TitleSerializer),
        'lecturer': (Lecturer, LecturerSerializer),
        'student': (Student, StudentSerializer),
        'course': (Course, CourseSerializer),
        'coursegroup': (Coursegroup, CourseGroupSerializer),
        'activitytype': (ActivityType, ActivitytypeSerializer),
        'coursesemester': (CourseSemester, CourseSemesterSerializer),
        'advisor': (Advisor, AdvisorSerializer),
        'users': (Users, UsersSerializer),
        'assistant': (Users, UsersSerializer),
    }

    def post(self, request):
        try:
            # Extract 'model' and 'id' from request data
            model_name = request.data.get('model')
            object_id = request.data.get('id')

            # Validate if the model exists in our mapping
            if model_name not in self.MODEL_SERIALIZER_MAP:
                return Response({"error": "Invalid model name"}, status=400)

            # Get the model and serializer based on the model name
            model_class, serializer_class = self.MODEL_SERIALIZER_MAP[model_name]

            if object_id:
                # Fetch a single object by ID
                try:
                    obj = model_class.objects.get(id=object_id)
                    serialized_data = serializer_class(obj).data
                except model_class.DoesNotExist:
                    return Response({"error": f"{model_name.capitalize()} not found."}, status=404)
            else:
                # Fetch all objects if no ID is provided
                obj = model_class.objects.all()
                serialized_data = serializer_class(obj, many=True).data
                if model_name=='schedule':
                    R = []
                    for schedule in obj:
                        canDisplay = canScheduleDisplay(None,schedule.pk)
                        if (canDisplay):
                            R.extend([schedule])
                        serialized_data = serializer_class(R, many=True).data
                    serialized_data = [shedule_modify_data(item) for item in serialized_data] # type: ignore

            return Response(serialized_data, status=200)

        except Exception as e:
            print(f"Error: {e}")
            return Response({"error": "Bad Request"}, status=400)

class MigrationView(APIView):
        authentication_classes =[]
        permission_classes = []

        def post(self,request):
            target_obj = request.data['obj']
            sourceTerm = request.data['source']
            targetTerm = request.data['target']
            source = Semester.objects.get(pk=sourceTerm)
            target = Semester.objects.get(pk=targetTerm)
            toReturnSource = []
            toReturnTarget = []
            if not 'save' in request.data:
                if(target_obj=='coursesemester'):
                    toReturnSource = [
                        {
                            'program': c.program.name,
                            'semester_num': c.semester_num,
                            'course_num': Coursegroup.objects.filter(course_semester=c.pk).count(),
                            'name': 'Program: '+str(c.program.shortname) + '-Semester: '+str(c.semester_num) + '-Department: '+str(c.program.department.shortname),
                            'key_verif':str(c.program.shortname)+'-'+str(c.semester_num),
                            'key':c.pk
                        } for  c in
                        CourseSemester.objects.filter(semester=source.pk)]
                    toReturnTarget = [
                        {
                            'name': 'Program: '+str(c.program.shortname) + '-Semester: '+str(c.semester_num) + '-Department: '+str(c.program.department.shortname),
                            'key_verif':str(c.program.shortname)+'-'+str(c.semester_num), # type: ignore
                            'key':c.pk,
                            'program': c.program.name,
                            'semester_num': c.semester_num,
                            'course_num': Coursegroup.objects.filter(course_semester=c.pk).count(),
                        } for  c in
                        CourseSemester.objects.filter(semester=target.pk)]

                # for o in toReturnSource:
                    # if o['key_verif'] in [t['key_verif'] for t in toReturnTarget]:
                    
                elif target_obj=='coursegroup':
                    course_semester_source = CourseSemester.objects.get(pk=request.data['courseSemester'])
                    course_semester_target = CourseSemester.objects.get(
                        semester=target.pk,
                        semester_num=course_semester_source.semester_num,
                        program=course_semester_source.program
                    )

                    toReturnSource = [{
                        'name':c.course.name,
                        'key_verif':str(c.course.pk) +'-'+ str(c.group_number),
                        'lecturer':c.lecturer.user.email,
                        'group':c.group_number,
                        'key':c.pk
                    }
                                    for c in Coursegroup.objects.filter(
                        course_semester__in=[course_semester_source.pk,]
                    )]

                    toReturnTarget = [{
                        'name':c.course.name,
                        'key_verif':str(c.course.pk) +'-'+ str(c.group_number),
                        'lecturer':c.lecturer.user.email,
                        'group':c.group_number,
                        'key':c.pk
                    }
                                    for c in Coursegroup.objects.filter(
                        course_semester__in=[course_semester_target.pk],
                    )]
                for item in toReturnSource:
                    if item['key_verif'] in [t['key_verif'] for t in toReturnTarget]:
                        item['exists_in_target'] = True
                    else:
                        item['exists_in_target'] = False
                return Response({'source':toReturnSource,'target':toReturnTarget},status=status.HTTP_200_OK)
            else:
                targetIds = request.data['targetIds']
                obj=  request.data['obj']
                if obj == 'coursesemester':
                    for id in targetIds:
                        try:
                            c=CourseSemester.objects.get(pk=id)
                            c.pk=None
                            c.semester = target
                            c.save()
                        except:
                            pass
                else:
                    course_semester_source = CourseSemester.objects.get(pk=request.data['courseSemester'])
                    course_semester_target = CourseSemester.objects.get(
                        semester=target.pk,
                        semester_num=course_semester_source.semester_num,
                        program=course_semester_source.program
                    )
                    for id in targetIds:
                        # try:
                            c=Coursegroup.objects.get(pk=id)

                            if Coursegroup.objects.filter(
                                course=c.course.pk,
                                group_number=c.group_number,
                                course_semester__id=course_semester_target.pk
                            ):
                                continue

                            c.pk=None
                            c.save()
                            c_cs = c.course_semester.all()
                            c.course_semester.clear()
                            for c_c in c_cs:
                                new_c = None
                                try:
                                    new_c = CourseSemester.objects.get(
                                        program=c_c.program.pk,
                                        semester=target.pk,
                                        semester_num=c_c.semester_num
                                    )
                                    c.course_semester.add(new_c.pk)
                                except:
                                    pass
                            c.course_semester.add(course_semester_target.pk)
                            c.save()
                        # except:
                            # pass
            return Response({},status=status.HTTP_200_OK)
        
class StudentScanView(viewsets.ModelViewSet):
    authentication_classes = ([TokenAuthentication])
    permission_classes = ([IsAuthenticated])    
    queryset = StudentScan.objects.all()
    serializer_class = StudentScanSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        scan = StudentScan.objects.get(pk=serializer.data['id'])
        output = scanTable(scan.image.path)
        return Response(output, status=status.HTTP_201_CREATED)

class SummerCourseView(viewsets.ModelViewSet):
    authentication_classes =[]
    permission_classes = []

    queryset = SummerCourse.objects.all()
    serializer_class = SummerCourseSerializer
    
    
    def get_queryset(self):
        return SummerCourse.objects.filter(course__isnull=False).distinct()
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class SummerStudentSelectionView(viewsets.ModelViewSet):
    authentication_classes =[]
    permission_classes = []

    queryset = SummerStudentSelection.objects.all()
    serializer_class = SummerStudentSelectionSerializer
    
    def get_queryset(self):
        return SummerStudentSelection.objects.filter(summer_course__course__isnull=False).distinct()
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
class CourseSelectionAdminView(APIView):
    authentication_classes = ([TokenAuthentication])
    permission_classes = ([IsAuthenticated])

    def get(self, request):
        user = request.user
        # if not user.is_superuser:
            # return Response({"error": "Permission denied"}, status=403)
        toReturn = []
        courses = Course.objects.all()
        for course in courses:
            course_data = {
                'id': course.pk,
                'name': course.name,
                'code': course.code,
                'isActive': course.summer_courses.exists(),
                # 'semester': course.groups.first().course_semester.first().program.name if course.groups.exists() else None,
                # 'faculty': course.faculty.name if course.faculty else None,
                # 'department': course.department.name if course.department else None,
            }
            toReturn.append(course_data)
        return Response(toReturn)

    def post(self, request):
        user = request.user
        # if not user.is_superuser:
            # return Response({"error": "Permission denied"}, status=403)
        courseId = request.data.get('courseId')
        isActive = request.data.get('isActive', False)
        if not courseId:
            return Response({"error": "Course ID is required"}, status=400)
        try:
            course = Course.objects.get(pk=courseId)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=404)
        #check   if exist in SummerCourse
        if isActive and not course.summer_courses.exists():
            summerCourse = SummerCourse.objects.create(course=course, status=isActive)
        elif not isActive and course.summer_courses.exists():
            summerCourse = SummerCourse.objects.filter(course=course).first()
            if summerCourse:
                summerCourse.delete()
        return Response({"success": "Course status updated"}, status=200)
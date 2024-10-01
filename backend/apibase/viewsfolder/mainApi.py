from rest_framework.response import Response 
from rest_framework.views import APIView
from rest_framework import viewsets, filters
from rest_framework import generics
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

from apibase.models import *
from apibase.serializers import *

# generics
class ViewSchedule(APIView):
    authentication_classes = []
    permission_classes = [] 
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer

    def post(self, request):
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
            print (toReturn)
        elif model == 'faculty':
            toReturn = Schedule.objects.filter(coursegroup__course_semester__program__department__faculty=request.data['id'])
        elif model == 'department':
            toReturn = Schedule.objects.filter(coursegroup__course_semester__program__department=request.data['id'])
        elif model == 'program':
            toReturn = Schedule.objects.filter(coursegroup__course_semester__program=request.data['id'])
        elif model == 'semester':
            toReturn = Schedule.objects.filter(coursegroup__course_semester=request.data['id'])
        else:
            return Response({'error': 'Invalid request'}, status=400)

        # Serialize the data
        serializer = ScheduleSerializer(toReturn, many=True)
        # Return serialized data
        return Response(serializer.data)

class MySchedule(APIView):
    authentication_classes = ([TokenAuthentication])
    permission_classes = ([IsAuthenticated])

    def get(self, request):
        user = request.user
        isLecturer = False
        
        try:
            # Check if the user is a lecturer
            isLecturer = Lecturer.objects.filter(user=user.pk).exists()
        except Exception as e:
            print(f"Error checking lecturer status: {e}")
            isLecturer = False
        
        if isLecturer:
            # Fetch schedules for lecturer
            toReturn = Schedule.objects.filter(coursegroup__lecturer__user=user.pk)
        else:
            try:
                # Fetch the student object based on the user
                student = Student.objects.get(user=user.pk)
                # Ensure `coursegroup` is a queryset/list
                coursegroups = student.coursegroup.all()  # assuming coursegroup is a ManyToMany field
                toReturn = Schedule.objects.filter(coursegroup__in=coursegroups)
            except Student.DoesNotExist:
                return Response({"error": "Student not found"}, status=404)
            except Exception as e:
                return Response({"error": str(e)}, status=400)
        
        serializer = ScheduleSerializer(toReturn, many=True)
        return Response(serializer.data)


class SysytemNewsView(viewsets.ModelViewSet):
    authentication_classes = []
    permission_classes = []
    queryset = SystemNews.objects.all()
    serializer_class = SystemNewsSerializer
    

class UpcomingScheduleView(generics.ListAPIView):
    serializer_class = ScheduleSerializer

    def get_queryset(self):
        # Get the current date and time
        now = timezone.now()

        # Get the current day of the week (1=Monday, 7=Sunday)
        current_day = now.weekday() + 1  # weekday() returns 0 for Monday, so we add 1

        # Filter schedules that:
        # 1. Have a future date OR
        # 2. Are scheduled for today or in the future based on the `day` field (Mon=1, Sun=7)
        return Schedule.objects.filter(
            Q(date__gt=now.date()) |  # Future dates
            Q(date=now.date(), start__gte=now.time()) |  # Today's schedules after the current time
            Q(day__gte=current_day)  # Schedules based on the day field (today or future days)
        ).order_by('date', 'day', 'start')[:10]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

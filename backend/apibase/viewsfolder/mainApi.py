from rest_framework.response import Response 
from rest_framework.views import APIView

from apibase.models import *
from apibase.serializers import ScheduleSerializer

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
                toReturn = Schedule.objects.filter(coursegroup__in=lectCourses)
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
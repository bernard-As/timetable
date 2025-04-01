from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response 
from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

from apibase.models import *
from apibase.serializers import ScheduleSerializer

class DefaultView(APIView):
    authentication_classes = ([TokenAuthentication])
    permission_classes =( [IsAuthenticated] )

    def post(self, request):
        try:
            user = Users.objects.get(user = request.user.pk)
            print(user.credential)
            if user.credential != 'SYSADM' and user.credential != 'PADM' and user.credential != 'VR':
                return Response({'message': 'You do not have permission to access this resource'}, status=status.HTTP_403_FORBIDDEN)
        except Users.DoesNotExist:
            return Response({'message': 'You do not have permission to access this resource'}, status=status.HTTP_403_FORBIDDEN)
        count_lectuerer = Lecturer.objects.all().count()
        count_coursegroup_total = Coursegroup.objects.all().count()
        count_lectuerer_with_final_exam = 0
        count_coursegroup = 0
        lectuerer_with_final_exam_ids = []
        coursegroup_ids = []
        schedules = Schedule.objects.filter(type=3,status=True)
        for schedule in schedules:
            if schedule.invigilator:
                if schedule.invigilator.pk not in lectuerer_with_final_exam_ids:
                    lectuerer_with_final_exam_ids.append(schedule.invigilator.pk)
                    count_lectuerer_with_final_exam += 1
            if schedule.coursegroup:
                if schedule.coursegroup.pk not in coursegroup_ids:
                    coursegroup_ids.append(schedule.coursegroup.pk)
                    count_coursegroup += 1

        students = Student.objects.all()
        count_student_total = students.count()
        count_student = 0
        student_ids = []
        for student in students:
            if student.pk not in student_ids:
                for coursegroup in student.coursegroup.all():
                    if coursegroup.pk in coursegroup_ids:
                        student_ids.append(student.pk)
                        count_student += 1
                        break
        return Response({
            'total_lecturer': count_lectuerer,
            'lecturer': count_lectuerer_with_final_exam,
            'coursegroup': count_coursegroup,
            'total_coursegroup': count_coursegroup_total,
            'student': count_student,
            'total_student': count_student_total,
            'schedule': schedules.count()
        })
        
class LecturerView(APIView):
    authentication_classes = ([TokenAuthentication])
    permission_classes =( [IsAuthenticated] )

    def post(self, request):
        try:
            user = Users.objects.get(user = request.user.pk)
            print(user.credential)
            if user.credential != 'SYSADM' and user.credential != 'PADM' and user.credential != 'VR':
                return Response({'message': 'You do not have permission to access this resource'}, status=status.HTTP_403_FORBIDDEN)
        except Users.DoesNotExist:
            return Response({'message': 'You do not have permission to access this resource'}, status=status.HTTP_403_FORBIDDEN)
                
        lecturers = Lecturer.objects.all()
        data = []
        for lecturer in lecturers:
            courseGroup = lecturer.course_lecturer.all()
            coursGroupIds = [c.pk for c in courseGroup]
            count_coursegroup = courseGroup.count()
            countLecturerOwnedExams = 0
            for coursegroup in courseGroup:
                if Schedule.objects.filter(coursegroup=coursegroup.pk, type=3).exists():
                    countLecturerOwnedExams += 1
            count_invigilation = 0
            count_total_invigilation = Schedule.objects.filter(invigilator=lecturer.pk, type=3).count()
            for schedule in Schedule.objects.filter(invigilator=lecturer.pk, type=3):
                if not schedule.coursegroup.pk in coursGroupIds:
                    count_invigilation += 1

            lect_schedules = Schedule.objects.filter(coursegroup__in=coursGroupIds, type=3)
            overlapping_ids = set()
            for i, schedule1 in enumerate(lect_schedules):
                for j, schedule2 in enumerate(lect_schedules):
                    if i != j and self.is_overlapping(ScheduleSerializer(schedule1).data, ScheduleSerializer(schedule2).data):
                        overlapping_ids.add(schedule1.pk)
                        overlapping_ids.add(schedule2.pk)


            data.append({
                'id': lecturer.user.pk,
                'name': lecturer.user.first_name + ' ' + lecturer.user.last_name,
                'email': lecturer.user.email,
                'courseExam': str(countLecturerOwnedExams) + '/' + str(count_coursegroup),
                'invigilation': str(count_invigilation),
                'total_invigilation': str(count_total_invigilation),
                'status': 4 if overlapping_ids.__len__() > 0 else 0
            })
        return Response(data)
    def is_overlapping(self,schedule1, schedule2):
        # Skip if it's the exact same schedule
        if schedule1['id'] == schedule2['id']:
            return False
            
        # Check if they're on the same day
        same_day = (schedule1['day'] == schedule2['day'])
        
        # Handle date comparison, considering null dates
        if schedule1['date'] is None and schedule2['date'] is None:
            same_date = True
        elif schedule1['date'] is None or schedule2['date'] is None:
            same_date = False
        else:
            same_date = (schedule1['date'] == schedule2['date'])
        
        # Check time overlap
        time_overlap = (schedule1['start'] < schedule2['end'] and schedule1['end'] > schedule2['start'])
        
        return same_day and same_date and time_overlap

class RoomView(APIView):
    authentication_classes = ([TokenAuthentication])
    permission_classes =([IsAuthenticated])
    def post(self,request):
        toReturn = []
        for room in Room.objects.all():
            schedules = Schedule.objects.filter(room=room.pk,type=3)
            num_exm = schedules.count()
            max_std = 0
            for schedule in schedules:
                if max_std<schedule.coursegroup.student_set.count(): # type: ignore
                    max_std = schedule.coursegroup.student_set.count() # type: ignore
            sts = 0
            if num_exm >=77:
                sts = 3
            elif num_exm>=35:
                sts = 2
            elif num_exm>5:
                sts = 1
            toReturn.append(
                {
                    'code':room.code,
                    'num_exms':num_exm,
                    'capacity':room.capacity,
                    'num_std':max_std,
                    'status':sts
                }
            )
        return Response(toReturn,status=status.HTTP_200_OK)
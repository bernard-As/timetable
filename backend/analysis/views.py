from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response 
from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

from apibase.models import Course, Coursegroup, Lecturer, Schedule, Student, Users

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
        schedules = Schedule.objects.filter(type=5,status=True)
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
                if Schedule.objects.filter(coursegroup=coursegroup.pk, type=5).exists():
                    countLecturerOwnedExams += 1
            count_invigilation = 0
            count_total_invigilation = Schedule.objects.filter(invigilator=lecturer.pk, type=5).count()
            for schedule in Schedule.objects.filter(invigilator=lecturer.pk, type=5):
                if not schedule.coursegroup.pk in coursGroupIds:
                    count_invigilation += 1
            data.append({
                'id': lecturer.user.pk,
                'name': lecturer.user.first_name + ' ' + lecturer.user.last_name,
                'email': lecturer.user.email,
                'courseExam': str(countLecturerOwnedExams) + '/' + str(count_coursegroup),
                'invigilation': str(count_invigilation),
                'total_invigilation': str(count_total_invigilation)
            })
        return Response(data)
        
            

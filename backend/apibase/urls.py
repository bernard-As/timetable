from django.conf import settings
from django.urls import path,include
from apibase.viewsfolder.storeRenew import StoreRenew
from rest_framework.routers import DefaultRouter

from apibase.viewsfolder.auths import LoginView, VerifyToken
from apibase.viewsfolder.mainApi import *
from .viewsfolder import siteManagement
from rest_framework.authtoken.views import ObtainAuthToken

"""
 The DefaultRouter supports the following actions:

list: Get a list of objects.
retrieve: Get a specific object by its ID.
create: Create a new object.
update: Update an existing object.
partial_update: Update part of an existing object.
destroy: Delete an existing object.
"""
router = DefaultRouter()
router.register(r'title', siteManagement.TitleViewSet, basename='title')
router.register(r'users', siteManagement.UserViewSet, basename='users')
router.register(r'general', siteManagement.GeneralViewSet, basename='general')
router.register(r'semester', siteManagement.SemesterViewSet, basename='semester')
router.register(r'building', siteManagement.BuildingViewSet, basename='building')
router.register(r'floor', siteManagement.FloorViewSet, basename='floor')
router.register(r'room', siteManagement.RoomViewSet, basename='room')
router.register(r'faculty', siteManagement.FacultyViewSet, basename='faculty')
router.register(r'department', siteManagement.DepartmentViewSet, basename='department')
router.register(r'program', siteManagement.ProgramViewSet, basename='program')
router.register(r'coursesemester', siteManagement.CourseSemesterViewSet, basename='coursesemester')
router.register(r'lecturer', siteManagement.LecturerViewSet, basename='lecturer')
router.register(r'student', siteManagement.StudentViewSet, basename='student')
router.register(r'other_staff', siteManagement.OtherStaffViewSet, basename='other_staff')
router.register(r'course', siteManagement.CourseViewSet, basename='course')
router.register(r'activitytype', siteManagement.ActivityTypeViewSet, basename='activitytype')
router.register(r'coursegroup', siteManagement.CourseGroupViewSet, basename='coursegroup')
router.register(r'preference', siteManagement.PreferenceViewSet, basename='preference')
router.register(r'eventtime', siteManagement.EventTimeViewSet, basename='eventtime')
router.register(r'schedule', siteManagement.ScheduleViewSet, basename='schedule')
router.register(r'scheduletype', siteManagement.ScheduleTypeViewSet, basename='schedule type')
router.register(r'system_news', SystemNewsView, basename='system News')
router.register(r'assistant', siteManagement.AssistantView, basename='Assistant')
urlpatterns = [
    path('login/', LoginView.as_view()),
    path('renewStore/',StoreRenew.as_view(), name='renewStore'),
    path('verify_token',VerifyToken.as_view(),name='verify_token'),
    path('', include(router.urls)),
    path('GP/',siteManagement.UserGroupPermission.getGP, name='User Groups and permissions user based'),
    path('AllGP/',siteManagement.UserGroupPermission.get_groups_and_permissions, name='All User Group'),
    path('student_list/',siteManagement.StudentViewSet.get_short_list, name='Student select list'),
    # path('assistant/',siteManagement.AssistantView.as_view(), name='Assistant View'),
    path('view_schedule/',ViewSchedule.as_view(), name='Schedule view View'),
    path('my_schedule/',MySchedule.as_view(), name='Schedule view View'),
    path('upcoming-schedule/',UpcomingScheduleView.as_view(), name='Upcoming Schedule View'),
    path('free_model/',FreeModel.as_view(), name='Free model')
    # path('start/',start_main,name='main')
]

# urlpatterns = format_suffix_patterns(urlpatterns)
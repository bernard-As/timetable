from django.conf import settings
from django.urls import path,include
from apibase.viewsfolder.storeRenew import StoreRenew
from rest_framework.routers import DefaultRouter

from apibase.viewsfolder.auths import LoginView, VerifyToken
from rest_framework.authtoken.views import ObtainAuthToken

from analysis.views import *

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
urlpatterns = [
    path('default/', DefaultView.as_view()),
    path('lecturer/', LecturerView.as_view()),
    path('room/', RoomView.as_view()),
]

# urlpatterns = format_suffix_patterns(urlpatterns)
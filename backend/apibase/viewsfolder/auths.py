# views.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
# from knox.auth import AuthToken
from rest_framework.authtoken.views import ObtainAuthToken
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from apibase.serializers import LoginSerializer
from apibase.models import Users
from rest_framework.authtoken.models import Token

class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        # Get the username or email and password from the request
        username_or_email = request.data.get('username')
        password = request.data.get('password')
        
        # Try to authenticate by username or email
        user = authenticate(request, username=username_or_email, password=password)
        
        if user is None:
            try:
                # If not authenticated by username, try authenticating by email
                user_obj = Users.objects.get(email=username_or_email)
                user = authenticate(request, username=user_obj.username, password=password)
            except Users.DoesNotExist:
                pass  # No user found with this email

        # If still no user, return an error response
        if user is None:
            return Response({'error': 'Invalid credentials'}, status=400)
        
        # If authenticated, generate or retrieve the token
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email,
            'username': user.username
        })
    

class VerifyToken(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = ([IsAuthenticated]) 
    def post(self,request):
        cred = Users.objects.get(user=request.user.id).credential

        return Response({'message':'success','credential':cred},200)
    

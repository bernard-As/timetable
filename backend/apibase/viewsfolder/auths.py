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

class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        if (request.data['password'] == ''):
            request.data['password']= 'timetable'
        
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
    
            user = authenticate(request, email=email, password=password)
    
            if user:
                # User is valid, generate token using DRF method
                obtain_auth_token = ObtainAuthToken()
                token_response = obtain_auth_token.post(request)
                token = token_response.data['token']
    
                return Response({'token': token, 'group':user.groups.all()})
            else:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class VerifyToken(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = ([IsAuthenticated]) 
    def post(self,request):
        cred = Users.objects.get(user=request.user.id).credential

        return Response({'message':'success','credential':cred},200)
    

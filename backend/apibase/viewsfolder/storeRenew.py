from django.http import JsonResponse
from apibase.models import Title, Users
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
# from knox.auth import TokenAuthentication
from rest_framework.response import Response

from apibase.serializers import TitleSerializer


@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])

class StoreRenew(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self,request):
        user = request.user
        user_group = user.groups.all()
        
        if('other_staff' in user_group):
            group = 'other_staff'
        elif('student' in user_group):
            group = 'student'
        elif('assistant' in user_group):
            group = 'assistant'
        elif('lecturer' in user_group):
            group = 'lecturer'
        elif('advisor' in user_group):
            group = 'advisor'
        elif('head_dean' in user_group):
            group = 'head_dean'
        elif('rectorate' in user_group):
            group = 'rectorate'
        elif('site_admin' in user_group):
            group = 'site_admin'
        else: 
            group = 'visitor'
        titles = Title.objects.all()
        title_serializer = TitleSerializer(titles, many=True)
        return Response(
            {
                'group': group,
                'titles': title_serializer.data
            },
            200
        )
        


            
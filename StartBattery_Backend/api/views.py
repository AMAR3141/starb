from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import Warrent_Claim_Serializer,UserSerializer
from .models import warrenty_claims,User
from rest_framework.decorators import api_view
from django.http import JsonResponse
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import ListAPIView,RetrieveAPIView
from django.contrib.auth.hashers import make_password,check_password
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
import jwt,datetime
import json

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView



# Create your views here.


        


class Warrenty_Claim(ListAPIView):
    
    queryset=warrenty_claims.objects.all()
    serializer_class=Warrent_Claim_Serializer
    paginator_class=PageNumberPagination 

    # def get_queryset(self):
    #     return Response(self.serializer_class(self.queryset,many=True))
    
    # def get(self,reqeust):
        
    #     serialized_data=Warrent_Claim_Serializer(self.queryset,many=True)
        
    #     return Response(serialized_data.data)
    

@api_view(['GET'])
def get_Count_Register(request):

    response=warrenty_claims.objects.all()
    serialized_data=Warrent_Claim_Serializer(response,many=True)
    pending_count=0
    approved_count=0

    for i in range(0,len(response)):
        print(response[i].Status)
        if response[i].Status=='Approved':
            approved_count+=1
        elif response[i].Status=='Pending':
            pending_count+=1

    
    

        
    return JsonResponse({'pending_count':pending_count,'approved_count':approved_count})




class Shop_Users(APIView):

    # queryset=User.objects.all()
    # serializer_class=UserSerializer

    def get(self,request):

        id=self.request.query_params.get('id')
        queryset=User.objects.filter(is_staff=False)
        
        user_serializer=UserSerializer(queryset,many=True)
                            
        if id is not None:
            
            queryset=User.objects.get(id=id)
            
            user_serializer=UserSerializer(queryset,many=False)
            
        
        return Response(user_serializer.data)
    
    def post(self,request):
        data=request.data
        queryset=User.objects.all()

        print(data['file'])
        if queryset.filter(username=data['Username']): 
            Status='UserName Already Exits'
        elif queryset.filter(email=data['Email']):
            Status='Email Already Exits'
        elif queryset.filter(Phone=data['Phone']):
            Status='Phone Number Already Exits'
        else:
            hash_password=make_password(data['Password'])
            response=User.objects.create(username=data['Username'],email=data['Email'],first_name=data['Name'],last_name=data['Surname'],password=hash_password,image=data['file'],Address=data['Address'],Phone=data['Phone'])

                    
            if response:
                Status=status.HTTP_201_CREATED
            else:
                Status=status.HTTP_500_INTERNAL_SERVER_ERROR    
        # except:
        #     status='Eror while submiting'
        
        return Response(Status)
    
    # @api_view(['POST'])
    def delete(self,request):
        id=request.GET['id']
        # id=('id')
        data=User.objects.get(id=id)
        data.delete()
        if data:
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_304_NOT_MODIFIED)
            

                    

    


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['email'] = user.email


        # ...

        return token
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class logOut(APIView):

    def post(self,request):
        response=Response()
        response.delete_cookie('jwt')

        response.data={
            'msg':'success'
        }
        return response
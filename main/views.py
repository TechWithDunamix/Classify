# from adrf.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSignupSerializer,UserLoginSerializer
from rest_framework.authtoken.models import Token
from .auth_check import CheckAuth
class UserSignUpView(generics.GenericAPIView):
    serializer_class = UserSignupSerializer

    def get_serializer_class(self):
        return UserSignupSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer_class()(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()

            token, _ = Token.objects.get_or_create(user=user)

            response = serializer.data
            response['token'] = token.key
            
            return Response(response, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer

    def post(self,request,*args,**kwargs):
        serializer  = self.get_serializer_class()(data = request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get("email")
            password = serializer.validated_data.get("password")
            auth = CheckAuth()
            user = auth.authenticate(email= email,password=password)
            if not user:
                return Response({
                    "detail":"Invalid authentication credentials"
                    },
                    status=status.HTTP_400_BAD_REQUEST)
            token,_ = Token.objects.get_or_create(user = user)
            return Response({
                "token":token.key,
                "email":user.email
                })
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
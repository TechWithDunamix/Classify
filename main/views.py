# from adrf.views import APIView
from . import constants
from django.http import JsonResponse
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from django.utils import crypto,timezone
from django.db.models import Q
from .serializers import (UserSignupSerializer,UserLoginSerializer,
                        UserProfileViewSerializer,ClassSerializer,
                        TopicSerializer,
                        AssignmentSerializer,TopicUpdateSerializer,
                        WorkSubmitionSerializer)
from rest_framework.authtoken.models import Token
from .auth_check import CheckAuth
from .models import User,Class,MemberShip,Assignment,ClassWork,Topic,TopicUpdate,WorkSubmitions
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.contrib.contenttypes.models import ContentType
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
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



class UserProfileView(generics.GenericAPIView):
    serializer_class = UserProfileViewSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return self.request.user
    
    def get(self,request,*args,**kwargs):
        serializer = self.get_serializer_class()(
            self.get_queryset(),
            context = {"request":request}
            )
        return Response(serializer.data)

    def put(self,request,*args, **kwargs):

        serializer = self.get_serializer_class()(
            data = request.data,
            instance = request.user,
            context = {"request":request}
            )
        if serializer.is_valid():
            serializer.update(serializer.validated_data,request.user)
            return Response(serializer.data)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class ClassView(generics.GenericAPIView):
    serializer_class = ClassSerializer
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]
    def get_queryset(self):

        user_class = Class.objects.filter(owner=self.request.user).all()
        return user_class
    def get(self,request,id = None,*args, **kwargs):
        
        serializer = self.get_serializer_class()(
            self.get_queryset(),
            many =True,
            context = {
                'request':request,
                'id':id
            })
        if id:
            obj = get_object_or_404(self.get_queryset(),id = id)
            serializer = self.get_serializer_class()(
            obj,
            # many =True,
            context = {
                'request':request,
                'id':id
            })
        return Response(serializer.data)
    def post(self,request,*args,**kwargs):
        serializer = self.get_serializer_class()(
            data = request.data,
            context = {
                "owner":request.user
            }
            )
        if serializer.is_valid():
            serializer.save(owner = request.user)

            response = serializer.data 
            return Response(response)

        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def put(self,request,id = None,*args,**kwargs):
        obj = get_object_or_404(Class,id = id)
        serializer = self.get_serializer_class()(
            data = request.data,
            instance=obj,
            context = {
                "request":request
            }
        )
        if serializer.is_valid():
            serializer.update(instance=obj,validated_data=serializer.validated_data)
            return Response(serializer.data)

        return Response(serializer.data)

class StudentClassView(generics.GenericAPIView):
    serializer_class = ClassSerializer
    permission_classes = [IsAuthenticated]
    def post(self,request,class_id = None,*args, **kwargs):
        _class = get_object_or_404(Class,id = class_id)
        member,created = MemberShip.objects.get_or_create(user = request.user,_class=_class)
        response = {
            "detail":"user already in group",
            "code":constants.ALREADY_EXISTS
        }

        if created:
            _class.members.add(member)
            response = {
            "detail":"user added to group",
            "code":constants.ADDED_SUCCESFULLY
                        }
        

        return Response(response)

    def delete(self,request,class_id,*args,**kwargs):
        _class = get_object_or_404(Class,id = class_id)
        member = get_object_or_404(MemberShip,user = request.user,_class = _class)
        member.delete()
        response = {
            "detail":"user removed",
            "code":constants.REMOVED_SUCCESFULLY
        }
        return Response(response)
        

class TeacherAssignmentView(generics.GenericAPIView):
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Class.objects.filter(owner=self.request.user).all()
    
    def get_object(self):
        class_id = self.kwargs['class_id']
        _class = get_object_or_404(self.get_queryset(),id = class_id)
        if _class.owner != self.request.user:
            return Response({
                "detail":"You have no permission top perform such actions"
                },
                status=status.HTTP_403_FORBIDDEN)
        return _class
    def get_asm_qs(self):
        query = Q(classwork___class = self.get_object)
        print(query)
        draft = self.request.GET.get("draft",False)
        if draft == "0":
            draft = False
        elif draft == "1":
            draft = True
        else:
            draft = False
        qs = self.get_object().assignments.filter(draft = draft).all()
        return qs
    def get(self,request,class_id = None,*args,**kwargs):
        obj = self.get_asm_qs()
        context = {
            "request":request
        }
        serializer = self.get_serializer_class()(obj,many = True,context = context)
        return Response(serializer.data)

    def post(self,request,class_id,*args,**kwargs):
        _class = self.get_object()
        print(_class)
        context = {
            "request":request
        }
        serializer = self.get_serializer_class()(data = request.data,context = context)
        if serializer.is_valid():
            
            content_type = ContentType.objects.get_for_model(Assignment)

            class_work = ClassWork.objects.create(
            _class = _class,
            title = serializer.validated_data.get("title"),
            content_type=content_type,
            object_id = crypto.get_random_string(6),
            date_due = serializer.validated_data.get("date_due"),
            classwork_type=serializer.validated_data.get("classwork_type"),
            mark=serializer.validated_data.get("mark")
            )
            asm  = Assignment.objects.create(
                title=serializer.validated_data.get("title"),
                question = serializer.validated_data.get("question"),
                classwork = class_work,
                _class = _class,
                options = serializer.validated_data.get("options"),
                draft=serializer.validated_data.get("draft")
            )
            return Response(serializer.data)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class TopicView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TopicSerializer
    def get_class_queryset(self):
        return Class.objects.filter(owner=self.request.user) 
    def get(self,request,*args,**kwargs):
        class_id = request.GET.get("class_id",None)
        if not class_id:
            return Response({
                "error":True,
                "detail" : "provide class id as a get param i.e url/endpoint?class_id={class_id}"
            },
            status=status.HTTP_400_BAD_REQUEST)
        _class = get_object_or_404(self.get_class_queryset(),id = class_id)
        qs = Topic.objects.filter(_class=_class).all()
        serializer = self.get_serializer_class()(instance=qs,many = True)
        return Response(serializer.data)

    def post(self,request,*args,**kwargs):
        serializer = self.get_serializer_class()(data = request.data)
        class_id = request.GET.get("class_id",None)
        if not class_id:
            return Response({
                "error":True,
                "detail" : "provide class id as a get param i.e url/endpoint?class_id={class_id}"
            },
            status=status.HTTP_400_BAD_REQUEST)
        if serializer.is_valid():
            _class = get_object_or_404(self.get_class_queryset(),id = class_id)
            topic = Topic.objects.create(
                title=serializer.validated_data.get("title"),
                _class=_class
            )
            return Response(
                serializer.data,
                status = status.HTTP_201_CREATED)
            
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    def delete(self,request,topic_id = None,*args, **kwargs):
        class_id = request.GET.get("class_id",None)
        if not class_id:
            return Response({
                "error":True,
                "detail" : "provide class id as a get param i.e url/endpoint?class_id={class_id}"
            },
            status=status.HTTP_400_BAD_REQUEST)
        _class = self.get_class_queryset().get(id = class_id)
        topic_qs = Topic.objects.filter(_class=_class)
        obj =  get_object_or_404(topic_qs,id = topic_id)
        obj.delete()
        return Response(
            {
                "succes":True,
                "detail":"delete success"
            }
        )
    def put(self,request,topic_id = None,*args, **kwargs):
        class_id = request.GET.get("class_id",None)
        if not class_id:
            return Response({
                "error":True,
                "detail" : "provide class id as a get param i.e url/endpoint?class_id={class_id}"
            },
            status=status.HTTP_400_BAD_REQUEST)
        _class = self.get_class_queryset().get(id = class_id)
        topic_qs = Topic.objects.filter(_class=_class)
        obj =  get_object_or_404(topic_qs,id = topic_id)
        serializer = self.get_serializer_class()(data=request.data)
        if serializer.is_valid():
            obj.title = serializer.validated_data.get("title",obj.title)
            obj.save()

            return Response(
                {
                    "succes":True,
                    "detail":"update success"
                }
            )
        return Response(
            serializer.data,
            status=status.HTTP_400_BAD_REQUEST
        )


class TopicUpdateView(generics.GenericAPIView):
    serializer_class = TopicUpdateSerializer
    permission_classes = [IsAuthenticated]    

    def get_class_queryset(self):
        return Class.objects.filter(owner=self.request.user).all()
    def get_topic_queryset(self):
        return Topic.objects.filter(_class__owner = self.request.user)
    def get_topic_updates_queryset(self):
        return TopicUpdate.objects.filter(_class__owner = self.request.user)
    def get(self,request,topic_id = None,*args,**kwargs):
        topic = get_object_or_404(self.get_topic_queryset(),id = topic_id)
        qs = TopicUpdate.objects.filter(topic = topic)
        serializer = self.get_serializer_class()(instance=qs,many = True)
        return Response(serializer.data)
    def post(self,request,topic_id = None ,*args, **kget_topic_update_querysetwargs):
        topic = get_object_or_404(self.get_topic_queryset(),id = topic_id)
        serializer =self.get_serializer_class()(data = request.data)
        if serializer.is_valid():
            updates = TopicUpdate.objects.create(
            _class = topic._class,
            topic = topic,
            title=serializer.validated_data.get("title"),
            content=serializer.validated_data.get("content")

            )
            return Response({
                "success":True,
                "detail":"Topic updated added succesfully"
            })
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    def put(self,request,update_id = None,*args, **kwargs):
        obj = get_object_or_404(
            self.get_topic_updates_queryset(),
            id = update_id
        )
        serializer = self.get_serializer_class()(data=request.data,instance=obj) 
        if serializer.is_valid():
            obj.title = serializer.validated_data.get("title",obj.title)
            obj.content = serializer.validated_data.get("content",obj.content)
            obj.save()
            return Response(serializer.data)
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    def delete(self,request,update_id = None,*args, **kwargs):
        obj = get_object_or_404(
            self.get_topic_updates_queryset(),
            id = update_id
        )
        obj.delete()
        return Response(
            {
                "success":True,
                "detail":"Deleted successfully"
            }
        )

class WorkSubmitionView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = WorkSubmitionSerializer

    def get_class_qs(self):
        class_id = self.request.GET.get("class_id")

        _class = get_object_or_404(Class,id = class_id)
        _class_check = MemberShip.objects.filter(
            _class = _class,
            user = self.request.user).exists()
        if not _class:
            return None
        return _class 
    def get(self,request,*args,**kwargs):
        class_id = request.GET.get("class_id")
        if not class_id:
            return Response(
                {
                    "detail":"Add class id a get param"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        _class = self.get_class_qs()
        if not _class:
            return Response(
                {
                    "detail":"User not allowed to submit this assignmeny"
                },
                status=status.HTTP_403_FORBIDDEN
            )
        submitions  = WorkSubmitions.objects.filter(
            _class = _class,
            user = request.user
        ).all()
        serializer = WorkSubmitionSerializer(submitions,many = True)
        return Response(serializer.data)
        

    def post(self,request,assignment_id = None,*args,**kwargs):
        class_id = request.GET.get("class_id")

        if not class_id:
            return Response({
                "error":True,
                "detail":"Provide a class_id as a get param"
            },status=status.HTTP_400_BAD_REQUEST)
        _class = self.get_class_qs()
        if not _class:
            return Response(
                {
                    "detail":"User not allowed to submit this assignment"
                },
                status=status.HTTP_403_FORBIDDEN
            )
        serializer = self.get_serializer_class()(data =request.data)        
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        assignment = get_object_or_404(
            self.get_class_qs().assignments.filter(draft = False).all(),
            id = assignment_id
            )
        check_work = WorkSubmitions.objects.filter(
            user = request.user,assignment = assignment
            
        )
        if check_work.exists():
            return Response({
                "error" : "User already submited assignment"
                
                },status=status.HTTP_400_BAD_REQUEST)
        work = WorkSubmitions.objects.create(
            user=request.user,
            _class=self.get_class_qs(),
            answer=serializer.data.get("answer"),
            assignment = assignment
        )
        serializer.data.setdefault("code",assignment.code)
        print(serializer.data)
        return Response(
            serializer.data
        )
        
        

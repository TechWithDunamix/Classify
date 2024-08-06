# from adrf.views import APIView
from . import constants
from django.http import HttpResponseBadRequest
from django.http import JsonResponse
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from django.utils import crypto,timezone
from django.db.models import Q
from .serializers import (UserSignupSerializer,UserLoginSerializer,
                        UserProfileViewSerializer,ClassSerializer,
                        TopicSerializer,CommentSerializer,GradingSerializer,
                        AssignmentSerializer,TopicUpdateSerializer,ClassFilesSerializer,
                        WorkSubmitionSerializer,WorkMarkSerializer,ChatSerializer,AnnouncementSerializer,
                        MemberSerializer)
from rest_framework.authtoken.models import Token
from .auth_check import CheckAuth
from .models import User,Class,MemberShip,Assignment,ClassWork,Topic,TopicUpdate,WorkSubmitions,ClassChat,Anouncement,ClassFiles,Comment
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404,get_list_or_404
from django.contrib.contenttypes.models import ContentType
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import faker
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
                "owner":request.user,
                "request":request
            }
            )
        if serializer.is_valid():
            serializer.save(owner = request.user)

            response = serializer.data 
            return Response(response)

        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def put(self,request,id = None,*args,**kwargs):
        obj = get_object_or_404(self.get_queryset(),id = id)
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

    def get(self,request,*args, **kwargs):
        qs = Class.objects.filter(members__user = request.user)
        serializer = self.get_serializer_class()(qs,many = True,context = {
            "request":request
        })
        return Response(serializer.data)
    def post(self,request,class_id = None,*args, **kwargs):

        _class = get_object_or_404(Class,class_code = class_id)
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
        _class = get_object_or_404(Class,class_code = class_id)
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
            print(serializer.validated_data)
            asm  = Assignment.objects.create(
                title=serializer.validated_data.get("title"),
                question = serializer.validated_data.get("question"),
                classwork = class_work,
                _class = _class,
                _files = serializer.validated_data.get("_files"),
                options = serializer.validated_data.get("options"),
                draft=serializer.validated_data.get("draft")
            )
            return Response(serializer.data)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class StudentAssignmentView(generics.GenericAPIView):
    serializer_class =  AssignmentSerializer
    permission_classes = [IsAuthenticated]

    def get(self,request,*args, **kwargs):
        class_id = request.GET.get("class_id")
        if not class_id:
            return Response("Provide the class id",status=status.HTTP_400_BAD_REQUEST)
        classes = Class.objects.filter(members__user = request.user)
        obj = get_object_or_404(classes,id = class_id)
        qs = obj.assignments.all()
        context = {
            "request":request
        }
        serializer = self.get_serializer_class()(qs,many = True ,context = context)
        return Response(serializer.data)
        


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
        query = Q(owner=self.request.user) | Q(members__user=self.request.user)
        qs = Class.objects.filter(query)
        _class = get_object_or_404(qs,id = class_id)
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
        query = Q(_class__owner = self.request.user) | Q(_class__members__user=self.request.user)
        return Topic.objects.filter(query)
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
        
        
class WorkMarkView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = WorkMarkSerializer
    def get_cls_qs(self):
        
        _qs = WorkSubmitions.objects.filter(
            _class__owner = self.request.user 
        ).order_by("-marked")
        return _qs
    def get(self,request,*args, **kwargs):
        class_id = request.GET.get("class_id")
        qs = self.get_cls_qs()
        serializer = self.get_serializer_class()(
            qs,
            many = True,
            )
        if class_id:
            qs = get_list_or_404(self.get_cls_qs(),_class__id = class_id)
            serializer = self.get_serializer_class()(
                qs,many = True,
                context = {
                "request":request
            }
            )
            

        return Response(
            serializer.data
        )
    def put(self,request,assignment_id = None,*args, **kwargs):
        _qs = self.get_cls_qs()
        print(_qs)
        obj = get_object_or_404(self.get_cls_qs(),id = assignment_id)
        serializer = self.get_serializer_class()(
            data = request.data,
            instance = obj ,
            context = {
                "request":request
            }
        )
       

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        obj.score = serializer.validated_data.get("score",obj.score)
        obj.comment = serializer.validated_data.get("comment",obj.comment)
        obj.marked = True
        obj.save()
        return Response(
            serializer.data
        )

class ChatClassView(generics.GenericAPIView):
    serializer_class = ChatSerializer 
    permission_classes = [IsAuthenticated]

    def get(self,request,class_id = None,*args, **kwargs):
        obj = get_object_or_404(Class,id = class_id)
        qs = ClassChat.objects.filter(_class = obj)
        serializer = self.get_serializer_class()(qs,many = True)
        return Response(
            serializer.data
        )
    def delete(self,request,class_id = None,id = None,*args,**kwargs):
        qs = get_object_or_404(Class,id = class_id)
        obj = get_object_or_404(qs.class_message.all(),id = id)
        obj.delete()
        return Response("Deleted successfully")
        



class AnnouncementView(generics.GenericAPIView):
    serializer_class = AnnouncementSerializer
    permission_classes = [IsAuthenticated]
    def get_cls_qs(self):
        user = self.request.user
        _class = Class.objects.filter(owner = user) 
        return _class
    def get(self,request,*args, **kwargs):
        if not request.GET.get("class_id"):
            return Response({
                "message":"include class id as a get pearam"
            },status=status.HTTP_400_BAD_REQUEST)
        query = Q(members__user=request.user) | Q(owner = request.user)
        _obj = Class.objects.filter(query)

        obj = get_object_or_404(_obj,id = request.GET.get("class_id"))
        qs = Anouncement.objects.filter(_class = obj)
        serializer = self.get_serializer_class()(qs,many = True)
        return Response(serializer.data)
    def post(self,request,*args, **kwargs):
        if not request.GET.get("class_id"):
            return Response({
                "message":"include class id as a get pearam"
            },status=status.HTTP_400_BAD_REQUEST)
        _obj = self.get_cls_qs()
        obj = get_object_or_404(_obj,id = request.GET.get("class_id"))
        serializer = self.get_serializer_class()(data = request.data)
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST)
        Anouncement.objects.create(
            _class = obj,
            detail = serializer.validated_data.get("detail")
        )
        return Response(serializer.data)

    def put(self,request,id = None,*args, **kwargs):
        if not request.GET.get("class_id"):
            return Response({
                "message":"include class id as a get pearam"
            },status=status.HTTP_400_BAD_REQUEST)
        _obj = self.get_cls_qs()
        obj = get_object_or_404(_obj,id = request.GET.get("class_id"))
        serializer = self.get_serializer_class()(data = request.data)
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST)
        announcement = get_object_or_404(Anouncement,_class__owner = request.user,id = id)
        announcement.detail = serializer.validated_data.get("detail",announcement.detail)
        announcement.save()
        print(announcement)
        return Response(serializer.data)
    
    def delete(self,request,id = None,*args, **kwargs):
        if not request.GET.get("class_id"):
            return Response({
                "message":"include class id as a get pearam"
            },status=status.HTTP_400_BAD_REQUEST)
        _obj = self.get_cls_qs()
        obj = get_object_or_404(_obj,id = request.GET.get("class_id"))
        
        announcement = get_object_or_404(Anouncement,_class__owner = request.user,id = id)
        announcement.delete()
        print(announcement)
        return Response({"detail":"deleted"})
    
class ClassFileView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ClassFilesSerializer 
    def get(self,request,file_id = None,*args, **kwargs):
        class_id = request.GET.get("class_id")
        if not class_id:
            return Response(
                {
                    "detail":"Provide class id as a get param"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer_class()(data = request.data)
        
        _class = get_object_or_404(Class,id = class_id)
        query = Q(_class = _class) | Q(user = request.user)
        qs = ClassFiles.objects.filter(query).order_by("-date_created")
        serializer = self.get_serializer_class()(qs,many = True,context = {
            "request":request
        })
        print(file_id)
        if file_id:
            obj = get_object_or_404(qs,id = file_id)
            serializer = self.get_serializer_class()(obj,context = {
                "request":request
            })
        return Response(serializer.data)
        
    def post(self,request,*args, **kwargs):
       class_id = request.GET.get("class_id")
       query = Q(members__user = request.user) | Q(owner = request.user)
       _class_qs = Class.objects.filter(query)
       try:
           _class = _class_qs.get(id = class_id)
       except Class.DoesNotExist:
           _class = None 

       serializer = self.get_serializer_class()(data = request.data)
       if not serializer.is_valid():
           return Response(serializer.errors,status=400)
       fake = faker.Faker()
       name = serializer.validated_data.get("name",fake.file_name())
       ClassFiles.objects.create(
           _file = request.FILES.get("_file"),
           user = request.user,
           name = name,
           _class = _class
       )
       return Response("success")

    
    def delete(self,request,file_id = None,*args, **kwargs):
        class_id = request.GET.get("class_id")
        if not class_id:
            return Response(
                {
                    "detail":"Provide class id as a get param"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

     
        _class = get_object_or_404(Class,id = class_id)

        qs = ClassFiles.objects.filter(_class = _class).order_by("-date_created")
        obj = get_object_or_404(qs,id = file_id)
        obj.delete()
        return Response("delete successfull")
        

class CommentView(generics.GenericAPIView):
    serializer_class= CommentSerializer
    permission_classes = [IsAuthenticated]
    def get_class_qs(self):
        user = self.request.user 
        query = Q(owner = user) | Q(members__user = user)
        class_qs = Class.objects.filter(query)
        return class_qs
    def dispatch(self, request, *args, **kwargs):
        if not request.GET.get("class_id"):
            return HttpResponseBadRequest({
                "message" : "Provide class_id as get pram"
            })
        return super().dispatch(request, *args, **kwargs)
    
    def get(self,request,id,*args,**kwargs):
        class_qs = self.get_class_qs()
        class_id =request.GET.get("class_id")
        _class = get_object_or_404(class_qs,id = class_id)
        obj = get_object_or_404(_class.announcments.all(),id = id)
        qs = obj.announcment_comment.all()
        serializer = self.get_serializer_class()(qs,many =True)
        return Response(serializer.data,status = 200)
    def post(self,request,id = None,*args, **kwargs):
        class_qs = self.get_class_qs()
        class_id =request.GET.get("class_id")
        _class = get_object_or_404(class_qs,id = class_id)

        anouncment = get_object_or_404(_class.announcments.all(),id = id)
        serializer = self.get_serializer_class()(data = request.data)
        if not serializer.is_valid():
            return Response(serializer.errors,status=400)
        Comment.objects.create(
            content = serializer.validated_data['content'],
            anouncement = anouncment,
            user = request.user,
            _class = _class
        )
        return Response(serializer.data)


class TeacherGradingView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = GradingSerializer
    def dispatch(self, request, *args, **kwargs):
        if not request.GET.get("class_id"):
            return HttpResponseBadRequest("Provide class_id as a get_param")
        return super().dispatch(request, *args, **kwargs)
    def get_cls_qs(self):
        return Class.objects.filter(owner = self.request.user)
    def get(self,request,*args, **kwargs):
        _class_qs = self.get_cls_qs()
        class_id = request.GET.get("class_id")
        obj = get_object_or_404(_class_qs,id = class_id)
        qs = obj.student_grading.all()
        serializer = self.get_serializer_class()(qs,many = True)
        return Response(serializer.data)


class StudentGradingView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = GradingSerializer
    def dispatch(self, request, *args, **kwargs):
        if not request.GET.get("class_id"):
            return HttpResponseBadRequest("Provide class_id as a get_param")
        return super().dispatch(request, *args, **kwargs)
    def get_cls_qs(self):
        return Class.objects.filter(members__user = self.request.user)
    def get(self,request,*args, **kwargs):
        _class_qs = self.get_cls_qs()
        print(_class_qs)
        class_id = request.GET.get("class_id")
        obj = get_object_or_404(_class_qs,id = class_id)
        qs = obj.student_grading.filter(user = request.user)
        serializer = self.get_serializer_class()(qs,many = True)
        return Response(serializer.data)
    
class MembersView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MemberSerializer

    def dispatch(self, request, *args, **kwargs):
        if not request.GET.get("class_id"):
            return HttpResponseBadRequest("Provide class_id as a get_param")
        return super().dispatch(request, *args, **kwargs)
    
    def get_cls_qs(self):
        return Class.objects.filter(owner = self.request.user)
    def get(self,request,*args, **kwargs):
        class_id = request.GET.get("class_id")
        _class_qs = self.get_cls_qs()
        obj = get_object_or_404(_class_qs,id = class_id)
        users = obj.members.all()
        serializer = self.get_serializer_class()(users,many = True) 
        return Response(serializer.data)

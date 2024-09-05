from rest_framework import serializers
from .models import User,Class,ClassSetting,ClassWork,Assignment,Topic,TopicUpdate,WorkSubmitions,ClassChat,Anouncement,ClassFiles,Comment,Grading,MemberShip
from django.shortcuts import get_object_or_404
from .validators import file_size_validator
class UserSignupSerializer(serializers.ModelSerializer):
        
    class Meta:
        fields = '__all__'
        model = User 
        
        extra_kwargs = {
            "password":{
                "write_only":True 
            },
            "profile_image":{
                "required":False
            },
            "intro":{
                "required":False 
            },
            "username":{
                "required":False
            },
            "user_id":{
                "required":False
            }
        }

    def create(self,validated_data):
        user = User.objects.create_user(
            email = validated_data.get("email"),
            password = validated_data.get("password"),
            intro = validated_data.get("intro"),
            full_name = validated_data.get("full_name"),
            username = validated_data.get("username"),
            dob = validated_data.get("dob"),
            intrest = validated_data.get("intrest"),
            profile_image = validated_data.get("profile_image"),
        )
        return user




class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

class UserProfileViewSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Make all fields not required
        for field in self.fields.values():
            field.required = False
    image_url = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = '__all__'
        
        extra_kwargs = {
        "password":{
            "write_only":True
        },
        "user_id":{
            "read_only":True 
        },
        "intrest":{
            "read_only":True
        }
    }
    def get_image_url(self,obj):
        request = self.context.get("request")
        if request:
            url = request.build_absolute_uri(obj.profile_image.url)
            return url
        return ''

    def update(self,validated_data,instance):
        # validated_data.pop("email")
        instance.email = validated_data.get("email",instance.email)
        instance.full_name = validated_data.get("full_name",instance.email)
        instance.dob = validated_data.get("dob",instance.dob)
        instance.username = validated_data.get("username",instance.username)
        instance.profile_image = validated_data.get("profile_image",instance.profile_image)
        instance.intro = validated_data.get("intro",instance.intro)
        instance.save()
        return instance
class ClassSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassSetting
        fields = '__all__'

    def to_representation(self,obj):
        data = super().to_representation(obj)
        return data
class MemberSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(read_only = True)
    class Meta:
        model = MemberShip
        fields = "__all__"

    def get_user(self,obj):
        serializer = UserProfileViewSerializer(obj.user,context = self.context)
        return serializer.data

class ClassSerializer(serializers.ModelSerializer):
    setting= serializers.SerializerMethodField()
    cover_image_url = serializers.SerializerMethodField()
    cover = serializers.ImageField(required = False)
    student_can_post = serializers.BooleanField(required=False)
    student_can_comment = serializers.BooleanField(required=False)
    default_grade = serializers.IntegerField(required=False)
    use_code = serializers.BooleanField(required=False)
    members = serializers.SerializerMethodField(read_only = True)


    def __init__(self,*args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.context.get("request").method == "PUT":
            for fields in self.fields.values():
                fields.required = False
        
    class Meta:
        model = Class
        fields = '__all__'

        extra_kwargs = {
            "owner":{
                "read_only":True 
            },
            "required":{
                "read_only":False
            },
            "class_setting":{
                "read_only":True 
            },
            "members":{
                "read_only":True,
                "required":False
            },
            "cover":{
                "required":False
            },
            "class_code":{
                "read_only":True
            },
            "setting":{
                "read_only":True
            }
        }
    def to_representation(self,*args,**kwargs):
        data = super().to_representation(*args,**kwargs)
        check = data['setting']['use_code']
        if not check:
            data['class_code'] = '######'
        return data
    def get_members(self,obj):
        serializer = MemberSerializer(obj.members,many = True,context = self.context)
        return serializer.data
    def get_cover_image_url(self,obj):
        request = self.context.get("request")
        if obj.cover:
            url = request.build_absolute_uri(obj.cover.url)
            return url
        return ''

    def create(self,validated_data):
        setting = ClassSetting.objects.create()
        _class = Class.objects.create(
            setting=setting,
            name = validated_data.get("name"),
            description = validated_data.get("description"),
            category=validated_data.get("category"),
            owner  = self.context.get("owner"),
            cover = self.validated_data.get("cover")
            



        )
        return _class

    def save(self,*args, **kwargs):
        user = kwargs.get("owner")
        instance = super().save(**kwargs)
        instance.owner = user 
        instance.save()
        return instance

    def update(self,instance,validated_data):
        instance.name = validated_data.get("name",instance.name)
        instance.category = validated_data.get("category",instance.category)
        instance.description = validated_data.get("description",instance.description)
        instance.setting.student_can_post = validated_data.get("student_can_post",
                                    instance.setting.student_can_post)

        instance.setting.student_can_comment = validated_data.get("student_can_comment",
                                    instance.setting.student_can_comment)
        
        instance.setting.default_grade = validated_data.get("default_grade",
                                    instance.setting.default_grade)
        
        instance.setting.use_code = validated_data.get("use_code",instance.setting.use_code)


        instance.save()
        instance.setting.save()

        return instance
        


    def get_setting(self,obj):
        many:bool = True
        if self.context.get("id"):
            many= False
        return ClassSettingSerializer(obj.setting).data



class AssignmentSerializer(serializers.ModelSerializer):
    submitions = serializers.SerializerMethodField(required=False,read_only = True)
    date_due = serializers.DateTimeField(required=False,write_only=True)
    date_created = serializers.SerializerMethodField(required=False,read_only =True)
    is_due = serializers.SerializerMethodField(required=False,read_only =True)
    is_submited = serializers.SerializerMethodField(required = False,read_only = True)
    classwork_type = serializers.CharField(write_only=True)
    mark = serializers.IntegerField(write_only=True)
    _date_due = serializers.SerializerMethodField(read_only=True)
    _mark = serializers.SerializerMethodField(read_only=True)
    _files = serializers.JSONField(required = False,default = [])
    draft = serializers.BooleanField(required=True)
    marked = serializers.SerializerMethodField(read_only = False)

    def get_marked(self,obj):
        request = self.context.get("request")
        user = request.user
        qs = WorkSubmitions.objects.filter(assignment = obj)
        
        if not qs.exists():
           return False
        if user == qs.first().user:
            return True
        return False
    def get_submitions(self,obj):
        req = self.context.get("request")
        if req.method == "POST":
            return ""
        if obj._class.owner == req.user:
            qs = WorkSubmitions.objects.filter(assignment = obj)
            submitions = WorkMarkSerializer(qs,many = True,context= self.context)
            return submitions.data
        user_qs = WorkSubmitions.objects.filter(assignment = obj,user = req.user).first()
        if not user_qs:
            return None
        if user_qs.user == req.user:
            submition = WorkMarkSerializer(user_qs,context= self.context)
            return submition.data

        if not user_qs.user == req.user:    
            return submitions.data
        return None
        
    def date_created(self,obj):
        return obj.date_created
    def get_is_submited(self,obj):
        req = self.context.get("request")
        if req.method == 'POST':
            return ''
        qs = obj.is_submited.filter(user = req.user)
        return qs.exists()

    def get_is_due(self,obj):
        if self.context.get("request").method == "POST":
            return ""    
        return obj.is_due
    def get__date_due(self,obj):
        request = self.context.get("request")
        print(self.context)
        if request.method == 'POST':
            return ''
        return obj.classwork.date_due
    
    def get__mark(self,obj):
        request = self.context.get("request")

        if request.method == 'POST':
            return ''
        return obj.classwork.mark
    class Meta:
        model = Assignment
        fields = ["id",'question','title','options','_files','is_submited',"submitions",'marked',
        'date_due','classwork_type','mark','_mark','_date_due','draft',"date_created","is_due"]

        # if self.context.get("request") == 'GET':
            # fields.append("_mark")
            # fields.append("_date_due")


        extra_kwargs = {
            "options":{
                "required":False 
            },
            "_files":{
                "read_only":True
            },
            "_date_due":{
                "read_only":True 
            },
            "_mark":{
                "read_only":True
            },
            "mark":{
                "required":False
            },
            "draft":{
                "required":True
            },
            "date_due" : {
                "required" :  False
            }
        }

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = [
            'title','date_created','date_updated','id'
        ]

        extra_kwargs = {
            "date_created":{
                "read_only":True 
            },
            "date_updated":{
                "read_only":True
            }
        }

class TopicUpdateSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = TopicUpdate
        fields = [
            "id",
            'title',
            'content',
            'date_created'
        ]

        exta_kwargs = {
            "date_created":{
                "read_only":True
            }
        }


class WorkSubmitionSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ['id','answer','marked','score','date','comment']
        model = WorkSubmitions 
        read_only_fields = ['marked','score','date','comment']

class WorkMarkSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(read_only = True)
    def get_user(self,obj):
        print("obj : ", obj)
        qs = get_object_or_404(User,email = obj.user.email)
    
        return UserProfileViewSerializer(qs,context = self.context).data
    class Meta:
        fields = ['id','answer','marked','score','date','comment','user']
        model = WorkSubmitions 
        # read_only_fields = ['marked','score','date','comment']

        extra_kwargs = {
            "marked":{
                "required":False 
            },
            "score":{
                "required":False
            },

            "answer":{
                "required":False 
            },
            "comment":{
                "required":False 
            },
            "user":{
                "required":False ,
                "read_only":True
            },
            "_comment":{
                "write_only" : True,
                "required" : False
            }
            
        }


    
class ChatSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    deletable = serializers.SerializerMethodField()
    def get_username(self,obj):
        return obj.user.username

    def get_email(self,obj):
        return obj.user.email

    def get_deletable(self,obj):
        request = self.context.get("request")
        check = (obj.user == request.user) or (obj._class.owner == request.user)
        return check
    class Meta:
        model  = ClassChat
        fields = ['content','timestamp','username',"id","email","deletable"]

class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField(read_only = True)
    class Meta:
        model = Comment
        fields = ['date','content',"user_name"]

        extra_kwargs = {
            "user_name":{
                "ready_only":True
            }
        }

    def get_user_name(self,obj):
        try:
            return obj.user_name
        except AttributeError:
            return ""

class AnnouncementSerializer(serializers.ModelSerializer):
    comments = serializers.SerializerMethodField(read_only = True)
    user = UserProfileViewSerializer(read_only = True)
    is_owner = serializers.SerializerMethodField(read_only = True)
    user_is_admin = serializers.SerializerMethodField(read_only = True)
    def get_is_owner(self,obj):
        request  = self.context.get("request")

        if request.method == "GET":
            return obj.user == request.user
        return ""

    def get_user_is_admin(self,obj):
        request  = self.context.get("request")

        if request.method == "GET":
            return request.user == obj._class.owner
        return ""


    def get_comments(self,obj):
        request  = self.context.get("request")

        if request.method == "GET":
            qs = obj.announcment_comment.all()
            serializer = CommentSerializer(qs,many =True)
            return serializer.data
        return ""
    class Meta:
        model = Anouncement
        fields = '__all__'

        extra_kwargs = {
            "_class":{
                "read_only":True
            }
        }

class ClassFilesSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField
    _file = serializers.FileField(validators = [file_size_validator])
    class  Meta:
        model = ClassFiles
        fields = ['id','date_created','_file',"name"]

        extra_kwargs = {
            "name":{
                "required":False
            }
        }

    def get_file_url(self,obj):
        request = self.context.get("request")
        return request.build_absoulte_uri(obj._file)
    


class GradingSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()
    submitions = serializers.SerializerMethodField(read_only = True)
    user = serializers.SerializerMethodField(read_only = True)
    def get_title(self,obj):
        return obj.title
    def get_username(self,obj):
        return obj.username
    class Meta:
        model = Grading
        fields = ['score',"title","username",'submitions',"user","comment","date"]

    def get_submitions(self,obj):
        qs = obj.assignment.assignment_submitions.filter(user = obj.user)
        serializer = WorkSubmitionSerializer(qs,context = self.context,many = True)
        return serializer.data

    
    def get_user(self,obj):
        serializer = UserProfileViewSerializer(obj.user,context = self.context)
        return serializer.data




class TeachersGradingSerializer(serializers.ModelSerializer):
    gradings = serializers.SerializerMethodField(read_only = True)
    user = serializers.SerializerMethodField()
    average = serializers.SerializerMethodField()
    class Meta:
        model = MemberShip
        fields = "__all__"

    def get_gradings(self,obj):
        qs = Grading.objects.filter(user = obj.user,_class = obj._class)
        serializer = GradingSerializer(qs,many = True,context = self.context)
        return serializer.data

    def get_user(self,obj):
        serializer = UserProfileViewSerializer(obj.user,context = self.context)
        return serializer.data
    def get_average(self,obj):
        qs = Grading.objects.filter(user = obj.user,_class = obj._class).all()
        aggregate = [x.score for x in qs]
        len_of_aggregate = len(aggregate)
        if len_of_aggregate < 1:
            len_of_aggregate = 1
        average = sum(aggregate)/len_of_aggregate
        return average



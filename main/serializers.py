from rest_framework import serializers
from .models import User,Class,ClassSetting,ClassWork,Assignment,Topic,TopicUpdate,WorkSubmitions
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
        # instance.
        return instance
class ClassSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassSetting
        fields = '__all__'

    def to_representation(self,obj):
        data = super().to_representation(obj)
        return data


class ClassSerializer(serializers.ModelSerializer):
    setting= serializers.SerializerMethodField()
    cover_image_url = serializers.SerializerMethodField()
  
    class Meta:
        model = Class
        fields = '__all__'

        extra_kwargs = {
            "owner":{
                "read_only":True 
            },
            "class_setting":{
                "read_only":True 
            },
            "members":{
                "read_only":True
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
    def get_cover_image_url(self,obj):
        request = self.context.get("request")
        if obj.cover:
            url = request.build_absolute_uri(obj.cover.url)
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
        instance.cover = validated_data.get("cover",instance.cover)
        instance.category = validated_data.get("category",instance.category)
        instance.description = validated_data.get("description",instance.description)
        instance.setting.student_can_post = validated_data.get("student_can_post",
                                    instance.setting.student_can_post)

        instance.setting.student_can_comment = validated_data.get("student_can_comment",
                                    instance.setting.student_can_comment)
        
        instance.setting.default_grade = validated_data.get("default_grade",
                                    instance.setting.default_grade)

        instance.save()
        instance.setting.save()
        


    def get_setting(self,obj):
        many:bool = True
        if self.context.get("id"):
            many= False
        return ClassSettingSerializer(obj.setting).data



class AssignmentSerializer(serializers.ModelSerializer):
    date_due = serializers.DateTimeField(required=False,write_only=True)
    classwork_type = serializers.CharField(write_only=True)
    mark = serializers.IntegerField(write_only=True)
    # if self.context.get("request").method == 'GET':
    _date_due = serializers.SerializerMethodField(read_only=True)
    _mark = serializers.SerializerMethodField(read_only=True)

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
        fields = ['question','title','options','_files',
        'date_due','classwork_type','mark','_mark','_date_due','draft']

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
        fields = ['answer','marked','score','date','comment']
        model = WorkSubmitions 
        read_only_fields = ['marked','score','date','comment']
    
    
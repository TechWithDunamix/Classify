from typing import Iterable
from django.db import models
from django.contrib.auth.models import AbstractBaseUser,PermissionsMixin,BaseUserManager
import uuid,json 
from django.utils import crypto,timezone
from django.contrib.contenttypes.models import ContentType
from django.db import transaction
from django.contrib.contenttypes.fields import GenericForeignKey
from django.core import exceptions  
import json
class UserManager(BaseUserManager):
    def create_user(self,**fields):
        if not fields.get("email"):
            raise ValueError("Email is a required field")
        if not fields.get("password"):
            raise ValueError("Password is a required field")
        
        if not fields.get("dob"):
            raise ValueError("Date of birth is requied")
        if not fields.get("intrest"):
            raise ValueError("intrest is a required field")
        username = fields.get("username")
        intro = fields.get("intro")
        if not username:
            code = crypto.get_random_string(3,['1','2','3','4','5','6','7','8','9','0'])
            username = f'{fields.get("email").split("@")[0]}_{code}'
        if not intro:
            intro = "Hi There I'm a student , want to be friends"
        user = self.model(
            email = fields.get("email"),
            full_name = fields.get("full_name"),
            username = username,
            intro = intro,
            dob = fields.get("dob"),
            intrest = fields.get("intrest"),
            profile_image = fields.get("profile_image"),
            user_id = crypto.get_random_string(18)

        )
        user.set_password(fields.get("password"))
        user.save()
        return user
class User(AbstractBaseUser,PermissionsMixin):
    objects = UserManager()
    id = models.UUIDField(default=uuid.uuid4,primary_key=True,editable=False,unique=True)
    email = models.EmailField(max_length=254,unique=True)    
    full_name = models.CharField(max_length=50)
    username = models.CharField(max_length=50)
    dob = models.DateField()
    user_id = models.CharField(max_length=90)
    intrest = models.TextField()
    profile_image = models.ImageField(upload_to='profile_images/',blank= True,null = True)
    intro = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    activated = models.BooleanField(default = False)
    profile_type = models.CharField(max_length = 150,default="public")
    notify = models.BooleanField(default=True)
    recieve_email = models.BooleanField(default=True)


    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.username 

    

    def save(self,*args,**kwargs):
        # self.intrest = json.loads(self.intrest)
        if not self.pk:
            self.user_id = crypto.get_random_string(8)
        return super().save(*args,**kwargs)

    @property
    def get_intrests(self):
        return self.intrest
    
    
    


        
class MemberShip(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='membership')
    _class = models.ForeignKey('Class',related_name='class_membership',on_delete=models.CASCADE)
    date_joined= models.DateField(auto_now=True)

class ClassSetting(models.Model):
    student_can_post = models.BooleanField(default=False)
    student_can_comment = models.BooleanField(default=True)
    default_grade = models.IntegerField(default=100)
    use_code = models.BooleanField(default = True)


class Class(models.Model):
    id = models.UUIDField(primary_key=True,editable=False,unique=True,default=uuid.uuid4)
    setting  = models.OneToOneField(ClassSetting, on_delete=models.CASCADE)
    data_created = models.DateField(auto_now_add=True)
    owner = models.ForeignKey(User,related_name='user_class',on_delete=models.CASCADE)
    members = models.ManyToManyField(MemberShip,related_name='members')
    name = models.CharField(max_length=180)
    description = models.TextField()
    category = models.CharField(max_length=90)
    cover = models.ImageField(null = True,blank = True,upload_to = 'class/covers')
    class_code = models.CharField(max_length=12)
    meet_link = models.URLField(null = True,blank = True)
    @property
    def invite_link(self):
        return ''

    def __str__(self):
        return self.name

    def save(self,*args,**kwargs):
        
        super().save(*args, **kwargs)


class ClassWork(models.Model):
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False,unique=True)
    _class = models.ForeignKey(Class,related_name='classworks',on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)
    classwork_type = models.CharField(default='Test',max_length=120)
    mark = models.PositiveIntegerField(default = 100)
    date_due = models.DateTimeField(null=True,default=None)
    title = models.CharField(max_length=240)
    content_type = models.ForeignKey(ContentType,on_delete=models.CASCADE)
    object_id = models.CharField(max_length=8)
    content_object = GenericForeignKey("content_type","object_id")

    def __str__(self):
        return self.title

class ClassFiles(models.Model):
    date_created = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=200)

    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name = 'user_files',null = True)
    _class = models.ForeignKey(Class,related_name='classfiles',on_delete=models.CASCADE,null = True)
    _file = models.FileField(blank=False,null = False,upload_to='class_files')
    
    def save(self,*args, **kwargs):
        self.code = crypto.get_random_string(7)
        return super().save(*args, **kwargs)
class Assignment(models.Model):
    title = models.CharField(max_length=240)
    draft = models.BooleanField(default=False)
    _class = models.ForeignKey(Class,related_name='assignments',on_delete=models.CASCADE,null = True)
    classwork = models.OneToOneField(ClassWork,related_name='assingment',on_delete=models.CASCADE)
    _files = models.JSONField(default = list,null=True)
    question = models.TextField()
    options = models.JSONField(null = True,default = list)
    code = models.CharField(max_length=90)

    @property
    def is_submited(self):
        qs = WorkSubmitions.objects.filter(_class = self._class,assignment = self)
        return qs
    @property
    def date_created(self):
        return self.classwork.date_created

    @property
    def is_due(self):
        if not self.classwork.date_due:
            return False 
        
        return self.classwork.date_due < timezone.now()
    def save(self,*args, **kwargs):
        
        created = self.pk
        obj = self 
        # super().save(*args, **kwargs)
        if not created:
            
                # obj.date_due = date_due
            obj.code = crypto.get_random_string(6)
                # content_type = ContentType.objects.get_for_model(obj)
                
                
                # class_work = ClassWork.objects.create(
                # _class = kwargs.get("_class"),
                # title = obj.title,
                # content_type=content_type,
                # object_id = crypto.get_random_string(6)
                # )

                # obj.classwork = class_work
                # obj.save(updated_fields = ['classwork'])
        return super().save(*args, **kwargs)



class Anouncement(models.Model):
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,unique=True)
    _class = models.ForeignKey(Class,related_name='announcments',on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length = 220)
    user = models.ForeignKey(User,on_delete=models.CASCADE,null = True)
    by_admin = models.BooleanField(default=False)
    detail =models.TextField()
    _type = models.CharField(default = 'stream',max_length=120)

    def save(self,**kwargs) -> None:
        if self._class.owner == self.user:
            self.by_admin = True

        super().save(**kwargs)


    def __str__(self):
        return self._class.name 
    
    
class Comment(models.Model):
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,unique=True)
    _class = models.ForeignKey(Class,related_name='announcments_comments',on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='comments')
    anouncement  = models.ForeignKey(Anouncement, on_delete=models.CASCADE,
                                     related_name='announcment_comment')
    content =models.TextField()
    @property
    def user_name(self):
        return self.user.username
class Topic(models.Model):
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,unique=True)
    _class = models.ForeignKey(Class,related_name='topics',on_delete=models.CASCADE)
    title = models.CharField(max_length=250)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


    class Meta:
        ordering = ["-date_created"]
    
class TopicUpdate(models.Model):
    _class = models.ForeignKey(Class,related_name='topic_update',
            on_delete=models.CASCADE,null=True)
    topic = models.ForeignKey(Topic,related_name='topics',on_delete=models.CASCADE)
    title = models.CharField(max_length=120)
    content = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)


    
class WorkSubmitions(models.Model):
    _class = models.ForeignKey(Class, on_delete=models.CASCADE,related_name='submitions')
    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name = 'class_work_submitions')
    date = models.DateTimeField(auto_now_add=True)
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE,related_name='assignment_submitions')
    score = models.IntegerField(null=True,blank=True,default=None)
    comment = models.TextField(blank=True,default=None,null = True )
    answer = models.TextField()
    marked = models.BooleanField(default=False)

    @property
    def options(self):
        return self.assignment.options
    def clean(self):
        if self.date > self.assignment.classwork.date_due:
            raise exceptions.ValidationError("Due date passed")


class DMChat(models.Model):
    _from = models.ForeignKey(User,related_name='sent_dm',on_delete=models.CASCADE)
    to = models.ForeignKey(User,related_name='recieved_dm',on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    content = models.TextField()


class ClassChat(models.Model):
    user = models.ForeignKey(User,related_name='user_chats',on_delete=models.CASCADE)
    _class = models.ForeignKey(Class,related_name='class_message',on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    content = models.TextField(default = '')
    active = models.BooleanField(default=True)


class Grading(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name = "grading")
    _class = models.ForeignKey(Class, on_delete=models.CASCADE,related_name="student_grading")
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE,related_name = 'grades')
    score = models.IntegerField(default=0)
    date = models.DateTimeField(auto_now_add = True,null = True)
    comment = models.CharField(max_length = 120,null = True)

    @property
    def username(self):
        return self.user.username 
    
    @property
    def title(self):
        return self.assignment.title


class ActivationsCode(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    code = models.TextField()

    def __str__(self):
        return self.code
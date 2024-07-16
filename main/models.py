from django.db import models
from django.contrib.auth.models import AbstractBaseUser,PermissionsMixin,BaseUserManager
import uuid,json 
from django.utils import crypto
class UserManager(BaseUserManager):
    def create_user(self,**fields):
        if not fields.get("email"):
            raise ValueError("Email is a required field")
        if not fields.get("password"):
            raise ValueError("Password is a required field")
        if not fields.get("username"):
            raise ValueError("Username is required field")
        if not fields.get("dob"):
            raise ValueError("Date of birth is requied")
        if not fields.get("intrest"):
            raise ValueError("intrest is a required field")
        user = self.model(
            email = fields.get("email"),
            full_name = fields.get("full_name"),
            username = fields.get("username",fields.get("email").split("@")[0]),
            intro = fields.get("intro","HI am a student, let's study together"),
            dob = fields.get("dob"),
            intrest = fields.get("intrest")

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
    profile_image = models.ImageField(blank= True,null = True)
    intro = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.username 

    def save(self,*args,**kwargs):
        self.intrest = json.dumps(self.intrest)
        self.user_id = crypto.get_random_string(8)
        return super().save(*args,**kwargs)

    @property
    def get_intrests(self):
        return json.loads(self.intrest)

        
    


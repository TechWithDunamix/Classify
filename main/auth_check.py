from django.contrib.auth.backends import ModelBackend
from .models import User
class CheckAuth(ModelBackend):
    def authenticate(self,email = None,password = None):
        try:
            user = User.objects.get(email = email)
        except User.DoesNotExist:
            return None 

        if user.check_password(password):
            return user
        else:
            return None

    def get_user(self,user_id):
        try:
            return User.objects.get(id = user_id)
        except User.DoesNotExist:
            return None
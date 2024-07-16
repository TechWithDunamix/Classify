from django.urls import path 
from .views import UserSignUpView,UserLoginView

urlpatterns = [
     path("auth/signup/",UserSignUpView.as_view()),
     path("auth/login/",UserLoginView.as_view())
]

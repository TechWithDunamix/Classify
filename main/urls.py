from django.urls import path 
from .views import (UserSignUpView,UserLoginView,
UserProfileView,ClassView,StudentClassView,TeacherAssignmentView,TopicView)

urlpatterns = [
     path("auth/signup",UserSignUpView.as_view()),
     path("auth/login",UserLoginView.as_view()),
     path("user/profile",UserProfileView.as_view()),
     path("class",ClassView.as_view()),
     path("class/<uuid:id>",ClassView.as_view()),
     path("class/join/<uuid:class_id>",StudentClassView.as_view()),
     path("class/assignment/<uuid:class_id>",TeacherAssignmentView.as_view()),
     path("topics",TopicView.as_view()),
     path("topics/<uuid:topic_id>",TopicView.as_view())


]

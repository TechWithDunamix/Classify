from django.urls import path 
from .views import (UserSignUpView,UserLoginView,
UserProfileView,ClassView,StudentClassView,TeacherAssignmentView,TopicView,TopicUpdateView,
WorkSubmitionView,WorkMarkView,ChatClassView,AnnouncementView,ClassFileView,StudentAssignmentView,
CommentView,TeacherGradingView,StudentGradingView,MembersView)

urlpatterns = [
     path("auth/signup/",UserSignUpView.as_view()),
     path("auth/login/",UserLoginView.as_view()),
     path("user/profile",UserProfileView.as_view()),
     path("class",ClassView.as_view()),
     path("class/<uuid:id>",ClassView.as_view()),
     path("class/join/<str:class_id>/",StudentClassView.as_view()),
     path("class/assignment/<uuid:class_id>",TeacherAssignmentView.as_view()),
     path("class/assignment/<uuid:class_id>/<int:asm_id>",TeacherAssignmentView.as_view()),

     path("class/students/assignment",StudentAssignmentView.as_view()),

     path("topics",TopicView.as_view()),
     path("topics/<uuid:topic_id>",TopicView.as_view()),
     path("topics/updates/<uuid:topic_id>",TopicUpdateView.as_view()),
     path("topic/updates/<int:update_id>",TopicUpdateView.as_view()),
     path("assignment/submit/<int:assignment_id>",WorkSubmitionView.as_view()),
     path("assignment/submitions",WorkSubmitionView.as_view()),
     path("class/assignments", WorkMarkView.as_view()),
     path("class/assignments/<int:assignment_id>", WorkMarkView.as_view()),
     path("chat_class/<uuid:class_id>",ChatClassView.as_view()),
     path("chat_class/<uuid:class_id>/<int:id>",ChatClassView.as_view()),
     path("class/announcement",AnnouncementView.as_view()),
     path("class/announcement/<uuid:id>",AnnouncementView.as_view()),
     path("class/files",ClassFileView.as_view()),
     path("class/files/<int:file_id>",ClassFileView.as_view()),
     path("comment/<uuid:id>",CommentView.as_view()),
     path("teacher/grading",TeacherGradingView.as_view()),
     path("students/grading",StudentGradingView.as_view()),
     path("class/members",MembersView.as_view()),




     








]

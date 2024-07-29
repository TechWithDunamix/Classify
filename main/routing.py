from .consumers import EmailConsumer
from django.urls import path

ws_paths = [
    path("ws/send_mail",EmailConsumer)
]
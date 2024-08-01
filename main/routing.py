from .consumers import EmailConsumer,ChatClass
from django.urls import path

ws_paths = [
    path("ws/sendaaa",ChatClass),

    # path("ws/send_mail",EmailConsumer),

]
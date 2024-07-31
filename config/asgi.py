"""
ASGI config for config project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import URLRouter,ProtocolTypeRouter
from channels.auth import AuthMiddlewareStack 
from main.routing import ws_paths
from django.urls import path
from main.consumers import EmailConsumer
from channels.routing import ChannelNameRouter
from channels.security.websocket import AllowedHostsOriginValidator
from main.middlewares import TokenAuthMiddleware
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

application = ProtocolTypeRouter(
    {
        "http":get_asgi_application(),
        'websocket':TokenAuthMiddleware(
                URLRouter(
                [
                    path("ws/send_mail",EmailConsumer.as_asgi())
                ] 
                
            )
        )
    }
)


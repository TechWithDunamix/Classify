from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import AnonymousUser
from django.conf import settings
from urllib.parse import parse_qs
from django.db import close_old_connections
@database_sync_to_async
def get_user(token_key):
    try:
        token = Token.objects.get(key=token_key)
        return token.user
    except Token.DoesNotExist:
        return None

class TokenAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        close_old_connections()
        headers = parse_qs(scope['query_string'].decode("utf8"))
        token = headers.get("token",None)
        
        if token:
            
            scope['user'] = await get_user(token[0])
        else:
            scope['user'] = None

        return await super().__call__(scope, receive, send)

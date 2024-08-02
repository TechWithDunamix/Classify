# consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
import json
from .models import Class,ClassChat


class EmailConsumer(AsyncWebsocketConsumer):
    
    async def connect(self):
        print(self.scope['user'])
        await self.channel_layer.group_add(
            "email_channel",
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        
        await self.channel_layer.group_discard(
            "email_channel",
            self.channel_name
        )

    async def send_mail(self, event):
        email = event["email"]
        # Print the email or perform some action
        print(f"Sending email to: {email}")
        # Optionally, send a message back to WebSocket client
        await self.send(text_data=json.dumps({
            "message": f"Email sent to: {email}"
        }))
class ChatClass(AsyncWebsocketConsumer):
    
    @database_sync_to_async
    def get_class_qs(self,class_id):
        try:
            _class = Class.objects.get(id = class_id)
        except Class.DoesNotExist:
            
            return 
        if _class.members.filter(user = self.scope['user']).exists():
            return _class
        return 

    @database_sync_to_async
    def save_message(self,message):
        class_id =  self.class_id 
        _class = Class.objects.get(id = class_id)
        ClassChat.objects.create(
            user = self.scope['user'],
            content = message,
            _class = _class
        )
        test = f" message  '{message}' to {class_id}"
        print(test)
        return 
    async def connect(self):
        self.class_id = self.scope['url_route']['kwargs']['class_id']
        user = self.scope['user']
        _class = await self.get_class_qs(self.class_id)

        if not _class:
            await self.close()
        await self.channel_layer.group_add(
            self.class_id,
            self.channel_name
        )
       
        await self.accept()
        await self.send(text_data = json.dumps({
            "message":f"Welcome to classify {self.scope['user'].username}"
        }))


    async def disconnect(self, close_code):
        
        await self.channel_layer.group_discard(
            "email_channel",
            self.channel_name
        )
    async def receive(self, text_data):
        print("Received message:")
        data = json.loads(text_data)
        
        await self.channel_layer.group_send(
            self.class_id,
            {
                'type': 'send_message',
                'message': data['text']
            }
        )
        operation = await self.save_message(data['text'])
    async def send_message(self, event):
       
        await self.send(text_data=json.dumps({
            "message": event['message']
        }))
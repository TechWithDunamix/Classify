# consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
import json
from .models import Class,ClassChat
from django.db.models import Q
from .serializers import ChatSerializer
from .models import ActivationsCode
from django.utils import crypto
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
        if _class.owner == self.scope['user']:
            return _class
        return 

    @database_sync_to_async
    def save_message(self,message):
        class_id =  self.class_id 
        _class = Class.objects.get(id = class_id)
        obj = ClassChat.objects.create(
            user = self.scope['user'],
            content = message,
            _class = _class
        )
        isDeletable = obj.user == _class.owner 
        print(obj.user)
        print(_class.owner)
        print(obj._class.owner)
        return obj,_class,isDeletable
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
        # await self.send(text_data = json.dumps({
        #     "message":f"Welcome to classify !! \n {self.scope['user'].username}"
        # }))


    async def disconnect(self, close_code):
        
        await self.channel_layer.group_discard(
            "email_channel",
            self.channel_name
        )
    async def receive(self, text_data):
        print("Received message:")
        data = json.loads(text_data)
        operation = await self.save_message(data['text'])
        user = self.scope['user']
        chat,_class,isDeletable = operation
        await self.channel_layer.group_send(
            self.class_id,
            {
                'type': 'send_message',
                'message': chat.content,
                "email" : chat.user.email,
                "username" :"Admin" if chat.user == _class.owner else chat.user.username,
                "deletable" : isDeletable,
                "date" : str(chat.timestamp),
                "id" : chat.id,
            
            }
        )
        
    async def send_message(self, event):
       
        await self.send(text_data=json.dumps({
            "message": event['message'],
            "user_email" : event['email'],
            "username" : event['username'],
            "deletable" : event['deletable'],
            "timestamp" : event['date'],
            "id" : event['id']
        }))



class AccountActivation(AsyncWebsocketConsumer):
    async def connect(self):
        if not self.scope['user']:
            self.disconnect(code=101)

        userEmail = self.scope['user'].user_id
        await self.channel_layer.group_add(
            'userEmail',
            self.channel_name
        )

       
        await self.accept()
       

    @database_sync_to_async
    def create_code(self):
        user = self.scope['user']
        code = crypto.get_random_string(18)
        check = ActivationsCode.objects.filter(user = user)
        if check:
            [obj.delete() for obj in check.all()]
        
        obj = ActivationsCode.objects.create(user = user,code = code)

        return obj,check.exists(),code

    @database_sync_to_async
    def confirm_code(self,id =None):
        try:
            user_code = AccountActivation.objects.get(id = id)
        except:
            self.disconnect()

        user_code.user.activated = True
        user_code.user.save()
        return user_code

    async def disconnect(self, code):
        return await super().disconnect(code)
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        user = self.scope['user']
        if data.get("code") == "001":
            obj,checked,code = await self.create_code()
            print(code)
        
        if data.get("code") == "002":
            operation = await self.confirm_code(data.get("id"))

            

        pass

    
    
    

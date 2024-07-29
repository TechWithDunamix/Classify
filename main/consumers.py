# consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
import json
import logging

logger = logging.getLogger(__name__)
class EmailConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add(
            "email_channel",
            self.channel_name
        )
        await self.accept()
        logger.info(f"Connected to email_channel")

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

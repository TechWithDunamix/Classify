from rest_framework import serializers
from .models import User 
class UserSignupSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = User 

        extra_kwargs = {
            "password":{
                "write_only":True 
            },
            "profile_image":{
                "required":False
            },
            "intro":{
                "required":False 
            },
            "username":{
                "required":False
            },
            "user_id":{
                "required":False
            }
        }

    def create(self,validated_data):
        user = User.objects.create_user(
            email = validated_data.get("email"),
            password = validated_data.get("password"),
            intro = validated_data.get("intro"),
            full_name = validated_data.get("full_name"),
            username = validated_data.get("username"),
            dob = validated_data.get("dob"),
            intrest = validated_data.get("intrest")
        )
        return user




class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
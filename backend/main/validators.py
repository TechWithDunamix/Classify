# validators.py

from django.conf import settings
from rest_framework import serializers

def file_size_validator(file):
    max_upload_size = settings.MAX_UPLOAD_SIZE
    if file.size > max_upload_size:
        raise serializers.ValidationError(f"File size should be under {max_upload_size / (1024 * 1024)} MB. Current file size is {file.size / (1024 * 1024):.2f} MB.")

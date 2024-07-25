from .models import Class,ClassFiles,ClassWork,Assignment
from django.dispatch import receiver
from django.db.models.signals import post_save,pre_save
from django.utils import crypto
from django.contrib.contenttypes.models import ContentType
@receiver(signal=post_save,sender = Class)
def set_class_code(**kwargs):
    # print(kwargs)
    if kwargs.get("created"):
        obj = kwargs.get("instance")
        obj.class_code = crypto.get_random_string(8)
        obj.save()
    

@receiver(signal=pre_save,sender = Assignment)
def save_assignment(**kwargs):
    pass    

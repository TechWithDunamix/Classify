from .models import Class,ClassFiles,ClassWork,Assignment,WorkSubmitions,Grading
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

@receiver(signal=post_save,sender = WorkSubmitions)
def add_grade(**kwargs):
    obj = kwargs.get("instance")
    created = kwargs.get("kwargs")
    score = obj.score

    if obj.marked:
        score = obj.score
        assignment = obj.assignment
        _class = obj._class
        user = obj.user
        check = Grading.objects.filter(
            assignment = assignment,
            _class = _class,
            user = user
        )
        if not check.exists():
            print("it is done")
            Grading.objects.create(
                user = user,
                _class =_class,
                assignment = assignment,
                score = score
            )
            return 
        obj = check.first()
        obj.score = score
        obj.save()
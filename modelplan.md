Sure! Here’s how you can put everything together for a complete setup:

### 1. Models

```python
# models.py
from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation

class Assignment(models.Model):
    title = models.CharField(max_length=200)
    due_date = models.DateField()
    class_work = GenericRelation('ClassWork')

class Classwork(models.Model):
    title = models.CharField(max_length=200)
    date_assigned = models.DateField()
    class_work = GenericRelation('ClassWork')

class Project(models.Model):
    title = models.CharField(max_length=200)
    deadline = models.DateField()
    class_work = GenericRelation('ClassWork')

class ClassWork(models.Model):
    title = models.CharField(max_length=200)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
```

### 2. Serializers

```python
# serializers.py
from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from .models import Assignment, Classwork, Project, ClassWork

class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = '__all__'

class ClassworkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classwork
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class ClassWorkSerializer(serializers.ModelSerializer):
    content_type = serializers.SlugRelatedField(
        queryset=ContentType.objects.all(), 
        slug_field='model'
    )
    object_id = serializers.IntegerField()

    class Meta:
        model = ClassWork
        fields = '__all__'

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if instance.content_type.model == 'assignment':
            ret['content_object'] = AssignmentSerializer(instance.content_object).data
        elif instance.content_type.model == 'classwork':
            ret['content_object'] = ClassworkSerializer(instance.content_object).data
        elif instance.content_type.model == 'project':
            ret['content_object'] = ProjectSerializer(instance.content_object).data
        return ret
```

### 3. Views

```python
# views.py
from rest_framework import viewsets
from .models import Assignment, Classwork, Project, ClassWork
from .serializers import AssignmentSerializer, ClassworkSerializer, ProjectSerializer, ClassWorkSerializer

class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer

class ClassworkViewSet(viewsets.ModelViewSet):
    queryset = Classwork.objects.all()
    serializer_class = ClassworkSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class ClassWorkViewSet(viewsets.ModelViewSet):
    queryset = ClassWork.objects.all()
    serializer_class = ClassWorkSerializer
```

### 4. URLs

```python
# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AssignmentViewSet, ClassworkViewSet, ProjectViewSet, ClassWorkViewSet

router = DefaultRouter()
router.register(r'assignments', AssignmentViewSet)
router.register(r'classworks', ClassworkViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'classworks-generic', ClassWorkViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
```

### 5. Settings

Ensure that you have `django.contrib.contenttypes` and `rest_framework` in your `INSTALLED_APPS` in `settings.py`:

```python
# settings.py
INSTALLED_APPS = [
    ...
    'django.contrib.contenttypes',
    'rest_framework',
    ...
]
```

### 6. Migration

Make and apply migrations to create the necessary database tables:

```sh
python manage.py makemigrations
python manage.py migrate
```

### Testing the API

#### Creating an Assignment

```sh
curl -X POST http://127.0.0.1:8000/assignments/ -H "Content-Type: application/json" -d '{"title": "Math Assignment", "due_date": "2024-08-01"}'
```

#### Creating a ClassWork related to Assignment

```sh
curl -X POST http://127.0.0.1:8000/classworks-generic/ -H "Content-Type: application/json" -d '{"title": "Math Assignment Class Work", "content_type": "assignment", "object_id": 1}'
```

#### Retrieving ClassWork with nested content object

```sh
curl http://127.0.0.1:8000/classworks-generic/
```

This setup allows you to manage different types of class work (assignments, classwork, projects) with a flexible generic relationship and expose these models through a RESTful API using Django REST Framework.

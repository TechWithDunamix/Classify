# Generated by Django 4.2.3 on 2024-09-10 20:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0036_grading_comment_grading_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='class',
            name='meet_link',
            field=models.URLField(blank=True, null=True),
        ),
    ]

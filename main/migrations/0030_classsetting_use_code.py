# Generated by Django 4.2.3 on 2024-08-09 23:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0029_alter_comment_anouncement_grading"),
    ]

    operations = [
        migrations.AddField(
            model_name="classsetting",
            name="use_code",
            field=models.BooleanField(default=True),
        ),
    ]
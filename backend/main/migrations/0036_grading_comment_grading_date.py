# Generated by Django 5.0.7 on 2024-09-02 15:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0035_anouncement__type"),
    ]

    operations = [
        migrations.AddField(
            model_name="grading",
            name="comment",
            field=models.CharField(max_length=120, null=True),
        ),
        migrations.AddField(
            model_name="grading",
            name="date",
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]
# Generated by Django 5.0.7 on 2024-07-29 18:42

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0019_topicupdate__class"),
    ]

    operations = [
        migrations.CreateModel(
            name="WorkSubmitions",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("date", models.DateTimeField(auto_now_add=True)),
                ("score", models.IntegerField(blank=True, default=None, null=True)),
                ("comment", models.TextField(blank=True, default=None, null=True)),
                ("answer", models.TextField()),
                (
                    "_class",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="submitions",
                        to="main.class",
                    ),
                ),
                (
                    "assignment",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="assignment_submitions",
                        to="main.assignment",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="class_work_submitions",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
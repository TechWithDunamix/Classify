# Generated by Django 4.2.3 on 2024-08-06 15:33

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0028_comment"),
    ]

    operations = [
        migrations.AlterField(
            model_name="comment",
            name="anouncement",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="announcment_comment",
                to="main.anouncement",
            ),
        ),
        migrations.CreateModel(
            name="Grading",
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
                ("score", models.IntegerField(default=0)),
                (
                    "_class",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="student_grading",
                        to="main.class",
                    ),
                ),
                (
                    "assignment",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="grades",
                        to="main.assignment",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="grading",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]

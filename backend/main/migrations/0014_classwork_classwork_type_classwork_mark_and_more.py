# Generated by Django 5.0.7 on 2024-07-20 22:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0013_remove_assignment__files_assignment__files"),
    ]

    operations = [
        migrations.AddField(
            model_name="classwork",
            name="classwork_type",
            field=models.CharField(default="Test", max_length=120),
        ),
        migrations.AddField(
            model_name="classwork",
            name="mark",
            field=models.PositiveIntegerField(default=100),
        ),
        migrations.AlterField(
            model_name="assignment",
            name="_files",
            field=models.JSONField(default=list),
        ),
        migrations.AlterField(
            model_name="assignment",
            name="options",
            field=models.JSONField(default=list, null=True),
        ),
        migrations.AlterField(
            model_name="class",
            name="members",
            field=models.ManyToManyField(related_name="members", to="main.membership"),
        ),
    ]

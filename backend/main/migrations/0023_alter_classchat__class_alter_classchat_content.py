# Generated by Django 5.0.7 on 2024-08-02 20:14

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0022_classchat_dmchat"),
    ]

    operations = [
        migrations.AlterField(
            model_name="classchat",
            name="_class",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="class_message",
                to="main.class",
            ),
        ),
        migrations.AlterField(
            model_name="classchat",
            name="content",
            field=models.TextField(default=""),
        ),
    ]

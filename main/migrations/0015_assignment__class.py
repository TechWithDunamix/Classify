# Generated by Django 5.0.7 on 2024-07-21 12:22

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0014_classwork_classwork_type_classwork_mark_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="assignment",
            name="_class",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="assignments",
                to="main.class",
            ),
        ),
    ]

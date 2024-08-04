# Generated by Django 5.0.7 on 2024-08-04 20:50

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0024_alter_classchat_active"),
    ]

    operations = [
        migrations.AddField(
            model_name="classfiles",
            name="user",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="user_files",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name="classfiles",
            name="_class",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="classfiles",
                to="main.class",
            ),
        ),
    ]

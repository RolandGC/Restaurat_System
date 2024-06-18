# Generated by Django 3.2.2 on 2024-06-12 00:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pos', '0017_alter_mesa_disponibilidad'),
    ]

    operations = [
        migrations.AddField(
            model_name='sale',
            name='estado',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='sale',
            name='numero_mesa',
            field=models.ForeignKey(default=3, on_delete=django.db.models.deletion.CASCADE, to='pos.mesa'),
            preserve_default=False,
        ),
    ]

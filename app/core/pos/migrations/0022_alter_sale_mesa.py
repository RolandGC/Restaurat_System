# Generated by Django 3.2.2 on 2024-06-12 17:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pos', '0021_alter_sale_mesa'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sale',
            name='mesa',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='pos.mesa'),
        ),
    ]

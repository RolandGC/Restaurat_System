# Generated by Django 3.2.2 on 2024-06-12 17:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pos', '0020_rename_numero_mesa_sale_mesa'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sale',
            name='mesa',
            field=models.ForeignKey(blank=True, default=0, null=True, on_delete=django.db.models.deletion.CASCADE, to='pos.mesa'),
        ),
    ]

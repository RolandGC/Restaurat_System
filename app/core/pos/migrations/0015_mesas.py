# Generated by Django 3.2.2 on 2024-06-05 20:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pos', '0014_auto_20240605_1007'),
    ]

    operations = [
        migrations.CreateModel(
            name='Mesas',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('numero_mesa', models.IntegerField()),
            ],
        ),
    ]
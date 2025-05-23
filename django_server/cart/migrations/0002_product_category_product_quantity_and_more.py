# Generated by Django 5.2 on 2025-04-21 02:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cart', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='category',
            field=models.CharField(choices=[('fruit', '과일'), ('vegetable', '채소'), ('snack', '간식')], default='fruit', max_length=20),
        ),
        migrations.AddField(
            model_name='product',
            name='quantity',
            field=models.IntegerField(default=1),
        ),
        migrations.AlterField(
            model_name='product',
            name='weight',
            field=models.FloatField(blank=True, null=True),
        ),
    ]

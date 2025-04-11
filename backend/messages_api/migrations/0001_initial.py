# Generated by Django 5.2 on 2025-04-11 19:27

import django.db.models.deletion
import messages_api.validators
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message_type', models.CharField(choices=[('text', 'Text'), ('image', 'Image'), ('video', 'Video'), ('audio', 'Audio')], default='text', max_length=10)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('receiver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='received_messages', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='AudioMessage',
            fields=[
                ('text', models.TextField()),
                ('message', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='audio_content', serialize=False, to='messages_api.message')),
                ('audio', models.FileField(upload_to='audio/', validators=[messages_api.validators.validate_audio])),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ImageMessage',
            fields=[
                ('text', models.TextField()),
                ('message', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='image_content', serialize=False, to='messages_api.message')),
                ('image', models.ImageField(upload_to='images/')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='TextMessage',
            fields=[
                ('text', models.TextField()),
                ('message', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='text_content', serialize=False, to='messages_api.message')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='VideoMessage',
            fields=[
                ('text', models.TextField()),
                ('message', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='video_content', serialize=False, to='messages_api.message')),
                ('video', models.FileField(upload_to='video/', validators=[messages_api.validators.validate_video])),
            ],
            options={
                'abstract': False,
            },
        ),
    ]

from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Message, TextMessage, AudioMessage, VideoMessage, ImageMessage
from django.conf import settings


class TextMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TextMessage
        fields = ['text']


class AudioMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AudioMessage
        fields = ['audio']


class VideoMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoMessage
        fields = ['video']


class ImageMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageMessage
        fields = ['image']


class MessageSerializer(serializers.ModelSerializer):
    receiver = serializers.SlugRelatedField(
        slug_field='username',
        queryset=get_user_model().objects.all()
    )

    content = serializers.SerializerMethodField()
    text = serializers.CharField(source="content.text")

    class Meta:
        model = Message
        fields = ['id', 'receiver',
                  'message_type', 'timestamp', 'content', 'text']

    def get_content(self, obj):
        """
        Returns the appropriate content based on message_type
        """
        if obj.message_type == Message.TEXT:
            serializer = TextMessageSerializer(obj.text_content)
            return serializer.data.get('text')
        elif obj.message_type == Message.AUDIO:
            serializer = AudioMessageSerializer(obj.audio_content)
            return serializer.data.get('audio')
        elif obj.message_type == Message.VIDEO:
            serializer = VideoMessageSerializer(obj.video_content)
            return serializer.data.get('video')
        elif obj.message_type == Message.IMAGE:
            serializer = ImageMessageSerializer(obj.image_content)
            image_url = serializer.data.get('image')
            if image_url:
                return f"{settings.MEDIA_URL_BASE}{image_url}"
            return None
        return None

    def create(self, validated_data):
        content = self.context.get('content')
        if not content:
            raise serializers.ValidationError("Content is required")

        message = Message.objects.create(**validated_data)
        message.content = content  # This will use the content setter in the Message model
        return message

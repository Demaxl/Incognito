from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.conf import settings
from django.db import transaction

from .models import Message, TextMessage, AudioMessage, VideoMessage, ImageMessage


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
    text = serializers.CharField(source="content.text", read_only=True)

    # Media content fields for write
    media_content = serializers.FileField(write_only=True, required=False)
    text_content = serializers.CharField(write_only=True, required=False)
    is_read = serializers.BooleanField(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'receiver',
                  'message_type', 'timestamp', 'content', 'text', 'media_content', 'text_content', 'is_read']

    def get_content(self, obj):
        """
        Returns the appropriate content based on message_type
        """
        if obj.message_type == Message.TEXT:
            serializer = TextMessageSerializer(obj.text_content)
            return serializer.data.get('text')
        elif obj.message_type == Message.AUDIO:
            serializer = AudioMessageSerializer(obj.audio_content)
        elif obj.message_type == Message.VIDEO:
            serializer = VideoMessageSerializer(obj.video_content)
        elif obj.message_type == Message.IMAGE:
            serializer = ImageMessageSerializer(obj.image_content)
        content_url = serializer.data.get(obj.message_type)
        if content_url:
            return f"{settings.MEDIA_URL_BASE}{content_url}"
        return None

    def validate(self, attrs):
        if attrs['message_type'] == Message.TEXT:
            if 'text_content' not in attrs:
                raise serializers.ValidationError(
                    {"text_content": "Text content is required for text messages"})
        else:
            if 'media_content' not in attrs:
                raise serializers.ValidationError(
                    {"media_content": "Uploaded Media content is required"})
        return attrs

    def create(self, validated_data):

        media_content = validated_data.pop('media_content', None)
        text_content = validated_data.pop('text_content', None)

        # Use transaction to ensure atomicity in creating
        # the message object and the related message type object
        with transaction.atomic():
            message = Message.objects.create(**validated_data)

            content = text_content if validated_data['message_type'] == Message.TEXT \
                else media_content
            message.set_content(content, caption=text_content)

        return message

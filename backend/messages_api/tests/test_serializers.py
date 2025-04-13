import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import serializers

from ..models import Message
from ..serializers import MessageSerializer


@pytest.mark.django_db
class TestMessageSerializer:
    def test_valid_message_serialization(self, user_factory, message_factory):
        """
        Test that a valid message can be serialized
        """
        receiver = user_factory()
        message = message_factory(
            "Hello, this is a text message.", receiver=receiver)

        serializer = MessageSerializer(message)
        data = serializer.data

        assert data['receiver'] == receiver.username
        assert data['message_type'] == Message.TEXT
        assert data['content'] == message.content.text
        assert data['text'] == message.content.text

    def test_create_text_message(self, user_factory):
        """Test creating a text message through the serializer"""
        receiver = user_factory()
        data = {
            'receiver': receiver.username,
            'message_type': Message.TEXT,
            'text_content': 'Hello World!'
        }

        serializer = MessageSerializer(data=data)
        assert serializer.is_valid()

        message = serializer.save()
        assert message.receiver == receiver
        assert message.message_type == Message.TEXT
        assert message.content.text == 'Hello World!'

    def test_create_image_message(self, user_factory):
        """Test creating an image message through the serializer"""
        receiver = user_factory()
        image_content = SimpleUploadedFile(
            "test.jpg",
            b"file_content",
            content_type="image/jpeg"
        )
        data = {
            'receiver': receiver.username,
            'message_type': Message.IMAGE,
            'media_content': image_content,
            'text_content': 'Image caption'
        }

        serializer = MessageSerializer(data=data)
        assert serializer.is_valid()

        message = serializer.save()
        assert message.receiver == receiver
        assert message.message_type == Message.IMAGE
        assert message.content.image.name.startswith('images/')
        assert message.content.text == 'Image caption'

    def test_text_message_without_content(self, user_factory):
        """Test that text messages require text content"""
        receiver = user_factory()
        data = {
            'receiver': receiver.username,
            'message_type': Message.TEXT
        }

        serializer = MessageSerializer(data=data)
        with pytest.raises(serializers.ValidationError) as exc:
            serializer.is_valid(raise_exception=True)
        
        assert 'text_content' in exc.value.detail
        assert str(exc.value.detail['text_content'][0]) == 'Text content is required for text messages'

    def test_media_message_without_content(self, user_factory):
        """Test that media messages require media content"""
        receiver = user_factory()
        data = {
            'receiver': receiver.username,
            'message_type': Message.IMAGE
        }

        serializer = MessageSerializer(data=data)
        with pytest.raises(serializers.ValidationError) as exc:
            serializer.is_valid(raise_exception=True)
        
        assert 'media_content' in exc.value.detail
        assert str(exc.value.detail['media_content'][0]) == 'Uploaded Media content is required'

    def test_create_audio_message(self, user_factory):
        """Test creating an audio message through the serializer"""
        receiver = user_factory()
        audio_content = SimpleUploadedFile(
            "test.mp3",
            b"file_content",
            content_type="audio/mpeg"
        )
        data = {
            'receiver': receiver.username,
            'message_type': Message.AUDIO,
            'media_content': audio_content,
            'text_content': 'Audio caption'
        }

        serializer = MessageSerializer(data=data)
        assert serializer.is_valid()

        message = serializer.save()
        assert message.receiver == receiver
        assert message.message_type == Message.AUDIO
        assert message.content.audio.name.startswith('audio/')
        assert message.content.text == 'Audio caption'

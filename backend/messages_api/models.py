from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db.models import QuerySet
from typing import Union

from .validators import validate_audio, validate_video, validate_image


class Message(models.Model):
    TEXT = "text"
    IMAGE = "image"
    VIDEO = "video"
    AUDIO = "audio"

    MESSAGE_TYPES = (
        (TEXT, 'Text'),
        (IMAGE, 'Image'),
        (VIDEO, 'Video'),
        (AUDIO, 'Audio'),
    )
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="received_messages")
    message_type = models.CharField(
        max_length=10, choices=MESSAGE_TYPES, default=TEXT)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.receiver}: {self.content}"

    @property
    def content(self) -> Union['TextMessage', 'ImageMessage', 'VideoMessage', 'AudioMessage']:
        """Returns the content object associated with this message's type."""
        return getattr(self, f"{self.message_type}_content")

    def set_content(self, value, caption=None):
        """Creates the appropriate content object based on message type."""
        match self.message_type:
            case Message.TEXT:
                TextMessage.objects.create(message=self, text=value)
            case Message.IMAGE:
                ImageMessage.objects.create(
                    message=self, image=value, text=caption)
            case Message.VIDEO:
                VideoMessage.objects.create(
                    message=self, video=value, text=caption)
            case Message.AUDIO:
                AudioMessage.objects.create(
                    message=self, audio=value, text=caption)

    @classmethod
    def related_objects(cls, operation: str = "read") -> QuerySet:
        """
        Returns a queryset with all message content types prefetched when reading.
        This optimizes database queries when accessing message content.
        """
        queryset = cls.objects.select_related(
            'receiver').order_by('-timestamp')
        if operation == "read":
            return queryset.prefetch_related(
                'text_content',
                'image_content',
                'video_content',
                'audio_content'
            )

        return queryset


class MessageTypeAbstract(models.Model):
    """Base abstract model for all message content types."""

    # Every type of message can have an optional text content
    text = models.TextField(blank=True, null=True)

    class Meta:
        abstract = True

    def clean(self):
       # Ensure the related 'message' exists before accessing its attributes
        if self.message_id is None:
            return
        if self.TYPE != self.message.message_type:
            raise ValidationError({"message": "Invalid message type"})

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)


class TextMessage(MessageTypeAbstract):
    """Model for text-only messages."""

    TYPE = Message.TEXT
    message = models.OneToOneField(
        Message, on_delete=models.CASCADE, primary_key=True, related_name="text_content")

    def __str__(self) -> str:
        return f"{self.text[:20]}..."

    def clean(self):
        super().clean()
        # self.text field can not be blank for TextMessage
        if not self.text:
            raise ValidationError({"text": "Text content is required"})


class AudioMessage(MessageTypeAbstract):
    """Model for audio messages with optional text caption."""

    TYPE = Message.AUDIO
    message = models.OneToOneField(
        Message, on_delete=models.CASCADE, primary_key=True, related_name="audio_content")
    audio = models.FileField(upload_to="audio/", validators=[validate_audio])

    def __str__(self) -> str:
        return f"{self.audio}"


class VideoMessage(MessageTypeAbstract):
    """Model for video messages with optional text caption."""

    TYPE = Message.VIDEO
    message = models.OneToOneField(
        Message, on_delete=models.CASCADE, primary_key=True, related_name="video_content")
    video = models.FileField(upload_to="video/", validators=[validate_video])

    def __str__(self) -> str:
        return str(self.video)


class ImageMessage(MessageTypeAbstract):
    """Model for image messages with optional text caption."""

    TYPE = Message.IMAGE
    message = models.OneToOneField(
        Message, on_delete=models.CASCADE, primary_key=True, related_name="image_content")
    image = models.ImageField(upload_to="images/", validators=[validate_image])

    def __str__(self) -> str:
        return str(self.image)

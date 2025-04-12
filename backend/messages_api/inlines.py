from django.contrib import admin
from .models import Message, TextMessage, AudioMessage, VideoMessage, ImageMessage

# Inline for TextMessage


class TextMessageInline(admin.StackedInline):
    model = TextMessage
    can_delete = False
    extra = 0
    verbose_name = "Text Message Content"
    verbose_name_plural = "Text Message Content"

# Inline for AudioMessage


class AudioMessageInline(admin.StackedInline):
    model = AudioMessage
    can_delete = False
    extra = 0
    verbose_name = "Audio Message Content"
    verbose_name_plural = "Audio Message Content"

# Inline for VideoMessage


class VideoMessageInline(admin.StackedInline):
    model = VideoMessage
    can_delete = False
    extra = 0
    verbose_name = "Video Message Content"
    verbose_name_plural = "Video Message Content"

# Inline for ImageMessage


class ImageMessageInline(admin.StackedInline):
    model = ImageMessage
    can_delete = False
    extra = 0
    verbose_name = "Image Message Content"
    verbose_name_plural = "Image Message Content"

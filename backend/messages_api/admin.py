from django.contrib import admin

from .models import Message
from .inlines import *


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'receiver',
                    'message_type', 'content', 'timestamp', 'is_read')
    list_filter = ('message_type', 'timestamp')
    search_fields = ('receiver__username',)
    ordering = ('-timestamp',)

    def get_inlines(self, request, obj=None):
        # Dynamically include the appropriate inline based on message type

        if obj is None:
            # Show all inlines when creating a new message
            return [TextMessageInline, AudioMessageInline, VideoMessageInline, ImageMessageInline]
        if obj.message_type == Message.TEXT:
            return [TextMessageInline]
        elif obj.message_type == Message.AUDIO:
            return [AudioMessageInline]
        elif obj.message_type == Message.VIDEO:
            return [VideoMessageInline]
        elif obj.message_type == Message.IMAGE:
            return [ImageMessageInline]
        return []

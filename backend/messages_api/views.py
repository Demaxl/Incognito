from typing import override

from rest_framework import mixins, viewsets
from rest_framework.response import Response

from .models import Message
from .permissions import IsReceiver
from .serializers import MessageSerializer


class MessageViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.DestroyModelMixin, viewsets.GenericViewSet):
    serializer_class = MessageSerializer

    def get_permissions(self):
        # Anyone should be able to create messages
        # but only the receiver should be able to read and delete
        if self.request.method == 'POST':
            return []
        return [IsReceiver()]

    @override
    def get_queryset(self):
        operation = "read" if self.action in ['retrieve', 'list'] else "write"
        return Message.related_objects(operation).filter(receiver=self.request.user)

    def list(self, request, *args, **kwargs):
        # Get the queryset first
        queryset = self.get_queryset()
        serializer_data = self.get_serializer(queryset, many=True).data

        # Mark all unread messages as read
        queryset.filter(is_read=False).update(is_read=True)

        return Response(serializer_data)

from typing import override

from rest_framework import mixins, viewsets

from .models import Message
from .permissions import IsReceiver
from .serializers import MessageSerializer


class MessageViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.DestroyModelMixin, viewsets.GenericViewSet):
    serializer_class = MessageSerializer

    def get_permissions(self):
        # Anyone should be able to create messages
        # but only the receiver should be able to read and delete
        permission_classes = [IsReceiver]
        if self.request.method == 'POST':
            permission_classes = []
        return [permission() for permission in permission_classes]

    @override
    def get_queryset(self):
        operation = "read" if self.action in ['retrieve', 'list'] else "write"
        return Message.related_objects(operation).filter(receiver=self.request.user)

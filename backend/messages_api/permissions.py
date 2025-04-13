from typing import override
from rest_framework import permissions


class IsReceiver(permissions.IsAuthenticated):
    """
    Permission to check if the user is the receiver of the message.
    """
    @override
    def has_object_permission(self, request, view, obj):
        if super().has_permission(request, view) and request.user == obj.receiver:
            return True

        return False

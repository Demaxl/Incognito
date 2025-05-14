import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from ..models import Message

pytestmark = pytest.mark.django_db


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def authenticated_client(api_client, user_factory):
    user = user_factory()
    api_client.force_authenticate(user=user)
    return api_client, user


class TestMessageViewSet:
    def test_create_text_message_unauthenticated(self, api_client, user_factory):
        """Test that anyone can create a text message without authentication"""
        receiver = user_factory()
        url = reverse('messages-list')
        data = {
            'receiver': receiver.username,
            'message_type': Message.TEXT,
            'text_content': 'Hello World!'
        }

        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_201_CREATED
        assert Message.objects.count() == 1
        message = Message.objects.first()
        assert message.receiver == receiver
        assert message.message_type == Message.TEXT
        assert message.content.text == 'Hello World!'

    def test_list_messages_authenticated(self, authenticated_client, message_factory):
        """Test that authenticated users can list their received messages"""
        client, user = authenticated_client

        # Create messages for the user
        message1 = message_factory("Text Message 1", receiver=user)
        message2 = message_factory("Text Message 2", receiver=user)
        # Create message for another user
        other_message = message_factory("Other message")

        url = reverse('messages-list')
        response = client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2
        message_ids = {msg['id'] for msg in response.data}
        assert message1.id in message_ids
        assert message2.id in message_ids
        assert other_message.id not in message_ids

    def test_retrieve_own_message(self, authenticated_client, message_factory):
        """Test that users can retrieve their own messages"""
        client, user = authenticated_client
        message = message_factory("Test message", receiver=user)

        url = reverse('messages-detail', args=[message.id])
        response = client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == message.id
        assert response.data['content'] == "Test message"

    def test_retrieve_others_message_forbidden(self, authenticated_client, message_factory):
        """Test that users cannot retrieve messages meant for others"""
        client, user = authenticated_client
        other_message = message_factory(
            "Other message")  # Creates for different user

        url = reverse('messages-detail', args=[other_message.id])
        response = client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_own_message(self, authenticated_client, message_factory):
        """Test that users can delete their own messages"""
        client, user = authenticated_client
        message = message_factory("Test message", receiver=user)

        url = reverse('messages-detail', args=[message.id])
        response = client.delete(url)

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Message.objects.filter(id=message.id).exists()

    def test_delete_others_message_forbidden(self, authenticated_client, message_factory):
        """Test that users cannot delete messages meant for others"""
        client, user = authenticated_client
        other_message = message_factory(
            "Other message")  # Creates for different user

        url = reverse('messages-detail', args=[other_message.id])
        response = client.delete(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert Message.objects.filter(id=other_message.id).exists()

    def test_list_messages_unauthenticated(self, api_client):
        """Test that unauthenticated users cannot list messages"""
        url = reverse('messages-list')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_403_FORBIDDEN

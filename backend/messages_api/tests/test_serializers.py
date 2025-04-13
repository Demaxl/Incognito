import pytest
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

import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.exceptions import ValidationError
from ..models import Message, TextMessage, AudioMessage, VideoMessage, ImageMessage


@pytest.mark.django_db
class TestMessageModels:
    @pytest.fixture(autouse=True)
    def setup_users(self, user_factory):
        self.receiver = user_factory()

    def test_create_text_message(self):
        message = Message.objects.create(
            receiver=self.receiver, message_type=Message.TEXT)
        text_message = TextMessage.objects.create(
            message=message, text="Hello, this is a text message.")

        assert message.content == text_message
        assert message.message_type == "text"
        assert message.text_content.text == "Hello, this is a text message."

    def test_valid_message_type(self):
        """
        Test that the message type is validated when saving the message

        """
        message = Message.objects.create(
            receiver=self.receiver, message_type=Message.IMAGE)

        # Image message should not have text content
        with pytest.raises(ValidationError):
            TextMessage.objects.create(message=message, text="Hello")

    def test_valid_message_media_type(self):
        """
        Test that the message media type is validated when saving the message

        """
        message = Message.objects.create(
            receiver=self.receiver, message_type=Message.AUDIO)

        with pytest.raises(ValidationError):
            # Audio message should not have image content
            AudioMessage.objects.create(
                message=message, audio=SimpleUploadedFile("image.jpg", b"file_content"))

    def test_caption(self, message_factory):
        """
        Test that all media types can have an optional text caption
        """
        image = SimpleUploadedFile("image.jpg", b"file_content")
        message = message_factory(image, message_type=Message.IMAGE)

        message.content.text = "Hello, this is a caption."
        message.content.save()

        assert message.content.text == "Hello, this is a caption."

        # Text messages must have text content
        with pytest.raises(ValidationError):
            text_message = message_factory("")

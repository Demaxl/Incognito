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

    def test_text_message_min_length(self, message_factory):
        """Test that text messages must be at least MIN_TEXT_LENGTH characters"""

        with pytest.raises(ValidationError) as exc_info:
            message_factory("short")
            assert "Text must be at least" in str(exc_info.value)

        # Test with text exactly at minimum length
        text_message = message_factory("1234567890")
        assert text_message.content.text == "1234567890"

    def test_media_message_caption_min_length(self, message_factory):
        """Test that media message captions must be at least MIN_TEXT_LENGTH characters if provided"""
        # Test Image message
        image = SimpleUploadedFile("image.jpg", b"file_content")
        message = message_factory(image, message_type=Message.IMAGE)

        # Test with caption shorter than minimum length
        with pytest.raises(ValidationError) as exc_info:
            message.content.text = "short"
            message.content.save()
            assert "Text must be at least" in str(exc_info.value)

        # Test with valid caption
        message.content.text = "This is a valid caption that meets the minimum length requirement"
        message.content.save()
        assert len(message.content.text) >= 10

        # Test Video message
        video = SimpleUploadedFile("video.mp4", b"file_content")
        message = message_factory(video, message_type=Message.VIDEO)

        # Test with caption shorter than minimum length
        with pytest.raises(ValidationError) as exc_info:
            message.content.text = "short"
            message.content.save()
        assert "Text must be at least" in str(exc_info.value)

        # Test with valid caption
        message.content.text = "This is a valid caption that meets the minimum length requirement"
        message.content.save()
        assert len(message.content.text) >= 10

        # Test Audio message
        audio = SimpleUploadedFile("audio.mp3", b"file_content")
        message = message_factory(audio, message_type=Message.AUDIO)

        # Test with caption shorter than minimum length
        with pytest.raises(ValidationError) as exc_info:
            message.content.text = "short"
            message.content.save()
        assert "Text must be at least" in str(exc_info.value)

        # Test with valid caption
        message.content.text = "This is a valid caption that meets the minimum length requirement"
        message.content.save()
        assert len(message.content.text) >= 10

    def test_media_message_empty_caption(self, message_factory):
        """Test that media messages can have empty captions"""
        # Test Image message
        image = SimpleUploadedFile("image.jpg", b"file_content")
        message = message_factory(image, message_type=Message.IMAGE)
        assert message.content.text is None

        # Test Video message
        video = SimpleUploadedFile("video.mp4", b"file_content")
        message = message_factory(video, message_type=Message.VIDEO)
        assert message.content.text is None

        # Test Audio message
        audio = SimpleUploadedFile("audio.mp3", b"file_content")
        message = message_factory(audio, message_type=Message.AUDIO)
        assert message.content.text is None

import mimetypes

from django.core.exceptions import ValidationError


def validate_audio(file):
    mime_type, _ = mimetypes.guess_type(file.name)
    if mime_type is None or not mime_type.startswith("audio"):
        raise ValidationError(
            "The uploaded file is not a valid audio file.")


def validate_video(file):
    mime_type, _ = mimetypes.guess_type(file.name)
    if mime_type is None or not mime_type.startswith("video"):
        raise ValidationError(
            "The uploaded file is not a valid video file.")

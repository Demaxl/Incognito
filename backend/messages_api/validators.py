import mimetypes

from django.core.exceptions import ValidationError
from rest_framework.exceptions import ValidationError as DRFValidationError
from rest_framework.serializers import as_serializer_error
from rest_framework.views import exception_handler as drf_exception_handler


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


def validate_image(file):
    mime_type, _ = mimetypes.guess_type(file.name)
    if mime_type is None or not mime_type.startswith("image"):
        raise ValidationError("The uploaded file is not a valid image file.")


def exception_handler(exception, context):
    # If it was a validation error that was raised
    if isinstance(exception, ValidationError):
        exception = DRFValidationError(as_serializer_error(exception))

    return drf_exception_handler(exception, context)

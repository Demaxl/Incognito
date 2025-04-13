import pytest
import string
import random

from django.contrib.auth.models import User


@pytest.fixture
def user_factory(django_user_model):
    def create_user(username=None) -> User:
        # Generate a random unique username
        rand_username = "user_" + \
            ''.join(random.choices(string.ascii_letters +
                                   string.digits, k=8))

        return django_user_model.objects.create_user(
            username=rand_username if username is None else username,
            password="password123"
        )

    return create_user

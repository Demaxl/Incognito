from django.views.decorators.csrf import ensure_csrf_cookie
from django.middleware.csrf import get_token
from django.contrib.auth.models import User
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.


@ensure_csrf_cookie
def login_set_cookie(request):
    """
    Set a CSRF cookie for the user and return the token.
    """
    csrf_token = get_token(request)
    return JsonResponse({"csrfToken": csrf_token})


@api_view(["GET"])
def check_username(request):
    """
    Check if a username is available.
    """
    username = request.GET.get("username")
    return Response({"available": User.objects.filter(username=username).exists()})

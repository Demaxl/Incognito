from django.views.decorators.csrf import ensure_csrf_cookie
from django.middleware.csrf import get_token

from django.http import JsonResponse

# Create your views here.


@ensure_csrf_cookie
def login_set_cookie(request):
    """
    Set a CSRF cookie for the user and return the token.
    """
    csrf_token = get_token(request)
    return JsonResponse({"csrfToken": csrf_token})

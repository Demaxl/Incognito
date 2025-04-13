from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse

# Create your views here.


@ensure_csrf_cookie
def login_set_cookie(request):
    """
    Set a CSRF cookie for the user.
    """
    return JsonResponse({"details": "CSRF cookie set"})

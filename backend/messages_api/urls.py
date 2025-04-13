from rest_framework import routers

from . import views

router = routers.DefaultRouter(trailing_slash=False)

router.register("messages", views.MessageViewSet, basename="messages")

urlpatterns = router.urls

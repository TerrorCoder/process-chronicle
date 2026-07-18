from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SummaryViewSet

router = DefaultRouter()
# Map POST /api/generate-summary/ to the ViewSet
router.register(r'generate-summary', SummaryViewSet, basename='generate-summary')

urlpatterns = [
    path('', include(router.urls)),
]

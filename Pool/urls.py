from rest_framework.routers import DefaultRouter
from django.urls import path, include   
from .views import PoolViewSet

router = DefaultRouter()
router.register(r'pools', PoolViewSet, basename='pool')


urlpatterns = [
    path('', include(router.urls)),
]
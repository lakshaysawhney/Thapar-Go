from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import PoolRequestViewSet, PoolViewSet

router = DefaultRouter()
router.register(r'pools', PoolViewSet, basename='pool')
router.register(r'pool-requests', PoolRequestViewSet, basename='pool-request')

urlpatterns = [
    path('', include(router.urls)),
]
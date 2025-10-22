from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlogPostViewSet, CategoryViewSet

router = DefaultRouter()
router.register(r'posts', BlogPostViewSet, basename='posts')
router.register(r'categories', CategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
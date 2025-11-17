from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlogPostViewSet, CategoryViewSet
from . import views 

router = DefaultRouter()
router.register(r'posts', BlogPostViewSet, basename='posts')
router.register(r'categories', CategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('posts/', views.blog_post_list, name='blogpost-list'),
    path('test-upload/', views.test_cloudinary, name='test-cloudinary'),
]
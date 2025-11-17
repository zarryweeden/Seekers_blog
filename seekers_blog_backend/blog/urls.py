from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlogPostViewSet, CategoryViewSet
from . import views 

router = DefaultRouter()
router.register(r'posts', BlogPostViewSet, basename='posts')
router.register(r'categories', CategoryViewSet)

urlpatterns = [
    path('posts/', views.blog_post_list, name='blogpost-list'),
    path('posts/<int:pk>/', views.blog_post_detail, name='blogpost-detail'),
    path('posts/featured/', views.featured_posts, name='featured-posts'),
    path('test-real-image-upload/', views.test_real_image_upload, name='test-real-image-upload'),
]
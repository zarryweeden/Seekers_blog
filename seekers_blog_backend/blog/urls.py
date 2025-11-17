from django.urls import path
from . import views

urlpatterns = [
    path('posts/', views.blog_post_list, name='blogpost-list'),
    path('posts/<int:pk>/', views.blog_post_detail, name='blogpost-detail'),
    path('posts/featured/', views.featured_posts, name='featured-posts'),
    path('test-image-upload/', views.test_image_upload, name='test-image-upload'),
]
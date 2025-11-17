from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'posts', views.BlogPostViewSet, basename='posts')
router.register(r'categories', views.CategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('test-image-upload/', views.test_image_upload, name='test-image-upload'),
    path('fix-admin/', views.fix_admin)
]
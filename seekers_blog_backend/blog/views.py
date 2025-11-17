from rest_framework import viewsets, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import BlogPost, Category
from .serializers import BlogPostListSerializer, BlogPostDetailSerializer, CategorySerializer,BlogPostDetailSerializer

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import json

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.filter(published=True)
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return BlogPostDetailSerializer
        return BlogPostListSerializer
    
    def get_queryset(self):
        queryset = BlogPost.objects.filter(published=True)
        category = self.request.query_params.get('category', None)
        
        if category:
            queryset = queryset.filter(category__name=category)
        
        return queryset.order_by('-created_at')
    
    @action(detail=True, methods=['post'])
    def increment_views(self, request, pk=None):
        blog_post = self.get_object()
        blog_post.views += 1
        blog_post.save()
        return Response({'views': blog_post.views})
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_posts = BlogPost.objects.filter(published=True, featured=True).order_by('featured_order')[:3]
        serializer = self.get_serializer(featured_posts, many=True, context={'request': request})
        return Response(serializer.data)



class BlogPostListView(generics.ListAPIView):
    queryset = BlogPost.objects.filter(published=True)
    serializer_class = BlogPostListSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request  # THIS IS CRITICAL
        return context



class BlogPostDetailView(generics.RetrieveAPIView):
    queryset = BlogPost.objects.filter(published=True)
    serializer_class = BlogPostDetailSerializer
    lookup_field = 'id'
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context





@csrf_exempt
def blog_post_list(request):
    """Simple blog posts endpoint"""
    if request.method == 'GET':
        posts = BlogPost.objects.filter(published=True)[:10]
        data = []
        for post in posts:
            data.append({
                'id': post.id,
                'title': post.title,
                'excerpt': post.excerpt,
                'author': post.author.display_name,
                'created_at': post.created_at.isoformat(),
                'featured_image': post.featured_image.url if post.featured_image else None
            })
        return JsonResponse({'posts': data})
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def test_cloudinary(request):
    """Test Cloudinary upload"""
    if request.method == 'POST':
        try:
            # Create test file
            test_content = b'Cloudinary test file content'
            saved_name = default_storage.save('cloudinary_test.txt', ContentFile(test_content))
            file_url = default_storage.url(saved_name)
            
            return JsonResponse({
                'success': True,
                'message': 'Cloudinary upload successful!',
                'file_url': file_url,
                'is_cloudinary': 'cloudinary.com' in file_url
            })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
    
    return JsonResponse({
        'message': 'Send POST request to test Cloudinary upload',
        'example_curl': 'curl -X POST https://your-domain/api/blog/test-upload/'
    })
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import BlogPost, Category
from .serializers import BlogPostListSerializer, BlogPostDetailSerializer, CategorySerializer

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
        serializer = self.get_serializer(featured_posts, many=True)
        return Response(serializer.data)

@csrf_exempt
def test_image_upload(request):
    """Test if Cloudinary image upload works"""
    if request.method == 'POST':
        try:
            if 'image' not in request.FILES:
                return JsonResponse({
                    'success': False,
                    'error': 'No image provided. Send a file with key "image"'
                }, status=400)
            
            image_file = request.FILES['image']
            
            from .models import Author, User
            import datetime
            
            user, _ = User.objects.get_or_create(username='test_author')
            author, _ = Author.objects.get_or_create(
                user=user, 
                defaults={'display_name': 'Test Author'}
            )
            category, _ = Category.objects.get_or_create(
                name='Test Category',
                defaults={'description': 'Test category'}
            )
            
            post = BlogPost.objects.create(
                title=f"Test Image - {datetime.datetime.now().strftime('%H:%M:%S')}",
                content="Test post for image upload",
                author=author,
                category=category,
                published=False
            )
            
            post.featured_image = image_file
            post.save()
            
            image_url = post.featured_image.url
            
            return JsonResponse({
                'success': True,
                'message': 'Image upload successful!',
                'image_url': image_url,
                'is_cloudinary': 'cloudinary.com' in image_url,
                'post_id': post.id
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
    
    return JsonResponse({
        'message': 'Send POST request with image file to test upload'
    })
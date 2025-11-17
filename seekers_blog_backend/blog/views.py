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
    """Real blog posts endpoint - returns actual data from database"""
    if request.method == 'GET':
        try:
            posts = BlogPost.objects.filter(published=True).order_by('-created_at')[:10]
            data = []
            for post in posts:
                data.append({
                    'id': post.id,
                    'title': post.title,
                    'slug': post.slug,
                    'excerpt': post.excerpt,
                    'content': post.content,
                    'author': {
                        'id': post.author.id,
                        'name': post.author.display_name,
                        'profile_image': post.author.profile_image.url if post.author.profile_image else None
                    },
                    'category': {
                        'id': post.category.id if post.category else None,
                        'name': post.category.name if post.category else None
                    },
                    'featured_image': post.featured_image.url if post.featured_image else None,
                    'created_at': post.created_at.isoformat(),
                    'updated_at': post.updated_at.isoformat(),
                    'views': post.views,
                    'featured': post.featured
                })
            return JsonResponse({
                'count': len(data),
                'posts': data
            })
        except Exception as e:
            return JsonResponse({
                'error': 'Failed to fetch blog posts',
                'details': str(e)
            }, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

# blog/views.py
@csrf_exempt
def test_real_image_upload(request):
    """TEST ACTUAL IMAGE UPLOAD - NOT TEXT FILES"""
    if request.method == 'POST':
        try:
            # Check if image was provided
            if 'image' not in request.FILES:
                return JsonResponse({
                    'success': False,
                    'error': 'No image provided. Send a file with key "image"'
                }, status=400)
            
            image_file = request.FILES['image']
            
            # Create a test blog post with the uploaded image
            from .models import BlogPost, Author, User, Category
            import datetime
            
            # Get or create test author
            user, _ = User.objects.get_or_create(username='test_author')
            author, _ = Author.objects.get_or_create(
                user=user, 
                defaults={'display_name': 'Test Author'}
            )
            
            # Get or create test category  
            category, _ = Category.objects.get_or_create(
                name='Test Category',
                defaults={'description': 'Test category for image upload'}
            )
            
            # Create blog post with the uploaded image
            post = BlogPost.objects.create(
                title=f"Test Image Post - {datetime.datetime.now().strftime('%H:%M:%S')}",
                content="This is a test post to verify image uploads work",
                author=author,
                category=category,
                published=True
            )
            
            # SAVE THE ACTUAL IMAGE TO THE POST
            post.featured_image = image_file
            post.save()
            
            # Get the URL
            image_url = post.featured_image.url
            
            return JsonResponse({
                'success': True,
                'message': 'REAL IMAGE UPLOAD SUCCESSFUL!',
                'post_id': post.id,
                'image_url': image_url,
                'is_cloudinary_url': 'cloudinary.com' in image_url,
                'full_response': {
                    'post_title': post.title,
                    'image_field_name': post.featured_image.name,
                    'storage_used': str(post.featured_image.storage),
                    'file_size': post.featured_image.size,
                    'file_exists': post.featured_image.name != ''
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e),
                'traceback': 'Check server logs for full error details'
            }, status=500)
    
    # For GET requests - show upload form
    return JsonResponse({
        'message': 'Send a POST request with an image file to test REAL image upload',
        'curl_example': 'curl -X POST -F "image=@/path/to/your/image.jpg" https://seekersblog-production.up.railway.app/api/blog/test-real-image-upload/',
        'note': 'This will create an actual blog post with your uploaded image'
    })



@csrf_exempt
def blog_post_detail(request, pk):
    """Get single blog post by ID"""
    if request.method == 'GET':
        try:
            post = BlogPost.objects.get(id=pk, published=True)
            post.views += 1
            post.save()
            
            return JsonResponse({
                'id': post.id,
                'title': post.title,
                'slug': post.slug,
                'content': post.content,
                'excerpt': post.excerpt,
                'author': {
                    'id': post.author.id,
                    'name': post.author.display_name,
                    'bio': post.author.bio,
                    'profile_image': post.author.profile_image.url if post.author.profile_image else None
                },
                'category': {
                    'id': post.category.id if post.category else None,
                    'name': post.category.name if post.category else None,
                    'description': post.category.description if post.category else None
                },
                'featured_image': post.featured_image.url if post.featured_image else None,
                'created_at': post.created_at.isoformat(),
                'updated_at': post.updated_at.isoformat(),
                'views': post.views,
                'featured': post.featured
            })
        except BlogPost.DoesNotExist:
            return JsonResponse({'error': 'Blog post not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def featured_posts(request):
    """Get featured blog posts"""
    if request.method == 'GET':
        try:
            posts = BlogPost.objects.filter(published=True, featured=True).order_by('featured_order', '-created_at')
            data = []
            for post in posts:
                data.append({
                    'id': post.id,
                    'title': post.title,
                    'slug': post.slug,
                    'excerpt': post.excerpt,
                    'featured_image': post.featured_image.url if post.featured_image else None,
                    'created_at': post.created_at.isoformat()
                })
            return JsonResponse({'featured_posts': data})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)
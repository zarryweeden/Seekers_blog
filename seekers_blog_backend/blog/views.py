from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import BlogPost, Category
from .serializers import BlogPostListSerializer, BlogPostDetailSerializer, CategorySerializer
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from .models import Like, Comment
from .serializers import CommentSerializer
from django.contrib.auth.models import User 
from rest_framework import generics
from .models import HeroSection
from .serializers import HeroSectionSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.filter(published=True)

    @action(detail=True, methods=['post'])
    def toggle_like(self, request, pk=None):
        blog_post = self.get_object()
        
        user, created = User.objects.get_or_create(
            username='anonymous_user',
            defaults={'email': 'anonymous@example.com'}
        )
        
        try:
            like = Like.objects.get(user=user, post=blog_post)
            like.delete()
            liked = False
        except Like.DoesNotExist:
            Like.objects.create(user=user, post=blog_post)
            liked = True
        
        return Response({
            'liked': liked,
            'likes_count': blog_post.likes_count()
        })
    
    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        blog_post = self.get_object()
        comments = blog_post.comment_set.all().order_by('-created_at')
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        blog_post = self.get_object()
        content = request.data.get('content', '').strip()
        
        if not content:
            return Response(
                {'error': 'Comment content is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # For now, use a simple user identifier
        user, created = User.objects.get_or_create(
            username='anonymous_user',
            defaults={'email': 'anonymous@example.com'}
        )
        
        comment = Comment.objects.create(
            user=user,
            post=blog_post,
            content=content
        )
        
        serializer = CommentSerializer(comment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    
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
    

@api_view(['GET'])
def post_comments(request, post_id):
    try:
        post = BlogPost.objects.get(id=post_id, published=True)
        comments = post.comment_set.all().order_by('-created_at')
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)
    except BlogPost.DoesNotExist:
        return Response({'error': 'Post not found'}, status=404)

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



class HeroSectionView(generics.RetrieveAPIView):
    serializer_class = HeroSectionSerializer
    
    def get_object(self):
        # Get the active hero section with highest order
        return HeroSection.objects.filter(active=True).order_by('-order', '-created_at').first()


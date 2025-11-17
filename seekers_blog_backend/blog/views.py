from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import BlogPost, Category

@csrf_exempt
def blog_post_list(request):
    """Get all published blog posts"""
    if request.method == 'GET':
        try:
            posts = BlogPost.objects.filter(published=True).order_by('-created_at')
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

@csrf_exempt
def blog_post_detail(request, pk):
    """Get single blog post by ID"""
    if request.method == 'GET':
        try:
            post = BlogPost.objects.get(id=pk, published=True)
            # Increment views
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
            
            # Create a test blog post with the uploaded image
            from .models import Author, User, Category
            import datetime
            
            # Get or create test data
            user, _ = User.objects.get_or_create(username='test_author')
            author, _ = Author.objects.get_or_create(
                user=user, 
                defaults={'display_name': 'Test Author'}
            )
            category, _ = Category.objects.get_or_create(
                name='Test Category',
                defaults={'description': 'Test category'}
            )
            
            # Create post with image
            post = BlogPost.objects.create(
                title=f"Test Image - {datetime.datetime.now().strftime('%H:%M:%S')}",
                content="Test post for image upload",
                author=author,
                category=category,
                published=False  # Don't publish test posts
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
        'message': 'Send POST request with image file to test upload',
        'curl_example': 'curl -X POST -F "image=@/path/to/image.jpg" YOUR-URL/api/blog/test-image-upload/'
    })
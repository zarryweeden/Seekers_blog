from django.contrib import admin
from django.urls import path
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from django.http import JsonResponse
from django.db import connection
import datetime
from blog.views import HeroSectionView

def api_root(request):
    """Root endpoint with health checks"""
    # Test database
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return JsonResponse({
        'service': 'Seekers Blog API',
        'status': 'operational',
        'timestamp': datetime.datetime.utcnow().isoformat() + 'Z',
        'environment': 'production',
        'health': {
            'database': db_status,
            'api': 'healthy'
        },
        'endpoints': {
            'admin': '/admin/',
            'blog_posts': '/api/blog/posts/',
            'devotionals': '/api/devotionals/'
        },
        'frontend': 'https://seekers-blog.vercel.app'
    })

urlpatterns = [
    path('', api_root, name='root'),
    path('admin/', admin.site.urls),
    path('api/hero-section/', HeroSectionView.as_view(), name='hero-section'),
    path('api/blog/', include('blog.urls')),
    path('api/devotionals/', include('devotionals.urls')),
]


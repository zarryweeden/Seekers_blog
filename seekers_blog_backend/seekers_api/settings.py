"""
Django settings for seekers_api project.
"""

from pathlib import Path
import os

from dotenv import load_dotenv
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "fallback-key-for-dev")

# Use environment variable for DEBUG
DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'

# ✅ FIXED: Add wildcard domains to catch ALL subdomains
ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    'seekersblog-production.up.railway.app',
    'seekers-blog.vercel.app',
    '.railway.app', 
    '.vercel.app',   
    '.onrender.com', 
]

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'cloudinary_storage',
    'cloudinary',
    'rest_framework',
    'corsheaders',
    'blog',
    'devotionals',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'seekers_api.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'seekers_api.wsgi.application'


import os
from urllib.parse import urlparse

# Check if we have DATABASE_URL (Railway) or individual PG variables
if os.environ.get('DATABASE_URL'):
    # Parse DATABASE_URL
    db_url = urlparse(os.environ.get('DATABASE_URL'))
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': db_url.path[1:],  # Remove leading slash
            'USER': db_url.username,
            'PASSWORD': db_url.password,
            'HOST': db_url.hostname,
            'PORT': db_url.port,
        }
    }
elif all([os.environ.get('PGDATABASE'), os.environ.get('PGUSER'), os.environ.get('PGPASSWORD')]):
    # Use individual PG variables if available
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get('PGDATABASE'),
            'USER': os.environ.get('PGUSER'),
            'PASSWORD': os.environ.get('PGPASSWORD'),
            'HOST': os.environ.get('PGHOST'),
            'PORT': os.environ.get('PGPORT'),
        }
    }
else:
    # Fallback to SQLite for local development only
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage' 

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "https://seekers-blog.vercel.app",
    "http://127.0.0.1:3000",
    "http://localhost:3000",
]

CSRF_TRUSTED_ORIGINS = [
    "https://seekersblog-production.up.railway.app",
    "https://seekers-blog.vercel.app",
]

CORS_ALLOW_ALL_ORIGINS = True




# Use local file storage (Railway has persistent storage)
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': os.environ.get('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': os.environ.get('CLOUDINARY_API_KEY'),
    'API_SECRET': os.environ.get('CLOUDINARY_API_SECRET'),
}




DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'



# DEBUG DATABASE CONFIGURATION
print("=== DATABASE DEBUG INFO ===")
print(f"DATABASE_URL: {os.environ.get('DATABASE_URL')}")
print(f"PGDATABASE: {os.environ.get('PGDATABASE')}")
print(f"PGUSER: {os.environ.get('PGUSER')}") 
print(f"PGPASSWORD: {os.environ.get('PGPASSWORD')}")
print(f"PGHOST: {os.environ.get('PGHOST')}")
print(f"PGPORT: {os.environ.get('PGPORT')}")

print(f"Using database: {DATABASES['default']['ENGINE']}")
print(f"Database name: {DATABASES['default']['NAME']}")
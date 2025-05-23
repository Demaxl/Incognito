from .settings import *
import environ
import os

env = environ.Env()

# Read environment variables from .env file
env.read_env(BASE_DIR / '.env')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('DJANGO_SECRET_KEY')

# Update allowed hosts with your EC2 instance domain/IP
ALLOWED_HOSTS = [env('ALLOWED_HOST'), "localhost"]

# Security settings
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# CORS settings
CORS_ALLOWED_ORIGINS = [
    env('FRONTEND_URL'),
]
CSRF_TRUSTED_ORIGINS = [
    env('FRONTEND_URL'),
]

# Cookie settings
SESSION_COOKIE_DOMAIN = env('COOKIE_DOMAIN')
CSRF_COOKIE_DOMAIN = env('COOKIE_DOMAIN')

# AWS S3 Configuration
# Configure S3 storage for both media and static files
AWS_S3_OPTIONS = {
    'bucket_name': env('AWS_STORAGE_BUCKET_NAME'),
    'region_name': env('AWS_S3_REGION_NAME'),
    'custom_domain': env('AWS_CLOUDFRONT_DOMAIN'),
    'object_parameters': {
        'CacheControl': 'max-age=86400',
    },
    'querystring_auth': False,
}

STORAGES = {
    'default': {
        'BACKEND': 'storages.backends.s3.S3Storage',
        'OPTIONS': {
            **AWS_S3_OPTIONS,
            'location': 'media',
        },
    },
    'staticfiles': {
        'BACKEND': 'storages.backends.s3.S3Storage',
        'OPTIONS': {
            **AWS_S3_OPTIONS,
            'location': 'static',  # Store static files in a 'static' subfolder
        },
    },
}

STATIC_URL = f'https://{env('AWS_CLOUDFRONT_DOMAIN')}/static/'
MEDIA_URL = f'https://{env('AWS_CLOUDFRONT_DOMAIN')}/media/'


# Remove debug toolbar
INSTALLED_APPS.remove('debug_toolbar')
MIDDLEWARE.remove('debug_toolbar.middleware.DebugToolbarMiddleware')

# Cache configuration (optional, for better performance)
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
}

# Logging configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'logs/django.log'),
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}

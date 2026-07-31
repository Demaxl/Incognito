from .settings import *
import environ
import os

env = environ.Env()

# Read environment variables from .env file (local) or process env (hosted)
env.read_env(BASE_DIR / '.env')

DEBUG = False

SECRET_KEY = env('DJANGO_SECRET_KEY')

ALLOWED_HOSTS = [
    host.strip()
    for host in env('ALLOWED_HOSTS', default=env('ALLOWED_HOST', default='')).split(',')
    if host.strip()
]

# Security settings (Render / Vercel terminate TLS; trust X-Forwarded-Proto)
SECURE_SSL_REDIRECT = env.bool('SECURE_SSL_REDIRECT', default=True)
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

FRONTEND_URL = env('FRONTEND_URL')

CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in env.list('CORS_ALLOWED_ORIGINS', default=[FRONTEND_URL])
    if origin.strip()
]
CSRF_TRUSTED_ORIGINS = [
    origin.strip()
    for origin in env.list('CSRF_TRUSTED_ORIGINS', default=[FRONTEND_URL])
    if origin.strip()
]

# Shared parent domain so session cookies work on api.* and apex/www
# e.g. .incgt.link
SESSION_COOKIE_DOMAIN = env('COOKIE_DOMAIN')
CSRF_COOKIE_DOMAIN = env('COOKIE_DOMAIN')
SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SAMESITE = 'Lax'

# WhiteNoise serves Django static files (admin, DRF) without a CDN
MIDDLEWARE.insert(
    MIDDLEWARE.index('django.middleware.security.SecurityMiddleware') + 1,
    'whitenoise.middleware.WhiteNoiseMiddleware',
)

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Media: Cloudflare R2 (S3-compatible). Falls back to local disk if unset.
USE_S3_MEDIA = env.bool('USE_S3_MEDIA', default=bool(env('R2_BUCKET_NAME', default='')))

if USE_S3_MEDIA:
    AWS_ACCESS_KEY_ID = env('R2_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = env('R2_SECRET_ACCESS_KEY')
    AWS_STORAGE_BUCKET_NAME = env('R2_BUCKET_NAME')
    AWS_S3_ENDPOINT_URL = env('R2_ENDPOINT_URL')
    AWS_S3_REGION_NAME = env('R2_REGION_NAME', default='auto')
    AWS_S3_CUSTOM_DOMAIN = env('R2_CUSTOM_DOMAIN', default=None)
    AWS_DEFAULT_ACL = None
    AWS_QUERYSTRING_AUTH = False
    AWS_S3_OBJECT_PARAMETERS = {
        'CacheControl': 'max-age=86400',
    }

    media_options = {
        'bucket_name': AWS_STORAGE_BUCKET_NAME,
        'endpoint_url': AWS_S3_ENDPOINT_URL,
        'region_name': AWS_S3_REGION_NAME,
        'default_acl': None,
        'querystring_auth': False,
        'object_parameters': AWS_S3_OBJECT_PARAMETERS,
        'location': 'media',
    }
    if AWS_S3_CUSTOM_DOMAIN:
        media_options['custom_domain'] = AWS_S3_CUSTOM_DOMAIN

    STORAGES = {
        'default': {
            'BACKEND': 'storages.backends.s3.S3Storage',
            'OPTIONS': media_options,
        },
        'staticfiles': {
            'BACKEND': 'whitenoise.storage.CompressedStaticFilesStorage',
        },
    }

    if AWS_S3_CUSTOM_DOMAIN:
        MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/media/'
    else:
        MEDIA_URL = f'{AWS_S3_ENDPOINT_URL.rstrip("/")}/{AWS_STORAGE_BUCKET_NAME}/media/'
    MEDIA_URL_BASE = ''
else:
    STORAGES = {
        'default': {
            'BACKEND': 'django.core.files.storage.FileSystemStorage',
        },
        'staticfiles': {
            'BACKEND': 'whitenoise.storage.CompressedStaticFilesStorage',
        },
    }
    MEDIA_URL = '/media/'
    MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
    MEDIA_URL_BASE = env('MEDIA_URL_BASE', default='')

# Remove debug toolbar
if 'debug_toolbar' in INSTALLED_APPS:
    INSTALLED_APPS.remove('debug_toolbar')
if 'debug_toolbar.middleware.DebugToolbarMiddleware' in MIDDLEWARE:
    MIDDLEWARE.remove('debug_toolbar.middleware.DebugToolbarMiddleware')

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
}

LOG_DIR = os.path.join(BASE_DIR, 'logs')
os.makedirs(LOG_DIR, exist_ok=True)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
        },
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': os.path.join(LOG_DIR, 'django.log'),
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}

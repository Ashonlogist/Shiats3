from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.http import JsonResponse, HttpResponseNotFound
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework_simplejwt.views import TokenRefreshView

def custom_404(request, exception=None):
    """Custom 404 handler that returns JSON for API requests"""
    if request.path.startswith('/api/'):
        return JsonResponse({
            'status': 'error',
            'message': 'API endpoint not found',
            'status_code': 404
        }, status=404)
    # For non-API requests, return a simple 404 response
    return HttpResponseNotFound('<h1>Page not found</h1><p>The requested page does not exist.</p>')

# API Schema and Documentation
schema_view = get_schema_view(
   openapi.Info(
      title="Shiats3 API",
      default_version='v1',
      description="API for Shiats3 Real Estate Platform",
      terms_of_service="https://www.shiats3.com/terms/",
      contact=openapi.Contact(email="contact@shiats3.com"),
      license=openapi.License(name="Proprietary"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    # Admin site
    path('admin/', admin.site.urls),
    
    # API Documentation
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    # API v1
    path('api/v1/', include([
        # Authentication (Custom JWT + Djoser)
        path('auth/', include('accounts.urls')),  # Our custom auth endpoints
        path('auth/social/', include('djoser.social.urls')),  # Keep social auth if needed
        
        # Properties app
        path('', include('properties.urls')),
        
        # Dashboard
        path('dashboard/', include('dashboard.urls')),
        
        # API health check
        path('health/', include('health_check.urls')),
    ])),
    
        # Frontend catch-all (for React Router)
    re_path(r'^(?!api/|admin/|media/|static/|__debug__/).*$', 
            TemplateView.as_view(template_name='index.html'), 
            name='frontend'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    
    # Debug toolbar
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns

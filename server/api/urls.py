from django.urls import path
from . import views

app_name = 'api'

urlpatterns = [
    # File upload and management endpoints
    path('files/', views.FileUploadView.as_view(), name='file-upload'),
    path('files/list/', views.FileListView.as_view(), name='file-list'),
    path('files/<int:id>/', views.FileDetailView.as_view(), name='file-detail'),
]

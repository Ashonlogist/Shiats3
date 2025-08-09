from django.urls import path
from . import views

app_name = 'dashboard'

urlpatterns = [
    path('', views.DashboardView.as_view(), name='dashboard'),
    path('admin/', views.AdminDashboardView.as_view(), name='admin_dashboard'),
    path('agent/', views.AgentDashboardView.as_view(), name='agent_dashboard'),
    path('hotel-manager/', views.HotelManagerDashboardView.as_view(), name='hotel_manager_dashboard'),
]

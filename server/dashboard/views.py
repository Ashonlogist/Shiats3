from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import (
    AdminDashboardSerializer,
    AgentDashboardSerializer,
    HotelManagerDashboardSerializer,
    get_dashboard_data
)

class DashboardView(APIView):
    """Base dashboard view that routes to the appropriate dashboard based on user role."""
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        """Return the appropriate serializer based on user role."""
        user = self.request.user
        if user.user_type == user.UserType.ADMIN:
            return AdminDashboardSerializer
        elif user.user_type == user.UserType.AGENT:
            return AgentDashboardSerializer
        elif user.user_type == user.UserType.HOTEL_MANAGER:
            return HotelManagerDashboardSerializer
        return None
    
    def get(self, request, *args, **kwargs):
        """Handle GET request to retrieve dashboard data."""
        user = request.user
        
        # Get dashboard data based on user role
        data = get_dashboard_data(user)
        
        # Serialize the data
        serializer_class = self.get_serializer_class()
        if serializer_class is None:
            return Response(
                {'detail': 'No dashboard available for this user type.'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        serializer = serializer_class(data=data)
        if not serializer.is_valid():
            return Response(
                {'detail': 'Error generating dashboard data.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
        return Response(serializer.validated_data)

class AdminDashboardView(DashboardView):
    """Admin-specific dashboard view."""
    def get_serializer_class(self):
        return AdminDashboardSerializer

class AgentDashboardView(DashboardView):
    """Agent-specific dashboard view."""
    def get_serializer_class(self):
        return AgentDashboardSerializer

class HotelManagerDashboardView(DashboardView):
    """Hotel Manager-specific dashboard view."""
    def get_serializer_class(self):
        return HotelManagerDashboardSerializer

from rest_framework import serializers
from accounts.models import User
from properties.models import Property, Booking
from django.db.models import Count, Sum, Q
from datetime import datetime, timedelta

class DashboardStatsSerializer(serializers.Serializer):
    """Serializer for dashboard statistics."""
    total_properties = serializers.IntegerField(default=0)
    active_listings = serializers.IntegerField(default=0)
    total_bookings = serializers.IntegerField(default=0)
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2, default=0)
    recent_activities = serializers.ListField(child=serializers.DictField(), default=list)

class AdminDashboardSerializer(DashboardStatsSerializer):
    """Admin dashboard specific statistics."""
    total_users = serializers.IntegerField(default=0)
    total_agents = serializers.IntegerField(default=0)
    total_hotel_managers = serializers.IntegerField(default=0)
    recent_users = serializers.ListField(child=serializers.DictField(), default=list)

class AgentDashboardSerializer(DashboardStatsSerializer):
    """Agent dashboard specific statistics."""
    pending_inquiries = serializers.IntegerField(default=0)
    scheduled_viewings = serializers.IntegerField(default=0)
    recent_inquiries = serializers.ListField(child=serializers.DictField(), default=list)

class HotelManagerDashboardSerializer(DashboardStatsSerializer):
    """Hotel Manager dashboard specific statistics."""
    total_rooms = serializers.IntegerField(default=0)
    available_rooms = serializers.IntegerField(default=0)
    occupancy_rate = serializers.FloatField(default=0)
    upcoming_bookings = serializers.ListField(child=serializers.DictField(), default=list)

def get_dashboard_data(user):
    """Get dashboard data based on user role."""
    if user.user_type == user.UserType.ADMIN:
        return get_admin_dashboard_data(user)
    elif user.user_type == user.UserType.AGENT:
        return get_agent_dashboard_data(user)
    elif user.user_type == user.UserType.HOTEL_MANAGER:
        return get_hotel_manager_dashboard_data(user)
    return {}

def get_admin_dashboard_data(user):
    """Get dashboard data for admin users."""
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    # Basic stats
    total_users = User.objects.count()
    total_agents = User.objects.filter(user_type=User.UserType.AGENT).count()
    total_hotel_managers = User.objects.filter(user_type=User.UserType.HOTEL_MANAGER).count()
    
    # Property stats
    total_properties = Property.objects.count()
    active_listings = Property.objects.filter(is_published=True).count()
    
    # Booking stats
    total_bookings = Booking.objects.count()
    total_revenue = Booking.objects.aggregate(
        total=Sum('total_price')
    )['total'] or 0
    
    # Recent activities (last 10)
    recent_users = User.objects.order_by('-date_joined')[:5].values(
        'id', 'email', 'first_name', 'last_name', 'date_joined', 'user_type'
    )
    
    return {
        'total_users': total_users,
        'total_agents': total_agents,
        'total_hotel_managers': total_hotel_managers,
        'total_properties': total_properties,
        'active_listings': active_listings,
        'total_bookings': total_bookings,
        'total_revenue': total_revenue,
        'recent_users': list(recent_users),
        'recent_activities': []  # TODO: Add activity log
    }

def get_agent_dashboard_data(user):
    """Get dashboard data for agent users."""
    # Properties managed by this agent
    agent_properties = Property.objects.filter(agent=user)
    total_properties = agent_properties.count()
    active_listings = agent_properties.filter(is_published=True).count()
    
    # Bookings for agent's properties
    agent_bookings = Booking.objects.filter(property__in=agent_properties)
    total_bookings = agent_bookings.count()
    total_revenue = agent_bookings.aggregate(
        total=Sum('total_price')
    )['total'] or 0
    
    # Inquiries and viewings
    from properties.models import Inquiry, Viewing
    pending_inquiries = Inquiry.objects.filter(
        property__in=agent_properties,
        status='pending'
    ).count()
    
    scheduled_viewings = Viewing.objects.filter(
        property__in=agent_properties,
        status='scheduled'
    ).count()
    
    # Recent inquiries
    recent_inquiries = Inquiry.objects.filter(
        property__in=agent_properties
    ).order_by('-created_at')[:5].values(
        'id', 'property__title', 'name', 'email', 'phone', 'status', 'created_at'
    )
    
    return {
        'total_properties': total_properties,
        'active_listings': active_listings,
        'total_bookings': total_bookings,
        'total_revenue': total_revenue,
        'pending_inquiries': pending_inquiries,
        'scheduled_viewings': scheduled_viewings,
        'recent_inquiries': list(recent_inquiries),
        'recent_activities': []  # TODO: Add activity log
    }

def get_hotel_manager_dashboard_data(user):
    """Get dashboard data for hotel manager users."""
    from properties.models import Room, Booking
    
    # Get hotel managed by this user
    from properties.models import Hotel
    try:
        hotel = Hotel.objects.get(manager=user)
    except Hotel.DoesNotExist:
        return {
            'total_rooms': 0,
            'available_rooms': 0,
            'occupancy_rate': 0,
            'total_properties': 0,
            'active_listings': 0,
            'total_bookings': 0,
            'total_revenue': 0,
            'upcoming_bookings': [],
            'recent_activities': []
        }
    
    # Room stats
    total_rooms = Room.objects.filter(hotel=hotel).count()
    
    # Get bookings for the next 30 days
    today = datetime.now().date()
    thirty_days_later = today + timedelta(days=30)
    
    upcoming_bookings = Booking.objects.filter(
        room__hotel=hotel,
        check_in_date__lte=thirty_days_later,
        check_out_date__gte=today,
        status__in=['confirmed', 'completed']
    ).order_by('check_in_date')[:10].values(
        'id', 'user__email', 'check_in_date', 'check_out_date', 'total_price', 'status'
    )
    
    # Calculate occupancy rate for the next 30 days
    total_nights = 30 * total_rooms
    if total_nights > 0:
        booked_nights = sum(
            (min(booking['check_out_date'], thirty_days_later) - 
             max(booking['check_in_date'], today)).days
            for booking in upcoming_bookings
        )
        occupancy_rate = (booked_nights / total_nights) * 100
    else:
        occupancy_rate = 0
    
    # Available rooms (simplified)
    available_rooms = Room.objects.filter(
        hotel=hotel,
        is_available=True
    ).count()
    
    # Booking stats
    hotel_bookings = Booking.objects.filter(room__hotel=hotel)
    total_bookings = hotel_bookings.count()
    total_revenue = hotel_bookings.aggregate(
        total=Sum('total_price')
    )['total'] or 0
    
    return {
        'total_rooms': total_rooms,
        'available_rooms': available_rooms,
        'occupancy_rate': round(occupancy_rate, 2),
        'total_properties': 1,  # The hotel itself
        'active_listings': 1 if hotel.is_published else 0,
        'total_bookings': total_bookings,
        'total_revenue': total_revenue,
        'upcoming_bookings': list(upcoming_bookings),
        'recent_activities': []  # TODO: Add activity log
    }

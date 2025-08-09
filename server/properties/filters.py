import django_filters
from django.db import models
from .models import Property

class PropertyFilter(django_filters.FilterSet):
    """
    Simple filter for Property model that avoids complex form handling.
    This is a workaround for compatibility issues with django-filter and DRF.
    """
    # Define explicit filters instead of using Meta.fields
    property_type = django_filters.CharFilter(lookup_expr='iexact')
    listing_type = django_filters.CharFilter(lookup_expr='iexact')
    bedrooms = django_filters.NumberFilter()
    bathrooms = django_filters.NumberFilter()
    city = django_filters.CharFilter(lookup_expr='icontains')
    country = django_filters.CharFilter(lookup_expr='icontains')
    is_featured = django_filters.BooleanFilter()
    price = django_filters.NumberFilter()
    price__gt = django_filters.NumberFilter(field_name='price', lookup_expr='gt')
    price__lt = django_filters.NumberFilter(field_name='price', lookup_expr='lt')
    price__gte = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    price__lte = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    area = django_filters.NumberFilter()
    area__gt = django_filters.NumberFilter(field_name='area', lookup_expr='gt')
    area__lt = django_filters.NumberFilter(field_name='area', lookup_expr='lt')
    area__gte = django_filters.NumberFilter(field_name='area', lookup_expr='gte')
    area__lte = django_filters.NumberFilter(field_name='area', lookup_expr='lte')
    
    class Meta:
        model = Property
        fields = []  # We're defining all fields explicitly above

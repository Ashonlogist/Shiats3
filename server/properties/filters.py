import django_filters
from django import forms
from django.db import models
from .models import Property

class PropertyFilter(django_filters.FilterSet):
    # Custom filters
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    min_bedrooms = django_filters.NumberFilter(field_name='bedrooms', lookup_expr='gte')
    min_bathrooms = django_filters.NumberFilter(field_name='bathrooms', lookup_expr='gte')
    min_area = django_filters.NumberFilter(field_name='area', lookup_expr='gte')
    max_area = django_filters.NumberFilter(field_name='area', lookup_expr='lte')
    
    class Meta:
        model = Property
        form = forms.Form  # Use a basic form to avoid issues with model forms
        fields = {
            'property_type': ['exact'],
            'listing_type': ['exact'],
            'bedrooms': ['exact', 'gte', 'lte'],
            'bathrooms': ['exact', 'gte', 'lte'],
            'city': ['exact', 'icontains'],
            'country': ['exact', 'icontains'],
            'is_featured': ['exact'],
            'price': ['exact', 'lt', 'gt', 'lte', 'gte'],
            'area': ['exact', 'lt', 'gt', 'lte', 'gte'],
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Ensure all filters have a field_class
        for name, filter_ in self.filters.items():
            if not hasattr(filter_, 'field_class'):
                filter_.field_class = forms.CharField  # Default to CharField if not set

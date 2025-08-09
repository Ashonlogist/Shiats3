from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Custom user admin to handle our custom user model.
    """
    # Fields to be used in displaying the User model
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {
            'fields': ('first_name', 'last_name', 'phone_number', 'profile_picture')
        }),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {
            'fields': ('last_login', 'date_joined'),
            'classes': ('collapse',)  # Makes this section collapsible
        }),
    )
    # Add user form doesn't need last_login and date_joined
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    filter_horizontal = ('groups', 'user_permissions',)
    readonly_fields = ('last_login', 'date_joined')  # Make these fields read-only
    
    def get_readonly_fields(self, request, obj=None):
        """
        Make all fields read-only for non-superusers
        """
        if not request.user.is_superuser:
            return [f.name for f in self.model._meta.fields]
        return super().get_readonly_fields(request, obj)

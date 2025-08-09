from django.contrib import admin
from .models import Property, PropertyImage, Hotel, RoomType, RoomImage, Booking, Amenity, Inquiry, BlogPost, Tag

admin.site.register(Property)
admin.site.register(PropertyImage)
admin.site.register(Hotel)
admin.site.register(RoomType)
admin.site.register(RoomImage)
admin.site.register(Booking)
admin.site.register(Amenity)
admin.site.register(Inquiry)
admin.site.register(BlogPost)
admin.site.register(Tag)

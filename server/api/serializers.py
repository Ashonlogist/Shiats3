from rest_framework import serializers
from .models import UploadedFile

class UploadedFileSerializer(serializers.ModelSerializer):
    """Serializer for the UploadedFile model."""
    file = serializers.FileField(use_url=True)
    file_size = serializers.SerializerMethodField()
    
    class Meta:
        model = UploadedFile
        fields = [
            'id', 'file', 'original_filename', 'file_size',
            'mime_type', 'uploaded_at', 'processed', 'processing_errors'
        ]
        read_only_fields = [
            'id', 'original_filename', 'file_size', 'mime_type',
            'uploaded_at', 'processed', 'processing_errors'
        ]
    
    def get_file_size(self, obj):
        if obj.file_size:
            return obj.file_size
        try:
            return obj.file.size
        except (FileNotFoundError, ValueError):
            return None

    def validate_file(self, value):
        max_size = 10 * 1024 * 1024  # 10MB
        if value.size > max_size:
            raise serializers.ValidationError("File size should not exceed 10MB.")
        
        # Check file extension
        valid_extensions = ['.xml']
        import os
        ext = os.path.splitext(value.name)[1].lower()
        if ext not in valid_extensions:
            raise serializers.ValidationError("Only XML files are allowed.")
        
        return value
    
    def create(self, validated_data):
        file_obj = validated_data.get('file')
        
        # Create the model instance
        instance = UploadedFile(
            file=file_obj,
            original_filename=file_obj.name,
            file_size=file_obj.size,
            mime_type=file_obj.content_type or 'application/octet-stream'
        )
        
        # Save the instance
        instance.save()
        
        return instance

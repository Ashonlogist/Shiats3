from django.db import models

class UploadedFile(models.Model):
    """Model to store uploaded XML files and their processing status."""
    file = models.FileField(upload_to='uploads/xml/')
    original_filename = models.CharField(max_length=255)
    file_size = models.PositiveIntegerField()
    mime_type = models.CharField(max_length=100)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    processed = models.BooleanField(default=False)
    processing_errors = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.original_filename} ({'Processed' if self.processed else 'Pending'})"

    class Meta:
        ordering = ['-uploaded_at']
        verbose_name = 'Uploaded File'
        verbose_name_plural = 'Uploaded Files'

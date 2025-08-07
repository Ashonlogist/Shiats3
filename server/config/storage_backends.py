from storages.backends.s3boto3 import S3Boto3Storage

class MediaStorage(S3Boto3Storage):
    """
    Custom storage backend for media files in S3.
    """
    location = 'media'
    file_overwrite = False
    default_acl = 'public-read'

class StaticStorage(S3Boto3Storage):
    """
    Custom storage backend for static files in S3.
    """
    location = 'static'
    default_acl = 'public-read'

from rest_framework import status, generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import UploadedFile
from .serializers import UploadedFileSerializer

class FileUploadView(APIView):
    """
    API endpoint that allows files to be uploaded.
    """
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [permissions.AllowAny]  # For development only
    
    def post(self, request, format=None):
        serializer = UploadedFileSerializer(data=request.data)
        
        if serializer.is_valid():
            file_obj = serializer.save()
            return Response(
                {
                    'id': file_obj.id,
                    'status': 'success',
                    'message': 'File uploaded successfully',
                    'file': UploadedFileSerializer(file_obj).data
                },
                status=status.HTTP_201_CREATED
            )
        
        return Response(
            {
                'status': 'error',
                'errors': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )


class FileListView(generics.ListAPIView):
    """
    API endpoint that lists all uploaded files.
    """
    queryset = UploadedFile.objects.all()
    serializer_class = UploadedFileSerializer
    permission_classes = [permissions.AllowAny]  # For development only


class FileDetailView(generics.RetrieveAPIView):
    """
    API endpoint that retrieves a specific uploaded file.
    """
    queryset = UploadedFile.objects.all()
    serializer_class = UploadedFileSerializer
    permission_classes = [permissions.AllowAny]  # For development only
    lookup_field = 'id'

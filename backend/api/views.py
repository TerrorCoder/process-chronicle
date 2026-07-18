from rest_framework import viewsets, status
from rest_framework.response import Response
from .serializers import GenerateSummaryRequestSerializer
from .services.llm import generate_process_summary

class SummaryViewSet(viewsets.ViewSet):
    """
    ViewSet to handle process summary generation requests.
    """
    def create(self, request):
        serializer = GenerateSummaryRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        validated_data = serializer.validated_data
        title = validated_data.get('title')
        drafts = validated_data.get('drafts')
        reflection = validated_data.get('reflection', '')
        
        try:
            summary = generate_process_summary(title, drafts, reflection)
            return Response({'summary': summary}, status=status.HTTP_200_OK)
        except ValueError as e:
            # This is raised when the environment keys are missing
            return Response(
                {
                    'error': 'ConfigurationError',
                    'message': str(e),
                    'details': 'LLM API key is missing on the server. Please add GEMINI_API_KEY to your .env file.'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            # This is raised when the LLM call itself fails
            return Response(
                {
                    'error': 'LLMApiFailure',
                    'message': str(e),
                    'details': 'The LLM service returned an error. Please verify the API key is active and check network logs.'
                },
                status=status.HTTP_502_BAD_GATEWAY
            )

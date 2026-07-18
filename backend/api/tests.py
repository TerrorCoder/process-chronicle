from unittest.mock import patch
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

class SummaryAPITests(APITestCase):
    def setUp(self):
        # Default router creates URL at /api/generate-summary/
        self.url = '/api/generate-summary/'
        self.valid_payload = {
            "title": "On Memory and Migration",
            "drafts": [
                {"label": "Draft 1", "content": "Initial content about memory."},
                {"label": "Final", "content": "Final version of memory essay."}
            ],
            "reflection": "I updated it for structure."
        }

    def test_validation_missing_fields(self):
        """Test that missing required fields fails validation."""
        response = self.client.post(self.url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('title', response.data)
        self.assertIn('drafts', response.data)

    def test_validation_too_few_drafts(self):
        """Test that having fewer than 2 drafts fails validation."""
        payload = self.valid_payload.copy()
        payload['drafts'] = [{"label": "Draft 1", "content": "Single draft."}]
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('drafts', response.data)

    def test_validation_too_many_drafts(self):
        """Test that having more than 10 drafts fails validation."""
        payload = self.valid_payload.copy()
        payload['drafts'] = [{"label": f"Draft {i}", "content": "text"} for i in range(11)]
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('drafts', response.data)

    def test_validation_content_too_long(self):
        """Test that a draft exceeding character limit fails validation."""
        payload = self.valid_payload.copy()
        payload['drafts'] = [
            {"label": "Draft 1", "content": "a" * 50001},
            {"label": "Draft 2", "content": "text"}
        ]
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('drafts', response.data)

    @patch('api.views.generate_process_summary')
    def test_successful_generation(self, mock_generate):
        """Test successful summary generation with mocked LLM service."""
        mock_generate.return_value = "Mocked process summary paragraph from LLM."
        
        response = self.client.post(self.url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['summary'], "Mocked process summary paragraph from LLM.")
        mock_generate.assert_called_once_with(
            "On Memory and Migration",
            self.valid_payload['drafts'],
            "I updated it for structure."
        )

    @patch('api.views.generate_process_summary')
    def test_api_key_missing(self, mock_generate):
        """Test that missing API key returns 500 Internal Server Error."""
        mock_generate.side_effect = ValueError("Neither GEMINI_API_KEY nor OPENAI_API_KEY is configured in the environment.")
        
        response = self.client.post(self.url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertEqual(response.data['error'], 'ConfigurationError')
        self.assertIn('LLM API key is missing', response.data['details'])

    @patch('api.views.generate_process_summary')
    def test_llm_api_failure(self, mock_generate):
        """Test that LLM API failure returns 502 Bad Gateway."""
        mock_generate.side_effect = Exception("API rate limit exceeded or network error")
        
        response = self.client.post(self.url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_502_BAD_GATEWAY)
        self.assertEqual(response.data['error'], 'LLMApiFailure')


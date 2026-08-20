# Process Chronicle Backend (Django REST API)

![Django](https://img.shields.io/badge/Django-5.x-092E20?logo=django&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)
![License: PolyForm Noncommercial](https://img.shields.io/badge/License-PolyForm_Noncommercial_1.0.0-blue.svg)

The backend service for **Process Chronicle** (Proof of Process) provides a clean, stateless REST API that analyzes sequential writing drafts and generates an objective process summary utilizing Large Language Models (LLMs).

---

## Features & Capabilities

- **Stateless Summary Generation**: Processes chronological draft sequences, labels, and author reflections to construct a cohesive paragraph outlining structural writing evolution.
- **Multi-LLM Provider Support**: Configured to use Google Gemini API (`google-generativeai`) as the primary model with fallback to OpenAI API (`openai`).
- **Input Validation & Safety Limits**: Enforces minimum draft count rules (requires at least 2 drafts), caps draft entries (up to 10), and validates character lengths to prevent API misuse.
- **CORS Enabled**: Configured out-of-the-box via `django-cors-headers` to support web frontends running across different ports or origins.
- **Privacy-First Processing**: Does not persist or record draft content to a database; requests are processed dynamically in memory and returned directly to the caller.

---

## Installation & Setup

### 1. Prerequisites
- **Python 3.10+** (tested up to Python 3.14.x)
- **pip** (Python package manager)

### 2. Virtual Environment Setup

Navigate to the `backend` directory and set up a virtual environment:

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# On Windows (Command Prompt):
venv\Scripts\activate.bat
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Variables Configuration

Copy `.env.example` to create `.env`:

```bash
cp .env.example .env
```

Configure your environment keys inside `.env`:

```env
SECRET_KEY=your-custom-django-secret-key
DEBUG=True
ALLOWED_HOSTS=*
GEMINI_API_KEY=your-gemini-api-key-here
# OR
OPENAI_API_KEY=your-openai-api-key-here
```

> **Note**: The backend provides clear error responses (`500 Internal Server Error`) if no LLM API keys are configured, or (`502 Bad Gateway`) if the upstream LLM service call fails.

### 4. Running Database Migrations & Server

```bash
# Apply Django migrations
python manage.py migrate

# Start development server
python manage.py runserver
```

The Django REST API service will listen at `http://localhost:8000/`.

---

## API Endpoints

### `POST /api/generate-summary/`

Accepts JSON payload containing project title, draft items, and author reflection, returning an LLM-synthesized narrative summary.

#### Endpoint Specifications
- **Content-Type**: `application/json`
- **Method**: `POST`

#### Example Request Payload
```json
{
  "title": "On Memory and Migration",
  "drafts": [
    {
      "label": "Draft 1",
      "content": "This is the initial draft exploring personal migration narratives..."
    },
    {
      "label": "Revision 1",
      "content": "This revised version tightens structural transitions and expands memory themes..."
    },
    {
      "label": "Final Draft",
      "content": "The final version refines tone, word choice, and concluding arguments..."
    }
  ],
  "reflection": "I adjusted the introduction in Revision 1 to hook the reader with narrative context rather than raw statistics."
}
```

#### Example Successful Response (`200 OK`)
```json
{
  "summary": "Across 3 versions, \"On Memory and Migration\" evolved from an exploratory narrative into a structured final piece. Initial revisions tightened conceptual focus, while subsequent edits refined tone, clarity, and word choice. The writer's reflection highlights a deliberate decision to substitute statistics with personal narrative, enhancing the introductory hook."
}
```

#### Error Handling Responses
- **`400 Bad Request`** (Validation error):
  ```json
  {
    "drafts": ["At least two drafts are required to analyze changes."]
  }
  ```
- **`500 Internal Server Error`** (Configuration missing):
  ```json
  {
    "error": "ConfigurationError",
    "message": "Neither GEMINI_API_KEY nor OPENAI_API_KEY is configured in the environment.",
    "details": "LLM API key is missing on the server. Please add GEMINI_API_KEY to your .env file."
  }
  ```
- **`502 Bad Gateway`** (Upstream Provider Error):
  ```json
  {
    "error": "LLMApiFailure",
    "message": "Failed to generate summary from LLM service provider."
  }
  ```

---

## License

Licensed under the **PolyForm Noncommercial License 1.0.0**. See the root [LICENSE](file:///c:/Users/Rose/Documents/Antigravity/process-chronicle/LICENSE) file for complete licensing terms.

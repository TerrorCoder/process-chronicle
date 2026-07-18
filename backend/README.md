# Proof of Process Backend (Django API)

Welcome to the backend service for **Proof of Process**, built for **Hoobit Hacks 2026**!
This backend is a simple, clean, stateless Django REST Framework API that analyzes essay drafts and generates an objective "Process Summary" utilizing a Large Language Model (LLM).

## Features
- **Stateless Summary Generation**: Analyzes chronological drafts, draft labels, and an optional student reflection.
- **Dual-LLM Support**: Configured to use Google Gemini API as the primary model with an option to fall back to/use OpenAI API.
- **Basic Input Validation**: Rejects requests with no drafts (or fewer than 2), caps draft counts to 10, and validates text character limits to control API abuse/cost issues.
- **CORS Enabled**: Out-of-the-box support allowing local static frontends (e.g. React/Vite running on separate ports) to interact without CORS block.

---

## Getting Started

### 1. Prerequisites
Ensure you have **Python 3.10+** (tested up to Python 3.14.x) installed on your system.

### 2. Installation
Navigate to this directory (`backend`) and create a Python virtual environment:

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows (Command Prompt):
venv\Scripts\activate.bat
# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Variables
Copy `.env.example` to a new `.env` file:

```bash
cp .env.example .env
```

Open `.env` and fill in the required values:
- **`SECRET_KEY`**: Set a custom Django secret key.
- **`GEMINI_API_KEY`**: (Recommended) Provide your Google AI/Gemini API key.
- **`OPENAI_API_KEY`**: (Optional fallback) Provide your OpenAI API key.

*Note: The backend will fail gracefully with a descriptive error message if no API keys are provided or if the API calls fail.*

### 4. Running the Server
Ensure your virtual environment is active and run:

```bash
python manage.py runserver
```

The Django REST API will be running at `http://localhost:8000/`.

---

## API Endpoints

### `POST /api/generate-summary/`

Accepts a JSON payload detailing the essay title, draft list, and reflection, and returns the LLM-generated summary.

#### Request Structure
```json
{
  "title": "On Memory and Migration",
  "drafts": [
    {
      "label": "Draft 1",
      "content": "This is the very first draft of the essay about migration..."
    },
    {
      "label": "Revision 1",
      "content": "This is a revised draft. The focus of migration has been expanded..."
    },
    {
      "label": "Final Draft",
      "content": "This is the final draft. It refines the tone and improves argument structure..."
    }
  ],
  "reflection": "I rewrote the opening because I wanted to hook the reader with a narrative instead of statistics."
}
```

#### Success Response (`200 OK`)
```json
{
  "summary": "Across 3 versions, \"On Memory and Migration\" evolved from an exploratory, narrative-heavy draft to a structured final piece. In the first draft, the writer began with an exploratory focus which later revisions tightened into a cohesive argument about memory. Revisions show substantial restructuring, while the final draft focuses on polishing tone, clarity, and word choice. The writer's reflection highlights a deliberate decision to substitute academic statistics with a personal narrative hook, which significantly enhanced the introduction's resonance."
}
```

#### Error Response Examples
- **`400 Bad Request`** (Validation Failure):
  ```json
  {
    "drafts": [
      "At least two drafts are required to analyze changes."
    ]
  }
  ```
- **`500 Internal Server Error`** (Configuration Error):
  ```json
  {
    "error": "ConfigurationError",
    "message": "Neither GEMINI_API_KEY nor OPENAI_API_KEY is configured in the environment.",
    "details": "LLM API key is missing on the server. Please add GEMINI_API_KEY to your .env file."
  }
  ```
- **`502 Bad Gateway`** (LLM API Failure):
  ```json
  {
    "error": "LLMApiFailure",
    "message": "Failed to generate summary: User location is not supported...",
    "details": "The LLM service returned an error. Please verify the API key is active and check network logs."
  }
  ```

# Proof of Process (Process Chronicle) 

> **Hoobit Hacks 2026 Hackathon Project**
> A verifiable record of human authorship, documenting the *evolution* of writing to prove authentic creation without unreliable AI detectors.

---

## The Inspiration & The Problem

In an era dominated by generative AI, honest writers are facing a major challenge: **unreliable AI detectors**. Academic institutions and publishers rely on black-box tools that produce high rates of false positives—especially for non-native English speakers.

Instead of trying to analyze a static final document *post-factum*, **Proof of Process** takes a completely different approach: it tracks the **historical evolution of the text**. By showing *how* a piece of writing grew from a rough brainstorm, through structural changes, to a final polished draft, writers can present undeniable, verifiable proof of their own human thinking.

---

## Key Features

1. **Chronological Version Tracking**: Log and visualize multiple draft versions in the order they were written.
2. **Word-Level Diff Analysis**: Interactive side-by-side comparison highlighting word-by-word additions and deletions between subsequent revisions.
3. **AI-Generated Process Summary**: A server-side REST API analyzes structural changes, tone shifts, and the writer's reflections to construct a cohesive paragraph outlining the writing journey.
4. **Author's Reflection Log**: Allows writers to explain *why* they made certain adjustments, adding human intent to the record.
5. **Private & Stateless by Design**: Portfolios are cached locally in the browser (`localStorage`), ensuring complete data privacy.
6. **Smart Caching**: Successfully generated summaries are saved in the local store, avoiding redundant server calls and minimizing API costs.
7. **Polished & Premium UI**: A glowing, modern glassmorphism design with responsive skeleton loaders and transition micro-animations.

---

## Technology Stack

### Frontend

- **Framework**: React 19 (via Vite)
- **Routing**: TanStack Router (Typescript-safe routing)
- **Styling**: Tailwind CSS v4 (with customized glassmorphism themes)
- **Icons**: Lucide React
- **Document Loading**: Mammoth.js (loads `.docx` files directly into drafts)

### Backend

- **Core Framework**: Django 5.x
- **API Engine**: Django REST Framework (DRF)
- **CORS Management**: `django-cors-headers`
- **LLM Integrations**:
  - **Google Gemini API** (via `google-generativeai` SDK)
  - **OpenAI API** (via `openai` SDK as secondary/fallback)
- **Environment config**: `python-dotenv`

---

## Quick Start Guide

### 1. Backend Setup (Django API)

The backend acts as the AI summarizer. Navigate to the `backend` folder, set up your Python environment, and start the API server:

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the environment
# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Create environment file
cp .env.example .env
```

Open `.env` and fill in your Django secret key and API keys:

```env
SECRET_KEY=generate-a-secure-random-key
DEBUG=True
OPENAI_API_KEY=your-openai-api-key-here
# OR
GEMINI_API_KEY=your-gemini-api-key-here
```

Once configured, run the server:

```bash
# Run migrations
python manage.py migrate

# Launch backend
python manage.py runserver
```

The Django REST API runs at `http://localhost:8000/`.

---

### 2. Frontend Setup (React/Vite)

Navigate back to the project root directory, install npm packages, and run the hot-reloading development server:

```bash
# Install dependencies
bun install   # or npm install / yarn install

# Start Vite dev server
bun dev       # or npm run dev
```

The application will open at `http://localhost:5173/`.

---

## Testing the Flow

1. Go to the dashboard and click **Start a new portfolio**.
2. Give your piece a title (e.g. *"The Silence of Cities"*).
3. Paste different versions of your drafts (e.g. starting with a rough 3-sentence draft, followed by an expanded version, and then a polished final text).
4. Fill in the optional reflection text explaining why you made structural adjustments.
5. Click **Generate my portfolio**.
6. Enjoy the beautiful shimmering loading state while the Django REST backend validates your inputs, compiles the drafts, queries the LLM, and prints your verifiable **Process Summary**!

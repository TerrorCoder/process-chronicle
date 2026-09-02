# Proof of Process (Process Chronicle) 

![License: PolyForm Noncommercial](https://img.shields.io/badge/License-PolyForm_Noncommercial_1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)
![Django](https://img.shields.io/badge/Django-5.x-092E20?logo=django&logoColor=white)

> A verifiable record of human authorship, documenting the *evolution* of writing to prove authentic creation without unreliable AI detectors.

---

## Overview & Vision

In an era dominated by generative AI, honest writers face a growing challenge: **unreliable AI detectors**. Academic institutions, publishers, and platforms rely on black-box statistical tools that produce high rates of false positives—especially for non-native speakers, structured technical content, and formal prose.

Instead of trying to analyze a static final document *post-factum*, **Proof of Process** takes an evolutionary approach: it tracks the **historical development of the text**. By documenting how a piece of writing grew from initial thoughts, through structural revisions, to a final polished draft, writers can present clear, verifiable evidence of authentic human thought.

---

## Core Capabilities

1. **Chronological Version Tracking**: Log and visualize multiple draft versions in the exact sequence they were composed.
2. **Word-Level Diff Visualizer**: Interactive side-by-side comparison highlighting word-by-word additions, deletions, and structural changes.
3. **AI-Generated Process Summary**: Server-side REST API analyzes structural changes, tone shifts, and author reflections to construct a cohesive summary of the writing process.
4. **Author's Reflection Log**: Contextual fields for writers to record intentional rationale for major adjustments.
5. **Private & Stateless Architecture**: Portfolios are cached locally in the browser (`localStorage`), ensuring complete data privacy.
6. **Smart Caching**: Process summaries are saved in the client store, preventing redundant server calls and optimizing API usage.
7. **Document Importing**: Direct upload support for `.docx` files via Mammoth.js.

---

## Architecture & Tech Stack

### Frontend Application
- **Framework**: React 19 (via Vite)
- **Routing**: TanStack Router (Typescript file-based routing)
- **Styling**: Tailwind CSS v4 (with custom glassmorphism design system)
- **Icons**: Lucide React
- **Document Loading**: Mammoth.js (loads `.docx` files into draft fields)

### Backend API
- **Framework**: Django 5.x with Django REST Framework (DRF)
- **CORS Management**: `django-cors-headers`
- **LLM Integrations**:
  - Primary: Google Gemini API (`google-generativeai`)
  - Fallback: OpenAI API (`openai`)
- **Environment config**: `python-dotenv`

---

## Quick Setup

### 1. Backend Service (Django API)

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment configuration
cp .env.example .env
```

Set your keys in `backend/.env`:
```env
SECRET_KEY=your-secure-secret-key
GEMINI_API_KEY=your-gemini-api-key
# OR
OPENAI_API_KEY=your-openai-api-key
```

Run database migrations and launch the backend:
```bash
python manage.py migrate
python manage.py runserver
```
The Django REST API operates at `http://localhost:8000/`.

---

### 2. Frontend Web Client (React/Vite)

From the project root directory:
```bash
# Install dependencies
bun install   # or npm install

# Launch development server
bun dev       # or npm run dev
```
The web application will open at `http://localhost:5173/`.

---

## License

This software is licensed under the **PolyForm Noncommercial License 1.0.0**.

Permission is granted to inspect, test, evaluate, and explore the code for noncommercial, research, and educational purposes. Commercial copying, distribution, or reproduction without explicit permission is prohibited; however, terms and licensing for commercial purposes can be negotiated. See [LICENSE](file:///c:/Users/Rose/Documents/Antigravity/process-chronicle/LICENSE) for details.

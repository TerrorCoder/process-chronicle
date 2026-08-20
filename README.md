# Process Chronicle (Proof of Process)

![License: PolyForm Noncommercial](https://img.shields.io/badge/License-PolyForm_Noncommercial_1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)
![TanStack Router](https://img.shields.io/badge/TanStack_Router-1.170-FF4154?logo=tanstack&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss&logoColor=white)
![Django](https://img.shields.io/badge/Django-5.x-092E20?logo=django&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)

> A verifiable record of human authorship, documenting the step-by-step evolution of text to prove authentic creation through process history rather than post-hoc AI detection.

---

## Table of Contents

- [Overview](#overview)
- [The Problem & The Solution](#the-problem--the-solution)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Backend Setup (Django REST API)](#1-backend-setup-django-rest-api)
  - [2. Frontend Setup (React / Vite)](#2-frontend-setup-react--vite)
- [Environment Configuration](#environment-configuration)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Data Privacy & Storage Model](#data-privacy--storage-model)
- [License](#license)

---

## Overview

**Process Chronicle** (also known as **Proof of Process**) is an open platform designed to track, analyze, and present the developmental history of written works. Rather than relying on opaque statistical probability scores from post-publication AI detectors, Process Chronicle turns the creative journey itself into evidence of human authorship.

By logging successive draft iterations, tracking structural modifications, recording author reflections, and leveraging LLM-based narrative synthesis, Process Chronicle generates a comprehensive, verifiable **Process Summary Portfolio** that highlights genuine human iteration.

---

## The Problem & The Solution

### The Problem
Traditional AI detection tools evaluate static, completed documents *post-factum*. These black-box classifiers frequently suffer from high false-positive rates—disproportionately penalizing non-native writers, structured academic formats, and concise technical writing.

### The Solution
Process Chronicle shifts the paradigm from **post-hoc inspection** to **process verification**:
1. **Evolutionary Evidence**: Real human writing involves structural adjustments, sentence rewrites, deletions, tone calibration, and conceptual expansion.
2. **Intentionality**: Authentic authors can reflect on *why* specific revisions were made.
3. **Synthesis Over Classification**: Instead of generating a binary "AI vs. Human" score, Process Chronicle produces a narrative digest summarizing structural progression and decision-making over time.

---

## Key Features

- 📜 **Chronological Draft Tracking**: Maintain and order multiple revisions (from early brainstorms to final polished drafts).
- 🔍 **Interactive Word-Level Diff Visualizer**: Side-by-side comparison engine highlighting word-by-word additions, deletions, and structural changes.
- 🧠 **AI-Powered Process Synthesis**: Server-side Django API powered by Google Gemini (with OpenAI fallback) to generate cohesive narrative summaries of writing evolution.
- ✍️ **Author Reflection Log**: Contextual fields for writers to record intentional rationale for key edits.
- 📄 **Direct Document Import**: Native `.docx` upload support powered by Mammoth.js for seamless draft importing.
- 🔒 **Privacy-Preserving & Stateless**: User drafts remain client-side in browser local storage (`localStorage`). The backend API operates statelessly without storing draft content.
- ⚡ **Smart Response Caching**: Generated summaries are cached locally to minimize redundant server requests and optimize API token usage.
- 🎨 **Modern Glassmorphism UI**: High-contrast dark interface featuring micro-animations, skeleton loaders, and responsive layouts built with Tailwind CSS v4.

---

## System Architecture

```
+-------------------------------------------------------------------+
|                        Client-Side Application                     |
|                                                                   |
|  +--------------------+   +-------------------+   +------------+  |
|  | Draft Manager &    |   | Diff Visualizer & |   | LocalStore |  |
|  | .docx Import       |---| Version History   |---| Cache      |  |
|  +--------------------+   +-------------------+   +------------+  |
+-------------------------------------|-----------------------------+
                                      | HTTP POST /api/generate-summary/
                                      v
+-------------------------------------------------------------------+
|                   Backend Service (Django REST API)                |
|                                                                   |
|  +--------------------+   +-------------------+   +------------+  |
|  | Payload Validation |-->| Prompt Builder &  |-->| LLM Engine |  |
|  | (Character/Draft)  |   | Context Parser    |   | (Gemini /  |  |
|  +--------------------+   +-------------------+   |  OpenAI)   |  |
|                                                   +------------+  |
+-------------------------------------------------------------------+
```

---

## Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Routing**: [TanStack Router](https://tanstack.com/router) (type-safe file-based routing)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Document Parsing**: [Mammoth.js](https://github.com/mwilliamson/mammoth.js/) (`.docx` reader)
- **State & Caching**: TanStack Query & Browser `localStorage`

### Backend
- **Framework**: [Django 5.x](https://www.djangoproject.com/)
- **API Architecture**: [Django REST Framework (DRF)](https://www.django-rest-framework.org/)
- **CORS Handling**: `django-cors-headers`
- **LLM Integrations**:
  - Primary: [Google Gemini API](https://ai.google.dev/) (`google-generativeai`)
  - Fallback: [OpenAI API](https://platform.openai.com/) (`openai`)
- **Environment Management**: `python-dotenv`

---

## Repository Structure

```
process-chronicle/
├── backend/                  # Django REST API Backend
│   ├── api/                  # Core API app (views, services, URLs)
│   │   ├── services/         # LLM integration logic (Gemini / OpenAI)
│   │   ├── urls.py           # Endpoint route mappings
│   │   └── views.py          # Summary generation handler & validation
│   ├── core/                 # Django project settings & root URLs
│   ├── manage.py             # Django management script
│   ├── requirements.txt      # Python dependencies
│   └── README.md             # Dedicated Backend documentation
├── src/                      # React Frontend Application
│   ├── components/           # UI components & design primitives
│   ├── routes/               # TanStack Router file-based pages
│   │   ├── index.tsx         # Dashboard / Landing page
│   │   ├── create.tsx        # Draft creation & editing interface
│   │   └── portfolio.tsx     # Process Summary & Diff Viewer
│   ├── styles.css            # Global CSS & Tailwind configuration
│   └── main.tsx              # Application entry point
├── package.json              # Frontend dependencies & scripts
├── vite.config.ts            # Vite configuration
├── LICENSE                   # PolyForm Noncommercial License 1.0.0
└── README.md                 # Main Project documentation
```

---

## Prerequisites

Before setting up Process Chronicle, ensure you have the following installed on your environment:

- **Node.js** (v18.0.0 or higher) or **Bun** (v1.0.0 or higher)
- **Python** (v3.10 or higher)
- **pip** (Python package manager)
- An active API key for **Google Gemini** or **OpenAI**

---

## Getting Started

### 1. Backend Setup (Django REST API)

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # On macOS/Linux:
   python3 -m venv venv
   source venv/bin/activate

   # On Windows (PowerShell):
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` to include your `GEMINI_API_KEY` (or `OPENAI_API_KEY`) and a secure `SECRET_KEY`.*

5. Apply database migrations and start the Django development server:
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```
   The backend API will run locally at `http://localhost:8000/`.

---

### 2. Frontend Setup (React / Vite)

1. Open a new terminal window in the root directory (`process-chronicle/`):
   ```bash
   # Install dependencies using Bun or NPM
   bun install
   # or
   npm install
   ```

2. Start the hot-reloading development server:
   ```bash
   bun dev
   # or
   npm run dev
   ```

3. Access the web interface in your browser at `http://localhost:5173/`.

---

## Environment Configuration

### Backend `.env` Options

| Variable | Required | Description |
| :--- | :--- | :--- |
| `SECRET_KEY` | Yes | Django cryptographic signing key |
| `DEBUG` | Optional | Set to `True` for development debugging (Default: `True`) |
| `ALLOWED_HOSTS` | Optional | Comma-separated list of permitted host headers |
| `GEMINI_API_KEY` | Recommended | Google Gemini API key for summary generation |
| `OPENAI_API_KEY` | Optional | OpenAI API key used if Gemini API key is omitted |

---

## Usage Guide

1. **Dashboard Initialization**: Navigate to the home dashboard (`/`) and select **Start a new portfolio** or load an existing portfolio from local storage.
2. **Draft Input**:
   - Provide a project title (e.g., *"Cognitive Architecture and Creative Writing"*).
   - Enter your initial draft (or import a `.docx` file using the upload button).
   - Add subsequent revisions as separate labeled drafts (e.g., *"Draft 1"*, *"Structural Revision"*, *"Final Draft"*).
3. **Author Reflection**: Enter optional reflections detailing structural changes, research additions, or stylistic refinements made during drafting.
4. **Portfolio Generation**: Click **Generate Portfolio**. The client sends draft metadata and content to the Django backend.
5. **Review & Analysis**:
   - View the synthesized **Process Summary** explaining the natural evolution of your document.
   - Inspect the interactive **Diff Visualizer** to compare word-level revisions across consecutive drafts.
6. **Export**: Print or save your Process Summary Portfolio for record-keeping or presentation.

---

## API Documentation

### POST `/api/generate-summary/`

Processes a set of chronological text drafts alongside optional author reflections to construct a process summary.

#### Request Body Structure
```json
{
  "title": "Cognitive Architecture and Creative Writing",
  "drafts": [
    {
      "label": "Draft 1",
      "content": "This early draft outlines the core concepts of cognitive architectures..."
    },
    {
      "label": "Revision 1",
      "content": "This revised version expands on neural memory models and refines arguments..."
    },
    {
      "label": "Final Draft",
      "content": "The final polished manuscript integrates empirical references and tightens concluding remarks..."
    }
  ],
  "reflection": "In revision 1, I expanded the memory section and removed redundant intro paragraphs to improve flow."
}
```

#### Response (`200 OK`)
```json
{
  "summary": "Across 3 iterations, 'Cognitive Architecture and Creative Writing' developed from an exploratory conceptual outline into a refined manuscript. Initial drafts focused on laying out foundational memory models. Middle revisions introduced structural shifts, significantly expanding on neural frameworks while trimming introductory repetition. The final draft polished word choice and reinforced concluding arguments. The writer's reflection underscores a deliberate decision to streamline narrative flow."
}
```

#### Response Status Codes
- `200 OK`: Summary successfully generated.
- `400 Bad Request`: Validation error (e.g., fewer than 2 drafts, empty draft content, or character limit exceeded).
- `500 Internal Server Error`: Server configuration issue (e.g., missing API keys).
- `502 Bad Gateway`: External LLM provider error.

---

## Data Privacy & Storage Model

Process Chronicle is designed with a **privacy-first philosophy**:
- **Local Ownership**: Draft history, portfolio state, and cached process summaries are retained locally within your browser's `localStorage`.
- **Stateless Server**: The Django REST API does not persist or store draft contents in any database. Requests are processed transiently to communicate with the LLM API and returned immediately to the client.

---

## License

This project is licensed under the **PolyForm Noncommercial License 1.0.0**.

### Permitted Uses
You are free to inspect, download, modify, test, evaluate, run, and explore the codebase for **noncommercial purposes**, including personal research, educational evaluation, and non-monetized exploration.

### Restrictions
Commercial use, unauthorized commercial distribution, reselling, or commercial reproduction of the software or services built upon it is strictly prohibited without explicit permission from the licensor.

See the full [LICENSE](file:///c:/Users/Rose/Documents/Antigravity/process-chronicle/LICENSE) file for complete legal terms.

# SplitTura — Your Split, Your Guide

A tourist assistant app for Split, Croatia, built as a hackathon project by a small team. It helps visitors find trustworthy restaurants, explore landmarks, and check beach conditions in real time.

The UI is presented as a mobile-first phone mockup running in the browser.

---

## Features

### Reviews — Restaurant Trust Analysis
Browse Split restaurants with AI-generated trust scores. Each place shows a risk level (low / medium / high), aggregated pros and cons, and per-category ratings (food, service, atmosphere, price).

> Currently the data is hardcoded. The roadmap is to build a backend pipeline that scrapes Google, TripAdvisor, and other sources, runs all reviews through an LLM to generate a structured summary, and stores the result in a database served via API.

### AI Photo Guide *(demo)*
Point your camera at a Split landmark and get an instant explanation — what it is, historical facts, and how it's used today. Supports 9 languages (EN, HR, DE, IT, FR, ES, JA, ZH, KO).

> The scan animation and result cards are a UI demo. Live landmark recognition via an AI vision API is planned for a future version.

### Beach Monitor
Live webcam streams for Split's beaches (Bačvice, Kašjuni, Bene, Žnjan, and more). A backend scheduler captures a frame from each stream every N minutes, sends it to GPT-4o for analysis, and stores crowd level, weather conditions, and people count as a JSON sidecar next to the image.

---

## Architecture

```
StSheepAI/
├── backend/          # FastAPI — beach monitor API
│   ├── main.py
│   ├── config.py
│   ├── routers/      # /beaches  /restaurants
│   ├── services/     # capture_service, analysis_service, beach_service
│   ├── scheduler/    # APScheduler job — capture + analyze on interval
│   ├── models/       # Pydantic models
│   └── data/         # beaches.json, reviews.json
└── StSheepAi/        # React frontend
    ├── src/
    │   ├── App.jsx
    │   ├── screens/  # Beach.jsx, Photo.jsx, Reviews.jsx
    │   └── ui.jsx
    └── public/
```

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite |
| Maps | Leaflet |
| Live streams | HLS.js |
| Backend | FastAPI (Python 3.12) |
| Scheduling | APScheduler |
| Vision AI | OpenAI GPT-4o (VLM) |
| Frame capture | ffmpeg |
| Config | Pydantic Settings |

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.12+
- ffmpeg (`sudo apt install ffmpeg`)
- OpenAI API key

### Frontend

```bash
cd StSheepAi
npm install
npm run dev
```

Runs at `http://localhost:5173`.

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
# Add your OPENAI_API_KEY to .env

uvicorn main:app --reload
```

Runs at `http://localhost:8000`. The scheduler starts automatically and captures beach frames on the configured interval (`CAPTURE_INTERVAL_MINUTES` in `.env`, default 30).

### Environment variables

| Variable | Default | Description |
|---|---|---|
| `OPENAI_API_KEY` | — | Required for VLM beach analysis |
| `CAPTURE_INTERVAL_MINUTES` | `30` | How often to capture and analyze webcam frames |
| `IMAGES_DIR` | `images` | Where captured frames are stored |
| `HOST` | `127.0.0.1` | API host |
| `PORT` | `8000` | API port |

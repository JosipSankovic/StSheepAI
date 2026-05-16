# SplitTura — Your Split, Your Guide

A tourist assistant app for Split, Croatia, built as a hackathon project by a small team. It helps visitors find trustworthy restaurants, explore landmarks, and check beach conditions in real time.

The UI is presented as a mobile-first phone mockup running in the browser.

---

## Features

### Reviews — AI Restaurant Trust Analysis
Tourist review platforms are unreliable — ratings are gamed, fake reviews are common, and a 4.5-star score on Google can hide dozens of complaints buried in one-star reviews that most visitors never read. SplitTura solves this by running every restaurant through a deep AI analysis before the tourist ever opens the app.

**How the AI review works**
Given a restaurant name and address, GPT-5.5 performs a deep research pass — reading and weighing all available reviews from Google, TripAdvisor, and similar platforms. It identifies recurring patterns across hundreds of reviews, separates genuine praise from inflated scores, and flags specific tourist traps (hidden charges, rushed service, bait-and-switch menus). The output is a structured trust summary stored in the database and served to the frontend.

Each restaurant card shows:
- **Trust score** (0–100) and a risk level: low / medium / high
- **Headline verdict** — one sentence capturing the honest consensus
- **Pros and cons** — the most repeated genuine observations
- **Per-category ratings** — food, service, atmosphere, price, and booking difficulty scored independently
- **Positive vs. warning review counts** — so you can see the ratio at a glance

**List view and Map view**
The screen toggles between two views. The **list view** is a searchable, scrollable feed of all restaurants with trust scores and tags visible at a glance. The **map view** renders an interactive Leaflet map of Split's old town with colour-coded pins — green for low risk, amber for medium, red for high — so tourists can see which restaurants around them are trustworthy before they walk in. Tapping a pin or a list card opens a full detail sheet with the complete AI summary, all ratings, and the full pros/cons breakdown.

This matters because the difference between a low-risk and high-risk restaurant in Split's tourist centre can be the difference between a memorable meal and an overpriced disappointment.

### AI Photo Guide
Split's old town is dense with 1,700 years of layered history — Roman walls, medieval churches, Venetian palaces, and Ottoman-era streets packed into a few city blocks. Most tourists walk past extraordinary things without knowing what they are, and the audio guides they rent at the tourist office cover only the top five landmarks. SplitTura turns every camera tap into an instant expert explanation.

**How it works**
The user selects their language (9 supported: EN, HR, DE, IT, FR, ES, JA, ZH, KO), then points their device camera at any landmark. The app accesses the live camera feed via `getUserMedia`. When the shutter button is pressed, the current frame is captured to a canvas element and encoded as a JPEG. The image is sent to the backend alongside the user's GPS coordinates obtained via the Geolocation API (defaulting to Split city centre if permission is denied).

The backend passes both the image and the location to GPT-4o as a vision prompt. The location context helps the model disambiguate — knowing the user is in Split, Croatia narrows identification significantly. GPT-4o returns a structured JSON response with the landmark name, a confidence score, and three info cards written entirely in the user's chosen language.

**What the app shows**
After a short scanning animation the result screen presents:
- **Identified landmark name** with a confidence percentage badge
- **Card 1 — What is this?** Historical background: what the place is, when it was built, and its original purpose
- **Card 2 — Did you know?** A single surprising or counterintuitive fact most tourists never hear
- **Card 3 — Today it's used for…** The landmark's current role in the city's daily life
- **Audio guide** — all three cards read aloud via the Web Speech API in the selected language, at a natural pace, so the user can listen while looking at the landmark rather than reading a screen

**Why it matters**
A Japanese tourist standing in front of the Peristyle has no way of knowing that the sphinx to their right is 3,500 years old — older than the palace it stands in — or that Diocletian, who built the palace, was later buried in a tomb that early Christians converted into the cathedral that still holds Mass every Sunday. That story, delivered in Japanese, in 15 seconds, is what the AI Photo Guide does.

### Beach Monitor
In summer, Split's beaches go from empty to dangerously overcrowded within a couple of hours — and there is no reliable way for a tourist to know which beach is worth the trip before they leave their accommodation. SplitTura solves this with a real-time beach intelligence system driven by live webcams and AI vision.

**How it works**
Each beach has a public webcam stream. The backend scheduler captures a still frame from every stream at a configurable interval (default every 30 minutes) using ffmpeg. Each captured frame is immediately sent to GPT-4o as a vision task. The model analyses the image and returns structured JSON — estimated crowd count, crowd level (low / moderate / crowded / very crowded), weather condition, wind estimate, visibility, and image quality metadata. The JSON sidecar is stored next to the image on disk and served to the frontend via the `/beaches` API.

**What the app shows**
Each beach card in the app displays:
- **Live HLS webcam stream** — watch the beach in real time directly in the app
- **Crowd level and score** — derived from the latest VLM analysis, shown as a percentage of beach capacity
- **People count estimate** — the model's best estimate of how many people are currently on the beach
- **Weather and sea conditions** — condition, wind, and visibility as read from the webcam image
- **Water temperature** — sourced per beach

**Why it matters**
A tourist who walks 30 minutes to Bačvice on a Saturday in August only to find it standing-room only has wasted their morning. The Beach Monitor gives them the same situational awareness a local has — glance at the app, pick the beach that has space, and arrive knowing what to expect.

---

## Architecture

```
StSheepAI/
├── backend/          # FastAPI — beach monitor API
│   ├── main.py
│   ├── config.py
│   ├── routers/      # /beaches  /landmarks  /restaurants
│   ├── services/     # capture_service, analysis_service, beach_service, landmark_service
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

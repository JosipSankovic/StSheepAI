# Beach Monitor API — Endpoint Reference

Base URL: `http://127.0.0.1:8000`

Static images are served at `/static/images/{beach_id}/{filename}`.

---

## Beaches

### `GET /beaches`

List all beaches.

**Response** `200 OK` — `BeachSummary[]`

```json
[
  {
    "id": "string",
    "name": "string",
    "location": "string",
    "description": "string"
  }
]
```

---

### `GET /beaches/{beach_id}`

Get full details for a single beach, including its live stream URL.

**Path params**
| Param | Type | Description |
|---|---|---|
| `beach_id` | string | Beach identifier |

**Response** `200 OK` — `BeachDetail`

```json
{
  "id": "string",
  "name": "string",
  "location": "string",
  "description": "string",
  "stream_url": "string"
}
```

**Errors**
- `404` — beach not found

---

### `GET /beaches/{beach_id}/latest-image`

Returns the most recently captured JPEG image for the beach as a raw file download (`image/jpeg`).

**Errors**
- `404` — no images captured yet, or beach not found

---

### `GET /beaches/{beach_id}/images`

List all captured images for a beach (newest first), each optionally including its VLM analysis sidecar.

**Response** `200 OK` — `CapturedImage[]`

```json
[
  {
    "filename": "2024-06-01_14-30.jpg",
    "timestamp": "2024-06-01T14:30:00",
    "url": "/static/images/{beach_id}/2024-06-01_14-30.jpg",
    "analysis": null
  }
]
```

`analysis` is `null` when no sidecar JSON exists for that image, otherwise it contains a full `BeachAnalysis` object (see schema below).

**Errors**
- `404` — beach not found

---

### `GET /beaches/{beach_id}/latest-analysis`

Get the most recent VLM analysis for a beach.

**Response** `200 OK` — `BeachAnalysis`

```json
{
  "timestamp": "2024-06-01T14:30:00",
  "location": "string",
  "scene_type": "string",
  "weather": {
    "condition": "string",
    "visibility": "string",
    "precipitation_visible": false,
    "wind_estimate": "string",
    "confidence": 0.95
  },
  "people": {
    "estimated_count": 42,
    "estimated_range": { "min": 35, "max": 50 },
    "crowd_level": "string",
    "crowd_score": 6,
    "confidence": 0.88
  },
  "image_quality": {
    "resolution": "string",
    "lighting": "string",
    "occlusion_level": "string",
    "confidence": 0.97
  },
  "notes": ["string"]
}
```

**Errors**
- `404` — no analysis available yet, or beach not found

---

### `GET /beaches/{beach_id}/analyses`

List all stored analyses for a beach (newest first).

**Response** `200 OK` — `BeachAnalysis[]`

**Errors**
- `404` — beach not found

---

### `POST /beaches/capture`

Manually trigger an image capture for all beaches (bypasses the scheduler).

**Response** `202 Accepted`

```json
{ "detail": "Capture completed" }
```

---

### `POST /beaches/{beach_id}/analyze`

Trigger an on-demand VLM analysis of the latest captured image for a beach.

**Path params**
| Param | Type | Description |
|---|---|---|
| `beach_id` | string | Beach identifier |

**Response** `200 OK` — `BeachAnalysis`

**Errors**
- `404` — no images captured yet, or beach not found
- `503` — OpenAI API key missing or request failed

---

## Restaurants

### `POST /restaurants/review`

Generate an AI-written review for a restaurant.

**Request body**

```json
{
  "name": "string",
  "location": "string",
  "address": "string"
}
```

**Response** `200 OK` — `RestaurantReview`

```json
{
  "id": "string",
  "name": "string",
  "location": "string",
  "address": "string",
  "timestamp": "2024-06-01T14:30:00",
  "cuisine_type": "string",
  "price_level": "string",
  "overall_rating": 4.2,
  "food_rating": 4.5,
  "service_rating": 4.0,
  "ambiance_rating": 4.1,
  "summary": "string",
  "pros": ["string"],
  "cons": ["string"],
  "reviewer_note": "string",
  "confidence": 0.85
}
```

**Errors**
- `503` — OpenAI API key not configured or request failed

---

## Shared Schemas

### `BeachAnalysis`

| Field | Type | Notes |
|---|---|---|
| `timestamp` | ISO 8601 string | Capture time |
| `location` | string | |
| `scene_type` | string | |
| `weather` | `WeatherAnalysis` | |
| `people` | `PeopleAnalysis` | |
| `image_quality` | `ImageQuality` | |
| `notes` | `string[]` | Free-form observations |

### `WeatherAnalysis`

| Field | Type |
|---|---|
| `condition` | string |
| `visibility` | string |
| `precipitation_visible` | boolean |
| `wind_estimate` | string |
| `confidence` | float (0–1) |

### `PeopleAnalysis`

| Field | Type | Notes |
|---|---|---|
| `estimated_count` | int | Point estimate |
| `estimated_range` | `{ min, max }` | Bounding range |
| `crowd_level` | string | e.g. "low", "moderate", "high" |
| `crowd_score` | int | Numeric score |
| `confidence` | float (0–1) | |

### `ImageQuality`

| Field | Type |
|---|---|
| `resolution` | string |
| `lighting` | string |
| `occlusion_level` | string |
| `confidence` | float (0–1) |

### `CapturedImage`

| Field | Type | Notes |
|---|---|---|
| `filename` | string | e.g. `2024-06-01_14-30.jpg` |
| `timestamp` | ISO 8601 string | Parsed from filename |
| `url` | string | Relative path under `/static/images/` |
| `analysis` | `BeachAnalysis \| null` | Present only if sidecar JSON exists |

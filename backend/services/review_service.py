import json
import logging
import uuid
from pathlib import Path

from openai import OpenAI

from config import settings, llm_model_name
from models.restaurant import RestaurantReview

logger = logging.getLogger(__name__)

_client: OpenAI | None = None
_REVIEWS_FILE = Path(__file__).parent.parent / "data" / "reviews.json"

_SEARCH_PROMPT = """Search the internet for reviews of this restaurant:

Name: {{RESTAURANT_NAME}}
City: {{CITY}}
Country / Address: {{COUNTRY}}

Search Google, Tripadvisor, Restaurant Guru, Facebook, Foursquare, Yelp, and any other available sources.
Gather: ratings, review counts, common praise, common complaints, pricing info, food quality signals, service signals, and any tourist warnings.
Return all gathered information as detailed text."""


_PROMPT = """
You are a restaurant review analysis assistant.

Your task is to analyze public restaurant reviews and return ONLY valid JSON. Do not include markdown, comments, explanations, or text outside the JSON.

Restaurant input:
{
  "name": "{{RESTAURANT_NAME}}",
  "city": "{{CITY}}",
  "country": "{{COUNTRY}}",
  "googleMapsUrl": "{{GOOGLE_MAPS_URL}}"
}

Instructions:
1. Look at as many available reviews as possible from Google, Tripadvisor, Restaurant Guru, Facebook, Foursquare, Yelp, or other public sources.
Take into account last 6 months as more important source of informations. Make summary most 500 characters
2. Compare review patterns across platforms.
3. Do not rely only on the average rating.
4. Detect repeated positive signals and repeated warning signals.
5. Pay special attention to tourist risks, pricing complaints, service complaints, food quality, cleanliness, atmosphere, and billing issues.
6. If some data is unavailable, use null and explain the limitation in the "limitations" field.
7. Return a realistic trust score from 0 to 100.
8. Assign one risk badge:
   - "Low"
   - "Medium"
   - "High"
9. Return ONLY JSON matching the schema below.

JSON schema to return:

{
  "restaurant": {
    "name": "string",
    "city": "string",
    "country": "string",
    "address": "string or null",
    "cuisineTags": ["string"]
  },
  "trustScoreCard": {
    "overallTrustScore": "number from 0 to 100",
    "maxScore": 100,
    "riskBadge": "Low | Medium | High",
    "summary": "short human-readable summary",
    "confidence": "Low | Medium | High",
    "reviewPattern": {
      "positiveReviewVolume": "Low | Medium | High",
      "negativeReviewRisk": "Low | Medium | High",
      "consistency": "Consistent | Mostly positive | Mixed | Mostly negative"
    }
  },
  "ratingsSnapshot": {
    "google": {
      "rating": "number or null",
      "maxRating": 5,
      "reviewCount": "number or null"
    },
    "tripadvisor": {
      "rating": "number or null",
      "maxRating": 5,
      "reviewCount": "number or null"
    },
    "restaurantGuru": {
      "rating": "number or null",
      "maxRating": 5,
      "reviewCount": "number or null"
    },
    "facebook": {
      "rating": "number or null",
      "maxRating": 5,
      "reviewCount": "number or null"
    },
    "otherSources": [
      {
        "source": "string",
        "rating": "number or null",
        "maxRating": "number or null",
        "reviewCount": "number or null"
      }
    ]
  },
  "positiveSignalsCard": {
    "title": "Positive signals",
    "signals": [
      {
        "label": "string",
        "details": "string",
        "strength": "Low | Medium | High"
      }
    ]
  },
  "warningSignalsCard": {
    "title": "Warning signals",
    "signals": [
      {
        "label": "string",
        "severity": "Low | Medium | High",
        "details": "string"
      }
    ]
  },
  "categoryBreakdown": [
    {
      "category": "Food",
      "score": "number from 0 to 10",
      "maxScore": 10,
      "summary": "string"
    },
    {
      "category": "Service",
      "score": "number from 0 to 10",
      "maxScore": 10,
      "summary": "string"
    },
    {
      "category": "CleanlinessAndAtmosphere",
      "score": "number from 0 to 10",
      "maxScore": 10,
      "summary": "string"
    },
    {
      "category": "ValueForMoney",
      "score": "number from 0 to 10",
      "maxScore": 10,
      "summary": "string"
    },
    {
      "category": "TouristReliability",
      "score": "number from 0 to 10",
      "maxScore": 10,
      "summary": "string"
    },
    {
      "category": "ReviewConsistency",
      "score": "number from 0 to 10",
      "maxScore": 10,
      "summary": "string"
    }
  ],
  "touristAdviceCard": {
    "recommendation": "Go | Go with caution | Avoid",
    "bestFor": ["string"],
    "avoidIf": ["string"],
    "advice": ["string"],
    "touristRiskLevel": "Low | Medium | High",
    "finalVerdict": "string"
  },
  "backendLabels": {
    "riskBadgeEnum": "LOW | MEDIUM | HIGH",
    "recommendationEnum": "GO | GO_WITH_CAUTION | AVOID",
    "trustTier": "HIGH_TRUST | MODERATE_TRUST | LOW_TRUST",
    "touristTrapRisk": "LOW | MEDIUM | HIGH",
    "priceTransparencyRisk": "LOW | MEDIUM | HIGH",
    "foodConsistencyRisk": "LOW | MEDIUM | HIGH",
    "serviceRisk": "LOW | MEDIUM | HIGH"
  },
  "reviewInsights": {
    "mostPraisedItems": ["string"],
    "mostCommonComplaints": ["string"],
    "recommendedDishes": ["string"],
    "dishesToBeCarefulWith": ["string"],
    "commonReviewPhrases": {
      "positive": ["string"],
      "negative": ["string"]
    }
  },
  "sources": [
    {
      "id": "string",
      "name": "string",
      "url": "string or null",
      "usedFor": ["string"]
    }
  ],
  "limitations": [
    "string"
  ],
  "generatedAt": "ISO 8601 date string"
}

Scoring rules:
- 90–100 = very reliable, low tourist risk
- 75–89 = generally reliable, minor concerns
- 60–74 = mixed but usable with caution
- 40–59 = risky, many repeated complaints
- 0–39 = avoid

Risk badge rules:
- Low: trust score >= 80 and warning signals are minor
- Medium: trust score 60–79 or reviews are inconsistent
- High: trust score < 60 or serious repeated complaints about scams, hygiene, food safety, aggressive billing, or rude service

Important:
Return only valid JSON. No markdown. No trailing commas.
"""


def _get_client() -> OpenAI | None:
    global _client
    if not settings.openai_api_key:
        return None
    if _client is None:
        _client = OpenAI(api_key=settings.openai_api_key)
    return _client


def generate_review(name: str, location: str, address: str) -> RestaurantReview | None:
    client = _get_client()
    if client is None:
        logger.warning("OPENAI_API_KEY not set — skipping review generation for %s", name)
        return None

    def _fill(template: str) -> str:
        return (
            template
            .replace("{{RESTAURANT_NAME}}", name)
            .replace("{{CITY}}", location)
            .replace("{{COUNTRY}}", address)
            .replace("{{GOOGLE_MAPS_URL}}", "")
        )

    try:
        search_response = client.responses.create(
            model=llm_model_name,
            tools=[{"type": "web_search_preview"}],
            input=_fill(_SEARCH_PROMPT),
        )
        raw_info = search_response.output_text
        logger.info("Web search complete for %s (%d chars)", name, len(raw_info))

        structure_prompt = _fill(_PROMPT) + "\n\nResearch gathered from web search:\n" + raw_info

        response = client.beta.chat.completions.parse(
            model=llm_model_name,
            messages=[{"role": "user", "content": structure_prompt}],
            response_format=RestaurantReview,
            max_completion_tokens=2000,
        )
        review = response.choices[0].message.parsed
        review.id = str(uuid.uuid4())

        existing: list[dict] = json.loads(_REVIEWS_FILE.read_text())
        existing.append(json.loads(review.model_dump_json()))
        _REVIEWS_FILE.write_text(json.dumps(existing, indent=2, ensure_ascii=False))
        logger.info("Review saved to %s (total: %d)", _REVIEWS_FILE, len(existing))

        return review

    except Exception:
        logger.exception("OpenAI review generation failed for %s", name)
        return None

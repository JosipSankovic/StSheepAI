import json
import logging
from openai import OpenAI
from config import settings, vlm_model_name

logger = logging.getLogger(__name__)

_LANGUAGE_NAMES = {
    "en": "English", "hr": "Croatian", "de": "German", "it": "Italian",
    "fr": "French", "es": "Spanish", "ja": "Japanese", "zh": "Chinese", "ko": "Korean",
}

_PROMPT = """You are a tour guide app for Split, Croatia. The user is at GPS coordinates {lat}, {lng}.

Analyze this image and identify any landmark or place of interest visible.

Respond entirely in {language_name}. Return a JSON object with exactly these keys:
- "name": the full name of the landmark (in {language_name})
- "confidence": float 0.0-1.0 how confident you are in the identification
- "c1": 2-3 sentences — what is this place and its historical significance
- "c2": 1-2 sentences — a surprising or fascinating fact about it
- "c3": 1-2 sentences — how it is used today

If no recognizable landmark is visible, set confidence below 0.5 and set name to "Unknown location"."""


def analyze_landmark(image_b64: str, lat: float, lng: float, language: str) -> dict | None:
    if not settings.openai_api_key:
        logger.warning("OPENAI_API_KEY not set — skipping landmark analysis")
        return None

    client = OpenAI(api_key=settings.openai_api_key)
    lang_name = _LANGUAGE_NAMES.get(language, "English")
    prompt = _PROMPT.format(lat=lat, lng=lng, language_name=lang_name)

    try:
        response = client.chat.completions.create(
            model=vlm_model_name,
            messages=[{
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_b64}"}},
                    {"type": "text", "text": prompt},
                ],
            }],
            response_format={"type": "json_object"},
            max_tokens=700,
        )
        return json.loads(response.choices[0].message.content)
    except Exception:
        logger.exception("Landmark analysis failed")
        return None

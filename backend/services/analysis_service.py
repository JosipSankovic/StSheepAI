import base64
import logging
from pathlib import Path

from openai import OpenAI

from config import settings
from models.beach import BeachAnalysis

logger = logging.getLogger(__name__)

_client: OpenAI | None = None


def _get_client() -> OpenAI | None:
    global _client
    if not settings.openai_api_key:
        return None
    if _client is None:
        _client = OpenAI(api_key=settings.openai_api_key)
    return _client


_PROMPT = """Analyze this beach webcam image. Return JSON with this exact structure:
{
  "timestamp": "<current UTC time in ISO 8601>",
  "location": "{beach_name}",
  "scene_type": "beach | promenade | street | square",
  "weather": {
    "condition": "sunny | partly_cloudy | cloudy | rainy | foggy",
    "visibility": "good | moderate | poor",
    "precipitation_visible": true or false,
    "wind_estimate": "calm | light | moderate | strong",
    "confidence": 0.0 to 1.0
  },
  "people": {
    "estimated_count": integer,
    "estimated_range": {"min": integer, "max": integer},
    "crowd_level": "low | moderate | crowded | very_crowded",
    "crowd_score": integer 1-10,
    "confidence": 0.0 to 1.0
  },
  "image_quality": {
    "resolution": "WxH or unknown",
    "lighting": "good | medium | poor",
    "occlusion_level": "low | medium | high",
    "confidence": 0.0 to 1.0
  },
  "notes": ["observation 1", "observation 2"]
}"""


def analyze_image(image_path: Path, beach_name: str) -> BeachAnalysis | None:
    client = _get_client()
    if client is None:
        logger.warning("OPENAI_API_KEY not set — skipping analysis for %s", image_path.name)
        return None

    b64 = base64.b64encode(image_path.read_bytes()).decode()
    prompt = _PROMPT.replace("{beach_name}", beach_name)

    try:
        response = client.beta.chat.completions.parse(
            model="gpt-4o",
            messages=[{
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64}"}},
                    {"type": "text", "text": prompt},
                ],
            }],
            response_format=BeachAnalysis,
            max_tokens=600,
        )
        analysis = response.choices[0].message.parsed

        sidecar = image_path.with_suffix(".json")
        sidecar.write_text(analysis.model_dump_json(indent=2))
        logger.info("Analysis saved -> %s", sidecar)
        return analysis

    except Exception:
        logger.exception("OpenAI analysis failed for %s", image_path)
        return None

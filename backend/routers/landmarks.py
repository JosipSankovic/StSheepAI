from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.landmark_service import analyze_landmark

router = APIRouter()


class LandmarkRequest(BaseModel):
    image: str
    lat: float = 43.5089
    lng: float = 16.4301
    language: str = "en"


@router.post("/analyze")
async def analyze(req: LandmarkRequest):
    result = analyze_landmark(req.image, req.lat, req.lng, req.language)
    if result is None:
        raise HTTPException(status_code=503, detail="Analysis unavailable — check OPENAI_API_KEY")
    return result

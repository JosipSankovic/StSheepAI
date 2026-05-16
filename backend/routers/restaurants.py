import json
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from models.restaurant import RestaurantReview
from services.review_service import generate_review

router = APIRouter()

_REVIEWS_FILE = Path(__file__).parent.parent / "data" / "reviews.json"


@router.get("")
def list_reviews() -> list[dict]:
    return json.loads(_REVIEWS_FILE.read_text())


class ReviewRequest(BaseModel):
    name: str
    location: str
    address: str


@router.post("/review", response_model=RestaurantReview)
def create_review(body: ReviewRequest) -> RestaurantReview:
    review = generate_review(body.name, body.location, body.address)
    if review is None:
        raise HTTPException(status_code=503, detail="OpenAI API key not configured or request failed")
    return review

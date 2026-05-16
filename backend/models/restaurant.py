from pydantic import BaseModel


class RestaurantReview(BaseModel):
    id: str
    name: str
    location: str
    address: str
    timestamp: str
    cuisine_type: str
    price_level: str
    overall_rating: float
    food_rating: float
    service_rating: float
    ambiance_rating: float
    summary: str
    pros: list[str]
    cons: list[str]
    reviewer_note: str
    confidence: float

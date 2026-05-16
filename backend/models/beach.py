from pydantic import BaseModel


class BeachSummary(BaseModel):
    id: str
    name: str
    location: str
    description: str


class BeachDetail(BeachSummary):
    stream_url: str


class WeatherAnalysis(BaseModel):
    condition: str
    visibility: str
    precipitation_visible: bool
    wind_estimate: str
    confidence: float


class PeopleRange(BaseModel):
    min: int
    max: int


class PeopleAnalysis(BaseModel):
    estimated_count: int
    estimated_range: PeopleRange
    crowd_level: str
    crowd_score: int
    confidence: float


class ImageQuality(BaseModel):
    resolution: str
    lighting: str
    occlusion_level: str
    confidence: float


class BeachAnalysis(BaseModel):
    timestamp: str
    location: str
    scene_type: str
    weather: WeatherAnalysis
    people: PeopleAnalysis
    image_quality: ImageQuality
    notes: list[str]


class CapturedImage(BaseModel):
    filename: str
    timestamp: str
    url: str
    analysis: BeachAnalysis | None = None

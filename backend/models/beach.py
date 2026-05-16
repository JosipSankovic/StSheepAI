from pydantic import BaseModel


class BeachSummary(BaseModel):
    id: str
    name: str
    location: str
    description: str


class BeachDetail(BeachSummary):
    stream_url: str


class CapturedImage(BaseModel):
    filename: str
    timestamp: str
    url: str

from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from config import settings
from models.beach import BeachDetail, BeachSummary, CapturedImage
from services.beach_service import get_all_beaches, get_beach_by_id
from scheduler.jobs import capture_all_beaches

router = APIRouter()


@router.post("/capture", status_code=202)
def trigger_capture():
    capture_all_beaches(get_all_beaches(), settings.images_dir)
    return {"detail": "Capture completed"}


@router.get("", response_model=list[BeachSummary])
def list_beaches():
    return get_all_beaches()


@router.get("/{beach_id}", response_model=BeachDetail)
def get_beach(beach_id: str):
    return get_beach_by_id(beach_id)


@router.get("/{beach_id}/latest-image")
def latest_image(beach_id: str):
    get_beach_by_id(beach_id)  # 404 if unknown
    beach_dir = Path(settings.images_dir) / beach_id
    jpegs = sorted(beach_dir.glob("*.jpg")) if beach_dir.exists() else []
    if not jpegs:
        raise HTTPException(status_code=404, detail="No images captured yet for this beach")
    return FileResponse(str(jpegs[-1]), media_type="image/jpeg")


@router.get("/{beach_id}/images", response_model=list[CapturedImage])
def list_images(beach_id: str):
    get_beach_by_id(beach_id)  # 404 if unknown
    beach_dir = Path(settings.images_dir) / beach_id
    jpegs = sorted(beach_dir.glob("*.jpg"), reverse=True) if beach_dir.exists() else []
    result = []
    for path in jpegs:
        stem = path.stem  # e.g. "2026-05-16_14-30"
        try:
            ts = datetime.strptime(stem, "%Y-%m-%d_%H-%M").isoformat()
        except ValueError:
            ts = stem
        result.append(CapturedImage(
            filename=path.name,
            timestamp=ts,
            url=f"/static/images/{beach_id}/{path.name}",
        ))
    return result

import logging

from apscheduler.schedulers.asyncio import AsyncIOScheduler

from services.capture_service import capture_frame
from services.analysis_service import analyze_image

logger = logging.getLogger(__name__)


def capture_all_beaches(beaches: list[dict], images_dir: str) -> None:
    for beach in beaches:
        path = capture_frame(
            beach_id=beach["id"],
            stream_url=beach["stream_url"],
            stream_headers=beach.get("stream_headers", {}),
            images_dir=images_dir,
        )
        if path:
            analyze_image(path, beach_name=beach["name"])


def build_scheduler(beaches: list[dict], settings) -> AsyncIOScheduler:
    scheduler = AsyncIOScheduler()
    scheduler.add_job(
        capture_all_beaches,
        trigger="interval",
        minutes=settings.capture_interval_minutes,
        args=[beaches, settings.images_dir],
        id="beach_capture",
        replace_existing=True,
        misfire_grace_time=60,
    )
    return scheduler

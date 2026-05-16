import logging

from apscheduler.schedulers.asyncio import AsyncIOScheduler

from services.capture_service import capture_frame

logger = logging.getLogger(__name__)


def capture_all_beaches(beaches: list[dict], images_dir: str) -> None:
    for beach in beaches:
        capture_frame(
            beach_id=beach["id"],
            stream_url=beach["stream_url"],
            stream_headers=beach.get("stream_headers", {}),
            images_dir=images_dir,
        )


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

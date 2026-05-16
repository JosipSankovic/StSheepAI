import logging
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from config import settings
from routers.beaches import router as beaches_router
from scheduler.jobs import build_scheduler
from services.beach_service import get_all_beaches

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")


@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler = build_scheduler(get_all_beaches(), settings)
    scheduler.start()
    yield
    scheduler.shutdown()


app = FastAPI(title="Beach Monitor API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

Path(settings.images_dir).mkdir(parents=True, exist_ok=True)
app.mount("/static/images", StaticFiles(directory=settings.images_dir), name="images")
app.include_router(beaches_router, prefix="/beaches", tags=["beaches"])

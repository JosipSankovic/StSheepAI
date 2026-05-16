import logging
import subprocess
from datetime import datetime
from pathlib import Path

logger = logging.getLogger(__name__)


def capture_frame(beach_id: str, stream_url: str, stream_headers: dict, images_dir: str) -> Path | None:
    output_dir = Path(images_dir) / beach_id
    output_dir.mkdir(parents=True, exist_ok=True)

    filename = datetime.now().strftime("%Y-%m-%d_%H-%M") + ".jpg"
    filepath = output_dir / filename

    referer = stream_headers.get("Referer", "")
    user_agent = stream_headers.get("User-Agent", "Mozilla/5.0")
    headers = f"Referer: {referer}\r\nUser-Agent: {user_agent}\r\n"

    cmd = [
        "ffmpeg", "-y",
        "-headers", headers,
        "-i", stream_url,
        "-frames:v", "1",
        "-q:v", "2",
        str(filepath),
    ]

    try:
        result = subprocess.run(cmd, capture_output=True, timeout=30)
        if result.returncode != 0:
            logger.error("ffmpeg failed for beach '%s': %s", beach_id, result.stderr.decode(errors="replace"))
            return None
        logger.info("Captured frame for '%s' -> %s", beach_id, filepath)
        return filepath
    except FileNotFoundError:
        logger.error("ffmpeg not found — install it with: sudo apt install ffmpeg")
        return None
    except subprocess.TimeoutExpired:
        logger.error("ffmpeg timed out for beach '%s'", beach_id)
        return None
    except Exception:
        logger.exception("Exception capturing frame for beach '%s'", beach_id)
        return None

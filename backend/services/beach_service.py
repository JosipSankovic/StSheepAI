import json
from pathlib import Path

from fastapi import HTTPException

_DATA_FILE = Path(__file__).parent.parent / "data" / "beaches.json"

with _DATA_FILE.open(encoding="utf-8") as _f:
    _beaches: list[dict] = json.load(_f)

_index: dict[str, dict] = {b["id"]: b for b in _beaches}


def get_all_beaches() -> list[dict]:
    return _beaches


def get_beach_by_id(beach_id: str) -> dict:
    beach = _index.get(beach_id)
    if beach is None:
        raise HTTPException(status_code=404, detail=f"Beach '{beach_id}' not found")
    return beach

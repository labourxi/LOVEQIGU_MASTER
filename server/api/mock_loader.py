import json
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / "data"


def load_mock(relative_path: str):
    path = DATA_DIR / relative_path
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def load_merchant_event_mock(filename: str):
    return load_mock(f"merchant_event/{filename}")


def load_merchant_portal_mock(filename: str):
    return load_mock(f"merchant_portal/{filename}")


def load_park_admin_mock(filename: str):
    return load_mock(f"park_admin/{filename}")


def load_platform_admin_mock(filename: str):
    return load_mock(f"platform_admin/{filename}")


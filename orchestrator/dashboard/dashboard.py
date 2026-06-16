from __future__ import annotations

import json
from pathlib import Path

from .stats import DashboardStats


ROOT = Path(__file__).resolve().parents[2]


def build_dashboard() -> dict[str, object]:
    return DashboardStats().build_dashboard()


def main() -> int:
    dashboard = build_dashboard()
    print(json.dumps(dashboard, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


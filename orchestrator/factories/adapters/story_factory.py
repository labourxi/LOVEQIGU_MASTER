from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[3]
GENERATED_DIR = ROOT / "data" / "story" / "generated"


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


class StoryFactoryAdapter:
    factory_name = "StoryFactory"

    def execute(self, task_context=None):
        context = task_context or {}
        GENERATED_DIR.mkdir(parents=True, exist_ok=True)
        task_id = str(context.get("task_id", "auto_generated"))
        target = str(context.get("target", "unknown"))
        payload: dict[str, Any] = {
            "status": "success",
            "factory": self.factory_name,
            "task_id": task_id,
            "target": target,
            "generated_at": _now_iso(),
            "output_dir": str(GENERATED_DIR.relative_to(ROOT)),
            "record": {
                "story_id": f"{task_id}_story",
                "title": target,
                "source": context,
            },
        }
        output_path = GENERATED_DIR / f"{task_id}_story.json"
        output_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        payload["output_path"] = str(output_path.relative_to(ROOT))
        return payload

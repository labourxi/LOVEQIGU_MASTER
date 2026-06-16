from __future__ import annotations

import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
TEMPLATES_DIR = ROOT / "orchestrator" / "templates"


class TaskPlanner:
    def __init__(self, templates_dir: Path | None = None):
        self.templates_dir = templates_dir or TEMPLATES_DIR

    def _template_path(self, workflow: str) -> Path:
        filename = f"{workflow}_workflow.json"
        return self.templates_dir / filename

    def _load_template(self, workflow: str) -> dict[str, Any] | None:
        path = self._template_path(workflow)
        if not path.exists():
            return None
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
            return data if isinstance(data, dict) else None
        except Exception:
            return None

    def plan(self, parsed_task: dict[str, Any]) -> dict[str, Any]:
        workflow = str(parsed_task.get("workflow", "unknown"))
        template = self._load_template(workflow)
        if not template:
            if workflow == "new_visual":
                return {
                    "task_id": parsed_task.get("task_id", "auto_generated"),
                    "workflow": workflow,
                    "target": parsed_task.get("target", ""),
                    "status": "planned",
                    "steps": [
                        {"factory": "visual_factory", "status": "pending"},
                        {"factory": "runtime_factory", "status": "pending"},
                    ],
                }
            if workflow == "new_story":
                return {
                    "task_id": parsed_task.get("task_id", "auto_generated"),
                    "workflow": workflow,
                    "target": parsed_task.get("target", ""),
                    "status": "planned",
                    "steps": [
                        {"factory": "story_factory", "status": "pending"},
                        {"factory": "runtime_factory", "status": "pending"},
                    ],
                }
            return {
                "task_id": parsed_task.get("task_id", "auto_generated"),
                "workflow": workflow,
                "target": parsed_task.get("target", ""),
                "status": "blocked",
                "reason": "template_missing",
                "steps": [],
            }

        raw_steps = template.get("steps", [])
        steps = []
        if isinstance(raw_steps, list):
            for item in raw_steps:
                factory = item.get("factory") if isinstance(item, dict) else str(item)
                if factory:
                    steps.append({"factory": factory, "status": "pending"})

        return {
            "task_id": parsed_task.get("task_id", "auto_generated"),
            "workflow": workflow,
            "target": parsed_task.get("target", ""),
            "status": "planned",
            "steps": steps,
        }

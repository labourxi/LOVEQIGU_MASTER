from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Any


@dataclass
class ParsedTask:
    task_id: str
    task_type: str
    target: str
    workflow: str
    raw_task: str

    def to_dict(self) -> dict[str, Any]:
        return {
            "task_id": self.task_id,
            "task_type": self.task_type,
            "target": self.target,
            "workflow": self.workflow,
            "raw_task": self.raw_task,
        }


class TaskParser:
    RELIC_PATTERN = re.compile(r"新增(?P<target>.+?(?:宿|星).*)$")
    POI_PATTERN = re.compile(r"新增(?P<target>.+?(?:景区|探索点|探索).*)$")

    def parse(self, task: dict[str, Any] | str) -> dict[str, Any]:
        explicit_task_id = ""
        if isinstance(task, dict):
            raw_task = str(task.get("task", "")).strip()
            explicit_task_id = str(task.get("task_id", "")).strip()
        else:
            raw_task = str(task).strip()

        parsed = self._parse_text(raw_task)
        if explicit_task_id:
            parsed.task_id = explicit_task_id
        return parsed.to_dict()

    def _parse_text(self, text: str) -> ParsedTask:
        task_id = "auto_generated"
        cleaned = text.strip()
        if not cleaned:
            return ParsedTask(task_id, "unknown", "", "unknown", cleaned)

        if "新增" in cleaned or "新建" in cleaned:
            target = cleaned.replace("新增", "", 1).replace("新建", "", 1).strip()
            if any(keyword in cleaned for keyword in ("视觉", "图像", "图片")):
                return ParsedTask(task_id, "new_visual", target, "new_visual", cleaned)

            if "故事" in cleaned:
                return ParsedTask(task_id, "new_story", target, "new_story", cleaned)

            if any(keyword in cleaned for keyword in ("景区", "探索点", "探索", "POI")):
                return ParsedTask(task_id, "new_poi", target, "new_poi", cleaned)

            if any(keyword in cleaned for keyword in ("宿", "星")) or "角宿" in cleaned:
                return ParsedTask(task_id, "new_relic", target, "new_relic", cleaned)

        if "鏂板" in cleaned:
            if "瑙嗚" in cleaned:
                target = cleaned.replace("鏂板", "", 1).strip()
                return ParsedTask(task_id, "new_visual", target, "new_visual", cleaned)

            if "鏁呬簨" in cleaned:
                target = cleaned.replace("鏂板", "", 1).strip()
                return ParsedTask(task_id, "new_story", target, "new_story", cleaned)

            if "鏅尯" in cleaned or "鎺㈢储鐐?" in cleaned:
                target = cleaned.replace("鏂板", "", 1).strip()
                return ParsedTask(task_id, "new_poi", target, "new_poi", cleaned)

            if self.RELIC_PATTERN.search(cleaned) or "瀹?" in cleaned or "鏄?" in cleaned:
                target = cleaned.replace("鏂板", "", 1).strip()
                return ParsedTask(task_id, "new_relic", target, "new_relic", cleaned)

        return ParsedTask(task_id, "unknown", "", "unknown", cleaned)

    def should_create_relic(self, task: dict[str, Any] | str) -> bool:
        return self.parse(task)["task_type"] == "new_relic"

    def should_create_poi(self, task: dict[str, Any] | str) -> bool:
        return self.parse(task)["task_type"] == "new_poi"


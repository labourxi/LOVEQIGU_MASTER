"""Shared types for Visual Autopilot."""

from __future__ import annotations


class Task:
    def __init__(self, task_id: str = "", task_type: str = "", prompt: str = "") -> None:
        self.task_id = task_id
        self.task_type = task_type
        self.prompt = prompt

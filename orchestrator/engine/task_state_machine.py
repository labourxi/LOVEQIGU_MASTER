from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


ALLOWED_TRANSITIONS = {
    "pending": {"running", "blocked"},
    "running": {"completed", "failed", "blocked"},
    "completed": set(),
    "failed": set(),
    "blocked": set(),
}


@dataclass
class TaskStateMachine:
    state: str = "pending"
    history: list[dict[str, Any]] = field(default_factory=list)

    def transition(self, next_state: str, reason: str | None = None) -> str:
        if next_state not in ALLOWED_TRANSITIONS:
            raise ValueError(f"Unsupported state: {next_state}")
        allowed = ALLOWED_TRANSITIONS.get(self.state, set())
        if next_state not in allowed:
            raise ValueError(f"Illegal transition: {self.state} -> {next_state}")
        self.state = next_state
        entry = {"state": next_state}
        if reason:
            entry["reason"] = reason
        self.history.append(entry)
        return self.state

    def can_transition(self, next_state: str) -> bool:
        return next_state in ALLOWED_TRANSITIONS.get(self.state, set())

    def mark_blocked(self, reason: str | None = None) -> str:
        return self.transition("blocked", reason=reason)

    def mark_running(self) -> str:
        return self.transition("running")

    def mark_completed(self) -> str:
        return self.transition("completed")

    def mark_failed(self) -> str:
        return self.transition("failed")

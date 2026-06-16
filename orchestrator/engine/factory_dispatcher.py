from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Type

from orchestrator.factories.adapters.relic_factory import RelicFactoryAdapter
from orchestrator.factories.adapters.story_factory import StoryFactoryAdapter
from orchestrator.factories.adapters.visual_factory import VisualFactoryAdapter


@dataclass
class DispatchResult:
    status: str
    factory: str
    result: dict[str, Any]

    def to_dict(self) -> dict[str, Any]:
        return {
            "status": self.status,
            "factory": self.factory,
            "result": self.result,
        }


class FactoryDispatcher:
    ROUTES: dict[str, Type] = {
        "new_relic": RelicFactoryAdapter,
        "new_visual": VisualFactoryAdapter,
        "new_story": StoryFactoryAdapter,
    }

    def route(self, task_type: str):
        adapter_cls = self.ROUTES.get(task_type)
        if adapter_cls is None:
            return None
        return adapter_cls()

    def dispatch(self, task_type: str, task_context: dict[str, Any] | None = None) -> dict[str, Any]:
        adapter = self.route(task_type)
        if adapter is None:
            return {
                "status": "blocked",
                "factory": "",
                "result": {
                    "error": "UNKNOWN_FACTORY_ROUTE",
                    "task_type": task_type,
                },
            }
        result = adapter.execute(task_context or {})
        return DispatchResult(
            status=result.get("status", "failed"),
            factory=result.get("factory", ""),
            result=result,
        ).to_dict()

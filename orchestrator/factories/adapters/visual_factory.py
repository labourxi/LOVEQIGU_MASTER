from __future__ import annotations

from pathlib import Path
from typing import Any

try:
    from scripts.visual_autopilot.run_multi_candidate_ranking import run as run_visual_pipeline
except Exception:  # pragma: no cover
    from .....scripts.visual_autopilot.run_multi_candidate_ranking import run as run_visual_pipeline  # type: ignore

try:
    from orchestrator.review.human_review_gate import HumanReviewGate
except Exception:  # pragma: no cover
    from ...review.human_review_gate import HumanReviewGate  # type: ignore


ROOT = Path(__file__).resolve().parents[3]


class VisualFactoryAdapter:
    factory_name = "VisualFactory"

    def execute(self, task_context=None):
        context = task_context or {}
        prompt = str(context.get("prompt") or context.get("target") or "Ancient Eastern celestial relic, Jiao Mansion constellation seal, jade glyph artifacts, museum artifact lighting, soft golden dust particles, ancient manuscript background")
        config = {
            "size": str(context.get("size", "2048x2048")),
            "negative_prompt": str(
                context.get(
                    "negative_prompt",
                    "phoenix, bird, dragon body, creature, monster, warrior, weapon, anime, cartoon, neon, game UI",
                )
            ),
        }
        result = run_visual_pipeline(prompt, config=config)
        if result.get("status") != "PASS":
            return {
                "status": "failed",
                "factory": self.factory_name,
                "error": result,
            }
        review_gate = HumanReviewGate()
        review_package = review_gate.create_review_package()
        publish_result = review_gate.attempt_runtime_publish()
        winner = result.get("winner") or {}
        winner_path = result.get("winner_path", "")
        score = 0
        if isinstance(winner, dict):
            scores = winner.get("scores", {})
            if isinstance(scores, dict):
                score = int(scores.get("total_score", 0))
        return {
            "status": "success",
            "factory": self.factory_name,
            "winner": Path(winner_path).name if winner_path else "",
            "winner_path": winner_path,
            "score": score,
            "result": result,
            "human_review": {
                "status": review_package.get("status"),
                "approval_status": review_package.get("approval_status"),
                "runtime_publish_status": review_package.get("runtime_publish_status"),
                "runtime_publish_allowed": review_package.get("runtime_publish_allowed"),
                "review_package_path": review_package.get("review_package_path"),
                "review_status_path": review_package.get("review_status_path"),
            },
            "runtime_publish": publish_result,
            "task_context": context,
        }

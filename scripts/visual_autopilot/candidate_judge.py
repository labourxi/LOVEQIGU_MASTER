from __future__ import annotations

import json
import os
import multiprocessing as mp
import queue
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

try:
    from PIL import Image
except Exception:  # pragma: no cover
    Image = None

try:
    from .gemini_judge import GeminiJudge
except Exception:  # pragma: no cover
    from gemini_judge import GeminiJudge  # type: ignore

try:
    from .credentials import get_gemini_credentials
except Exception:  # pragma: no cover
    from credentials import get_gemini_credentials  # type: ignore


ROOT = Path(__file__).resolve().parents[2]
CANDIDATES_DIR = ROOT / "assets" / "visual-autopilot" / "candidates"
JUDGE_DIR = ROOT / "assets" / "visual-autopilot" / "judge"


@dataclass
class CandidateScore:
    path: str
    provider: str
    image_size: str
    dimensions: dict[str, int]
    total_score: int
    review_mode: str
    reasoning: str


def _gemini_review_worker(candidate_path: str, prompt: str, timeout_seconds: int, output_queue) -> None:
    try:
        judge = GeminiJudge()
        result = judge.judge(candidate_path, prompt, timeout=timeout_seconds)
        output_queue.put({"ok": True, "result": result})
    except Exception as exc:  # pragma: no cover - worker safety
        output_queue.put(
            {
                "ok": False,
                "result": {
                    "judge_source": "GEMINI",
                    "judge_status": "failed",
                    "status": "FAILED",
                    "key_found": False,
                    "key_source": "missing",
                    "http_status": None,
                    "latency_ms": 0,
                    "exception_type": type(exc).__name__,
                    "exception_message": str(exc),
                    "error": {
                        "error_code": "CANDIDATE_JUDGE_WORKER_ERROR",
                        "error_message": str(exc),
                        "retryable": False,
                    },
                },
            }
        )


class CandidateJudge:
    CANDIDATE_JUDGE_TIMEOUT_SECONDS = 30

    def __init__(self, candidates_dir: Path | None = None):
        self.candidates_dir = candidates_dir or CANDIDATES_DIR
        self.gemini_judge = GeminiJudge()

    def _now_iso(self) -> str:
        return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    def _list_candidates(self, candidate_paths: list[str] | None = None) -> list[Path]:
        if candidate_paths:
            items = [Path(item) for item in candidate_paths]
            return [item for item in items if item.exists() and item.is_file()]
        if not self.candidates_dir.exists():
            return []
        items = [
            item
            for item in self.candidates_dir.iterdir()
            if item.is_file() and item.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}
        ]
        return sorted(items)

    def _mime_type(self, path: Path) -> str:
        suffix = path.suffix.lower()
        if suffix in {".jpg", ".jpeg"}:
            return "image/jpeg"
        if suffix == ".webp":
            return "image/webp"
        return "image/png"

    def _read_image_size(self, path: Path) -> tuple[int | None, int | None]:
        try:
            data = path.read_bytes()
        except Exception:
            return None, None

        if data.startswith(b"\x89PNG\r\n\x1a\n") and len(data) >= 24:
            return int.from_bytes(data[16:20], "big"), int.from_bytes(data[20:24], "big")

        if data.startswith(b"\xff\xd8"):
            index = 2
            length = len(data)
            while index < length - 1:
                if data[index] != 0xFF:
                    index += 1
                    continue
                marker = data[index + 1]
                index += 2
                while marker == 0xFF and index < length - 1:
                    marker = data[index]
                    index += 1
                if marker in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
                    if index + 7 > length:
                        return None, None
                    height = int.from_bytes(data[index + 3:index + 5], "big")
                    width = int.from_bytes(data[index + 5:index + 7], "big")
                    return width, height
                if index + 2 > length:
                    return None, None
                segment_length = int.from_bytes(data[index:index + 2], "big")
                if segment_length < 2:
                    return None, None
                index += segment_length

        return None, None

    def _image_metadata(self, path: Path) -> dict[str, Any]:
        width, height = self._read_image_size(path)
        return {
            "path": str(path),
            "filename": path.name,
            "provider": "Unknown",
            "size_bytes": path.stat().st_size,
            "width": width,
            "height": height,
            "mime_type": self._mime_type(path),
            "image_size": f"{width}x{height}" if width and height else "unknown",
        }

    def _image_features(self, path: Path) -> dict[str, float]:
        if Image is None:
            return {}
        try:
            with Image.open(path) as img:
                img = img.convert("RGB").resize((128, 128))
                pixels = list(img.getdata())
        except Exception:
            return {}

        if not pixels:
            return {}

        total = len(pixels)
        bright = 0
        warm = 0
        low_sat = 0
        red_dominant = 0
        for r, g, b in pixels:
            mx = max(r, g, b)
            mn = min(r, g, b)
            sat = 0.0 if mx == 0 else (mx - mn) / mx
            brightness = (r + g + b) / 3
            if brightness >= 220 and sat <= 0.22:
                bright += 1
            if r >= g >= b and r >= 110 and g >= 70 and b <= 210:
                warm += 1
            if sat <= 0.25:
                low_sat += 1
            if r > g and r > b and r >= 120:
                red_dominant += 1
        return {
            "bright_ratio": bright / total,
            "warm_ratio": warm / total,
            "low_sat_ratio": low_sat / total,
            "red_ratio": red_dominant / total,
        }

    def _local_review(self, path: Path, prompt: str, metadata: dict[str, Any]) -> CandidateScore:
        features = self._image_features(path)
        prompt_text = f"{prompt} {metadata.get('filename', '')}".lower()
        relic_keywords = [
            "relic",
            "seal",
            "jade",
            "artifact",
            "ancient",
            "museum",
            "ritual",
            "constellation",
            "信物",
            "古",
            "礼",
            "印",
        ]
        relic_boost = sum(1 for keyword in relic_keywords if keyword in prompt_text)

        oriental = min(10, max(0, 1 + int(features.get("warm_ratio", 0.0) * 8) + (1 if relic_boost else 0)))
        ancient = min(10, max(0, 2 + int(features.get("warm_ratio", 0.0) * 10)))
        mystery = min(10, max(0, 1 + int((1.0 - features.get("bright_ratio", 0.0)) * 3)))
        whitespace = min(10, max(0, 2 + int(features.get("bright_ratio", 0.0) * 12)))
        relic_fit = min(10, max(0, 1 + relic_boost + int(features.get("low_sat_ratio", 0.0) * 3)))

        total_score = oriental + ancient + mystery + whitespace + relic_fit
        reasoning = (
            "Local fallback judge used because Gemini review key is unavailable. "
            "Scores derived from image brightness, warm-tone presence, and prompt keyword fit."
        )
        return CandidateScore(
            path=str(path),
            provider=metadata.get("provider", "Unknown"),
            image_size=metadata.get("image_size", "unknown"),
            dimensions={
                "oriental_score": oriental,
                "ancient_score": ancient,
                "mystery_score": mystery,
                "whitespace_score": whitespace,
                "relic_fit_score": relic_fit,
            },
            total_score=total_score,
            review_mode="local_fallback",
            reasoning=reasoning,
        )

    def _gemini_review(self, path: Path, prompt: str, metadata: dict[str, Any]) -> CandidateScore | None:
        ctx = mp.get_context("spawn")
        output_queue = ctx.Queue()
        process = ctx.Process(
            target=_gemini_review_worker,
            args=(str(path), prompt, self.CANDIDATE_JUDGE_TIMEOUT_SECONDS, output_queue),
        )
        process.start()
        process.join(self.CANDIDATE_JUDGE_TIMEOUT_SECONDS)
        if process.is_alive():
            process.terminate()
            process.join()
            return CandidateScore(
                path=str(path),
                provider=metadata.get("provider", "Unknown"),
                image_size=metadata.get("image_size", "unknown"),
                dimensions={
                    "oriental_score": 0,
                    "ancient_score": 0,
                    "mystery_score": 0,
                    "whitespace_score": 0,
                    "relic_fit_score": 0,
                },
                total_score=0,
                review_mode="gemini_timeout",
                reasoning="Gemini candidate judge timed out.",
            )

        try:
            worker_result = output_queue.get_nowait()
        except queue.Empty:
            return CandidateScore(
                path=str(path),
                provider=metadata.get("provider", "Unknown"),
                image_size=metadata.get("image_size", "unknown"),
                dimensions={
                    "oriental_score": 0,
                    "ancient_score": 0,
                    "mystery_score": 0,
                    "whitespace_score": 0,
                    "relic_fit_score": 0,
                },
                total_score=0,
                review_mode="gemini_timeout",
                reasoning="Gemini candidate judge produced no response before timeout.",
            )

        result = worker_result.get("result", {})
        if result.get("judge_source") != "GEMINI" or result.get("judge_status") != "available":
            status = str(result.get("status", "")).upper()
            if status == "TIMEOUT":
                return CandidateScore(
                    path=str(path),
                    provider=metadata.get("provider", "Unknown"),
                    image_size=metadata.get("image_size", "unknown"),
                    dimensions={
                        "oriental_score": 0,
                        "ancient_score": 0,
                        "mystery_score": 0,
                        "whitespace_score": 0,
                        "relic_fit_score": 0,
                    },
                    total_score=0,
                    review_mode="gemini_timeout",
                    reasoning=str(result.get("exception_message", "Gemini candidate judge timed out.")),
                )
            return None

        dimensions = {
            "oriental_score": int(result.get("oriental_score", 0)),
            "ancient_score": int(result.get("ancient_score", 0)),
            "mystery_score": int(result.get("mystery_score", 0)),
            "whitespace_score": int(result.get("whitespace_score", 0)),
            "relic_fit_score": int(result.get("relic_fit_score", 0)),
        }
        total_score = int(result.get("total_score", sum(dimensions.values())))
        reasoning = str(result.get("review_text", "")).strip() or "Gemini visual review completed."
        return CandidateScore(
            path=str(path),
            provider=metadata.get("provider", "Unknown"),
            image_size=metadata.get("image_size", "unknown"),
            dimensions=dimensions,
            total_score=total_score,
            review_mode="gemini",
            reasoning=reasoning,
        )

    def score_candidate(self, path: Path, prompt: str, metadata: dict[str, Any] | None = None) -> dict[str, Any]:
        metadata = metadata or {}
        merged_metadata = {**self._image_metadata(path), **metadata}
        gemini = self._gemini_review(path, prompt, merged_metadata)
        review = gemini or self._local_review(path, prompt, merged_metadata)
        judge_source = "GEMINI" if review.review_mode in {"gemini", "gemini_timeout"} else "LOCAL_FALLBACK"
        return {
            "path": review.path,
            "provider": review.provider,
            "image_size": review.image_size,
            "dimensions": review.dimensions,
            "total_score": review.total_score,
            "review_mode": review.review_mode,
            "reasoning": review.reasoning,
            "judge_source": judge_source,
            "status": "TIMEOUT" if review.review_mode == "gemini_timeout" else "SUCCESS",
            "candidate_id": path.name,
            "http_status": None if review.review_mode == "gemini_timeout" else 200,
            "exception_type": "TimeoutExpired" if review.review_mode == "gemini_timeout" else None,
            "exception_message": "Gemini candidate judge timed out." if review.review_mode == "gemini_timeout" else None,
            "fallback_state": "MANUAL_REVIEW_REQUIRED" if review.review_mode == "gemini_timeout" else "NONE",
        }

    def _write_judge_report(self, payload: dict[str, Any]) -> Path:
        JUDGE_DIR.mkdir(parents=True, exist_ok=True)
        report_path = JUDGE_DIR / "judge_report.json"
        report_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        return report_path

    def judge_candidates(
        self,
        prompt: str,
        candidate_paths: list[str] | None = None,
        threshold: int = 35,
    ) -> dict[str, Any]:
        files = self._list_candidates(candidate_paths)
        scored = [self.score_candidate(path, prompt) for path in files]
        ranked = sorted(scored, key=lambda item: item["total_score"], reverse=True)
        winner = ranked[0] if ranked else None
        backup = ranked[1] if len(ranked) > 1 else None
        rejected = ranked[2:] if len(ranked) > 2 else []
        freeze_status = "READY_FOR_FREEZE" if winner and winner["total_score"] >= threshold else "NOT_READY"
        judge_source = "GEMINI" if any(item.get("judge_source") == "GEMINI" for item in scored) else "LOCAL_FALLBACK"
        payload = {
            "timestamp": self._now_iso(),
            "prompt": prompt,
            "candidate_count": len(scored),
            "judge_source": judge_source,
            "scores": scored,
            "ranked_candidates": ranked,
            "winner": winner,
            "backup": backup,
            "rejected": rejected,
            "total_score_max": 50,
            "freeze_status": freeze_status,
            "gemini_review_available": bool(get_gemini_credentials().get("gemini_key_found")),
            "fallback_state": "MANUAL_REVIEW_REQUIRED" if any(item.get("status") == "TIMEOUT" for item in scored) else "NONE",
            "candidate_trace": [
                {
                    "candidate_id": item.get("candidate_id"),
                    "status": item.get("status"),
                    "http_status": item.get("http_status"),
                    "exception_type": item.get("exception_type"),
                    "exception_message": item.get("exception_message"),
                    "duration_seconds": 0,
                }
                for item in scored
            ],
        }
        payload["report_path"] = str(self._write_judge_report(payload))
        return payload

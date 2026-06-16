from __future__ import annotations

import base64
import json
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
import sys
import socket
from urllib import error, request

try:
    from .credentials import get_gemini_credentials
except Exception:  # pragma: no cover
    CURRENT_DIR = Path(__file__).resolve().parent
    if str(CURRENT_DIR) not in sys.path:
        sys.path.insert(0, str(CURRENT_DIR))
    from credentials import get_gemini_credentials  # type: ignore


ROOT = Path(__file__).resolve().parents[2]
DEFAULT_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
JUDGE_DIR = ROOT / "assets" / "visual-autopilot" / "judge"


@dataclass
class GeminiJudgeResult:
    oriental_score: int
    oriental_reason: str
    ancient_score: int
    ancient_reason: str
    mystery_score: int
    mystery_reason: str
    whitespace_score: int
    whitespace_reason: str
    relic_fit_score: int
    relic_fit_reason: str
    total_score: int
    review_text: str

    def to_dict(self) -> dict[str, object]:
        return {
            "oriental_score": self.oriental_score,
            "oriental_reason": self.oriental_reason,
            "ancient_score": self.ancient_score,
            "ancient_reason": self.ancient_reason,
            "mystery_score": self.mystery_score,
            "mystery_reason": self.mystery_reason,
            "whitespace_score": self.whitespace_score,
            "whitespace_reason": self.whitespace_reason,
            "relic_fit_score": self.relic_fit_score,
            "relic_fit_reason": self.relic_fit_reason,
            "total_score": self.total_score,
            "review_text": self.review_text,
        }


class GeminiJudge:
    HEALTH_MODEL = "gemini-2.5-flash"

    def __init__(self, endpoint: str = DEFAULT_ENDPOINT):
        self.endpoint = endpoint

    def _now_iso(self) -> str:
        return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    def _mask_api_key(self, api_key: str | None) -> str:
        if not api_key:
            return "MISSING"
        value = api_key.strip()
        if len(value) <= 8:
            return "*" * len(value)
        return f"{value[:4]}...{value[-4:]}"

    def _summarize_payload(self, payload: dict[str, object]) -> dict[str, object]:
        contents = payload.get("contents", [])
        generation_config = payload.get("generationConfig", {})
        first_content = contents[0] if isinstance(contents, list) and contents else {}
        parts = first_content.get("parts", []) if isinstance(first_content, dict) else []
        part_types = []
        if isinstance(parts, list):
            for part in parts:
                if isinstance(part, dict):
                    if "text" in part:
                        part_types.append("text")
                    elif "inline_data" in part:
                        part_types.append("inline_data")
                    else:
                        part_types.append("unknown")
        schema = {}
        if isinstance(generation_config, dict):
            schema = generation_config.get("responseSchema", {}) if isinstance(generation_config.get("responseSchema", {}), dict) else {}
        return {
            "contents_count": len(contents) if isinstance(contents, list) else 0,
            "parts_count": len(parts) if isinstance(parts, list) else 0,
            "part_types": part_types,
            "response_mime_type": generation_config.get("responseMimeType") if isinstance(generation_config, dict) else None,
            "response_schema_keys": sorted(list(schema.get("properties", {}).keys())) if isinstance(schema, dict) else [],
        }

    def _summarize_response_body(self, body: object) -> dict[str, object]:
        if not isinstance(body, dict):
            return {"type": type(body).__name__, "summary": str(body)[:500]}
        summary: dict[str, object] = {"keys": sorted(list(body.keys()))}
        candidates = body.get("candidates", [])
        if isinstance(candidates, list):
            summary["candidate_count"] = len(candidates)
            if candidates and isinstance(candidates[0], dict):
                first = candidates[0]
                content = first.get("content", {})
                parts = content.get("parts", []) if isinstance(content, dict) else []
                summary["first_candidate_part_count"] = len(parts) if isinstance(parts, list) else 0
        return summary

    def _build_debug_block(
        self,
        *,
        key_found: bool,
        key_source: str | None,
        api_key: str | None,
        payload: dict[str, object],
        result: dict[str, object] | None = None,
    ) -> dict[str, object]:
        response_error_message = None
        exception_type = None
        exception_message = None
        http_status = None
        raw_response_summary = {}
        latency_ms = 0
        if result:
            http_status = result.get("status_code")
            raw_response_summary = self._summarize_response_body(result.get("body"))
            latency_ms = int(result.get("latency_ms", 0) or 0)
            if not result.get("ok"):
                response_error_message = result.get("raw_body") or result.get("error")
                exception_type = result.get("exception_type")
                exception_message = result.get("exception_message")
        return {
            "key_detected": "YES" if key_found else "NO",
            "key_source": key_source or "missing",
            "key_masked_preview": self._mask_api_key(api_key),
            "model": self.HEALTH_MODEL,
            "endpoint": self.endpoint,
            "request_payload_summary": self._summarize_payload(payload),
            "http_status": http_status,
            "response_error_message": response_error_message,
            "exception_type": exception_type,
            "exception_message": exception_message,
            "response_body_summary": raw_response_summary,
            "latency_ms": latency_ms,
        }

    def _mime_type(self, image_path: Path) -> str:
        suffix = image_path.suffix.lower()
        if suffix in {".jpg", ".jpeg"}:
            return "image/jpeg"
        if suffix == ".webp":
            return "image/webp"
        return "image/png"

    def _build_payload(self, prompt: str, image_path: Path) -> dict[str, object]:
        image_bytes = image_path.read_bytes()
        judge_prompt = (
            "You are an Eastern cultural visual director.\n"
            "Score the image on five dimensions from 0 to 10.\n"
            "Use the following meaning for each score:\n"
            "- oriental_score: Chinese classics, epigraphy, constellations, scrolls, and whitespace.\n"
            "- ancient_score: museum-grade relic presence from modern to ancient.\n"
            "- mystery_score: ritual atmosphere and sacred ambiguity.\n"
            "- whitespace_score: breathing room, composition space, refined emptiness.\n"
            "- relic_fit_score: fit for the LOVEQIGU relic system.\n\n"
            "Avoid game UI, cyberpunk, anime, and western fantasy aesthetics.\n"
            "Return only strict JSON with the exact keys:\n"
            "oriental_score, oriental_reason, ancient_score, ancient_reason, mystery_score, mystery_reason, whitespace_score, whitespace_reason, relic_fit_score, relic_fit_reason, total_score, review_text.\n"
            "No markdown fences. No extra text.\n\n"
            f"Prompt context: {prompt}"
        )
        return {
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        {"text": judge_prompt},
                        {
                            "inline_data": {
                                "mime_type": self._mime_type(image_path),
                                "data": base64.b64encode(image_bytes).decode("utf-8"),
                            }
                        },
                    ],
                }
            ],
            "generationConfig": {
                "temperature": 0.0,
                "maxOutputTokens": 1024,
                "responseMimeType": "application/json",
                "responseSchema": {
                    "type": "object",
                    "properties": {
                        "oriental_score": {"type": "integer"},
                        "oriental_reason": {"type": "string"},
                        "ancient_score": {"type": "integer"},
                        "ancient_reason": {"type": "string"},
                        "mystery_score": {"type": "integer"},
                        "mystery_reason": {"type": "string"},
                        "whitespace_score": {"type": "integer"},
                        "whitespace_reason": {"type": "string"},
                        "relic_fit_score": {"type": "integer"},
                        "relic_fit_reason": {"type": "string"},
                        "total_score": {"type": "integer"},
                        "review_text": {"type": "string"},
                    },
                    "required": [
                        "oriental_score",
                        "oriental_reason",
                        "ancient_score",
                        "ancient_reason",
                        "mystery_score",
                        "mystery_reason",
                        "whitespace_score",
                        "whitespace_reason",
                        "relic_fit_score",
                        "relic_fit_reason",
                        "total_score",
                        "review_text",
                    ],
                },
            },
        }

    def _build_calibrated_payload(self, prompt: str, image_path: Path) -> dict[str, object]:
        image_bytes = image_path.read_bytes()
        judge_prompt = (
            "You are an Eastern cultural visual director.\n"
            "Calibrate the scoring so that images with different quality levels receive meaningfully different scores.\n"
            "From each dimension, provide a score and a short reason.\n\n"
            "Dimension definitions and scoring anchors:\n"
            "1. 东方感 (Oriental): Chinese classics, epigraphy, constellations, scrolls, whitespace.\n"
            "   - 0-2: no oriental cues\n"
            "   - 3-5: partial oriental cues\n"
            "   - 6-8: clear oriental visual language\n"
            "   - 9-10: fully realized oriental visual authority\n"
            "2. 古朴感 (Ancient):\n"
            "   - 0-2: modern-heavy\n"
            "   - 3-5: average\n"
            "   - 6-8: clear relic feel\n"
            "   - 9-10: museum-grade relic presence\n"
            "3. 神秘感 (Mystery):\n"
            "   - 0-2: none\n"
            "   - 3-5: mild\n"
            "   - 6-8: strong ritual atmosphere\n"
            "   - 9-10: ceremonial intensity\n"
            "4. 留白感 (Whitespace):\n"
            "   - 0-2: crowded\n"
            "   - 3-5: ordinary\n"
            "   - 6-8: good breathing room\n"
            "   - 9-10: high-level whitespace\n"
            "5. 信物契合度 (Relic Fit):\n"
            "   - 0-2: not a relic\n"
            "   - 3-5: partial fit\n"
            "   - 6-8: clearly fits relic system\n"
            "   - 9-10: fully matches LOVEQIGU relic system\n\n"
            "Disallow game UI, cyberpunk, anime, and western fantasy aesthetics.\n"
            "Return only strict JSON with exact keys:\n"
            "oriental_score, oriental_reason, ancient_score, ancient_reason, mystery_score, mystery_reason, whitespace_score, whitespace_reason, relic_fit_score, relic_fit_reason, total_score, review_text.\n"
            "No markdown fences. No extra text.\n\n"
            f"Prompt context: {prompt}"
        )
        return {
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        {"text": judge_prompt},
                        {
                            "inline_data": {
                                "mime_type": self._mime_type(image_path),
                                "data": base64.b64encode(image_bytes).decode("utf-8"),
                            }
                        },
                    ],
                }
            ],
            "generationConfig": {
                "temperature": 0.0,
                "maxOutputTokens": 1536,
                "responseMimeType": "application/json",
                "responseSchema": {
                    "type": "object",
                    "properties": {
                        "oriental_score": {"type": "integer"},
                        "oriental_reason": {"type": "string"},
                        "ancient_score": {"type": "integer"},
                        "ancient_reason": {"type": "string"},
                        "mystery_score": {"type": "integer"},
                        "mystery_reason": {"type": "string"},
                        "whitespace_score": {"type": "integer"},
                        "whitespace_reason": {"type": "string"},
                        "relic_fit_score": {"type": "integer"},
                        "relic_fit_reason": {"type": "string"},
                        "total_score": {"type": "integer"},
                        "review_text": {"type": "string"},
                    },
                    "required": [
                        "oriental_score",
                        "oriental_reason",
                        "ancient_score",
                        "ancient_reason",
                        "mystery_score",
                        "mystery_reason",
                        "whitespace_score",
                        "whitespace_reason",
                        "relic_fit_score",
                        "relic_fit_reason",
                        "total_score",
                        "review_text",
                    ],
                },
            },
        }

    def _safe_json(self, text: str):
        try:
            return json.loads(text)
        except Exception:
            return {"raw": text}

    def _request(self, api_key: str, payload: dict[str, object], timeout: int = 30) -> dict[str, object]:
        body = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
        req = request.Request(
            self.endpoint,
            data=body,
            method="POST",
            headers={
                "Content-Type": "application/json",
                "x-goog-api-key": api_key,
            },
        )
        started = time.perf_counter()
        try:
            with request.urlopen(req, timeout=timeout) as resp:
                raw_body = resp.read().decode("utf-8", errors="replace")
                latency_ms = int((time.perf_counter() - started) * 1000)
                return {
                    "ok": True,
                    "status_code": resp.status,
                    "latency_ms": latency_ms,
                    "raw_body": raw_body,
                    "body": json.loads(raw_body) if raw_body else {},
                }
        except error.HTTPError as exc:
            raw_body = exc.read().decode("utf-8", errors="replace")
            latency_ms = int((time.perf_counter() - started) * 1000)
            return {
                "ok": False,
                "status_code": exc.code,
                "latency_ms": latency_ms,
                "raw_body": raw_body,
                "body": self._safe_json(raw_body),
                "error": str(exc),
                "exception_type": type(exc).__name__,
                "exception_message": str(exc),
            }
        except (TimeoutError, socket.timeout) as exc:
            latency_ms = int((time.perf_counter() - started) * 1000)
            return {
                "ok": False,
                "status_code": None,
                "latency_ms": latency_ms,
                "raw_body": "",
                "body": None,
                "error": str(exc),
                "exception_type": type(exc).__name__,
                "exception_message": str(exc),
            }
        except Exception as exc:
            latency_ms = int((time.perf_counter() - started) * 1000)
            return {
                "ok": False,
                "status_code": None,
                "latency_ms": latency_ms,
                "raw_body": "",
                "body": None,
                "error": str(exc),
                "exception_type": type(exc).__name__,
                "exception_message": str(exc),
            }

    def _parse_review(self, response_body: dict[str, object]) -> GeminiJudgeResult | None:
        try:
            candidates = response_body.get("candidates", [])
            if not candidates:
                return None
            parts = candidates[0].get("content", {}).get("parts", [])
            text = "".join(part.get("text", "") for part in parts if isinstance(part, dict))
            text = text.strip()
            if text.startswith("```"):
                text = text.strip("`")
                if text.lower().startswith("json"):
                    text = text[4:]
            text = text.strip()
            if text.startswith("{") and text.endswith("}"):
                pass
            else:
                start = text.find("{")
                end = text.rfind("}")
                if start != -1 and end != -1 and end > start:
                    text = text[start:end + 1]
            data = self._safe_json(text)
            if not isinstance(data, dict):
                return None
            oriental = int(data.get("oriental_score", 0))
            oriental_reason = str(data.get("oriental_reason", "")).strip()
            ancient = int(data.get("ancient_score", 0))
            ancient_reason = str(data.get("ancient_reason", "")).strip()
            mystery = int(data.get("mystery_score", 0))
            mystery_reason = str(data.get("mystery_reason", "")).strip()
            whitespace = int(data.get("whitespace_score", 0))
            whitespace_reason = str(data.get("whitespace_reason", "")).strip()
            relic_fit = int(data.get("relic_fit_score", 0))
            relic_fit_reason = str(data.get("relic_fit_reason", "")).strip()
            total = int(data.get("total_score", oriental + ancient + mystery + whitespace + relic_fit))
            review_text = str(data.get("review_text", "")).strip()
            return GeminiJudgeResult(
                oriental_score=oriental,
                oriental_reason=oriental_reason,
                ancient_score=ancient,
                ancient_reason=ancient_reason,
                mystery_score=mystery,
                mystery_reason=mystery_reason,
                whitespace_score=whitespace,
                whitespace_reason=whitespace_reason,
                relic_fit_score=relic_fit,
                relic_fit_reason=relic_fit_reason,
                total_score=total,
                review_text=review_text,
            )
        except Exception:
            return None

    def _parse_calibrated_review(self, response_body: dict[str, object]) -> GeminiJudgeResult | None:
        return self._parse_review(response_body)

    def _write_judge_report(self, payload: dict[str, object]) -> Path:
        JUDGE_DIR.mkdir(parents=True, exist_ok=True)
        report_path = JUDGE_DIR / "judge_report.json"
        report_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        return report_path

    def judge(self, image_path: str | Path, prompt: str, timeout: int = 30) -> dict[str, object]:
        path = Path(image_path)
        creds = get_gemini_credentials()
        key_found = bool(creds.get("gemini_key_found"))
        key_source = creds.get("key_source", "missing")
        api_key = creds.get("api_key")

        if not key_found or not api_key:
            result = {
                "judge_source": "LOCAL_FALLBACK",
                "judge_status": "unavailable",
                "key_found": False,
                "key_source": "missing",
                "error": {
                    "error_code": "GEMINI_API_KEY_MISSING",
                    "error_message": "No Gemini API key found in Gemini environment variables.",
                    "retryable": False,
                },
            }
            self._write_judge_report(
                {
                    "candidate": str(path),
                    "prompt": prompt,
                    "judge_source": result["judge_source"],
                    "key_found": result["key_found"],
                    "key_source": result["key_source"],
                    "error": result["error"],
                    "debug": self._build_debug_block(
                        key_found=False,
                        key_source="missing",
                        api_key=None,
                        payload={},
                    ),
                }
            )
            return result

        payload = self._build_payload(prompt, path)
        result = self._request(str(api_key), payload, timeout=timeout)
        if not result.get("ok"):
            failure = {
                "judge_source": "GEMINI",
                "judge_status": "failed",
                "key_found": True,
                "key_source": key_source,
                "http_status": result.get("status_code"),
                "latency_ms": result.get("latency_ms", 0),
                "exception_type": result.get("exception_type"),
                "exception_message": result.get("exception_message"),
                "error": {
                    "error_code": "KEY_FOUND_BUT_API_CALL_FAILED",
                    "error_message": result.get("raw_body") or result.get("error") or "Gemini judge request failed.",
                    "retryable": False,
                },
            }
            self._write_judge_report(
                {
                    "candidate": str(path),
                    "prompt": prompt,
                    "judge_source": failure["judge_source"],
                    "key_found": failure["key_found"],
                    "key_source": failure["key_source"],
                    "error": failure["error"],
                    "http_status": failure["http_status"],
                    "latency_ms": failure["latency_ms"],
                    "debug": self._build_debug_block(
                        key_found=True,
                        key_source=str(key_source),
                        api_key=str(api_key),
                        payload=payload,
                        result=result,
                    ),
                }
            )
            return failure

        parsed = self._parse_review(result.get("body", {}))
        if parsed is None:
            failure = {
                "judge_source": "GEMINI",
                "judge_status": "failed",
                "key_found": True,
                "key_source": key_source,
                "http_status": result.get("status_code"),
                "latency_ms": result.get("latency_ms", 0),
                "exception_type": result.get("exception_type"),
                "exception_message": result.get("exception_message"),
                "error": {
                    "error_code": "KEY_FOUND_BUT_API_CALL_FAILED",
                    "error_message": "Gemini judge response could not be parsed into the required schema.",
                    "retryable": False,
                },
            }
            self._write_judge_report(
                {
                    "candidate": str(path),
                    "prompt": prompt,
                    "judge_source": failure["judge_source"],
                    "key_found": failure["key_found"],
                    "key_source": failure["key_source"],
                    "error": failure["error"],
                    "http_status": failure["http_status"],
                    "latency_ms": failure["latency_ms"],
                    "debug": self._build_debug_block(
                        key_found=True,
                        key_source=str(key_source),
                        api_key=str(api_key),
                        payload=payload,
                        result=result,
                    ),
                }
            )
            return failure

        output = {
            **parsed.to_dict(),
            "judge_source": "GEMINI",
            "judge_status": "available",
            "key_found": True,
            "key_source": key_source,
            "http_status": result.get("status_code"),
            "latency_ms": result.get("latency_ms", 0),
            "raw_response": result.get("body", {}),
        }
        self._write_judge_report(
            {
                "candidate": str(path),
                "prompt": prompt,
                "judge_source": output["judge_source"],
                "key_found": output["key_found"],
                "key_source": output["key_source"],
                "scores": {
                    "oriental_score": output["oriental_score"],
                    "ancient_score": output["ancient_score"],
                    "mystery_score": output["mystery_score"],
                    "whitespace_score": output["whitespace_score"],
                    "relic_fit_score": output["relic_fit_score"],
                    "total_score": output["total_score"],
                },
                "review_text": output["review_text"],
                "http_status": output["http_status"],
                "latency_ms": output["latency_ms"],
                "debug": self._build_debug_block(
                    key_found=True,
                    key_source=str(key_source),
                    api_key=str(api_key),
                    payload=payload,
                    result=result,
                ),
            }
        )
        return output

    def judge_calibrated(self, image_path: str | Path, prompt: str, timeout: int = 30) -> dict[str, object]:
        path = Path(image_path)
        creds = get_gemini_credentials()
        key_found = bool(creds.get("gemini_key_found"))
        key_source = creds.get("key_source", "missing")
        api_key = creds.get("api_key")

        if not key_found or not api_key:
            result = {
                "judge_source": "LOCAL_FALLBACK",
                "judge_status": "unavailable",
                "key_found": False,
                "key_source": "missing",
                "error": {
                    "error_code": "GEMINI_API_KEY_MISSING",
                    "error_message": "No Gemini API key found in Gemini environment variables.",
                    "retryable": False,
                },
            }
            self._write_judge_report(
                {
                    "candidate": str(path),
                    "prompt": prompt,
                    "judge_source": result["judge_source"],
                    "key_found": result["key_found"],
                    "key_source": result["key_source"],
                    "error": result["error"],
                    "debug": self._build_debug_block(
                        key_found=False,
                        key_source="missing",
                        api_key=None,
                        payload={},
                    ),
                }
            )
            return result

        payload = self._build_calibrated_payload(prompt, path)
        result = self._request(str(api_key), payload, timeout=timeout)
        if not result.get("ok"):
            failure = {
                "judge_source": "GEMINI",
                "judge_status": "failed",
                "key_found": True,
                "key_source": key_source,
                "http_status": result.get("status_code"),
                "latency_ms": result.get("latency_ms", 0),
                "exception_type": result.get("exception_type"),
                "exception_message": result.get("exception_message"),
                "error": {
                    "error_code": "KEY_FOUND_BUT_API_CALL_FAILED",
                    "error_message": result.get("raw_body") or result.get("error") or "Gemini judge request failed.",
                    "retryable": False,
                },
            }
            self._write_judge_report(
                {
                    "candidate": str(path),
                    "prompt": prompt,
                    "judge_source": failure["judge_source"],
                    "key_found": failure["key_found"],
                    "key_source": failure["key_source"],
                    "error": failure["error"],
                    "http_status": failure["http_status"],
                    "latency_ms": failure["latency_ms"],
                    "debug": self._build_debug_block(
                        key_found=True,
                        key_source=str(key_source),
                        api_key=str(api_key),
                        payload=payload,
                        result=result,
                    ),
                }
            )
            return failure

        parsed = self._parse_calibrated_review(result.get("body", {}))
        if parsed is None:
            failure = {
                "judge_source": "GEMINI",
                "judge_status": "failed",
                "key_found": True,
                "key_source": key_source,
                "http_status": result.get("status_code"),
                "latency_ms": result.get("latency_ms", 0),
                "exception_type": result.get("exception_type"),
                "exception_message": result.get("exception_message"),
                "error": {
                    "error_code": "KEY_FOUND_BUT_API_CALL_FAILED",
                    "error_message": "Gemini judge response could not be parsed into the required calibrated schema.",
                    "retryable": False,
                },
            }
            self._write_judge_report(
                {
                    "candidate": str(path),
                    "prompt": prompt,
                    "judge_source": failure["judge_source"],
                    "key_found": failure["key_found"],
                    "key_source": failure["key_source"],
                    "error": failure["error"],
                    "http_status": failure["http_status"],
                    "latency_ms": failure["latency_ms"],
                    "debug": self._build_debug_block(
                        key_found=True,
                        key_source=str(key_source),
                        api_key=str(api_key),
                        payload=payload,
                        result=result,
                    ),
                }
            )
            return failure

        output = {
            **parsed.to_dict(),
            "judge_source": "GEMINI",
            "judge_status": "available",
            "key_found": True,
            "key_source": key_source,
            "http_status": result.get("status_code"),
            "latency_ms": result.get("latency_ms", 0),
            "raw_response": result.get("body", {}),
        }
        self._write_judge_report(
            {
                "candidate": str(path),
                "prompt": prompt,
                "judge_source": output["judge_source"],
                "key_found": output["key_found"],
                "key_source": output["key_source"],
                "scores": {
                    "oriental_score": output["oriental_score"],
                    "ancient_score": output["ancient_score"],
                    "mystery_score": output["mystery_score"],
                    "whitespace_score": output["whitespace_score"],
                    "relic_fit_score": output["relic_fit_score"],
                    "total_score": output["total_score"],
                },
                "review_reason": {
                    "oriental_reason": output["oriental_reason"],
                    "ancient_reason": output["ancient_reason"],
                    "mystery_reason": output["mystery_reason"],
                    "whitespace_reason": output["whitespace_reason"],
                    "relic_fit_reason": output["relic_fit_reason"],
                },
                "review_text": output["review_text"],
                "http_status": output["http_status"],
                "latency_ms": output["latency_ms"],
                "debug": self._build_debug_block(
                    key_found=True,
                    key_source=str(key_source),
                    api_key=str(api_key),
                    payload=payload,
                    result=result,
                ),
            }
        )
        return output

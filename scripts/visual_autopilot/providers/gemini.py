from __future__ import annotations

import json
import os
import time
from datetime import datetime, timezone
from urllib import error, request

from .base import BaseProvider


class GeminiProvider(BaseProvider):
    HEALTH_MODEL = "gemini-2.5-flash"
    HEALTH_ENDPOINT = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        "gemini-2.5-flash:generateContent"
    )
    HEALTH_CHECK_TIMEOUT_SECONDS = 10
    MODEL_LIST_TIMEOUT_SECONDS = 10
    GENERATE_TIMEOUT_SECONDS = 30
    IMAGE_NOT_AVAILABLE_ERROR = {
        "error_code": "GEMINI_IMAGE_NOT_AVAILABLE",
        "error_message": (
            "AI Studio key validated, but image generation provider is not "
            "implemented or not available."
        ),
        "retryable": False,
    }

    def _resolve_api_key(self):
        for env_name in (
            "GEMINI_API_KEY",
            "GOOGLE_API_KEY",
            "GOOGLE_GENAI_API_KEY",
        ):
            value = os.getenv(env_name)
            if value:
                return env_name, value.strip()
        return None, None

    def _now_iso(self):
        return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    def _request_json(self, endpoint, payload, api_key, timeout=30):
        return self._request(
            endpoint=endpoint,
            method="POST",
            payload=payload,
            api_key=api_key,
            timeout=timeout,
        )

    def _request_get_json(self, endpoint, api_key, timeout=30):
        return self._request(
            endpoint=endpoint,
            method="GET",
            payload=None,
            api_key=api_key,
            timeout=timeout,
        )

    def _request(self, endpoint, method, payload, api_key, timeout=30):
        body = json.dumps(payload).encode("utf-8") if payload is not None else None
        headers = {
            "Content-Type": "application/json",
            "x-goog-api-key": api_key,
        }
        req = request.Request(endpoint, data=body, headers=headers, method=method)
        started = time.perf_counter()
        try:
            with request.urlopen(req, timeout=timeout) as resp:
                raw_body = resp.read().decode("utf-8", errors="replace")
                latency_ms = int((time.perf_counter() - started) * 1000)
                parsed = json.loads(raw_body) if raw_body else {}
                return {
                    "ok": True,
                    "status_code": resp.status,
                    "latency_ms": latency_ms,
                    "body": parsed,
                    "raw_body": raw_body,
                }
        except error.HTTPError as exc:
            raw_body = exc.read().decode("utf-8", errors="replace")
            latency_ms = int((time.perf_counter() - started) * 1000)
            return {
                "ok": False,
                "status_code": exc.code,
                "latency_ms": latency_ms,
                "body": self._safe_json(raw_body),
                "raw_body": raw_body,
                "error": str(exc),
                }
        except Exception as exc:
            latency_ms = int((time.perf_counter() - started) * 1000)
            return {
                "ok": False,
                "status_code": None,
                "latency_ms": latency_ms,
                "body": None,
                "raw_body": "",
                "error": str(exc),
            }

    def _extract_model_fields(self, model_entry):
        name = model_entry.get("name", "")
        display_name = model_entry.get("displayName", "")
        description = model_entry.get("description", "")
        supported_methods = model_entry.get("supportedGenerationMethods", [])
        joined = " ".join(
            [
                str(name),
                str(display_name),
                str(description),
                " ".join(str(item) for item in supported_methods),
            ]
        ).lower()
        return {
            "name": name,
            "display_name": display_name,
            "description": description,
            "supported_generation_methods": supported_methods,
            "contains_image": "image" in joined,
            "contains_imagen": "imagen" in joined,
            "contains_multimodal": "multimodal" in joined,
        }

    def _normalize_models(self, response_body):
        items = response_body.get("models", []) if isinstance(response_body, dict) else []
        normalized = []
        for item in items:
            if isinstance(item, dict):
                normalized.append(self._extract_model_fields(item))
        return normalized

    def _safe_json(self, text):
        try:
            return json.loads(text)
        except Exception:
            return {"raw": text}

    def _structured_failure(self, prompt, model, error_code, error_message):
        return {
            "provider": "Gemini",
            "model": model,
            "image_path": "",
            "prompt": prompt,
            "timestamp": self._now_iso(),
            "status": "failed",
            "error": {
                "error_code": error_code,
                "error_message": error_message,
                "retryable": False,
            },
        }

    def health_check(self):
        key_name, api_key = self._resolve_api_key()
        if not api_key:
            return {
                "provider": "Gemini",
                "status": "unavailable",
                "latency_ms": 0,
                "key_found": False,
                "key_source": None,
                "model": self.HEALTH_MODEL,
                "endpoint": self.HEALTH_ENDPOINT,
                "error": {
                    "error_code": "GEMINI_API_KEY_MISSING",
                    "error_message": (
                        "No Gemini API key found in GEMINI_API_KEY, "
                        "GOOGLE_API_KEY, or GOOGLE_GENAI_API_KEY."
                    ),
                    "retryable": False,
                },
            }

        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": "health check",
                        }
                    ]
                }
            ]
        }
        result = self._request_json(
            self.HEALTH_ENDPOINT,
            payload,
            api_key,
            timeout=self.HEALTH_CHECK_TIMEOUT_SECONDS,
        )

        if not result["ok"]:
            return {
                "provider": "Gemini",
                "status": "unavailable",
                "latency_ms": result["latency_ms"],
                "key_found": True,
                "key_source": key_name,
                "model": self.HEALTH_MODEL,
                "endpoint": self.HEALTH_ENDPOINT,
                "http_status": result.get("status_code"),
                "error": {
                    "error_code": "GEMINI_HEALTH_CHECK_FAILED",
                    "error_message": result.get("raw_body") or result.get("error") or (
                        "Gemini health check failed."
                    ),
                    "retryable": False,
                },
            }

        return {
            "provider": "Gemini",
            "status": "available",
            "latency_ms": result["latency_ms"],
            "key_found": True,
            "key_source": key_name,
            "model": self.HEALTH_MODEL,
            "endpoint": self.HEALTH_ENDPOINT,
            "http_status": result.get("status_code"),
            "response": result.get("body", {}),
        }

    def capabilities(self):
        return {
            "supports_aspect_ratio": False,
            "supports_style_control": False,
            "supports_seed": False,
            "supports_prompt_enhancement": False,
        }

    def image_capability_check(self):
        key_name, api_key = self._resolve_api_key()
        if not api_key:
            return {
                "provider": "Gemini",
                "key_found": False,
                "key_source": None,
                "available_models": [],
                "image_models": [],
                "image_generation_supported": False,
                "recommended_model": None,
                "error": {
                    "error_code": "GEMINI_API_KEY_MISSING",
                    "error_message": (
                        "No Gemini API key found in GEMINI_API_KEY, "
                        "GOOGLE_API_KEY, or GOOGLE_GENAI_API_KEY."
                    ),
                    "retryable": False,
                },
            }

        list_endpoint = "https://generativelanguage.googleapis.com/v1beta/models"
        result = self._request_get_json(list_endpoint, api_key, timeout=self.MODEL_LIST_TIMEOUT_SECONDS)

        if not result["ok"]:
            return {
                "provider": "Gemini",
                "key_found": True,
                "key_source": key_name,
                "available_models": [],
                "image_models": [],
                "image_generation_supported": False,
                "recommended_model": None,
                "http_status": result.get("status_code"),
                "error": {
                    "error_code": "GEMINI_MODEL_LIST_FAILED",
                    "error_message": result.get("raw_body") or result.get("error") or (
                        "Gemini model list request failed."
                    ),
                    "retryable": False,
                },
            }

        available_models = self._normalize_models(result.get("body", {}))
        image_models = [
            model
            for model in available_models
            if model["contains_image"]
            or model["contains_imagen"]
            or model["contains_multimodal"]
        ]

        recommended_model = None
        for priority in ("imagen", "image", "multimodal"):
            for model in image_models:
                if priority == "imagen" and model["contains_imagen"]:
                    recommended_model = model["name"]
                    break
                if priority == "image" and model["contains_image"]:
                    recommended_model = model["name"]
                    break
                if priority == "multimodal" and model["contains_multimodal"]:
                    recommended_model = model["name"]
                    break
            if recommended_model:
                break

        return {
            "provider": "Gemini",
            "key_found": True,
            "key_source": key_name,
            "available_models": available_models,
            "image_models": image_models,
            "image_generation_supported": bool(image_models),
            "recommended_model": recommended_model,
            "http_status": result.get("status_code"),
            "latency_ms": result.get("latency_ms", 0),
        }

    def generate(self, prompt, config):
        health = self.health_check()
        model = self.HEALTH_MODEL

        if health.get("status") != "available":
            error_info = health.get("error") or {}
            error_code = error_info.get("error_code", "GEMINI_HEALTH_CHECK_FAILED")
            error_message = error_info.get(
                "error_message",
                "Gemini provider is unavailable.",
            )
            return self._structured_failure(prompt, model, error_code, error_message)

        return self._structured_failure(
            prompt,
            model,
            self.IMAGE_NOT_AVAILABLE_ERROR["error_code"],
            self.IMAGE_NOT_AVAILABLE_ERROR["error_message"],
        )

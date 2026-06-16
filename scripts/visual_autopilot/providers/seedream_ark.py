from __future__ import annotations

import base64
import copy
import json
import os
import time
from datetime import datetime, timezone
from pathlib import Path
from shutil import copy2
from urllib import error, parse, request

from .base import BaseProvider


ROOT = Path(__file__).resolve().parents[3]
ENV_PATH = ROOT / ".env.local"
CANDIDATES_DIR = ROOT / "assets" / "visual-autopilot" / "candidates"


def _load_env() -> None:
    try:
        from dotenv import load_dotenv  # type: ignore
    except Exception:
        load_dotenv = None

    if not ENV_PATH.exists():
        return

    if load_dotenv is not None:
        load_dotenv(dotenv_path=ENV_PATH, override=False)
        return

    for line in ENV_PATH.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or "=" not in stripped:
            continue
        key, value = stripped.split("=", 1)
        key = key.strip()
        value = value.strip().strip("'").strip('"')
        if key and key not in os.environ:
            os.environ[key] = value


class SeedreamArkProvider(BaseProvider):
    PROVIDER_NAME = "SeedreamArk"
    ENDPOINT = "https://ark.cn-beijing.volces.com/api/v3/images/generations"
    MODEL = "doubao-seedream-5-0-260128"
    DEFAULT_SIZE = "2048x2048"

    def __init__(self):
        _load_env()

    def _now_iso(self):
        return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    def _resolve_api_key(self):
        _load_env()
        api_key = os.getenv("ARK_API_KEY")
        if api_key and api_key.strip():
            return "ARK_API_KEY", api_key.strip()
        return None, None

    def _request_json(self, payload, api_key, timeout=120):
        body = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
        req = request.Request(self.ENDPOINT, data=body, method="POST")
        req.add_header("Content-Type", "application/json")
        req.add_header("Authorization", f"Bearer {api_key}")

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
            }

    def _safe_json(self, text):
        try:
            return json.loads(text)
        except Exception:
            return {"raw": text}

    def _structured_error(self, error_code, error_message, retryable=False, **extra):
        payload = {
            "provider": self.PROVIDER_NAME,
            "status": "failed",
            "error": {
                "error_code": error_code,
                "error_message": error_message,
                "retryable": retryable,
            },
        }
        payload.update(extra)
        return payload

    def _build_payload(self, prompt, config):
        model = self.MODEL
        size = self.DEFAULT_SIZE
        seed = -1
        if isinstance(config, dict):
            configured_model = config.get("model")
            if isinstance(configured_model, str) and configured_model.strip():
                model = configured_model.strip()
            configured_size = config.get("size")
            if isinstance(configured_size, str) and configured_size.strip():
                size = configured_size.strip()
            configured_seed = config.get("seed")
            if isinstance(configured_seed, int):
                seed = configured_seed
            elif isinstance(configured_seed, str):
                try:
                    seed = int(configured_seed)
                except Exception:
                    seed = -1
        payload = {
            "model": model,
            "prompt": prompt,
            "response_format": "url",
            "size": size,
            "seed": seed,
        }
        if isinstance(config, dict):
            for key in ("aspect_ratio", "negative_prompt", "response_format"):
                if key in config and config[key] is not None:
                    payload[key] = config[key]
        return payload

    def _candidate_count(self, config):
        if not isinstance(config, dict):
            return 1
        raw = config.get("candidate_count", 1)
        try:
            count = int(raw)
        except Exception:
            return 1
        return max(1, count)

    def _seed_for_candidate(self, payload, candidate_index):
        seed = payload.get("seed", -1)
        try:
            seed_int = int(seed)
        except Exception:
            seed_int = -1
        if seed_int >= 0:
            return seed_int + candidate_index
        return int(time.time()) + candidate_index

    def _collect_artifacts(self, item, image_urls, binary_data_base64):
        if isinstance(item, dict):
            for key, value in item.items():
                if key in ("url", "image_url") and isinstance(value, str) and value:
                    if value not in image_urls:
                        image_urls.append(value)
                elif key in ("image_urls", "urls") and isinstance(value, list):
                    for url in value:
                        if isinstance(url, str) and url and url not in image_urls:
                            image_urls.append(url)
                elif key == "data" and isinstance(value, list):
                    for entry in value:
                        if isinstance(entry, dict):
                            url = entry.get("url")
                            if isinstance(url, str) and url and url not in image_urls:
                                image_urls.append(url)
                elif key in ("binary_data_base64", "b64_json") and isinstance(value, str) and value:
                    if value not in binary_data_base64:
                        binary_data_base64.append(value)
                elif isinstance(value, (dict, list)):
                    self._collect_artifacts(value, image_urls, binary_data_base64)
        elif isinstance(item, list):
            for entry in item:
                self._collect_artifacts(entry, image_urls, binary_data_base64)

    def _extract_artifacts(self, response_body):
        image_urls = []
        binary_data_base64 = []
        self._collect_artifacts(response_body, image_urls, binary_data_base64)
        return image_urls, binary_data_base64

    def _download_bytes(self, url, timeout=120):
        with request.urlopen(url, timeout=timeout) as resp:
            content_type = resp.headers.get("Content-Type", "").lower()
            return resp.read(), content_type

    def _infer_extension(self, content_type, url=""):
        lower = (content_type or "").lower()
        if "png" in lower or url.lower().endswith(".png"):
            return ".png"
        if "jpeg" in lower or "jpg" in lower or url.lower().endswith(".jpg") or url.lower().endswith(".jpeg"):
            return ".jpg"
        if "webp" in lower or url.lower().endswith(".webp"):
            return ".webp"
        return ".png"

    def _write_candidate_file(self, payload_bytes, stem, extension=".png"):
        CANDIDATES_DIR.mkdir(parents=True, exist_ok=True)
        output_path = CANDIDATES_DIR / f"{stem}{extension}"
        output_path.write_bytes(payload_bytes)
        return output_path

    def _generate_one(self, prompt, config, api_key, key_name, candidate_index=0, candidate_count=1):
        payload = self._build_payload(prompt, config or {})
        payload["seed"] = self._seed_for_candidate(payload, candidate_index)
        result = self._request_json(payload, api_key)
        if not result.get("ok"):
            return self._structured_error(
                "ARK_REQUEST_FAILED",
                result.get("raw_body") or result.get("error") or "Seedream Ark request failed.",
                retryable=False,
                provider=self.PROVIDER_NAME,
                model=payload["model"],
                image_url="",
                image_urls=[],
                binary_data_base64=[],
                raw_response=result,
                endpoint=self.ENDPOINT,
                http_status=result.get("status_code"),
                latency_ms=result.get("latency_ms", 0),
                key_found=True,
                key_source=key_name,
                candidate_index=candidate_index + 1,
                candidate_count=candidate_count,
                prompt=prompt,
            )

        image_urls, binary_data_base64 = self._extract_artifacts(result.get("body", {}))
        response_body = result.get("body", {})
        created = None
        usage = None
        if isinstance(response_body, dict):
            created = response_body.get("created")
            usage = response_body.get("usage")
            data = response_body.get("data")
            if isinstance(data, list):
                for entry in data:
                    if isinstance(entry, dict):
                        url = entry.get("url")
                        if isinstance(url, str) and url and url not in image_urls:
                            image_urls.append(url)
                        b64 = entry.get("binary_data_base64")
                        if isinstance(b64, str) and b64 and b64 not in binary_data_base64:
                            binary_data_base64.append(b64)
        saved_path = ""
        if image_urls:
            try:
                image_bytes, content_type = self._download_bytes(image_urls[0])
                extension = self._infer_extension(content_type, image_urls[0])
                saved = self._write_candidate_file(
                    image_bytes,
                    f"seedream_ark_{int(time.time_ns())}_{candidate_index + 1}",
                    extension=extension,
                )
                saved_path = str(saved.relative_to(ROOT))
            except Exception as exc:
                return self._structured_error(
                    "ARK_IMAGE_DOWNLOAD_FAILED",
                    str(exc),
                    retryable=False,
                    provider=self.PROVIDER_NAME,
                    model=payload["model"],
                    image_url=image_urls[0],
                    image_urls=image_urls,
                    binary_data_base64=binary_data_base64,
                    raw_response=result,
                    endpoint=self.ENDPOINT,
                    http_status=result.get("status_code"),
                    latency_ms=result.get("latency_ms", 0),
                    key_found=True,
                    key_source=key_name,
                    candidate_index=candidate_index + 1,
                    candidate_count=candidate_count,
                    prompt=prompt,
                )
        elif binary_data_base64:
            try:
                image_bytes = base64.b64decode(binary_data_base64[0])
                saved = self._write_candidate_file(
                    image_bytes,
                    f"seedream_ark_{int(time.time_ns())}_{candidate_index + 1}",
                    extension=".png",
                )
                saved_path = str(saved.relative_to(ROOT))
            except Exception as exc:
                return self._structured_error(
                    "ARK_IMAGE_DECODE_FAILED",
                    str(exc),
                    retryable=False,
                    provider=self.PROVIDER_NAME,
                    model=payload["model"],
                    image_url="",
                    image_urls=image_urls,
                    binary_data_base64=binary_data_base64,
                    raw_response=result,
                    endpoint=self.ENDPOINT,
                    http_status=result.get("status_code"),
                    latency_ms=result.get("latency_ms", 0),
                    key_found=True,
                    key_source=key_name,
                    candidate_index=candidate_index + 1,
                    candidate_count=candidate_count,
                    prompt=prompt,
                )
        else:
            return self._structured_error(
                "ARK_IMAGE_DATA_MISSING",
                "Ark image response did not contain image URLs or binary image data.",
                retryable=False,
                provider=self.PROVIDER_NAME,
                model=payload["model"],
                image_url="",
                image_urls=[],
                binary_data_base64=[],
                raw_response=result,
                endpoint=self.ENDPOINT,
                http_status=result.get("status_code"),
                latency_ms=result.get("latency_ms", 0),
                key_found=True,
                key_source=key_name,
                candidate_index=candidate_index + 1,
                candidate_count=candidate_count,
                prompt=prompt,
            )

        return {
            "provider": self.PROVIDER_NAME,
            "status": "success",
            "model": payload["model"],
            "prompt": prompt,
            "timestamp": self._now_iso(),
            "endpoint": self.ENDPOINT,
            "image_url": image_urls[0] if image_urls else "",
            "image_urls": image_urls,
            "binary_data_base64": binary_data_base64,
            "image_path": saved_path,
            "raw_response": response_body,
            "http_status": result.get("status_code"),
            "latency_ms": result.get("latency_ms", 0),
            "response_format": payload.get("response_format", "url"),
            "size": payload.get("size", self.DEFAULT_SIZE),
            "created": created,
            "usage": usage,
            "key_found": True,
            "key_source": key_name,
            "candidate_index": candidate_index + 1,
            "candidate_count": candidate_count,
            "seed": payload.get("seed"),
        }

    def health_check(self):
        key_name, api_key = self._resolve_api_key()
        if not api_key:
            return {
                "provider": self.PROVIDER_NAME,
                "status": "unavailable",
                "key_found": False,
                "key_source": None,
                "endpoint": self.ENDPOINT,
                "model": self.MODEL,
                "error": {
                    "error_code": "ARK_API_KEY_MISSING",
                    "error_message": "No ARK_API_KEY found in environment or .env.local.",
                    "retryable": False,
                },
            }

        return {
            "provider": self.PROVIDER_NAME,
            "status": "available",
            "key_found": True,
            "key_source": key_name,
            "endpoint": self.ENDPOINT,
            "model": self.MODEL,
        }

    def capabilities(self):
        return {
            "supports_aspect_ratio": True,
            "supports_style_control": True,
            "supports_seed": True,
            "supports_prompt_enhancement": True,
        }

    def generate(self, prompt, config):
        key_name, api_key = self._resolve_api_key()
        if not api_key:
            return self._structured_error(
                "ARK_API_KEY_MISSING",
                "No ARK_API_KEY found in environment or .env.local.",
                retryable=False,
                provider=self.PROVIDER_NAME,
                model=self.MODEL,
                image_url="",
                image_urls=[],
                binary_data_base64=[],
                raw_response={},
                endpoint=self.ENDPOINT,
                http_status=None,
                latency_ms=0,
                key_found=False,
                key_source=None,
            )

        candidate_count = self._candidate_count(config or {})
        if candidate_count <= 1:
            return self._generate_one(prompt, config or {}, api_key, key_name, candidate_index=0, candidate_count=1)

        candidates = []
        errors = []
        image_urls = []
        image_paths = []
        raw_responses = []
        for index in range(candidate_count):
            result = self._generate_one(prompt, config or {}, api_key, key_name, candidate_index=index, candidate_count=candidate_count)
            if result.get("status") == "success":
                candidates.append(result)
                image_url = result.get("image_url")
                if isinstance(image_url, str) and image_url:
                    image_urls.append(image_url)
                image_path = result.get("image_path")
                if isinstance(image_path, str) and image_path:
                    image_paths.append(image_path)
                raw_responses.append(result.get("raw_response", {}))
            else:
                errors.append(result)
                candidates.append(result)
                raw_responses.append(result.get("raw_response", {}))

        success_count = sum(1 for item in candidates if item.get("status") == "success")
        if success_count != candidate_count:
            return {
                "provider": self.PROVIDER_NAME,
                "status": "failed",
                "model": (config or {}).get("model", self.MODEL) if isinstance(config, dict) else self.MODEL,
                "prompt": prompt,
                "timestamp": self._now_iso(),
                "endpoint": self.ENDPOINT,
                "candidate_count": candidate_count,
                "generated_count": success_count,
                "candidates": candidates,
                "image_urls": image_urls,
                "image_paths": image_paths,
                "raw_responses": raw_responses,
                "errors": errors,
                "key_found": True,
                "key_source": key_name,
                "error": {
                    "error_code": "ARK_BATCH_GENERATION_INCOMPLETE",
                    "error_message": f"Requested {candidate_count} candidates but only {success_count} succeeded.",
                    "retryable": False,
                },
            }

        return {
            "provider": self.PROVIDER_NAME,
            "status": "success",
            "model": (config or {}).get("model", self.MODEL) if isinstance(config, dict) else self.MODEL,
            "prompt": prompt,
            "timestamp": self._now_iso(),
            "endpoint": self.ENDPOINT,
            "candidate_count": candidate_count,
            "generated_count": success_count,
            "candidates": candidates,
            "image_urls": image_urls,
            "image_paths": image_paths,
            "raw_responses": raw_responses,
            "key_found": True,
            "key_source": key_name,
        }

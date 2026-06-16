from __future__ import annotations

import base64
import hashlib
import hmac
import json
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib import error, parse, request

from .base import BaseProvider
from ..credentials import bootstrap_environment, get_credentials


ROOT = Path(__file__).resolve().parents[3]
CANDIDATES_DIR = ROOT / "assets" / "visual-autopilot" / "candidates"


class SeedreamProvider(BaseProvider):
    PROVIDER_NAME = "Seedream"
    ENDPOINT = "https://visual.volcengineapi.com"
    METHOD = "POST"
    REGION = "cn-north-1"
    SERVICE = "cv"
    ACTION = "CVProcess"
    VERSION = "2022-08-31"
    REQ_KEY = "high_aes_general_v30l_zt2i"

    def __init__(self):
        bootstrap_environment(force=True)

    def _now_iso(self):
        return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    def _http_date(self):
        return datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")

    def _canonical_query(self):
        query_items = [("Action", self.ACTION), ("Version", self.VERSION)]
        return parse.urlencode(sorted(query_items), doseq=True)

    def _canonical_request(self, payload, x_date):
        body = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
        parsed = parse.urlparse(self.ENDPOINT)
        content_sha256 = hashlib.sha256(body).hexdigest()
        canonical_headers = (
            f"content-type:application/json\n"
            f"host:{parsed.netloc}\n"
            f"x-content-sha256:{content_sha256}\n"
            f"x-date:{x_date}\n"
        )
        signed_headers = "content-type;host;x-content-sha256;x-date"
        canonical_request = "\n".join(
            [
                self.METHOD,
                parsed.path or "/",
                self._canonical_query(),
                canonical_headers,
                signed_headers,
                content_sha256,
            ]
        )
        return canonical_request, signed_headers, content_sha256

    def _sign_v4(self, access_key, secret_key, x_date, canonical_request_hash, signed_headers):
        date_stamp = x_date[:8]

        def hmac_sha256(key, msg):
            return hmac.new(key, msg.encode("utf-8"), hashlib.sha256).digest()

        k_date = hmac_sha256(("VOLCENGINE" + secret_key).encode("utf-8"), date_stamp)
        k_region = hmac.new(k_date, self.REGION.encode("utf-8"), hashlib.sha256).digest()
        k_service = hmac.new(k_region, self.SERVICE.encode("utf-8"), hashlib.sha256).digest()
        k_signing = hmac.new(k_service, b"request", hashlib.sha256).digest()
        string_to_sign = "\n".join(
            [
                "HMAC-SHA256",
                x_date,
                f"{date_stamp}/{self.SERVICE}/request",
                canonical_request_hash,
            ]
        )
        signature = hmac.new(k_signing, string_to_sign.encode("utf-8"), hashlib.sha256).hexdigest()
        authorization = (
            "HMAC-SHA256 "
            f"Credential={access_key}/{date_stamp}/{self.SERVICE}/request, "
            f"SignedHeaders={signed_headers}, "
            f"Signature={signature}"
        )
        return authorization, x_date

    def build_signature(self, payload=None):
        creds = get_credentials()
        access_key = creds.get("access_key")
        secret_key = creds.get("secret_key")
        if not creds.get("access_key_found") or not creds.get("secret_key_found"):
            return {
                "signature_status": "failed",
                "authorization": "",
                "x_date": "",
                "error": {
                    "error_code": "CREDENTIAL_NOT_LOADED",
                    "source": "env.local",
                },
            }

        body_payload = payload or {
            "req_key": self.REQ_KEY,
            "prompt": "signature health check",
        }
        x_date = self._http_date()
        canonical_request, signed_headers, content_sha256 = self._canonical_request(body_payload, x_date)
        canonical_request_hash = hashlib.sha256(canonical_request.encode("utf-8")).hexdigest()
        authorization, x_date = self._sign_v4(
            access_key,
            secret_key,
            x_date,
            canonical_request_hash,
            signed_headers,
        )
        return {
            "signature_status": "ready",
            "authorization": authorization,
            "x_date": x_date,
            "x_content_sha256": content_sha256,
            "canonical_request": canonical_request,
            "string_to_sign": "\n".join(
                [
                    "HMAC-SHA256",
                    x_date,
                    f"{x_date[:8]}/{self.SERVICE}/request",
                    canonical_request_hash,
                ]
            ),
            "credential_scope": f"{x_date[:8]}/{self.SERVICE}/request",
        }

    def health_check(self):
        creds = get_credentials()
        signature = self.build_signature()
        if signature.get("signature_status") != "ready":
            return {
                "provider": self.PROVIDER_NAME,
                "status": "unavailable",
                "signature_status": "failed",
                "access_key_found": bool(creds.get("access_key_found")),
                "secret_key_found": bool(creds.get("secret_key_found")),
                "error": signature.get("error", {}),
            }
        return {
            "provider": self.PROVIDER_NAME,
            "status": "available",
            "signature_status": "ready",
            "access_key_found": bool(creds.get("access_key_found")),
            "secret_key_found": bool(creds.get("secret_key_found")),
            "authorization": signature["authorization"],
            "x_date": signature["x_date"],
            "x_content_sha256": signature["x_content_sha256"],
        }

    def capabilities(self):
        return {
            "supports_aspect_ratio": False,
            "supports_style_control": False,
            "supports_seed": False,
            "supports_prompt_enhancement": False,
        }

    def _resolve_timeout(self, config):
        if isinstance(config, dict):
            value = config.get("timeout")
            if isinstance(value, (int, float)) and value > 0:
                return int(value)
        return 120

    def _build_payload(self, prompt, config):
        payload = {
            "req_key": self.REQ_KEY,
            "prompt": prompt,
            "seed": -1,
            "scale": 2.5,
            "width": 1024,
            "height": 1024,
            "return_url": True,
        }
        if isinstance(config, dict):
            for key in ("seed", "scale", "width", "height", "return_url"):
                if key in config and config[key] is not None:
                    payload[key] = config[key]
        return payload

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

    def _request_json(self, endpoint, authorization, x_date, payload, timeout=120):
        parsed = parse.urlparse(endpoint)
        url = f"{endpoint}?{self._canonical_query()}"
        body = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
        req = request.Request(url, data=body, method="POST")
        req.add_header("Content-Type", "application/json")
        req.add_header("X-Content-Sha256", hashlib.sha256(body).hexdigest())
        req.add_header("X-Date", x_date)
        req.add_header("Authorization", authorization)
        req.add_header("Host", parsed.netloc)

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

    def _extract_artifacts(self, response_body):
        image_urls = []
        binary_data_base64 = []
        if not isinstance(response_body, dict):
            return image_urls, binary_data_base64

        data = response_body.get("data")
        candidates = []
        if isinstance(data, dict):
            candidates.append(data)
        elif isinstance(data, list):
            candidates.extend([item for item in data if isinstance(item, dict)])
        else:
            candidates.append(response_body)

        for item in candidates:
            urls = item.get("image_urls")
            if isinstance(urls, list):
                for url in urls:
                    if isinstance(url, str) and url and url not in image_urls:
                        image_urls.append(url)
            binary = item.get("binary_data_base64")
            if isinstance(binary, str) and binary and binary not in binary_data_base64:
                binary_data_base64.append(binary)

        return image_urls, binary_data_base64

    def _download_bytes(self, url, timeout=120):
        with request.urlopen(url, timeout=timeout) as resp:
            return resp.read()

    def _write_candidate_png(self, payload_bytes, stem):
        CANDIDATES_DIR.mkdir(parents=True, exist_ok=True)
        png_path = CANDIDATES_DIR / f"{stem}.png"
        png_path.write_bytes(payload_bytes)
        return png_path

    def generate(self, prompt, config):
        creds = get_credentials()
        if not creds.get("access_key_found") or not creds.get("secret_key_found"):
            return self._structured_error(
                "CREDENTIAL_NOT_LOADED",
                "Required credentials were not loaded from env.local.",
                retryable=False,
                provider=self.PROVIDER_NAME,
                image_urls=[],
                binary_data_base64=[],
                raw_response={},
                signature_status="failed",
                source="env.local",
            )

        endpoint = self.ENDPOINT
        timeout = self._resolve_timeout(config)
        payload = self._build_payload(prompt, config or {})
        signature = self.build_signature(payload=payload)
        if signature.get("signature_status") != "ready":
            return self._structured_error(
                "CREDENTIAL_NOT_LOADED",
                "Required credentials were not loaded from env.local.",
                retryable=False,
                provider=self.PROVIDER_NAME,
                image_urls=[],
                binary_data_base64=[],
                raw_response={},
                signature_status="failed",
                source="env.local",
            )

        result = self._request_json(
            endpoint,
            signature["authorization"],
            signature["x_date"],
            payload,
            timeout=timeout,
        )
        if not result.get("ok"):
            return self._structured_error(
                "SEEDREAM_REQUEST_FAILED",
                result.get("raw_body") or result.get("error") or "Seedream request failed.",
                retryable=False,
                provider=self.PROVIDER_NAME,
                image_urls=[],
                binary_data_base64=[],
                raw_response=result,
                endpoint=endpoint,
                http_status=result.get("status_code"),
                latency_ms=result.get("latency_ms", 0),
                signature_status="ready",
                source="env.local",
            )

        image_urls, binary_data_base64 = self._extract_artifacts(result.get("body", {}))
        saved_path = None
        if binary_data_base64:
            try:
                decoded = base64.b64decode(binary_data_base64[0])
                saved_path = self._write_candidate_png(decoded, f"seedream_{int(time.time())}")
            except Exception as exc:
                return self._structured_error(
                    "SEEDREAM_BINARY_DECODE_FAILED",
                    str(exc),
                    retryable=False,
                    provider=self.PROVIDER_NAME,
                    image_urls=image_urls,
                    binary_data_base64=binary_data_base64,
                    raw_response=result,
                    endpoint=endpoint,
                    http_status=result.get("status_code"),
                    latency_ms=result.get("latency_ms", 0),
                    signature_status="ready",
                    source="env.local",
                )
        elif image_urls:
            try:
                image_bytes = self._download_bytes(image_urls[0], timeout=timeout)
                saved_path = self._write_candidate_png(image_bytes, f"seedream_{int(time.time())}")
            except Exception as exc:
                return self._structured_error(
                    "SEEDREAM_IMAGE_DOWNLOAD_FAILED",
                    str(exc),
                    retryable=False,
                    provider=self.PROVIDER_NAME,
                    image_urls=image_urls,
                    binary_data_base64=binary_data_base64,
                    raw_response=result,
                    endpoint=endpoint,
                    http_status=result.get("status_code"),
                    latency_ms=result.get("latency_ms", 0),
                    signature_status="ready",
                    source="env.local",
                )
        else:
            return self._structured_error(
                "SEEDREAM_IMAGE_DATA_MISSING",
                "Seedream response did not include image_urls or binary_data_base64.",
                retryable=False,
                provider=self.PROVIDER_NAME,
                image_urls=[],
                binary_data_base64=[],
                raw_response=result,
                endpoint=endpoint,
                http_status=result.get("status_code"),
                latency_ms=result.get("latency_ms", 0),
                signature_status="ready",
                source="env.local",
            )

        return {
            "provider": self.PROVIDER_NAME,
            "status": "success",
            "image_urls": image_urls,
            "binary_data_base64": binary_data_base64,
            "image_path": str(saved_path.relative_to(ROOT)) if saved_path else "",
            "raw_response": result.get("body", {}),
            "endpoint": endpoint,
            "model": self.REQ_KEY,
            "prompt": prompt,
            "http_status": result.get("status_code"),
            "latency_ms": result.get("latency_ms", 0),
            "signature_status": "ready",
            "x_date": signature["x_date"],
            "authorization": signature["authorization"],
            "source": "env.local",
            "timestamp": self._now_iso(),
        }

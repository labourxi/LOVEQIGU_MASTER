from __future__ import annotations

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]
ENV_PATH = BASE_DIR / ".env.local"
_BOOTSTRAPPED = False


def _fallback_load_dotenv_local(path: Path, override: bool = True) -> None:
    if not path.exists():
        return

    for line in path.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or "=" not in stripped:
            continue
        key, value = stripped.split("=", 1)
        key = key.strip()
        value = value.strip().strip("'").strip('"')
        if not key:
            continue
        if override or key not in os.environ:
            os.environ[key] = value


def bootstrap_environment(force: bool = True) -> None:
    global _BOOTSTRAPPED
    if _BOOTSTRAPPED and not force:
        return

    print("ENV_PATH:", ENV_PATH)
    print("ENV_EXISTS:", ENV_PATH.exists())

    try:
        from dotenv import load_dotenv  # type: ignore
    except Exception:
        load_dotenv = None

    if ENV_PATH.exists():
        if load_dotenv is not None:
            load_dotenv(dotenv_path=ENV_PATH, override=True)
        else:
            _fallback_load_dotenv_local(ENV_PATH, override=True)

    _BOOTSTRAPPED = True


def _read_preferred_env_value(env_names: tuple[str, ...]) -> tuple[str | None, str | None]:
    for env_name in env_names:
        value = os.environ.get(env_name)
        if value and value.strip():
            return env_name, value.strip()
    return None, None


def get_credentials() -> dict[str, object]:
    bootstrap_environment(force=True)
    access_key_name, access_key = _read_preferred_env_value(("VOLCENGINE_ACCESS_KEY",))
    secret_key_name, secret_key = _read_preferred_env_value(("VOLCENGINE_SECRET_KEY",))
    source = "env.local" if ENV_PATH.exists() else "system"
    return {
        "access_key_found": bool(access_key),
        "secret_key_found": bool(secret_key),
        "source": source,
        "access_key": access_key,
        "secret_key": secret_key,
        "access_key_source": access_key_name,
        "secret_key_source": secret_key_name,
    }


def get_gemini_credentials() -> dict[str, object]:
    system_snapshot = {
        "GEMINI_API_KEY": os.environ.get("GEMINI_API_KEY"),
        "GOOGLE_API_KEY": os.environ.get("GOOGLE_API_KEY"),
        "GOOGLE_GENAI_API_KEY": os.environ.get("GOOGLE_GENAI_API_KEY"),
    }
    bootstrap_environment(force=True)

    preferred_names = ("GEMINI_API_KEY", "GOOGLE_API_KEY", "GOOGLE_GENAI_API_KEY")
    for env_name in preferred_names:
        system_value = system_snapshot.get(env_name)
        if system_value and system_value.strip():
            return {
                "gemini_key_found": True,
                "key_source": env_name,
                "api_key": system_value.strip(),
            }
        env_value = os.environ.get(env_name)
        if env_value and env_value.strip():
            return {
                "gemini_key_found": True,
                "key_source": env_name,
                "api_key": env_value.strip(),
            }

    return {
        "gemini_key_found": False,
        "key_source": "missing",
        "api_key": None,
    }


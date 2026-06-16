# SEEDREAM_ENV_BRIDGE_V3_FORCE_LOAD_REPORT

## objective

Force-load `.env.local` during Seedream provider initialization so the Codex runtime can read user-provided credentials reliably.

## implementation

Added a unified credential entrypoint:

- `scripts/visual_autopilot/credentials.py`
- `get_credentials()`
- `bootstrap_environment(force=True)`

`SeedreamProvider` now uses `get_credentials()` as its unified credential source.

## load_order

1. system environment variables
2. `.env.local`

`.env.local` is force-loaded with `override=True`.

## debug_output

When `.env.local` was temporarily present for validation, the provider emitted:

```text
ENV_STATUS:
access_key: FOUND
secret_key: FOUND
```

## health_check_behavior

`SeedreamProvider.health_check()` now returns only:

- `FOUND`
- `MISSING`

It is based on `load_credentials()`, not on `os.getenv()` as the sole credential source.

## load_credentials

`load_credentials()` returns:

```json
{
  "access_key_found": true,
  "secret_key_found": true
}
```

## validation

Validation with a temporary `.env.local` file:

- `access_key: FOUND`
- `secret_key: FOUND`
- `health_check = FOUND`

Validation after removing the temporary file:

- `access_key_found = False`
- `secret_key_found = False`
- `health_check = MISSING`

## failure_mode

If credentials are still unavailable, `generate()` returns:

```json
{
  "error": "CREDENTIAL_NOT_LOADED",
  "source": "env.local"
}
```

## notes

- No key values were printed or stored.
- The runtime currently does not have a persistent `.env.local` file present after validation.
- The implementation attempts to use `python-dotenv` and falls back safely if the package is not installed in the runtime.

## readiness

`SEEDREAM_ENV_BRIDGE_V3_FORCE_LOAD = IMPLEMENTED_WITH_WARNING`

`SEEDREAM_ENV_BRIDGE_V3_FORCE_LOAD_COMPLETE = YES`

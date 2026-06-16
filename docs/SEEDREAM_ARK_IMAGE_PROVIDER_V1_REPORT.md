# SEEDREAM_ARK_IMAGE_PROVIDER_V1_REPORT

## Summary

Implemented a new Ark-based Seedream image provider at:

- `scripts/visual_autopilot/providers/seedream_ark.py`

The provider reads `ARK_API_KEY` from the current runtime or `.env.local`, sends a bearer-authenticated request to the Ark image generation endpoint, and downloads the first returned image URL when present.

Result of the validation run: `FAIL`

The request reached the endpoint, but the service returned:

- `HTTP status = 404`
- `error.code = InvalidEndpointOrModel.NotFound`
- message:
  - `The model or endpoint doubao-seedream-3.0-t2i does not exist or you do not have access to it.`

No image URL was returned, so no file was saved into `assets/visual-autopilot/candidates/`.

## Provider

- `provider = SeedreamArk`
- `endpoint = https://ark.cn-beijing.volces.com/api/v3/images/generations`
- `auth = Bearer ARK_API_KEY`
- `default model = doubao-seedream-3.0-t2i`

## Health Check

`SeedreamArkProvider.health_check()` returned:

- `status = available`
- `key_found = true`
- `key_source = ARK_API_KEY`

## Request Payload

```json
{
  "model": "doubao-seedream-3.0-t2i",
  "prompt": "red apple on wooden table",
  "response_format": "url"
}
```

## Full Response

```json
{
  "provider": "SeedreamArk",
  "status": "failed",
  "error": {
    "error_code": "ARK_REQUEST_FAILED",
    "error_message": "{\"error\":{\"code\":\"InvalidEndpointOrModel.NotFound\",\"message\":\"The model or endpoint doubao-seedream-3.0-t2i does not exist or you do not have access to it. Request id: 0217813591302689a0d83abff91b62c26f47d22f8f1622572dcd4\",\"param\":\"\",\"type\":\"Not Found\"}}",
    "retryable": false
  },
  "model": "doubao-seedream-3.0-t2i",
  "image_url": "",
  "image_urls": [],
  "binary_data_base64": [],
  "raw_response": {
    "ok": false,
    "status_code": 404,
    "latency_ms": 102,
    "raw_body": "{\"error\":{\"code\":\"InvalidEndpointOrModel.NotFound\",\"message\":\"The model or endpoint doubao-seedream-3.0-t2i does not exist or you do not have access to it. Request id: 0217813591302689a0d83abff91b62c26f47d22f8f1622572dcd4\",\"param\":\"\",\"type\":\"Not Found\"}}",
    "body": {
      "error": {
        "code": "InvalidEndpointOrModel.NotFound",
        "message": "The model or endpoint doubao-seedream-3.0-t2i does not exist or you do not have access to it. Request id: 0217813591302689a0d83abff91b62c26f47d22f8f1622572dcd4",
        "param": "",
        "type": "Not Found"
      }
    },
    "error": "HTTP Error 404: Not Found"
  },
  "endpoint": "https://ark.cn-beijing.volces.com/api/v3/images/generations",
  "http_status": 404,
  "latency_ms": 102,
  "key_found": true,
  "key_source": "ARK_API_KEY"
}
```

## Storage Result

- `image_saved = NO`
- `candidate_directory = assets/visual-autopilot/candidates/`

## Interpretation

The Ark API key is visible in the current runtime, but the requested Seedream model name is not accepted by the endpoint or is not available to the current account.

The provider implementation itself is usable, but the specific model binding still needs confirmation from the Ark-side model catalog or access control settings.

## Next Required Action

Confirm the exact Ark Seedream model identifier available to this account, then rerun `SeedreamArkProvider.generate()` with that model value.

## Additional Model Probes

A narrow set of alternate model identifiers was also tested against the same endpoint and bearer credential. Every probe returned the same `InvalidEndpointOrModel.NotFound` failure pattern:

- `doubao-seedream-4.0-t2i`
- `doubao-seedream-4-0-t2i`
- `doubao-seedream-4.0`
- `doubao-seedream-4-0`
- `seedream-4.0`
- `seedream-3.0`
- `doubao-seedream-3-0-t2i`

This means the current blocker is not a formatting issue in the model string alone. The account either lacks access to the Seedream image model family or the exact Ark model identifier is different from the public guesses used in this validation.

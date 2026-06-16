# SEEDREAM_REAL_GENERATION_V1_REPORT

## implementation_status

`REAL_PROVIDER_ADAPTER_IMPLEMENTED`

`scripts/visual_autopilot/providers/seedream.py` is now a real HTTP-based provider adapter rather than a stub.

## api_key_read

`SEEDREAM_API_KEY`

## supported_generation_fields

- `prompt`
- `size`
- `aspect_ratio`
- `negative_prompt`

## success_response_shape

```json
{
  "provider": "Seedream",
  "status": "success",
  "image_url": "...",
  "raw_response": {}
}
```

## failure_response_shape

Structured errors only.

The provider returns explicit error payloads for:

- missing API key
- missing endpoint/model configuration
- request failure
- missing image URL in response

## runtime_validation_result

Current runtime check result:

- `SEEDREAM_API_KEY = MISSING`

Because the key is not visible in the current Codex Agent Runtime, a live ModelArk Seedream image-generation call could not be executed in this workspace.

## configuration_note

The implementation is configuration-driven for the ModelArk image endpoint and model name.
Endpoint/model are resolved from provider config or environment variables so the real service can be bound without hardcoding secrets.

## next_required_action

Provide `SEEDREAM_API_KEY` to the runtime environment and bind the confirmed ModelArk Seedream image-generation endpoint and model name, then rerun `generate()` with `prompt`, `size`, `aspect_ratio`, and `negative_prompt`.

## conclusion

The provider has been upgraded from stub to real adapter code, but end-to-end image generation remains blocked in this runtime until the missing environment binding is available.

`SEEDREAM_REAL_GENERATION_V1_COMPLETE = YES`

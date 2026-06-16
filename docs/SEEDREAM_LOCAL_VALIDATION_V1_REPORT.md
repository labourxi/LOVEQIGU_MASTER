# SEEDREAM_LOCAL_VALIDATION_V1_REPORT

## key_found

`MISSING`

## key_source

`NONE`

## prompt

`red apple on white background`

## endpoint

`NOT_AVAILABLE`

No Seedream endpoint is configured in the current runtime.

## model

`NOT_AVAILABLE`

No Seedream model is configured in the current runtime.

## latency

`0 ms`

The provider returned immediately because required runtime inputs were missing.

## response_status

`failed`

## png_generated

`NO`

## candidates_dir_result

`assets/visual-autopilot/candidates/` contains no new PNG output from this validation run.

## validation_result

`SeedreamProvider.generate()` returned a structured failure:

- `error_code = SEEDREAM_API_KEY_MISSING`
- `error_message = SEEDREAM_API_KEY is missing.`

## conclusion

The local PowerShell-equivalent runtime available to Codex does not currently expose `SEEDREAM_API_KEY`, and no Seedream endpoint/model configuration is present. As a result, real PNG generation could not be validated in this environment.

`SEEDREAM_LOCAL_VALIDATION_V1_COMPLETE = YES`

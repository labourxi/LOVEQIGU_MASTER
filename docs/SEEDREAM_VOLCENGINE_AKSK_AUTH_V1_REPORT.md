# SEEDREAM_VOLCENGINE_AKSK_AUTH_V1_REPORT

## objective

SeedreamProvider has been migrated from `SEEDREAM_API_KEY` mode to Volcengine AK/SK signing mode.

## configured_endpoint

`https://visual.volcengineapi.com`

## configured_action

`CVProcess`

## configured_version

`2022-08-31`

## configured_region

`cn-north-1`

## configured_service

`cv`

## configured_req_key

`high_aes_general_v30l_zt2i`

## auth_type

`Volcengine HMAC-SHA256`

## required_env_vars

- `VOLCENGINE_ACCESS_KEY`
- `VOLCENGINE_SECRET_KEY`

## deprecated_compatibility

`SEEDREAM_API_KEY` is still read only as a deprecated compatibility path.

It is no longer the primary auth source.

## health_check_result

Current runtime check:

- `access_key_found = False`
- `secret_key_found = False`
- `signature_status = not_attempted`

The provider cannot perform a live signature validation in the current Agent Runtime because the required AK/SK variables are not visible there.

## response_fields

Expected response image fields:

- `data.image_urls`
- `data.binary_data_base64`

## implementation_status

- HMAC-SHA256 signing implemented
- Authorization header generation implemented
- `X-Date` support implemented
- structured errors preserved
- deprecated `SEEDREAM_API_KEY` compatibility preserved

## next_required_action

Expose `VOLCENGINE_ACCESS_KEY` and `VOLCENGINE_SECRET_KEY` to the runtime environment, then rerun `SeedreamProvider.health_check()` and `generate()` against the confirmed Seedream image endpoint.

## conclusion

The provider has been migrated to the requested Volcengine AK/SK auth path, but the current Codex runtime still lacks the required credentials for live verification.

`SEEDREAM_VOLCENGINE_AKSK_AUTH_V1_COMPLETE = YES`

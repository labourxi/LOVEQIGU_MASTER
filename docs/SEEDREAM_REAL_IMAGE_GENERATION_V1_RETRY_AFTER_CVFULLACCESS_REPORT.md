# SEEDREAM_REAL_IMAGE_GENERATION_V1_RETRY_AFTER_CVFULLACCESS_REPORT

## Summary

Retried the confirmed Seedream request after CVFullAccess was granted to the current AK/SK principal.

Result: `FAIL`

The service still rejected the Authorization header with `InvalidCredential`.

## Request

- `endpoint = https://visual.volcengineapi.com`
- `Action = CVProcess`
- `Version = 2022-08-31`
- `region = cn-north-1`
- `service = cv`
- `req_key = high_aes_general_v30l_zt2i`

## Prompt

`Ancient Eastern celestial relic, Jiao Mansion constellation seal, jade glyph artifacts, museum artifact lighting, soft golden dust particles, ancient manuscript background`

## Negative Prompt

`phoenix, bird, dragon body, creature, monster, warrior, weapon, anime, cartoon, neon, game UI`

## Response

- `HTTP status = 400`
- `Code = InvalidCredential`
- `CodeN = 100025`
- `Message = Invalid credential in 'Authorization', Pls check your authorization header.`
- `RequestId = 20260613212858563C51A40AE3315A9D90`

## Image Output

- `image_urls = []`
- `binary_data_base64 = []`
- `PNG saved = NO`

## Interpretation

CVFullAccess did not resolve the failure mode.

This indicates the current blocker is still in the authorization/signing path, not in the service permission grant.

## Execution Notes

- The request used the already confirmed interface:
  - `endpoint = https://visual.volcengineapi.com`
  - `Action = CVProcess`
  - `Version = 2022-08-31`
  - `service = cv`
- No key material was printed in this report.
- No image generation fallback path was used.

## Conclusion

The retry after CVFullAccess did not produce a valid authorization result and did not generate an image.


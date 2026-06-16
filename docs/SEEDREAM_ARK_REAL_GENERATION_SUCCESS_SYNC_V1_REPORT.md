# SEEDREAM_ARK_REAL_GENERATION_SUCCESS_SYNC_V1_REPORT

## Summary

The local successful Seedream Ark generation result has been synchronized into the Visual Autopilot provider layer.

Result: `PASS`

## Updated Provider

- `scripts/visual_autopilot/providers/seedream_ark.py`

## Default Runtime Configuration

- `endpoint = https://ark.cn-beijing.volces.com/api/v3/images/generations`
- `auth = Authorization: Bearer ARK_API_KEY`
- `model = doubao-seedream-5-0-260128`
- `size = 2048x2048`

## Validation Request

- `prompt = red apple on wooden table`
- `response_format = url`

## Validation Result

The provider returned a successful generation response with:

- `provider = SeedreamArk`
- `status = success`
- `http_status = 200`
- `image_url = present`
- `image_path = present`
- `size = 2048x2048`
- `created = present`
- `usage.generated_images = 1`

## Response Metadata

The returned payload included:

- `data[0].url`
- `data[0].size = 2048x2048`
- `usage.generated_images = 1`

## Saved Asset

- `assets/visual-autopilot/candidates/seedream_ark_1781361910.jpg`

The endpoint returned a JPEG URL, so the saved local candidate is a `.jpg` file rather than `.png`.

## Provider Output Contract

The synchronized provider now returns:

- `provider`
- `model`
- `prompt`
- `image_url`
- `image_path`
- `size`
- `created`
- `usage`

## Conclusion

The Ark Seedream provider is now wired to the confirmed working model and response shape, and it successfully generates and stores a local candidate asset.

`SEEDREAM_ARK_REAL_GENERATION_SUCCESS_SYNC_V1_COMPLETE = YES`


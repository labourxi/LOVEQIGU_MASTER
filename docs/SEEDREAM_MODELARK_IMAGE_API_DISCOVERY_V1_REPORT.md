# SEEDREAM_MODELARK_IMAGE_API_DISCOVERY_V1_REPORT

## provider

`ModelArk`

## service

`Seedream Image Generation`

## endpoint

`UNCONFIRMED_PUBLIC_MODELARK_IMAGE_API`

The public Seedream launch page is visible at:

- `https://www.volcengine.com/experience/ark?launch=seedream`

That page confirms Seedream is surfaced through Volcengine Ark, but the accessible public sources in this workspace do not expose a stable Seedream-specific API endpoint.

## model_name

`Seedream 4.0`

Seedream 4.0 is publicly described as a multimodal image generation system, not a video model.

## auth_type

`ModelArk API key / bearer token (inferred)`

This is a platform-level inference based on ModelArk conventions. No Seedream-specific public auth snippet was available in the accessible sources used for this discovery.

## request_payload_schema

`UNCONFIRMED_PUBLIC_SCHEMA`

The accessible sources do not expose a Seedream-specific public request schema.

For this discovery record, the only safe conclusion is:

- image-generation request schema is required
- video-generation payloads are not acceptable for this service

## response_image_field

`UNCONFIRMED_PUBLIC_IMAGE_FIELD`

The accessible sources do not expose a confirmed response field name for the generated image.

## decision

- `video API is not acceptable`
- `image API required`

Seedream is an image generation service and must not be wired to a video-only API.

## evidence_used

- Seedream 4.0 paper and public launch reference:
  - `https://www.volcengine.com/experience/ark?launch=seedream`
  - Seedream 4.0 is described as a multimodal image generation system

## conclusion

This discovery confirms the product should be treated as a ModelArk image-generation service, but the workspace does not contain enough public documentation to safely assert the exact endpoint, request schema, or response field name without further vendor-side confirmation.

`SEEDREAM_MODELARK_IMAGE_API_DISCOVERY_V1_COMPLETE = YES`

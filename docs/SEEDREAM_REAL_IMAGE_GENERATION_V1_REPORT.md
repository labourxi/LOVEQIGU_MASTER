# SEEDREAM_REAL_IMAGE_GENERATION_V1_REPORT

## objective

Attempt real Seedream ModelArk image generation using the verified signature path.

## request

- `prompt = 千军万马`
- `seed = -1`
- `scale = 2.5`
- `width = 1024`
- `height = 1024`
- `return_url = true`

## endpoint

`https://visual.volcengineapi.com`

## model

`high_aes_general_v30l_zt2i`

## signature_status

`ready`

## response_status

`failed`

HTTP status returned by the service:

- `400`

## latency_ms

`190`

## parsed_response

```json
{
  "ResponseMetadata": {
    "RequestId": "20260613205423C6E705092B5F0CD5A5C4",
    "Action": "CVProcess",
    "Version": "2022-08-31",
    "Error": {
      "CodeN": 100025,
      "Code": "InvalidCredential",
      "Message": "Invalid credential in 'Authorization', Pls check your authorization header."
    }
  }
}
```

## image_urls

`[]`

## binary_data_base64

`[]`

## png_generated

`NO`

## candidates_dir

`assets/visual-autopilot/candidates/`

No PNG was written by this attempt.

## failure_mode

The service rejected the Authorization header with:

- `Code = InvalidCredential`
- `Message = Invalid credential in 'Authorization', Pls check your authorization header.`

## validation_note

The provider now correctly:

- reads credentials from the bridged runtime
- constructs a signature
- injects `Authorization` and `x-date`
- sends the POST request
- parses `image_urls` and `binary_data_base64`
- returns structured errors instead of throwing

The current blocker is the remote service credential rejection, not local request construction.

## conclusion

Real image generation was attempted but not achieved in the current runtime because the ModelArk/Seedream endpoint rejected the provided Authorization header.

`SEEDREAM_REAL_IMAGE_GENERATION_V1_COMPLETE = BLOCKED`

# VISUAL_AUTOPILOT_GENERATION_BRIDGE_V2_REPORT

Status: BLOCKED

## Current API Shapes

### OpenAI

- Endpoint: `/v1/images/generations`
- Model: `gpt-image-1`
- Payload: minimal only
  - `model`
  - `prompt`

### Gemini

- Endpoint: `https://generativelanguage.googleapis.com/v1/models/gemini-3.1-flash-image:generateContent`
- Model: `gemini-3.1-flash-image`
- Payload:
  - `contents: [{ parts: [{ text: "<prompt>" }] }]`
  - `generationConfig: { responseModalities: ["Image"] }`

## Why OpenAI Returned 400

The current OpenAI call is now a real image-generation request and prints the HTTP body on failure.

Latest rerun result:

- HTTP 400 with body:
  - `billing_hard_limit_reached`

So the active 400 is not a payload-shape bug anymore. It is a billing/account limit.

## Why Gemini Returned 404

The previous Gemini path was stale:

- old model: `gemini-2.0-flash-exp`
- old endpoint: `v1beta/models/...`

The bridge now points at the current image model path:

- `gemini-3.1-flash-image`

However, this environment still does not have a usable Gemini key, so the image call cannot be completed here.

## Fix Applied

Updated files:

- `scripts/visual_autopilot/visual_generation_bridge_v1.py`
- `scripts/visual_autopilot/visual_generation_config.example.json`

Changes:

- OpenAI reset to `gpt-image-1`
- OpenAI request reduced to the minimal payload only
- HTTP errors now print the full response body
- PNG writing now handles raw bytes, base64 payloads, and image URLs
- Gemini image generation remains on the current official Gemini image API
- Gemini key lookup accepts common aliases:
  - `GEMINI_API_KEY`
  - `GOOGLE_API_KEY`
  - `GOOGLE_GENAI_API_KEY`
- Missing Gemini key no longer prevents OpenAI from being attempted

## Rerun Result

Latest run command:

- `python scripts/visual_autopilot/visual_generation_bridge_v1.py --prompt "ART-04 four symbol dragon bridge test" --task-id art04_four_symbol_dragon`

Result:

- OpenAI attempted
- Gemini skipped because key is missing
- OpenAI failed with billing hard limit
- No candidate PNG was written

Run artifacts:

- `assets/visual-autopilot/reports/art04_four_symbol_dragon_20260613_142404.json`

## Images Generated

- OpenAI: `0`
- Gemini: `0`

## Candidates Directory

`assets/visual-autopilot/candidates/` is still empty.

## Conclusion

BLOCKED

The bridge code is now aligned to the current request shape and prints HTTP bodies, but this environment still cannot complete the requested end-to-end image generation because:

1. OpenAI billing is exhausted
2. Gemini key is missing

VISUAL_AUTOPILOT_GENERATION_BRIDGE_V2_COMPLETE = YES

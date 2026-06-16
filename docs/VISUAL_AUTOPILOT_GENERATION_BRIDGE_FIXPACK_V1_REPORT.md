# VISUAL_AUTOPILOT_GENERATION_BRIDGE_FIXPACK_V1_REPORT

Status: BLOCKED

## 1. Current OpenAI Request

- Endpoint: `https://api.openai.com/v1/images/generations`
- Model: `gpt-image-2`
- Payload: `{ "model": "gpt-image-2", "prompt": "<prompt>" }`

## 2. Current Gemini Request

- Endpoint: `https://generativelanguage.googleapis.com/v1/models/gemini-3.1-flash-image:generateContent`
- Model: `gemini-3.1-flash-image`
- Payload:
  - `contents: [{ parts: [{ text: "<prompt>" }] }]`
  - `generationConfig: { responseModalities: ["Image"] }`

## 3. Why OpenAI Returned 400

The previous bridge run used stale OpenAI settings:

- model: `gpt-image-1`
- payload included the older request shape

The bridge has now been updated to the current official image-generation shape. A direct OpenAI verification call using `gpt-image-2` and the minimal payload reached the API, but the account is currently blocked by billing, not by request validation.

## 4. Why Gemini Returned 404

The previous bridge run used a stale Gemini endpoint/model:

- `v1beta/models/gemini-2.0-flash-exp:generateContent`

The current official image-generation model is `gemini-3.1-flash-image`, so the old model path was invalid and returned 404.

## 5. Fix Applied

Updated:

- `scripts/visual_autopilot/visual_generation_bridge_v1.py`
- `scripts/visual_autopilot/visual_generation_config.example.json`

Changes:

- OpenAI moved to `gpt-image-2`
- OpenAI payload reduced to the current minimal request shape
- Gemini moved to `gemini-3.1-flash-image`
- Gemini response parsing now accepts both `inlineData` and `inline_data`
- Gemini API key lookup now tolerates common Google aliases:
  - `GEMINI_API_KEY`
  - `GOOGLE_API_KEY`
  - `GOOGLE_GENAI_API_KEY`

## 6. Rerun Result

Validation run:

- `python scripts/visual_autopilot/visual_generation_bridge_v1.py --prompt "ART-04 four symbol dragon bridge test" --task-id art04_four_symbol_dragon --validate-only`
- Exit: `2`

Direct OpenAI verification:

- The updated OpenAI request shape reached the API
- The account returned `billing_hard_limit_reached`

Current blockers:

- `GEMINI_API_KEY` is missing
- OpenAI billing is exhausted on the current account

## 7. Images Generated

- OpenAI: `0`
- Gemini: `0`

## 8. Candidates Directory

`assets/visual-autopilot/candidates/` remains empty because neither provider completed a successful image write in this environment.

## 9. Conclusion

BLOCKED

The bridge code is now aligned to the current official request shapes, but the requested end-to-end rerun cannot complete in this environment until:

1. a valid Gemini API key is provided, and
2. the OpenAI account billing limit is cleared.

VISUAL_AUTOPILOT_GENERATION_BRIDGE_FIXPACK_V1_COMPLETE = YES

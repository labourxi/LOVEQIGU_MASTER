# VISUAL_AUTOPILOT_PROVIDER_ABSTRACTION_V1

## 1. Objective

Define a unified provider abstraction layer for all visual generation models in VISUAL_AUTOPILOT_V3.

This layer ensures:
- All models are interchangeable
- All outputs follow a unified schema
- Router and evaluator can operate without model-specific logic

---

## 2. Core Interface (Required)

All providers MUST implement:

### generate(prompt, config)

Returns:

{
  "image_path": "",
  "provider": "",
  "model": "",
  "prompt": "",
  "timestamp": "",
  "status": "success | failed",
  "error": ""
}

---

### health_check()

Returns:

{
  "provider": "",
  "status": "available | unavailable",
  "latency_ms": 0
}

---

### capabilities()

Returns:

{
  "supports_aspect_ratio": true,
  "supports_style_control": true,
  "supports_seed": true,
  "supports_prompt_enhancement": true
}

---

## 3. Provider Registry

Registered providers:

- OpenAIProvider
- GeminiProvider
- WanxiangProvider
- WenxinYigeProvider
- SeedreamProvider

Each provider MUST:

- Implement BaseProvider
- Follow unified interface
- Never expose raw API logic to router

---

## 4. Base Provider Class

All providers inherit:

BaseProvider

Required methods:

- generate()
- health_check()
- capabilities()

---

## 5. Error Handling Standard

All providers MUST return structured errors:

{
  "error_code": "",
  "error_message": "",
  "retryable": true | false
}

No silent failures allowed.

---

## 6. Router Integration Rule

Router MUST NOT:

- Call APIs directly
- Contain provider-specific logic

Router ONLY:

- Select provider
- Pass prompt + config
- Receive unified output

---

## 7. Output Contract

All providers MUST output:

- deterministic metadata
- image_path OR failure reason
- standardized schema

---

## 8. Future Extension

This abstraction layer enables:

- Multi-model competition
- Auto ranking
- Dynamic routing
- A/B visual testing

---

Success Marker:

VISUAL_AUTOPILOT_PROVIDER_ABSTRACTION_V1_COMPLETE = YES

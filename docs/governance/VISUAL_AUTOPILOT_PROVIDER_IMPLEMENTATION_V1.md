# VISUAL_AUTOPILOT_PROVIDER_IMPLEMENTATION_V1

## Objective

Implement real provider adapters for VISUAL_AUTOPILOT_V3.

This layer converts abstract provider interfaces into real API calls.

---

## Base Dependency

All providers MUST inherit:

BaseProvider (from providers/base.py)

Required methods:

- generate(prompt, config)
- health_check()
- capabilities()

---

## 1. OpenAIProvider

File:

scripts/visual_autopilot/providers/openai.py

API:

POST /v1/images/generations

Model:

gpt-image-1

Input:

{
  "model": "gpt-image-1",
  "prompt": "...",
  "size": "1024x1024"
}

Output:

- image_path (saved locally)
- metadata

Error handling:

- HTTP errors must be returned (no silent fail)

---

## 2. GeminiProvider

File:

scripts/visual_autopilot/providers/gemini.py

API:

Vertex AI / Google Generative Language API

Model:

gemini-3.1-flash-image OR Imagen 3 (preferred if available)

Input:

{
  "contents": [
    {
      "parts": [{"text": "prompt"}]
    }
  ],
  "generationConfig": {
    "responseModalities": ["Image"]
  }
}

Output:

- image_path
- metadata

Fallback:

If image generation fails:

return structured error (no fallback to text)

---

## 3. WanxiangProvider (Alibaba)

File:

scripts/visual_autopilot/providers/wanxiang.py

Use:

Tongyi Wanxiang Image API

Role:

Commercial / advertisement / poster generation

Output:

- image_path
- metadata

---

## 4. WenxinYigeProvider (Baidu)

File:

scripts/visual_autopilot/providers/wenxin_yige.py

Role:

- Artistic generation
- Chinese aesthetic style

Output:

- image_path
- metadata

---

## 5. SeedreamProvider (ByteDance)

File:

scripts/visual_autopilot/providers/seedream.py

Role:

- High-quality production assets
- Stable composition
- Product-grade visuals

Output:

- image_path
- metadata

---

## 6. Shared Provider Rules

All providers MUST:

- return unified schema
- never bypass BaseProvider
- never directly interact with router
- never modify evaluation logic

---

## 7. Output Schema (ALL PROVIDERS)

{
  "provider": "",
  "model": "",
  "image_path": "",
  "prompt": "",
  "timestamp": "",
  "status": "success | failed",
  "error": ""
}

---

## 8. Error Handling Standard

All errors must be:

- returned explicitly
- logged
- never swallowed

---

## 9. Integration Requirement

Providers are ONLY called by:

VisualRouter  Pipeline Executor

Direct calls are forbidden.

---

## 10. Future Evolution

V1  Basic API wrappers  
V2  Retry + fallback system  
V3  Adaptive provider selection  
V4  Self-healing provider layer  
V5  Autonomous multi-model visual factory  

---

Success Marker:

VISUAL_AUTOPILOT_PROVIDER_IMPLEMENTATION_V1_COMPLETE = YES

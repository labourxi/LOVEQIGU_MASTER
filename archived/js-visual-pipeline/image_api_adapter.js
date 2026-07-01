/**
 * VISUAL PRODUCTION PIPELINE V1 — IMAGE API ADAPTER
 *
 * FROZEN PIPELINE STEP 2 EXECUTOR:
 *   Abstraction layer over external image generation APIs.
 *
 * Supported providers:
 *   - Gemini (google)
 *   - DALL·E 3 (openai)
 *   - 豆包 / 即梦 (bytedance) — placeholder
 *
 * Pipeline Rule RULE-002:
 *   No API call before prompt approval (automatic from prompt_builder).
 *
 * Each provider must implement:
 *   generate(promptObject) → { status, imageData, imagePath, provider }
 */

var PROVIDERS = {
  gemini: {
    name: 'gemini',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
    requiresApiKey: true,
    supportedFormats: ['PNG', 'JPEG'],
    maxSize: 2048
  },
  dalle3: {
    name: 'dalle3',
    endpoint: 'https://api.openai.com/v1/images/generations',
    requiresApiKey: true,
    supportedFormats: ['PNG'],
    maxSize: 1024
  },
  seedream: {
    name: 'seedream',
    endpoint: 'internal://seedream',
    requiresApiKey: true,
    supportedFormats: ['PNG', 'JPEG'],
    maxSize: 2048
  }
};

function validatePrompt(prompt) {
  if (!prompt || !prompt.promptText || !prompt.targetPath) {
    return { valid: false, reason: 'Missing prompt text or target path' };
  }
  if (!prompt.width || !prompt.height) {
    return { valid: false, reason: 'Missing dimensions' };
  }
  if (prompt.width > 2048 || prompt.height > 2048) {
    return { valid: false, reason: 'Dimensions exceed max 2048px' };
  }
  return { valid: true };
}

function selectProvider(prompt) {
  if (!prompt) return PROVIDERS.gemini;

  var category = prompt.category || 'scene';
  switch (category) {
    case 'scene':
      return PROVIDERS.gemini;
    case 'ui_overlay':
      return PROVIDERS.dalle3;
    case 'icon':
      return PROVIDERS.dalle3;
    default:
      return PROVIDERS.gemini;
  }
}

function generate(prompt) {
  var validation = validatePrompt(prompt);
  if (!validation.valid) {
    console.error('[IMAGE_API] Invalid prompt:', validation.reason);
    return { status: 'FAILED', error: validation.reason };
  }

  var provider = selectProvider(prompt);
  console.log('[IMAGE_API] Selected provider:', provider.name, 'for:', prompt.assetKey);

  // ─── API KEY CHECK ───
  if (provider.requiresApiKey) {
    var apiKey = globalThis.__VISUAL_API_KEY__ || process && process.env && (
      provider.name === 'gemini' ? process.env.GEMINI_API_KEY :
      provider.name === 'dalle3' ? process.env.OPENAI_API_KEY :
      null
    );
    if (!apiKey) {
      console.warn('[IMAGE_API] No API key for', provider.name, '— using local generation fallback');
      return {
        status: 'API_KEY_MISSING',
        provider: provider.name,
        assetKey: prompt.assetKey,
        message: 'No API key configured. Provide ' + provider.name.toUpperCase() + '_API_KEY in environment.'
      };
    }
  }

  // ─── ACTUAL API CALL WOULD HAPPEN HERE ───
  // In production, this makes HTTP requests to the provider's endpoint.
  // For now, returns the call spec for manual/scripted execution.

  return {
    status: 'SPEC_READY',
    provider: provider.name,
    assetKey: prompt.assetKey,
    targetPath: prompt.targetPath,
    endpoint: provider.endpoint,
    payload: {
      prompt: prompt.promptText,
      negative_prompt: prompt.negativePrompt,
      size: prompt.width + 'x' + prompt.height,
      format: prompt.format.toLowerCase()
    },
    message: 'API spec ready. Execute with configured API key.'
  };
}

function generateAll(prompts) {
  if (!Array.isArray(prompts)) return [];
  return prompts.map(generate);
}

module.exports = {
  generate: generate,
  generateAll: generateAll,
  selectProvider: selectProvider,
  validatePrompt: validatePrompt,
  PROVIDERS: PROVIDERS
};

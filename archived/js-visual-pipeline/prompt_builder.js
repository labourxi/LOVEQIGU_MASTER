/**
 * VISUAL PRODUCTION PIPELINE V1 — PROMPT BUILDER
 *
 * FROZEN PIPELINE STEP 2 INPUT:
 *   Builds structured prompts for AI image generation from page structure.
 *
 * INPUT:  PageSpec or STRUCTURE_SPEC
 * OUTPUT: Array of { assetKey, prompt, style_spec, size, mood, composition }
 *
 * Pipeline Rule RULE-001:
 *   No asset generation before structure approval.
 *   This module assumes STRUCTURE_APPROVED state.
 */

var PROMPT_TEMPLATES = {
  scene: {
    context: 'This is the entry scene for 爱企谷 (AIGU VALLEY) — a mystical fog-shrouded valley mobile game world.',
    style: [
      'Chinese ink-wash landscape aesthetic interpreted through atmospheric rendering',
      'NOT photorealistic — painterly, misty, contemplative',
      'Deep forest black (#0A1A14) as dominant tone',
      'Warm gold (#C8A24A) as the only accent — appears as light, not as color',
      'Low saturation (0.35-0.55), dark tone (brightness 0.5-0.65)',
      'No neon, no cyberpunk, no high-purity fluorescent colors',
      'No rainbow gradients, no game UI elements',
      'No text or branding (UI layer handles text)',
      'No human characters (distant silhouettes OK)',
      'Mist layering, warm golden light, entry gate metaphor'
    ].join('. '),
    palette: {
      primary: '#0A1A14',
      accent: '#C8A24A',
      secondary: 'rgba(200, 162, 74, 0.3-0.6)',
      mist: 'rgba(232, 224, 208, 0.1-0.3)',
      deep: ['#1A1A2E', '#16213E']
    },
    canon: '"游离之域 · 世界正在显现", "爱企谷" (AIGU VALLEY)'
  },
  ui_overlay: {
    style: [
      'Gold line art (#C8A24A)',
      'Background: COMPLETELY TRANSPARENT',
      'Stroke width 0.5-1.5px logical',
      'Minimal, elegant'
    ].join('. ')
  },
  icon: {
    style: [
      'Single continuous line art',
      'Color: rgba(200,162,74, 0.6)',
      'Background: TRANSPARENT',
      'Stroke width ~1.5px logical'
    ].join('. ')
  }
};

function buildPrompt(assetDef) {
  if (!assetDef || !assetDef.key) {
    console.error('[PROMPT_BUILDER] Invalid asset definition');
    return null;
  }

  var prompt = {
    assetKey: assetDef.key,
    targetPath: assetDef.targetPath,
    format: assetDef.format || 'PNG',
    width: assetDef.width || 750,
    height: assetDef.height || 1624,
    promptText: '',
    negativePrompt: 'phoenix, bird, dragon body, creature, monster, warrior, weapon, anime, cartoon, neon, game UI, rainbow gradient, high purity fluorescent, human face, text, logo, watermark',
    styleSpec: ''
  };

  var category = assetDef.category || 'scene';
  var template = PROMPT_TEMPLATES[category] || PROMPT_TEMPLATES.scene;

  if (category === 'scene') {
    prompt.promptText = [
      'AIGU VALLEY landscape.',
      assetDef.visualIntent || 'Mountain valley with mist and golden light.',
      'Mobile portrait orientation. ' + assetDef.width + 'x' + assetDef.height + 'px.',
      'Style: ' + template.style,
      'Color palette primary ' + template.palette.primary + ' accent ' + template.palette.accent + '.',
      'Canon reference: ' + template.canon
    ].join(' ');
  } else if (category === 'ui_overlay') {
    prompt.promptText = [
      assetDef.visualIntent || 'Decorative overlay.',
      'Style: ' + template.style,
      'Size: ' + assetDef.width + 'x' + assetDef.height + 'px.'
    ].join(' ');
  } else if (category === 'icon') {
    prompt.promptText = [
      assetDef.visualIntent || 'Icon.',
      'Style: ' + template.style,
      'Size: ' + assetDef.width + 'x' + assetDef.height + 'px.'
    ].join(' ');
  }

  return prompt;
}

function buildAllPrompts(assetDefinitions) {
  if (!Array.isArray(assetDefinitions)) return [];
  return assetDefinitions.map(buildPrompt).filter(Boolean);
}

module.exports = {
  buildPrompt: buildPrompt,
  buildAllPrompts: buildAllPrompts,
  PROMPT_TEMPLATES: PROMPT_TEMPLATES
};

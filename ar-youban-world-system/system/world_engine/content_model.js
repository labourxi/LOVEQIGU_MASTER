/**
 * CONTENT_MODEL — unified world content structure (no UI)
 */

export const CONTENT_TYPE = {
  ECHO: 'echo',
  TRACE: 'trace',
  RELIC: 'relic',
  FOLD: 'fold',
  FRAGMENT: 'fragment',
  PLACE: 'place'
};

export const CONTENT_EMOTION = {
  QUIET_DISCOVERY: 'quiet_discovery',
  WARM_MEMORY: 'warm_memory',
  BOOKISH_MIST: 'bookish_mist',
  SOFT_FLOW: 'soft_flow',
  OLD_GARDEN_LIGHT: 'old_garden_light',
  QUIET_READING: 'quiet_reading',
  AWAKENED: 'awakened',
  DRIFTING: 'drifting'
};

export const CONTENT_VISUAL = {
  RIVER_NIGHT_GOLD: 'river_night_gold',
  WUKANG_SHADOW: 'wukang_shadow',
  LIBRARY_CLOUD: 'library_cloud',
  RIVER_BRIDGE: 'river_bridge',
  GARDEN_LANTERN: 'garden_lantern',
  BOOK_WINDOW: 'book_window'
};

/**
 * @param {{ title: string, subtitle: string, type: string, emotion: string, visual: string, hint: string, id?: string }} fields
 */
export function createContentModel(fields) {
  return {
    id: fields.id || '',
    title: fields.title || '',
    subtitle: fields.subtitle || '',
    type: fields.type || CONTENT_TYPE.PLACE,
    emotion: fields.emotion || CONTENT_EMOTION.QUIET_DISCOVERY,
    visual: fields.visual || CONTENT_VISUAL.RIVER_NIGHT_GOLD,
    hint: fields.hint || ''
  };
}

export function isContentModel(item) {
  return Boolean(
    item &&
    typeof item.title === 'string' &&
    typeof item.subtitle === 'string' &&
    typeof item.type === 'string' &&
    typeof item.emotion === 'string' &&
    typeof item.visual === 'string' &&
    typeof item.hint === 'string'
  );
}

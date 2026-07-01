/**
 * ORCHESTRATOR — SPEC FACTORY
 *
 * Generates a complete, valid PageSpec from a high-level PageDefinition.
 *
 * ORCHESTRATOR §2: generateSpec(pageDefinition) → buildPageSpec
 *
 * PageDefinition is a simplified input format:
 *   {
 *     type: 'landing' | 'explore' | 'relic' | 'echo' | 'collection' | 'profile',
 *     title: string,
 *     layers: { name: string, component: string, asset?: string, data?: string[] }[],
 *     dataBindings: { [key: string]: string },  // label → state_key
 *     assets: string[],
 *     behaviors: { on_load?: string[], on_click?: object, on_enter?: object, on_exit?: object },
 *     rules?: object
 *   }
 */

var PAGE_TYPE_MAP = {
  landing: 'landing',
  explore: 'explore',
  relic: 'relic',
  echo: 'echo',
  collection: 'collection',
  profile: 'profile'
};

var LAYER_STRUCTURE_MAP = {
  landing: 'layered',
  explore: 'layered',
  relic: 'orbit',
  echo: 'layered',
  collection: 'grid',
  profile: 'vertical_stack'
};

var LAYER_COMPONENT_MAP = {
  background: 'view',
  hero: 'hero',
  content: 'view',
  action: 'button'
};

/**
 * Generate a page_id from the page type.
 *
 * @param {string} type — page type identifier
 * @returns {string} — unique page ID
 */
function generatePageId(type) {
  var typePrefixes = {
    landing: 'PAGE_01',
    explore: 'PAGE_02',
    relic: 'PAGE_03',
    echo: 'PAGE_04',
    collection: 'PAGE_05',
    profile: 'PAGE_06'
  };
  var prefix = typePrefixes[type] || 'PAGE_XX';
  var timestamp = Date.now().toString(36);
  return prefix + '_' + type.toUpperCase() + '_' + timestamp;
}

/**
 * Create a default component for a layer name.
 *
 * @param {string} layerName — the layer name
 * @param {string} [assetId] — optional asset ID for the layer
 * @returns {Object} — component descriptor
 */
function createLayerComponent(layerName, assetId) {
  var compType = LAYER_COMPONENT_MAP[layerName] || 'view';
  var component = {
    type: compType,
    className: 'layer-' + layerName,
    children: []
  };
  if (assetId) {
    component.asset = assetId;
  }
  return component;
}

/**
 * Extract asset IDs from page definition and map them.
 *
 * @param {Object} pageDef — the page definition
 * @returns {string[]} — array of unique asset IDs
 */
function extractAssets(pageDef) {
  var assetSet = {};

  if (pageDef.assets && Array.isArray(pageDef.assets)) {
    pageDef.assets.forEach(function (a) {
      if (a && typeof a === 'string') assetSet[a] = true;
    });
  }

  if (pageDef.layers && Array.isArray(pageDef.layers)) {
    pageDef.layers.forEach(function (layer) {
      if (layer.asset && !assetSet[layer.asset]) {
        assetSet[layer.asset] = true;
      }
    });
  }

  return Object.keys(assetSet);
}

/**
 * Build a full PageSpec from a simplified PageDefinition.
 *
 * @param {Object} pageDefinition — simplified page definition
 * @returns {Object} — valid PageSpec ready for rendering
 */
function buildPageSpec(pageDefinition) {
  if (!pageDefinition || typeof pageDefinition !== 'object') {
    throw new Error('[SPEC_FACTORY] Invalid page definition');
  }
  if (!pageDefinition.type) {
    throw new Error('[SPEC_FACTORY] Page type is required');
  }

  var type = PAGE_TYPE_MAP[pageDefinition.type];
  if (!type) {
    throw new Error('[SPEC_FACTORY] Invalid page type "' + pageDefinition.type + '". Allowed: ' + Object.keys(PAGE_TYPE_MAP).join(', '));
  }

  // Build page_id
  var pageId = pageDefinition.page_id || generatePageId(type);

  // Build layout
  var layerNames = [];
  var components = [];

  if (pageDefinition.layers && Array.isArray(pageDefinition.layers)) {
    pageDefinition.layers.forEach(function (layer) {
      layerNames.push(layer.name);
      components.push(createLayerComponent(layer.name, layer.asset));
    });
  } else {
    // Default layers based on type.
    // ALL layer names MUST be valid parser layer types:
    // ['background', 'hero', 'content', 'action']
    var defaultLayerNames = {
      landing: ['background', 'hero', 'content', 'action'],
      explore: ['background', 'hero', 'content'],
      relic: ['background', 'hero', 'content', 'action'],
      echo: ['background', 'hero', 'content', 'action'],
      collection: ['background', 'hero', 'content', 'action'],
      profile: ['background', 'hero', 'content', 'action']
    };
    layerNames = defaultLayerNames[type] || ['background', 'content'];
    components = layerNames.map(function (name) {
      return createLayerComponent(name);
    });
  }

  var structure = LAYER_STRUCTURE_MAP[type] || 'layered';

  var layout = {
    structure: structure,
    layers: layerNames
  };

  // Build data bindings
  var data = {};
  if (pageDefinition.dataBindings && typeof pageDefinition.dataBindings === 'object') {
    var keys = Object.keys(pageDefinition.dataBindings);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var value = pageDefinition.dataBindings[key];
      // Only map to ALLOWED_STATE_KEYS
      data[key] = value;
    }
  }

  // Build assets list (deduplicated)
  var assets = extractAssets(pageDefinition);

  // Build behavior
  var behavior = pageDefinition.behaviors || {
    on_load: [],
    on_click: {},
    on_enter: {},
    on_exit: {}
  };

  // Build rules
  var rules = pageDefinition.rules || {};

  return {
    page_id: pageId,
    type: type,
    title: pageDefinition.title || '',
    layout: layout,
    data: data,
    assets: assets,
    components: components,
    behavior: behavior,
    rules: rules
  };
}

module.exports = {
  buildPageSpec: buildPageSpec,
  generatePageId: generatePageId,
  PAGE_TYPE_MAP: PAGE_TYPE_MAP
};

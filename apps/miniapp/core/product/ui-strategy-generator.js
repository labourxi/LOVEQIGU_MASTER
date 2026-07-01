/**
 * UI STRATEGY GENERATOR — V3
 *
 * Generates a product-driven UI strategy from a product intent.
 *
 * V3 §2: generateUIStrategy(intent) → strategy
 *
 * The strategy defines:
 *   - primary_focus: what this page should achieve
 *   - layout_priority: ordered list of visual priorities
 *   - visual_emphasis: the dominant visual treatment
 *   - interaction_model: user interaction pattern
 *   - priority_overrides: P0-P3 priority assignments for elements
 */

/**
 * Strategy templates for each known page role.
 *
 * V3 §5: Landing Page MUST follow:
 *   1. Conversion layer (login)
 *   2. Identity layer (world entrance)
 *   3. Data layer (stats)
 *   4. Exploration layer (preview)
 */
var ROLE_STRATEGIES = {
  landing: {
    primary_focus: 'conversion_and_entry',
    layout_priority: ['CTA', 'identity', 'data', 'exploration'],
    visual_emphasis: 'portal_center_focus',
    interaction_model: 'single_primary_action',
    required_layers: {
      order: ['action', 'hero', 'content', 'background'],
      P0: ['action'],
      P1: ['hero'],
      P2: ['content'],
      P3: ['background']
    }
  },
  explore: {
    primary_focus: 'navigation_and_discovery',
    layout_priority: ['map', 'nodes', 'path', 'AR'],
    visual_emphasis: 'spatial_depth',
    interaction_model: 'multi_choice',
    required_layers: {
      order: ['background', 'hero', 'content', 'action'],
      P0: ['action', 'hero'],
      P1: ['content'],
      P2: ['background']
    }
  },
  relic: {
    primary_focus: 'lore_and_details',
    layout_priority: ['relic_display', 'description', 'lore_tree', 'actions'],
    visual_emphasis: 'artifact_center_focus',
    interaction_model: 'scroll_and_inspect',
    required_layers: {
      order: ['hero', 'content', 'action'],
      P0: ['hero'],
      P1: ['content'],
      P2: ['action']
    }
  },
  echo: {
    primary_focus: 'communication_and_resonance',
    layout_priority: ['messages', 'input', 'character_card', 'ambient'],
    visual_emphasis: 'conversation_depth',
    interaction_model: 'chat_and_respond',
    required_layers: {
      order: ['content', 'hero', 'action'],
      P0: ['content', 'action'],
      P1: ['hero']
    }
  },
  collection: {
    primary_focus: 'browse_and_manage',
    layout_priority: ['grid', 'filter', 'item_detail', 'stats'],
    visual_emphasis: 'gallery_grid',
    interaction_model: 'scroll_and_select',
    required_layers: {
      order: ['content', 'hero', 'action'],
      P0: ['content'],
      P1: ['action'],
      P2: ['hero']
    }
  },
  profile: {
    primary_focus: 'account_and_progress',
    layout_priority: ['user_card', 'stats', 'settings', 'support'],
    visual_emphasis: 'card_focused',
    interaction_model: 'tab_and_edit',
    required_layers: {
      order: ['hero', 'content', 'action'],
      P0: ['hero', 'action'],
      P1: ['content']
    }
  },
  unknown: {
    primary_focus: 'generic_content',
    layout_priority: ['content'],
    visual_emphasis: 'standard',
    interaction_model: 'scroll',
    required_layers: {
      order: ['content'],
      P0: ['content']
    }
  }
};

/**
 * P0-P3 priority level definitions.
 *
 * V3 §4: Product Priority System
 *   P0 = conversion critical (login, CTA) — ALWAYS overrides all other layers
 *   P1 = core experience (exploration, map)
 *   P2 = supporting info (stats)
 *   P3 = decorative elements (visual effects)
 */
var PRIORITY_LEVELS = {
  P0: {
    label: 'conversion_critical',
    description: 'Login, CTA — ALWAYS overrides all other layers',
    must_be_visible: true,
    cannot_be_hidden: true
  },
  P1: {
    label: 'core_experience',
    description: 'Exploration, map — core page experience',
    must_be_visible: true,
    cannot_be_hidden: false
  },
  P2: {
    label: 'supporting_info',
    description: 'Stats, descriptions — supporting content',
    must_be_visible: false,
    cannot_be_hidden: false
  },
  P3: {
    label: 'decorative',
    description: 'Visual effects, ambiance — decorative only',
    must_be_visible: false,
    cannot_be_hidden: false
  }
};

/**
 * Look up which P-level a component belongs to for a given role.
 *
 * @param {string} role — page role
 * @param {string} componentType — component type identifier
 * @returns {string} — 'P0', 'P1', 'P2', or 'P3'
 */
function getComponentPriority(role, componentType) {
  var strategy = ROLE_STRATEGIES[role] || ROLE_STRATEGIES.unknown;
  var layers = strategy.required_layers || {};

  var compLower = (componentType || '').toLowerCase();

  // Map of component type keywords to layer assignments
  var componentLayerMap = {
    'enter_button': 'action',
    'login': 'action',
    'cta': 'action',
    'portal_gate': 'hero',
    'world_entrance': 'hero',
    'identity': 'hero',
    'stats_display': 'content',
    'data': 'content',
    'invitation_text': 'content',
    'description': 'content',
    'ambient': 'background',
    'decoration': 'background',
    'fog': 'background',
    'explore_map': 'content',
    'map': 'content',
    'node': 'content',
    'relic_display': 'hero',
    'chat_bubble': 'content',
    'gallery_view': 'content',
    'user_card': 'hero',
    'setting_panel': 'content'
  };

  // Try component-to-layer mapping first
  for (var keyword in componentLayerMap) {
    if (compLower.indexOf(keyword) !== -1) {
      var mappedLayer = componentLayerMap[keyword];
      for (var level in layers) {
        // Skip non-priority keys (like 'order')
        if (level !== 'P0' && level !== 'P1' && level !== 'P2' && level !== 'P3') continue;
        if (layers[level].indexOf(mappedLayer) !== -1) {
          return level;
        }
      }
    }
  }

  // Try direct layer match in component name
  for (var level2 in layers) {
    if (level2 !== 'P0' && level2 !== 'P1' && level2 !== 'P2' && level2 !== 'P3') continue;
    if (layers[level2].some(function (l) { return compLower.indexOf(l) !== -1; })) {
      return level2;
    }
  }

  // Check layout_priority
  var priority = strategy.layout_priority || [];
  for (var p = 0; p < priority.length; p++) {
    if (compLower.indexOf(priority[p].toLowerCase()) !== -1) {
      return 'P' + Math.min(p, 3);
    }
  }

  return 'P3'; // Default to decorative
}

/**
 * Generate a full UI strategy from a product intent.
 *
 * V3 §2: generateUIStrategy(intent) → strategy
 *
 * @param {Object} intent — from analyzeProductIntent
 * @returns {Object} — UI strategy descriptor
 */
function generateUIStrategy(intent) {
  if (!intent || !intent.page_role) {
    throw new Error('[UI_STRATEGY] Product intent with page_role is required');
  }

  var role = intent.page_role;
  var template = ROLE_STRATEGIES[role] || ROLE_STRATEGIES.unknown;

  var strategy = {
    page_role: role,
    primary_focus: template.primary_focus,
    layout_priority: template.layout_priority.slice(),
    visual_emphasis: template.visual_emphasis,
    interaction_model: template.interaction_model,
    required_layers: JSON.parse(JSON.stringify(template.required_layers)),
    priority: {
      conversion: intent.priority_weights.conversion,
      exploration: intent.priority_weights.exploration,
      retention: intent.priority_weights.retention
    },
    user_goal: intent.user_goal,
    business_goal: intent.business_goal,
    priority_levels: PRIORITY_LEVELS
  };

  console.log('[UI_STRATEGY] Role: ' + role + ' | Focus: ' + strategy.primary_focus + ' | Model: ' + strategy.interaction_model);

  return strategy;
}

module.exports = {
  generateUIStrategy: generateUIStrategy,
  getComponentPriority: getComponentPriority,
  ROLE_STRATEGIES: ROLE_STRATEGIES,
  PRIORITY_LEVELS: PRIORITY_LEVELS
};

/**
 * PRODUCT INTENT ENGINE — V3
 *
 * Analyzes a PageSpec to infer product intent: page role, user goal,
 * business goal, and priority weights.
 *
 * V3 §1: analyzeProductIntent(pageSpec) → intent
 *
 * This is the FIRST stage of the V3 pipeline. Every page must be
 * understood in product terms before UI generation.
 */

/**
 * Known page roles and their identifying patterns.
 */
var PAGE_ROLE_PATTERNS = {
  landing: {
    keywords: ['landing', 'entry', 'welcome', 'portal', 'gate'],
    components: ['enter_button', 'login', 'portal_gate', 'invitation_text'],
    priority: ['conversion', 'identity']
  },
  explore: {
    keywords: ['explore', 'map', 'discover', 'world', 'journey'],
    components: ['explore_map', 'node', 'path', 'ar_viewer'],
    priority: ['navigation', 'discovery']
  },
  relic: {
    keywords: ['relic', 'artifact', 'item', 'collectible', 'treasure'],
    components: ['relic_display', 'artifact_viewer', 'collection_item'],
    priority: ['retention', 'collection']
  },
  echo: {
    keywords: ['echo', 'chat', 'message', 'conversation', 'resonance'],
    components: ['chat_bubble', 'message_list', 'echo_chamber'],
    priority: ['retention', 'engagement']
  },
  collection: {
    keywords: ['collection', 'inventory', 'gallery', 'library', 'archive'],
    components: ['gallery_view', 'inventory_list', 'collectible_grid'],
    priority: ['retention', 'exploration']
  },
  profile: {
    keywords: ['profile', 'account', 'user', 'setting', 'me'],
    components: ['user_card', 'setting_panel', 'stats_display'],
    priority: ['retention', 'conversion']
  }
};

/**
 * Priority weight definitions.
 */
var PRIORITY_OPTIONS = ['high', 'medium', 'low'];

/**
 * Infer the page role from a PageSpec.
 *
 * @param {Object} pageSpec
 * @returns {string} — page role identifier
 */
function inferPageRole(pageSpec) {
  var pageName = (pageSpec.page || pageSpec.page_id || '').toLowerCase();
  var specStr = JSON.stringify(pageSpec).toLowerCase();

  // Try exact page name keyword match first
  for (var role in PAGE_ROLE_PATTERNS) {
    var pattern = PAGE_ROLE_PATTERNS[role];
    for (var k = 0; k < pattern.keywords.length; k++) {
      if (pageName.indexOf(pattern.keywords[k]) !== -1) {
        return role;
      }
    }
  }

  // Try component-based match
  for (var role2 in PAGE_ROLE_PATTERNS) {
    var pattern2 = PAGE_ROLE_PATTERNS[role2];
    if (pageSpec.components && Array.isArray(pageSpec.components)) {
      for (var c = 0; c < pageSpec.components.length; c++) {
        var compStr = (pageSpec.components[c].type || pageSpec.components[c].component || '').toLowerCase();
        for (var m = 0; m < pattern2.components.length; m++) {
          if (compStr.indexOf(pattern2.components[m]) !== -1) {
            return role2;
          }
        }
      }
    }
  }

  // Try layer-based inference
  if (pageSpec.layers_by_type) {
    for (var role3 in PAGE_ROLE_PATTERNS) {
      var pattern3 = PAGE_ROLE_PATTERNS[role3];
      var layerKeys = Object.keys(pageSpec.layers_by_type);
      for (var l = 0; l < layerKeys.length; l++) {
        for (var m2 = 0; m2 < pattern3.components.length; m2++) {
          if (layerKeys[l].indexOf(pattern3.components[m2]) !== -1) {
            return role3;
          }
        }
      }
    }
  }

  // Check for landing-specific layers
  if (pageSpec.layout && pageSpec.layout.layers) {
    var layers = pageSpec.layout.layers;
    if (layers.indexOf('hero') !== -1 && layers.indexOf('action') !== -1) {
      return 'landing';
    }
  }

  // Fallback
  if (pageSpec.type || pageSpec.page_id) {
    var id = (pageSpec.type || pageSpec.page_id || '').toLowerCase();
    if (id.indexOf('landing') !== -1 || id.indexOf('page_01') !== -1) return 'landing';
    if (id.indexOf('explore') !== -1 || id.indexOf('page_02') !== -1) return 'explore';
    if (id.indexOf('relic') !== -1 || id.indexOf('page_03') !== -1) return 'relic';
    if (id.indexOf('echo') !== -1 || id.indexOf('page_04') !== -1) return 'echo';
    if (id.indexOf('collection') !== -1 || id.indexOf('page_05') !== -1) return 'collection';
    if (id.indexOf('profile') !== -1 || id.indexOf('page_06') !== -1) return 'profile';
  }

  return 'unknown';
}

/**
 * Infer the primary user goal for a page.
 *
 * @param {Object} pageSpec
 * @returns {string}
 */
function inferUserGoal(pageSpec) {
  var role = inferPageRole(pageSpec);

  var goalMap = {
    landing: 'enter_world_and_begin_journey',
    explore: 'discover_and_navigate_the_heavens',
    relic: 'view_and_understand_relic_lore',
    echo: 'communicate_and_resonate_with_characters',
    collection: 'browse_and_manage_collected_items',
    profile: 'manage_account_and_view_progress',
    unknown: 'explore_content'
  };

  return goalMap[role] || goalMap.unknown;
}

/**
 * Infer the business goal for a page.
 *
 * @param {Object} pageSpec
 * @returns {string}
 */
function inferBusinessGoal(pageSpec) {
  var role = inferPageRole(pageSpec);

  var goalMap = {
    landing: 'convert_user_to_active_explorer',
    explore: 'drive_engagement_and_discovery_time',
    relic: 'build_retention_through_lore_depth',
    echo: 'increase_session_length_and_emotional_connection',
    collection: 'reinforce_collection_value_driving_retention',
    profile: 'support_conversion_and_account_loyalty',
    unknown: 'maintain_engagement'
  };

  return goalMap[role] || goalMap.unknown;
}

/**
 * Calculate priority weights based on page role.
 *
 * V3 §4: Product Priority System — P0, P1, P2, P3
 * RULE: P0 ALWAYS overrides all other layers.
 *
 * @param {Object} pageSpec
 * @returns {Object} — { conversion, exploration, retention }
 */
function inferPriorityWeights(pageSpec) {
  var role = inferPageRole(pageSpec);

  // Default weights
  var weights = {
    conversion: 'low',
    exploration: 'medium',
    retention: 'medium'
  };

  switch (role) {
    case 'landing':
      weights.conversion = 'high';
      weights.exploration = 'medium';
      weights.retention = 'low';
      break;
    case 'explore':
      weights.conversion = 'medium';
      weights.exploration = 'high';
      weights.retention = 'medium';
      break;
    case 'relic':
      weights.conversion = 'low';
      weights.exploration = 'medium';
      weights.retention = 'high';
      break;
    case 'echo':
      weights.conversion = 'low';
      weights.exploration = 'medium';
      weights.retention = 'high';
      break;
    case 'collection':
      weights.conversion = 'medium';
      weights.exploration = 'medium';
      weights.retention = 'high';
      break;
    case 'profile':
      weights.conversion = 'high';
      weights.exploration = 'low';
      weights.retention = 'high';
      break;
  }

  return weights;
}

/**
 * Full product intent analysis.
 *
 * V3 §1: Returns page_role, user_goal, business_goal, priority_weights.
 *
 * @param {Object} pageSpec — the PageSpec to analyze
 * @returns {Object} — product intent descriptor
 */
function analyzeProductIntent(pageSpec) {
  if (!pageSpec) {
    throw new Error('[PRODUCT_INTENT] PageSpec is required');
  }

  var role = inferPageRole(pageSpec);

  var intent = {
    page_role: role,
    user_goal: inferUserGoal(pageSpec),
    business_goal: inferBusinessGoal(pageSpec),
    priority_weights: inferPriorityWeights(pageSpec),
    priority_level: role === 'landing' ? 'P0' : 'P1' // V3 §4: Landing is always P0 by default
  };

  console.log('[PRODUCT_INTENT] Role: ' + role + ' | User: ' + intent.user_goal + ' | Business: ' + intent.business_goal);

  return intent;
}

module.exports = {
  analyzeProductIntent: analyzeProductIntent,
  inferPageRole: inferPageRole,
  inferUserGoal: inferUserGoal,
  inferBusinessGoal: inferBusinessGoal,
  inferPriorityWeights: inferPriorityWeights,
  PAGE_ROLE_PATTERNS: PAGE_ROLE_PATTERNS
};

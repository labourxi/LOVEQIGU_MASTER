/**
 * PRODUCT STATE MACHINE — V4
 *
 * Manages the product lifecycle state and adapts UI behavior automatically.
 *
 * V4 §6: Product lifecycle:
 *   INIT → ACTIVATION → EXPLORATION → ENGAGEMENT → RETENTION → EXPANSION
 *
 * UI MUST adapt to product state automatically.
 */

/**
 * Product lifecycle states.
 */
var PRODUCT_STATES = {
  INIT: {
    name: 'INIT',
    description: 'Product initialized, pre-activation',
    allowed_transitions: ['ACTIVATION']
  },
  ACTIVATION: {
    name: 'ACTIVATION',
    description: 'User activation and onboarding phase',
    allowed_transitions: ['EXPLORATION', 'ENGAGEMENT']
  },
  EXPLORATION: {
    name: 'EXPLORATION',
    description: 'Core discovery and navigation phase',
    allowed_transitions: ['ENGAGEMENT', 'RETENTION']
  },
  ENGAGEMENT: {
    name: 'ENGAGEMENT',
    description: 'Active interaction and participation phase',
    allowed_transitions: ['EXPLORATION', 'RETENTION', 'EXPANSION']
  },
  RETENTION: {
    name: 'RETENTION',
    description: 'Return-user loyalty and depth phase',
    allowed_transitions: ['ENGAGEMENT', 'EXPANSION']
  },
  EXPANSION: {
    name: 'EXPANSION',
    description: 'Product growth and feature extension phase',
    allowed_transitions: ['RETENTION']
  }
};

/**
 * State-dependent UI adaptation rules.
 *
 * Each state prescribes how the UI should behave.
 */
var STATE_UI_ADAPTATIONS = {
  INIT: {
    emphasis: 'entry_and_onboarding',
    show_conversion: true,
    show_exploration: false,
    show_rewards: false,
    max_layers: 3,
    cta_text: 'Begin Journey'
  },
  ACTIVATION: {
    emphasis: 'onboarding_and_first_steps',
    show_conversion: true,
    show_exploration: true,
    show_rewards: false,
    max_layers: 4,
    cta_text: 'Explore World'
  },
  EXPLORATION: {
    emphasis: 'discovery_and_navigation',
    show_conversion: false,
    show_exploration: true,
    show_rewards: true,
    max_layers: 5,
    cta_text: 'Discover More'
  },
  ENGAGEMENT: {
    emphasis: 'interaction_and_participation',
    show_conversion: false,
    show_exploration: true,
    show_rewards: true,
    max_layers: 5,
    cta_text: 'Engage'
  },
  RETENTION: {
    emphasis: 'depth_and_return',
    show_conversion: false,
    show_exploration: true,
    show_rewards: true,
    max_layers: 5,
    cta_text: 'Return to World'
  },
  EXPANSION: {
    emphasis: 'growth_and_features',
    show_conversion: false,
    show_exploration: true,
    show_rewards: true,
    max_layers: 5,
    cta_text: 'Explore New'
  }
};

var currentState = 'INIT';

/**
 * Get the current product state.
 *
 * @returns {string}
 */
function getState() {
  return currentState;
}

/**
 * Set the product state.
 *
 * @param {string} newState — one of PRODUCT_STATES keys
 * @param {Object} [context] — optional transition context
 * @returns {boolean} — true if transition was allowed
 */
function setState(newState, context) {
  var currentDef = PRODUCT_STATES[currentState];
  if (!currentDef) {
    console.warn('[PRODUCT_STATE] Unknown current state: ' + currentState);
    return false;
  }

  if (currentDef.allowed_transitions.indexOf(newState) === -1) {
    console.warn('[PRODUCT_STATE] Invalid transition: ' + currentState + ' → ' + newState);
    return false;
  }

  console.log('[PRODUCT_STATE] Transition: ' + currentState + ' → ' + newState + (context ? ' (' + JSON.stringify(context) + ')' : ''));
  currentState = newState;

  return true;
}

/**
 * Get the UI adaptation for the current state.
 *
 * V4 §6: UI MUST adapt to product state automatically.
 *
 * @returns {Object} — UI adaptation rules for current state
 */
function getUIAdaptation() {
  return STATE_UI_ADAPTATIONS[currentState] || STATE_UI_ADAPTATIONS.INIT;
}

/**
 * Apply state adaptation to a page spec or UI descriptor.
 *
 * @param {Object} spec — the page spec or UI descriptor
 * @param {Object} [adaptation] — optional override adaptation
 * @returns {Object} — adapted spec
 */
function applyStateToSpec(spec, adaptation) {
  var rules = adaptation || getUIAdaptation();
  var adapted = JSON.parse(JSON.stringify(spec));

  // Apply layer count constraint
  if (adapted.layout && adapted.layout.layers) {
    adapted.layout.layers = adapted.layout.layers.slice(0, rules.max_layers);
    adapted.layout.layerCount = adapted.layout.layers.length;
  }

  // Apply visibility rules
  if (adapted.components && Array.isArray(adapted.components)) {
    adapted.components = adapted.components.filter(function (comp) {
      var type = (comp.type || comp.component || '').toLowerCase();

      // If exploration is hidden, filter exploration components
      if (!rules.show_exploration && (type.indexOf('explore') !== -1 || type.indexOf('map') !== -1)) {
        return false;
      }
      // If rewards are hidden, filter reward components
      if (!rules.show_rewards && (type.indexOf('relic') !== -1 || type.indexOf('collect') !== -1)) {
        return false;
      }
      return true;
    });
  }

  // Apply CTA text
  adapted._state_cta = rules.cta_text;
  adapted._state_emphasis = rules.emphasis;
  adapted._product_state = currentState;

  return adapted;
}

/**
 * Reset state to INIT.
 */
function resetState() {
  currentState = 'INIT';
}

module.exports = {
  PRODUCT_STATES: PRODUCT_STATES,
  STATE_UI_ADAPTATIONS: STATE_UI_ADAPTATIONS,
  getState: getState,
  setState: setState,
  getUIAdaptation: getUIAdaptation,
  applyStateToSpec: applyStateToSpec,
  resetState: resetState
};

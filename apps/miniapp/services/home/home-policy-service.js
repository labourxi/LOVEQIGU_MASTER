/**
 * Dual Home policy — mode resolution & persisted preferences.
 * Reserved admin fields: home_policy, default_mode, forced_mode,
 * campaign_override, experiment_group.
 */

const STORAGE_KEY_LAST_MODE = 'dual_home_last_mode';

const MODES = {
  EXPLORE: 'explore',
  AFFINITY: 'affinity',
  CAMPAIGN: 'campaign'
};

/** Placeholder policy payload — future remote admin config. */
const DEFAULT_POLICY = {
  home_policy: 'dual_home_v1',
  default_mode: MODES.EXPLORE,
  forced_mode: null,
  campaign_override: null,
  experiment_group: null
};

let cachedPolicyConfig = null;

function loadPolicyConfig() {
  if (cachedPolicyConfig) {
    return cachedPolicyConfig;
  }
  try {
    cachedPolicyConfig = require('../../config/home-policy.v1.js');
  } catch (e) {
    cachedPolicyConfig = {};
  }
  return cachedPolicyConfig;
}

function normalizeMode(mode) {
  if (mode === MODES.AFFINITY || mode === MODES.CAMPAIGN || mode === MODES.EXPLORE) {
    return mode;
  }
  return null;
}

function getPolicy(overrides) {
  const fromConfig = loadPolicyConfig();
  return {
    ...DEFAULT_POLICY,
    home_policy: fromConfig.home_policy || DEFAULT_POLICY.home_policy,
    default_mode: fromConfig.default_mode || DEFAULT_POLICY.default_mode,
    forced_mode: fromConfig.forced_mode !== undefined ? fromConfig.forced_mode : DEFAULT_POLICY.forced_mode,
    campaign_override:
      fromConfig.campaign_override !== undefined ? fromConfig.campaign_override : DEFAULT_POLICY.campaign_override,
    experiment_group:
      fromConfig.experiment_group !== undefined ? fromConfig.experiment_group : DEFAULT_POLICY.experiment_group,
    ...(overrides || {})
  };
}

function getLastMode() {
  try {
    return normalizeMode(wx.getStorageSync(STORAGE_KEY_LAST_MODE));
  } catch (e) {
    return null;
  }
}

function persistLastMode(mode) {
  const normalized = normalizeMode(mode);
  if (!normalized || normalized === MODES.CAMPAIGN) {
    return;
  }
  try {
    wx.setStorageSync(STORAGE_KEY_LAST_MODE, normalized);
  } catch (e) {
    // ignore storage failures in placeholder phase
  }
}

function isCampaignTabVisible(policy) {
  return Boolean(policy && policy.campaign_override);
}

function resolveActiveMode(policy, launchOptions) {
  const options = launchOptions || {};

  if (policy.forced_mode) {
    const forced = normalizeMode(policy.forced_mode);
    if (forced) {
      return forced;
    }
  }

  if (policy.campaign_override && options.mode === MODES.CAMPAIGN) {
    return MODES.CAMPAIGN;
  }

  if (options.mode) {
    const fromQuery = normalizeMode(options.mode);
    if (fromQuery && fromQuery !== MODES.CAMPAIGN) {
      return fromQuery;
    }
  }

  if (options.source === 'rights' || options.source === 'campaign' || options.source === 'affinity') {
    return MODES.AFFINITY;
  }

  if (options.source === 'explore' || options.source === 'story' || options.source === 'ar') {
    return MODES.EXPLORE;
  }

  const last = getLastMode();
  if (last) {
    return last;
  }

  const fallback = normalizeMode(policy.default_mode);
  return fallback || MODES.EXPLORE;
}

module.exports = {
  MODES,
  DEFAULT_POLICY,
  getPolicy,
  getLastMode,
  persistLastMode,
  isCampaignTabVisible,
  resolveActiveMode
};

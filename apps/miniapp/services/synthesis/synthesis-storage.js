const STORAGE_KEY = 'loveqigu_synthesis_v1';

const DEFAULT_STATE = {
  schema: 'loveqigu.synthesis.state.v1',
  version: '1.0.0',
  synthesized_ids: [],
  records: []
};

let memoryState = null;

function cloneState(state) {
  return {
    schema: state.schema,
    version: state.version,
    synthesized_ids: state.synthesized_ids.slice(),
    records: state.records.map((record) => ({ ...record }))
  };
}

function normalizeState(raw) {
  if (!raw || !Array.isArray(raw.synthesized_ids)) {
    return cloneState(DEFAULT_STATE);
  }
  return {
    schema: raw.schema || DEFAULT_STATE.schema,
    version: raw.version || DEFAULT_STATE.version,
    synthesized_ids: raw.synthesized_ids.slice(),
    records: Array.isArray(raw.records) ? raw.records.map((record) => ({ ...record })) : []
  };
}

function readState() {
  if (typeof wx !== 'undefined' && wx.getStorageSync) {
    return normalizeState(wx.getStorageSync(STORAGE_KEY));
  }
  if (!memoryState) {
    memoryState = cloneState(DEFAULT_STATE);
  }
  return cloneState(memoryState);
}

function writeState(state) {
  const next = normalizeState(state);
  if (typeof wx !== 'undefined' && wx.setStorageSync) {
    wx.setStorageSync(STORAGE_KEY, next);
  } else {
    memoryState = cloneState(next);
  }
  return next;
}

function hasSynthesized(rewardId) {
  const state = readState();
  return state.synthesized_ids.indexOf(rewardId) !== -1;
}

function addSynthesis(record) {
  const state = readState();
  if (state.synthesized_ids.indexOf(record.reward_id) !== -1) {
    return state;
  }
  state.synthesized_ids.push(record.reward_id);
  state.records.push({
    reward_id: record.reward_id,
    reward_name: record.reward_name,
    reward_type: record.reward_type || '',
    recipe_id: record.recipe_id,
    synthesized_at: record.synthesized_at || Date.now()
  });
  return writeState(state);
}

function getSynthesizedRecords() {
  return readState().records;
}

function resetStateForTest() {
  memoryState = cloneState(DEFAULT_STATE);
  return memoryState;
}

module.exports = {
  STORAGE_KEY,
  readState,
  writeState,
  hasSynthesized,
  addSynthesis,
  getSynthesizedRecords,
  resetStateForTest
};

const STORAGE_KEY = 'loveqigu_user_frontend_v1';
const { safeParse, safeClone } = require('../../utils/safe-json');

const DEFAULT_STATE = {
  schema: 'loveqigu.user_frontend.v1',
  version: '1.0.0',
  logged_in: false,
  auth_status: 'UNLOGGED',
  user: {
    user_id: 'guest_mock',
    nick_name: '游客',
    avatar_url: '',
    role: 'visitor'
  },
  active_tab: 'home',
  last_activity_id: null,
  last_route: '',
  updated_at: ''
};

let memoryState = null;

function clone(value) {
  return safeClone(value);
}

function isObject(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function readStoredValue(key) {
  try {
    if (typeof wx !== 'undefined' && wx.getStorageSync) {
      const value = wx.getStorageSync(key);
      if (value === undefined) return null;
      // 保护：storage 返回的字符串可能是被污染的数据（如 HTML 片段）
      if (typeof value === 'string' && (value.startsWith('<') || value.startsWith('%') || value.startsWith('!'))) {
        console.warn('[storage] corrupted data detected for key:', key, 'first 50 chars:', value.slice(0, 50));
        return null;
      }
      return value;
    }
  } catch (err) {
    // ignore storage read errors
  }

  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(key);
      if (raw === null) {
        return null;
      }
      return safeParse(raw);
    }
  } catch (err) {
    // ignore storage read errors
  }

  if (!memoryState) {
    memoryState = clone(DEFAULT_STATE);
  }
  if (key === STORAGE_KEY) {
    return clone(memoryState);
  }
  return null;
}

function writeStoredValue(key, value) {
  try {
    if (typeof wx !== 'undefined' && wx.setStorageSync) {
      wx.setStorageSync(key, value);
      return value;
    }
  } catch (err) {
    // ignore storage write errors
  }

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
      return value;
    }
  } catch (err) {
    // ignore storage write errors
  }

  if (key === STORAGE_KEY) {
    memoryState = clone(value);
  }
  return value;
}

function normalizeState(raw) {
  if (!isObject(raw)) {
    return clone(DEFAULT_STATE);
  }

  const user = isObject(raw.user) ? raw.user : {};

  return {
    schema: typeof raw.schema === 'string' ? raw.schema : DEFAULT_STATE.schema,
    version: typeof raw.version === 'string' ? raw.version : DEFAULT_STATE.version,
    logged_in: Boolean(raw.logged_in),
    auth_status: typeof raw.auth_status === 'string' ? raw.auth_status : DEFAULT_STATE.auth_status,
    user: {
      user_id: typeof user.user_id === 'string' ? user.user_id : DEFAULT_STATE.user.user_id,
      nick_name: typeof user.nick_name === 'string' ? user.nick_name : DEFAULT_STATE.user.nick_name,
      avatar_url: typeof user.avatar_url === 'string' ? user.avatar_url : DEFAULT_STATE.user.avatar_url,
      role: typeof user.role === 'string' ? user.role : DEFAULT_STATE.user.role
    },
    active_tab: typeof raw.active_tab === 'string' ? raw.active_tab : DEFAULT_STATE.active_tab,
    last_activity_id: typeof raw.last_activity_id === 'string' ? raw.last_activity_id : null,
    last_route: typeof raw.last_route === 'string' ? raw.last_route : '',
    updated_at: typeof raw.updated_at === 'string' ? raw.updated_at : ''
  };
}

function readState() {
  return normalizeState(readStoredValue(STORAGE_KEY));
}

function writeState(state) {
  const next = normalizeState(state);
  next.updated_at = new Date().toISOString();
  writeStoredValue(STORAGE_KEY, next);
  return clone(next);
}

function patchState(mutator) {
  const current = readState();
  const draft = clone(current);

  if (typeof mutator === 'function') {
    const result = mutator(draft);
    if (result && isObject(result)) {
      return writeState(result);
    }
    return writeState(draft);
  }

  if (isObject(mutator)) {
    return writeState({
      ...draft,
      ...mutator
    });
  }

  return writeState(draft);
}

function resetForTest() {
  memoryState = clone(DEFAULT_STATE);
  writeStoredValue(STORAGE_KEY, memoryState);
  return clone(memoryState);
}

module.exports = {
  STORAGE_KEY,
  DEFAULT_STATE,
  clone,
  isObject,
  readStoredValue,
  writeStoredValue,
  normalizeState,
  readState,
  writeState,
  patchState,
  resetForTest
};

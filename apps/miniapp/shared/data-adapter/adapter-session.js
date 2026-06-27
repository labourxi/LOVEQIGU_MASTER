/**
 * LOVEQIGU Adapter Session Store — Phase 3 persistence layer.
 * memory | sessionStorage | localStorage demo persistence (not a real backend).
 */
(function (global) {
  var safeJson = null;
  try {
    safeJson = require('../../utils/safe-json');
  } catch (e) { /* ignore */ }
  var safeParse = safeJson && typeof safeJson.safeParse === 'function' ? safeJson.safeParse : function (v, fb) { try { return JSON.parse(v); } catch (e) { return fb; } };

  var safeClone = safeJson && typeof safeJson.safeClone === 'function' ? safeJson.safeClone : function (v, fb) { try { return JSON.parse(JSON.stringify(v)); } catch (e) { return fb; } };

  var SESSION_VERSION = "1.0.0";
  var SEED_VERSION = "PHASE2_RUNTIME_FLOW_FREEZE_V1";
  var SESSION_KEY = "LOVEQIGU_ADAPTER_SESSION_V1";
  var META_KEY = "LOVEQIGU_ADAPTER_SESSION_META_V1";
  var BACKUP_KEY = "LOVEQIGU_ADAPTER_SESSION_BACKUP_V1";

  var SESSION_COLLECTION_KEYS = [
    "users", "userProgress", "userPointStates", "userRelics", "arScanSessions",
    "merchants", "merchantStaff", "coupons", "couponClaims", "redemptions",
    "parks", "activities", "parkMerchants", "reviewRecords", "operationLogs",
    "publishRecords", "publishLogs", "platformRisks",
    "explorationPoints", "relics", "blessingContents", "arContents",
    "artRequests", "generationTasks"
  ];

  var persistenceEnabled = true;
  var persistenceMode = "sessionStorage";

  function nowIso() {
    var d = new Date();
    var pad = function (n) { return String(n).padStart(2, "0"); };
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) +
      "T" + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()) + "+08:00";
  }

  function getStorageBackend(mode) {
    var m = mode || persistenceMode;
    if (m === "memory" || !persistenceEnabled) return null;
    try {
      if (m === "sessionStorage" && typeof sessionStorage !== "undefined") return sessionStorage;
      if (m === "localStorage" && typeof localStorage !== "undefined") return localStorage;
    } catch (e) { /* private mode */ }
    return null;
  }

  function simpleChecksum(str) {
    var hash = 5381;
    for (var i = 0; i < str.length; i += 1) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i);
      hash &= 0xffffffff;
    }
    return "djb2_" + (hash >>> 0).toString(16);
  }

  function clone(val) {
    return safeClone(val);
  }

  function defaultMeta(overrides) {
    return Object.assign({
      version: SESSION_VERSION,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      persistenceMode: persistenceMode,
      seedVersion: SEED_VERSION,
      lastResetAt: "",
      lastImportedAt: "",
      lastExportedAt: "",
      source: "mock_adapter_session",
      phase: "ADAPTER_SESSION_PERSISTENCE_V1"
    }, overrides || {});
  }

  function emptySession() {
    var s = {};
    SESSION_COLLECTION_KEYS.forEach(function (key) {
      s[key] = [];
    });
    return s;
  }

  function buildParkMerchants(mock) {
    if (!mock || !mock.merchants) return [];
    return mock.merchants.map(function (m) {
      return {
        id: m.id,
        parkId: m.parkId,
        merchantId: m.id,
        name: m.name,
        category: m.category,
        accountStatus: m.accountStatus
      };
    });
  }

  function initFromMock(mock) {
    if (!mock) return emptySession();
    var session = emptySession();
    SESSION_COLLECTION_KEYS.forEach(function (key) {
      if (mock[key] && Array.isArray(mock[key])) {
        session[key] = clone(mock[key]);
      }
    });
    if (!session.parks.length && mock.parks) session.parks = clone(mock.parks);
    if (!session.merchants.length && mock.merchants) session.merchants = clone(mock.merchants);
    if (!session.merchantStaff.length && mock.merchantStaff) session.merchantStaff = clone(mock.merchantStaff);
    if (!session.parkMerchants.length) session.parkMerchants = buildParkMerchants(mock);
    if (!session.redemptions.length) session.redemptions = [];
    if (!session.platformRisks.length) session.platformRisks = [];
    return session;
  }

  function ensureCollections(session, mock) {
    var seed = mock ? initFromMock(mock) : emptySession();
    SESSION_COLLECTION_KEYS.forEach(function (key) {
      if (!Array.isArray(session[key])) {
        session[key] = clone(seed[key] || []);
      }
    });
    return session;
  }

  function migrateSessionIfNeeded(session, mock) {
    if (!session || typeof session !== "object") {
      return { ok: false, session: initFromMock(mock), migrated: false, reason: "invalid_session" };
    }
    var meta = session._meta || {};
    var version = meta.version || session.version || "0.0.0";
    if (version === SESSION_VERSION) {
      ensureCollections(session, mock);
      return { ok: true, session: session, migrated: false };
    }
    try {
      var migrated = ensureCollections(session, mock);
      migrated._meta = Object.assign(defaultMeta(), meta, {
        version: SESSION_VERSION,
        updatedAt: nowIso(),
        migratedFrom: version
      });
      return { ok: true, session: migrated, migrated: true };
    } catch (e) {
      return { ok: false, session: initFromMock(mock), migrated: false, reason: e.message || "migration_failed" };
    }
  }

  function readStorageJson(storage, key) {
    if (!storage) return null;
    try {
      var raw = storage.getItem(key);
      if (!raw) return null;
      return safeParse(raw);
    } catch (e) {
      return null;
    }
  }

  function writeStorageJson(storage, key, value) {
    if (!storage) return false;
    try {
      storage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  function removeStorageKeys(storage) {
    if (!storage) return;
    try {
      storage.removeItem(SESSION_KEY);
      storage.removeItem(META_KEY);
    } catch (e) { /* ignore */ }
  }

  function backupSession(storage, session, meta) {
    if (!storage) return;
    try {
      storage.setItem(BACKUP_KEY, JSON.stringify({
        backedUpAt: nowIso(),
        meta: meta,
        session: session
      }));
    } catch (e) { /* ignore */ }
  }

  var sessionMeta = null;

  function getSessionMeta() {
    if (sessionMeta) return clone(sessionMeta);
    var storage = getStorageBackend();
    var stored = readStorageJson(storage, META_KEY);
    if (stored) {
      sessionMeta = stored;
      return clone(stored);
    }
    return defaultMeta();
  }

  function setSessionMeta(patch) {
    sessionMeta = Object.assign(getSessionMeta(), patch || {}, { updatedAt: nowIso() });
    return sessionMeta;
  }

  function loadPersistedSession(mock) {
    var storage = getStorageBackend();
    var storedSession = readStorageJson(storage, SESSION_KEY);
    var storedMeta = readStorageJson(storage, META_KEY);
    if (!storedSession) return null;
    var migration = migrateSessionIfNeeded(storedSession, mock);
    if (!migration.ok) {
      backupSession(storage, storedSession, storedMeta);
      return null;
    }
    sessionMeta = Object.assign(defaultMeta(), storedMeta || {}, migration.session._meta || {});
    delete migration.session._meta;
    return migration.session;
  }

  function initSession(options) {
    options = options || {};
    var mock = options.mockSource || global.LQGMockSource;

    if (options.mode) {
      persistenceMode = options.mode;
    }
    if (typeof options.persistenceEnabled === "boolean") {
      persistenceEnabled = options.persistenceEnabled;
    }

    if (global.LQGAdapterSession && !options.forceReseed && !options.forceReload) {
      return global.LQGAdapterSession;
    }

    var session = null;
    if (!options.forceReseed) {
      session = loadPersistedSession(mock);
    }

    if (!session) {
      session = initFromMock(mock);
      sessionMeta = defaultMeta({
        createdAt: nowIso(),
        persistenceMode: persistenceMode,
        seedVersion: SEED_VERSION
      });
      saveSession(session, { silent: true });
    } else {
      if (!sessionMeta) {
        sessionMeta = defaultMeta({ persistenceMode: persistenceMode });
      }
    }

    global.LQGAdapterSession = session;
    return session;
  }

  function getSession() {
    if (global.LQGAdapterSession) return global.LQGAdapterSession;
    return initSession({ mockSource: global.LQGMockSource });
  }

  function saveSession(session, options) {
    options = options || {};
    var data = session || global.LQGAdapterSession;
    if (!data) return { ok: false, warning: "no_session" };

    global.LQGAdapterSession = data;
    setSessionMeta({ updatedAt: nowIso(), persistenceMode: persistenceMode });

    if (!persistenceEnabled || persistenceMode === "memory") {
      return { ok: true, warning: null, mode: "memory" };
    }

    var storage = getStorageBackend();
    if (!storage) {
      if (!options.silent) {
        console.warn("[LQGAdapterSessionStore] persistence storage unavailable, using memory only");
      }
      return { ok: true, warning: "storage_unavailable", mode: "memory" };
    }

    var sessionOk = writeStorageJson(storage, SESSION_KEY, data);
    var metaOk = writeStorageJson(storage, META_KEY, getSessionMeta());
    if (!sessionOk || !metaOk) {
      if (!options.silent) {
        console.warn("[LQGAdapterSessionStore] saveSession failed");
      }
      return { ok: false, warning: "save_failed", mode: persistenceMode };
    }
    return { ok: true, warning: null, mode: persistenceMode };
  }

  function persistAfterWrite() {
    return saveSession(global.LQGAdapterSession);
  }

  function resetSession(options) {
    options = options || {};
    var mock = options.mockSource || global.LQGMockSource;
    var storage = getStorageBackend();
    removeStorageKeys(storage);
    global.LQGAdapterSession = initFromMock(mock);
    sessionMeta = defaultMeta({
      lastResetAt: nowIso(),
      persistenceMode: persistenceMode,
      seedVersion: SEED_VERSION
    });
    saveSession(global.LQGAdapterSession, { silent: true });
    return {
      ok: true,
      message: "session reset from seed",
      session: clone(global.LQGAdapterSession),
      meta: clone(getSessionMeta())
    };
  }

  function clearSession() {
    var storage = getStorageBackend();
    removeStorageKeys(storage);
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(META_KEY);
      }
    } catch (e) { /* ignore */ }
    global.LQGAdapterSession = null;
    sessionMeta = null;
    return { ok: true, message: "session cleared from storage" };
  }

  function exportSessionSnapshot() {
    var session = getSession();
    var meta = getSessionMeta();
    var exportedAt = nowIso();
    var payload = { meta: meta, session: clone(session), exportedAt: exportedAt };
    var checksum = simpleChecksum(JSON.stringify(payload.session));
    setSessionMeta({ lastExportedAt: exportedAt });
    saveSession(session, { silent: true });
    return Object.assign(payload, {
      checksum: checksum,
      note: "LOVEQIGU mock adapter session snapshot — not a real backend export"
    });
  }

  function importSessionSnapshot(snapshot) {
    if (!snapshot || typeof snapshot !== "object") {
      return { ok: false, message: "invalid snapshot format" };
    }
    if (!snapshot.session || typeof snapshot.session !== "object") {
      return { ok: false, message: "snapshot missing session" };
    }
    var version = (snapshot.meta && snapshot.meta.version) || snapshot.version || SESSION_VERSION;
    if (!version) {
      return { ok: false, message: "snapshot missing version" };
    }
    var mock = global.LQGMockSource;
    var migration = migrateSessionIfNeeded(clone(snapshot.session), mock);
    if (!migration.ok) {
      return { ok: false, message: "migration failed: " + (migration.reason || "unknown") };
    }
    var required = ["reviewRecords", "couponClaims", "activities"];
    for (var i = 0; i < required.length; i += 1) {
      if (!Array.isArray(migration.session[required[i]])) {
        return { ok: false, message: "snapshot missing collection: " + required[i] };
      }
    }
    if (snapshot.checksum) {
      var check = simpleChecksum(JSON.stringify(migration.session));
      if (check !== snapshot.checksum) {
        console.warn("[LQGAdapterSessionStore] checksum mismatch on import");
      }
    }
    global.LQGAdapterSession = migration.session;
    sessionMeta = defaultMeta(Object.assign({}, snapshot.meta || {}, {
      lastImportedAt: nowIso(),
      version: SESSION_VERSION
    }));
    saveSession(global.LQGAdapterSession);
    return {
      ok: true,
      message: "snapshot imported",
      meta: clone(getSessionMeta()),
      session: clone(global.LQGAdapterSession)
    };
  }

  function enablePersistence(mode) {
    persistenceEnabled = true;
    if (mode) persistenceMode = mode;
    setSessionMeta({ persistenceMode: persistenceMode });
    saveSession(getSession(), { silent: true });
    return { ok: true, mode: persistenceMode };
  }

  function disablePersistence() {
    persistenceEnabled = false;
    setSessionMeta({ persistenceMode: "memory" });
    return { ok: true, mode: "memory" };
  }

  function ensureSession(mockSource) {
    return initSession({ mockSource: mockSource || global.LQGMockSource });
  }

  function printSummary() {
    var session = getSession();
    var meta = getSessionMeta();
    var summary = {
      meta: meta,
      counts: {}
    };
    SESSION_COLLECTION_KEYS.forEach(function (key) {
      summary.counts[key] = Array.isArray(session[key]) ? session[key].length : 0;
    });
    if (typeof console !== "undefined" && console.log) {
      console.log("[LQGAdapterSessionDebug] summary", summary);
    }
    return summary;
  }

  var store = {
    SESSION_VERSION: SESSION_VERSION,
    SEED_VERSION: SEED_VERSION,
    SESSION_KEY: SESSION_KEY,
    META_KEY: META_KEY,
    BACKUP_KEY: BACKUP_KEY,
    SESSION_COLLECTION_KEYS: SESSION_COLLECTION_KEYS,
    initFromMock: initFromMock,
    initSession: initSession,
    getSession: getSession,
    saveSession: saveSession,
    persistAfterWrite: persistAfterWrite,
    resetSession: resetSession,
    clearSession: clearSession,
    exportSessionSnapshot: exportSessionSnapshot,
    importSessionSnapshot: importSessionSnapshot,
    getSessionMeta: getSessionMeta,
    migrateSessionIfNeeded: migrateSessionIfNeeded,
    enablePersistence: enablePersistence,
    disablePersistence: disablePersistence,
    ensureSession: ensureSession
  };

  global.LQGAdapterSessionStore = store;

  global.LQGAdapterSessionDebug = {
    getSession: getSession,
    getMeta: getSessionMeta,
    reset: resetSession,
    clear: clearSession,
    export: exportSessionSnapshot,
    import: importSessionSnapshot,
    setMode: function (mode) { return enablePersistence(mode); },
    printSummary: printSummary
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = store;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : global);

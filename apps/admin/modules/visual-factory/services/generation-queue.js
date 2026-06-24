(function (root, factory) {
  var api = factory(root);
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  root.VisualFactoryServices = root.VisualFactoryServices || {};
  root.VisualFactoryServices.generationQueue = api;
})(typeof window !== "undefined" ? window : globalThis, function (root) {
  var storeApi = root.VisualFactoryRuntimeStore || (typeof require === "function" ? require("./runtime-store.js") : null);
  var store = storeApi.createStore("loveqigu_visual_factory_queue_v1", function () {
    return [];
  });

  var STATES = ["DRAFT", "PROMPT_READY", "WAITING_GENERATION", "GENERATED", "REVIEWING", "APPROVED"];

  function makeId(prefix) {
    return [prefix || "vfqueue", Date.now().toString(36), Math.random().toString(36).slice(2, 8)].join("_");
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function clone(value) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  }

  function readItems() {
    return store.ensureSeed() || [];
  }

  function saveItems(items) {
    return store.write(items || []);
  }

  function enqueue(input) {
    var source = input || {};
    var item = {
      id: source.id || makeId("vfqueue"),
      task_id: source.task_id || source.taskId || "",
      prompt_id: source.prompt_id || source.promptId || "",
      status: STATES.indexOf(source.status) >= 0 ? source.status : "DRAFT",
      created_at: source.created_at || nowIso(),
      updated_at: source.updated_at || nowIso(),
      note: source.note || ""
    };
    var items = readItems();
    items.unshift(item);
    saveItems(items);
    return clone(item);
  }

  function list() {
    return readItems()
      .sort(function (a, b) {
        return String(b.created_at || "").localeCompare(String(a.created_at || ""));
      })
      .map(clone);
  }

  function update(id, patch) {
    var itemId = String(id || "");
    var items = readItems();
    var index = items.findIndex(function (item) { return item.id === itemId; });
    if (index < 0) return null;
    var next = Object.assign({}, items[index], patch || {}, { updated_at: nowIso() });
    if (next.status && STATES.indexOf(next.status) < 0) {
      next.status = "DRAFT";
    }
    items[index] = next;
    saveItems(items);
    return clone(next);
  }

  function get(id) {
    var itemId = String(id || "");
    return clone(readItems().find(function (item) { return item.id === itemId; }) || null);
  }

  function findByTaskId(taskId) {
    var id = String(taskId || "");
    return clone(readItems().find(function (item) { return item.task_id === id; }) || null);
  }

  function ensureSeedQueue(task, prompt) {
    if (!task) return null;
    var existing = findByTaskId(task.id);
    if (existing) return existing;
    return enqueue({
      task_id: task.id,
      prompt_id: prompt && prompt.id ? prompt.id : "",
      status: "WAITING_GENERATION",
      note: "Seeded Ancient Tree workflow"
    });
  }

  function resetQueue(items) {
    saveItems(Array.isArray(items) ? items : []);
  }

  return {
    STATES: STATES,
    enqueue: enqueue,
    list: list,
    update: update,
    get: get,
    findByTaskId: findByTaskId,
    ensureSeedQueue: ensureSeedQueue,
    resetQueue: resetQueue
  };
});

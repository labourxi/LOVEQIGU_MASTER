(function (root, factory) {
  var api = factory(root);
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  root.VisualFactoryServices = root.VisualFactoryServices || {};
  root.VisualFactoryServices.visualTaskService = api;
})(typeof window !== "undefined" ? window : globalThis, function (root) {
  var storeApi = root.VisualFactoryRuntimeStore || (typeof require === "function" ? require("./runtime-store.js") : null);
  var store = storeApi.createStore("loveqigu_visual_factory_tasks_v1", function () {
    return [];
  });

  function nowIso() {
    return new Date().toISOString();
  }

  function makeId(prefix) {
    return [prefix || "vtask", Date.now().toString(36), Math.random().toString(36).slice(2, 8)].join("_");
  }

  function readTasks() {
    return store.ensureSeed() || [];
  }

  function saveTasks(tasks) {
    return store.write(tasks || []);
  }

  function clone(value) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  }

  function normalizeTask(input) {
    var source = input || {};
    return {
      id: source.id || makeId("vtask"),
      type: source.type || "landmark_ar",
      explorationPointId: source.explorationPointId || source.exploration_point_id || "",
      title: source.title || "",
      effectType: source.effectType || source.effect_type || "DRAGON_IMPRINT_LITE",
      status: source.status || "draft",
      priority: source.priority || "p0",
      createdAt: source.createdAt || nowIso(),
      updatedAt: source.updatedAt || nowIso(),
      artRequirement: source.artRequirement || null,
      prompt: source.prompt || null,
      queueItemId: source.queueItemId || "",
      outputAssets: source.outputAssets || [],
      notes: source.notes || ""
    };
  }

  function createTask(input) {
    var task = normalizeTask(input);
    var tasks = readTasks();
    tasks.unshift(task);
    saveTasks(tasks);
    return clone(task);
  }

  function listTasks(filters) {
    var query = filters || {};
    return readTasks()
      .filter(function (task) {
        var statusOk = !query.status || query.status === "all" || task.status === query.status;
        var text = [task.title, task.explorationPointId, task.effectType, task.status, task.priority].join(" ").toLowerCase();
        var searchOk = !query.search || text.indexOf(String(query.search).toLowerCase()) >= 0;
        return statusOk && searchOk;
      })
      .sort(function (a, b) {
        return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
      })
      .map(clone);
  }

  function getTask(id) {
    var taskId = String(id || "");
    return clone(readTasks().find(function (task) { return task.id === taskId; }) || null);
  }

  function patchTask(id, patch) {
    var taskId = String(id || "");
    var tasks = readTasks();
    var index = tasks.findIndex(function (task) { return task.id === taskId; });
    if (index < 0) return null;
    var next = Object.assign({}, tasks[index], patch || {}, { updatedAt: nowIso() });
    tasks[index] = next;
    saveTasks(tasks);
    return clone(next);
  }

  function updateTaskStatus(id, status, patch) {
    return patchTask(id, Object.assign({}, patch || {}, { status: status }));
  }

  function ensureSeedTask() {
    var tasks = readTasks();
    var existing = tasks.find(function (task) {
      return task.title === "Ancient Tree" || task.explorationPointId === "ancient_tree";
    });
    if (existing) {
      return clone(existing);
    }
    return createTask({
      title: "Ancient Tree",
      explorationPointId: "ancient_tree",
      effectType: "DRAGON_IMPRINT_LITE",
      status: "draft",
      priority: "p0",
      type: "landmark_ar"
    });
  }

  function resetTasks(nextTasks) {
    saveTasks(Array.isArray(nextTasks) ? nextTasks.map(normalizeTask) : []);
  }

  return {
    createTask: createTask,
    listTasks: listTasks,
    getTask: getTask,
    patchTask: patchTask,
    updateTaskStatus: updateTaskStatus,
    ensureSeedTask: ensureSeedTask,
    resetTasks: resetTasks
  };
});

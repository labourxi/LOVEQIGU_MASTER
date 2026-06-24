(function (root, factory) {
  var api = factory(root);
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  root.VisualFactoryApp = api;
})(typeof window !== "undefined" ? window : globalThis, function (root) {
  var lib = root.AdminComponentLibrary;
  var taskService = (root.VisualFactoryServices && root.VisualFactoryServices.visualTaskService) || null;
  var artGenerator = (root.VisualFactoryServices && root.VisualFactoryServices.artRequirementGenerator) || null;
  var promptGenerator = (root.VisualFactoryServices && root.VisualFactoryServices.promptGenerator) || null;
  var queueService = (root.VisualFactoryServices && root.VisualFactoryServices.generationQueue) || null;
  var board = root.VisualFactoryTaskBoard || null;

  function baseHref() {
    var pathname = (root.location && root.location.pathname) || "";
    var idx = pathname.indexOf("/apps/admin/modules/visual-factory/");
    if (idx >= 0) {
      return pathname.slice(0, idx + "/apps/admin/modules/visual-factory/".length);
    }
    return "./";
  }

  function pagePath(page) {
    var base = baseHref();
    if (page === "home") return base + "index.html";
    return base + "pages/" + page + "/index.html";
  }

  function shell(activeId, subtitle) {
    return {
      topnav: lib.renderTopNav({
        brand: "V",
        title: "Visual Factory L1",
        subtitle: subtitle || "Exploration point -> requirement -> prompt -> queue",
        env: "MOCK",
        user: "visual_operator"
      }),
      sidenav: lib.renderSideNav({
        activeId: activeId,
        sections: [
          {
            title: "Visual Factory",
            items: [
              { id: "home", label: "Home", href: pagePath("home") },
              { id: "task-list", label: "Visual Task List", href: pagePath("task-list") },
              { id: "prompt-preview", label: "Prompt Preview", href: pagePath("prompt-preview") },
              { id: "generation-queue", label: "Generation Queue", href: pagePath("generation-queue") }
            ]
          }
        ]
      })
    };
  }

  function ensureSeedWorkflow() {
    if (!taskService || !artGenerator || !promptGenerator || !queueService) return null;
    var task = taskService.ensureSeedTask();
    if (!task) return null;
    var tasks = taskService.listTasks();
    var seedTask = tasks.find(function (item) {
      return item.id === task.id;
    }) || task;
    var requirement = seedTask.artRequirement || artGenerator.generateArtRequirement(seedTask.explorationPointId || seedTask.title || "Ancient Tree");
    var prompt = seedTask.prompt || promptGenerator.generatePrompt(requirement, { targetModel: "Gemini / 豆包" });
    var queueItem = queueService.findByTaskId(seedTask.id) || queueService.ensureSeedQueue(seedTask, prompt);
    var patch = {};
    if (!seedTask.artRequirement) patch.artRequirement = requirement;
    if (!seedTask.prompt) patch.prompt = prompt;
    if (!seedTask.queueItemId && queueItem) patch.queueItemId = queueItem.id;
    if (!seedTask.outputAssets || !seedTask.outputAssets.length) patch.outputAssets = requirement.assets.slice();
    if (seedTask.status === "draft" || seedTask.status === "prompt_ready") {
      patch.status = "waiting_generation";
    }
    if (Object.keys(patch).length) {
      seedTask = taskService.patchTask(seedTask.id, patch) || seedTask;
    }
    return {
      task: seedTask,
      requirement: requirement,
      prompt: prompt,
      queueItem: queueItem
    };
  }

  function taskListView(context) {
    var allTasks = taskService.listTasks();
    var query = (context.search || "").toLowerCase();
    var status = context.status || "all";
    var filtered = allTasks.filter(function (task) {
      var text = [task.title, task.explorationPointId, task.effectType, task.status].join(" ").toLowerCase();
      var bySearch = !query || text.indexOf(query) >= 0;
      var byStatus = status === "all" || task.status === status;
      return bySearch && byStatus;
    });
    return board.renderTaskTable(filtered, baseHref());
  }

  function taskDetailView(taskId) {
    var task = taskService.getTask(taskId) || ensureSeedWorkflow().task;
    var requirement = task && task.artRequirement ? task.artRequirement : artGenerator.generateArtRequirement(task && task.explorationPointId ? task.explorationPointId : "Ancient Tree");
    var prompt = task && task.prompt ? task.prompt : promptGenerator.generatePrompt(requirement, { targetModel: "Gemini / 豆包" });
    var queueItem = queueService.findByTaskId(task.id) || null;
    return board.renderTaskDetail(task, requirement, prompt, queueItem);
  }

  function promptPreviewView(taskId) {
    var task = taskService.getTask(taskId) || ensureSeedWorkflow().task;
    var requirement = task && task.artRequirement ? task.artRequirement : artGenerator.generateArtRequirement(task && task.explorationPointId ? task.explorationPointId : "Ancient Tree");
    var prompt = task && task.prompt ? task.prompt : promptGenerator.generatePrompt(requirement, { targetModel: "Gemini / 豆包" });
    return (
      '<article class="vf-card">' +
      '<div class="vf-toolbar">' +
      '<div>' +
      '<h3>Prompt Preview</h3>' +
      '<p>执行对象：Gemini / 豆包</p>' +
      '</div>' +
      '<div class="vf-actions">' +
      '<a class="btn" href="' + pagePath("task-detail") + '?taskId=' + encodeURIComponent(task.id) + '">查看需求单</a>' +
      '<a class="btn btn-primary" href="' + pagePath("generation-queue") + '">进入队列</a>' +
      '</div>' +
      '</div>' +
      board.renderPromptPreview(prompt) +
      '</article>'
    );
  }

  function generationQueueView() {
    var items = queueService.list();
    return (
      '<article class="vf-card">' +
      '<div class="vf-toolbar">' +
      '<div>' +
      '<h3>Generation Queue</h3>' +
      '<p>状态流：DRAFT -> PROMPT_READY -> WAITING_GENERATION -> GENERATED -> REVIEWING -> APPROVED</p>' +
      '</div>' +
      '<div class="vf-actions">' +
      '<a class="btn" href="' + pagePath("task-list") + '">回到视觉任务</a>' +
      '</div>' +
      '</div>' +
      board.renderQueuePanel(items, baseHref()) +
      '</article>'
    );
  }

  function homeView() {
    var seeded = ensureSeedWorkflow() || { task: null, requirement: null, prompt: null, queueItem: null };
    var tasks = taskService.listTasks();
    var queue = queueService.list();
    return board.renderHomeBoard({
      tasks: tasks,
      queue: queue,
      seed: seeded,
      baseHref: baseHref(),
      paths: {
        taskList: pagePath("task-list"),
        promptPreview: pagePath("prompt-preview"),
        generationQueue: pagePath("generation-queue")
      }
    });
  }

  function pageHeaderFor(view) {
    var map = {
      home: ["Visual Factory Home", "探索点 -> 自动需求单 -> 自动 Prompt -> 待生图队列"],
      "task-list": ["Visual Task List", "探索点视觉任务列表"],
      "task-detail": ["Visual Task Detail", "需求单 / Prompt / 输出资产 / 队列状态"],
      "prompt-preview": ["Prompt Preview", "面向 Gemini / 豆包 的 Prompt 预览"],
      "generation-queue": ["Generation Queue", "等待生图的队列状态"]
    };
    return map[view] || map.home;
  }

  function render(view, options) {
    var rootEl = options.root;
    var ctx = options.context || {};
    var title = pageHeaderFor(view);
    var content = "";
    if (view === "task-list") {
      content = '<article class="vf-card">' +
        '<div class="vf-toolbar">' +
        '<div><h3>Visual Task List</h3><p>可在此查看探索点视觉任务、Prompt 和待生图状态。</p></div>' +
        '<div class="vf-actions">' +
        '<input class="ad-input ad-input--search" id="vf-search" placeholder="搜索标题 / 探索点 / 效果类型" value="' + esc(ctx.search || "") + '" />' +
        '<select class="ad-select" id="vf-status">' +
        ['all', 'draft', 'prompt_ready', 'waiting_generation', 'generated', 'reviewing', 'approved'].map(function (item) {
          return '<option value="' + item + '"' + (ctx.status === item ? ' selected' : '') + '>' + item + '</option>';
        }).join("") +
        '</select>' +
        '<button class="ad-btn ad-btn--primary" id="vf-refresh" type="button">刷新</button>' +
        '</div></div>' +
        '<div id="vf-task-table">' + taskListView(ctx) + '</div>' +
        '</article>';
    } else if (view === "task-detail") {
      content = '<article class="vf-card">' +
        '<div class="vf-toolbar">' +
        '<div><h3>Visual Task Detail</h3><p>展示需求单、Prompt、输出资产与队列状态。</p></div>' +
        '<div class="vf-actions">' +
        '<a class="btn" href="' + pagePath("task-list") + '">返回列表</a>' +
        '<a class="btn btn-primary" href="' + pagePath("prompt-preview") + '?taskId=' + encodeURIComponent(ctx.taskId || "") + '">预览 Prompt</a>' +
        '</div></div>' +
        '<div id="vf-task-detail">' + taskDetailView(ctx.taskId) + '</div>' +
        '</article>';
    } else if (view === "prompt-preview") {
      content = promptPreviewView(ctx.taskId);
    } else if (view === "generation-queue") {
      content = generationQueueView();
    } else {
      content = homeView();
    }

    rootEl.innerHTML = lib.renderAppShell({
      topNav: shell(view, title[1]).topnav,
      sideNav: shell(view, title[1]).sidenav,
      breadcrumb: { items: [{ label: "Visual Factory" }, { label: title[0] }] },
      content: '<div class="vf-content">' + content + "</div>"
    });
    bindInteractive(view, rootEl);
  }

  function esc(value) {
    return lib.escapeHtml(value === undefined || value === null ? "" : value);
  }

  function bindInteractive(view, rootEl) {
    if (view === "task-list") {
      var search = rootEl.querySelector("#vf-search");
      var status = rootEl.querySelector("#vf-status");
      var refresh = rootEl.querySelector("#vf-refresh");
      function rerender() {
        render(view, {
          root: rootEl,
          context: {
            search: search ? search.value : "",
            status: status ? status.value : "all"
          }
        });
      }
      if (search) search.addEventListener("input", rerender);
      if (status) status.addEventListener("change", rerender);
      if (refresh) refresh.addEventListener("click", rerender);
    }
  }

  function mount(rootEl, options) {
    var target = rootEl || (root.document && root.document.getElementById("app"));
    if (!target) return;
    var body = root.document && root.document.body;
    var view = (options && options.view) || (target.dataset && target.dataset.vfView) || (body && body.dataset && body.dataset.vfView) || "home";
    var ctx = {
      taskId: (options && options.taskId) || (root.location && new URLSearchParams(root.location.search).get("taskId")) || "",
      search: (options && options.search) || "",
      status: (options && options.status) || "all"
    };
    if (!taskService || !artGenerator || !promptGenerator || !queueService || !board) {
      target.innerHTML = '<div class="ad-state ad-state--error"><div class="ad-state__title">Visual Factory services not loaded</div></div>';
      return;
    }
    ensureSeedWorkflow();
    render(view, { root: target, context: ctx });
  }

  function autoBoot() {
    if (!root.document) return;
    var target = root.document.getElementById("app");
    if (!target) return;
    mount(target, {});
  }

  if (root.document) {
    if (root.document.readyState === "loading") {
      root.document.addEventListener("DOMContentLoaded", autoBoot);
    } else {
      autoBoot();
    }
  }

  return {
    mount: mount,
    ensureSeedWorkflow: ensureSeedWorkflow,
    pagePath: pagePath,
    baseHref: baseHref
  };
});

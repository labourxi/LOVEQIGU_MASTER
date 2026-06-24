(function (root, factory) {
  var api = factory(root);
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  root.VisualFactoryTaskBoard = api;
})(typeof window !== "undefined" ? window : globalThis, function (root) {
  var lib = root.AdminComponentLibrary;

  function esc(value) {
    return lib && lib.escapeHtml ? lib.escapeHtml(value) : String(value === undefined || value === null ? "" : value);
  }

  function renderTaskSummary(tasks, queueItems) {
    var list = tasks || [];
    var queue = queueItems || [];
    var created = list.filter(function (task) { return task.status === "draft"; }).length;
    var waiting = queue.filter(function (item) { return item.status === "WAITING_GENERATION"; }).length;
    var generated = queue.filter(function (item) { return item.status === "GENERATED"; }).length;
    var approved = queue.filter(function (item) { return item.status === "APPROVED"; }).length;
    var stats = [
      { label: "Visual Task", value: String(list.length), subtext: "探索点视觉任务" },
      { label: "Draft", value: String(created), subtext: "待拆解需求单" },
      { label: "Waiting", value: String(waiting), subtext: "待生图队列" },
      { label: "Generated", value: String(generated), subtext: "已生图候选" },
      { label: "Approved", value: String(approved), subtext: "已审核通过" }
    ];
    return '<section class="vf-grid vf-grid--4">' + stats.map(function (item) { return lib.renderKpiCard(item); }).join("") + "</section>";
  }

  function renderTaskTable(tasks, actionsBaseHref) {
    var rows = tasks || [];
    return lib.renderTable({
      stickyHeader: true,
      columns: [
        { key: "title", label: "标题" },
        { key: "explorationPointId", label: "探索点" },
        { key: "effectType", label: "效果类型" },
        { key: "status", label: "状态", render: function (row) { return { html: lib.renderStatusBadge({ text: row.status, tone: row.status === "approved" ? "success" : row.status === "waiting_generation" ? "warning" : "neutral" }) }; } },
        { key: "priority", label: "优先级" },
        { key: "createdAt", label: "创建时间" },
        {
          key: "actions",
          label: "操作",
          render: function (row) {
            var base = actionsBaseHref || "";
            return [
              '<a class="ad-btn ad-btn--ghost" href="' + esc(base + 'pages/task-detail/index.html?taskId=' + encodeURIComponent(row.id)) + '">查看</a>',
              '<a class="ad-btn" href="' + esc(base + 'pages/prompt-preview/index.html?taskId=' + encodeURIComponent(row.id)) + '">Prompt</a>'
            ].join(" ");
          }
        }
      ],
      rows: rows
    });
  }

  function renderTaskDetail(task, requirement, prompt, queueItem) {
    var rows = [
      { label: "ID", value: task && task.id },
      { label: "类型", value: task && task.type },
      { label: "探索点", value: task && task.explorationPointId },
      { label: "效果类型", value: task && task.effectType },
      { label: "状态", html: task ? lib.renderStatusBadge({ text: task.status, tone: task.status === "approved" ? "success" : task.status === "waiting_generation" ? "warning" : "neutral" }) : "" },
      { label: "优先级", value: task && task.priority },
      { label: "创建时间", value: task && task.createdAt },
      { label: "队列状态", value: queueItem && queueItem.status }
    ];
    var requirementHtml = requirement ? '<pre class="vf-pre">' + esc(JSON.stringify(requirement, null, 2)) + '</pre>' : '<div class="ad-empty-inline">暂无需求单</div>';
    var promptHtml = prompt ? '<pre class="vf-pre">' + esc(prompt.markdown || prompt.prompt_text || "") + '</pre>' : '<div class="ad-empty-inline">暂无 Prompt</div>';
    var assetsHtml = requirement && requirement.assets ? '<div class="vf-actions">' + requirement.assets.map(function (asset) { return '<span class="vf-pill">' + esc(asset) + '</span>'; }).join("") + "</div>" : '<div class="ad-empty-inline">暂无输出资产</div>';
    return (
      '<section class="vf-grid vf-grid--2">' +
      '<article class="vf-card"><h3>需求单</h3>' + lib.renderDetailRows(rows) + "</article>" +
      '<article class="vf-card"><h3>Prompt</h3>' + promptHtml + "</article>" +
      '</section>' +
      '<section class="vf-grid vf-grid--2">' +
      '<article class="vf-card"><h3>输出资产</h3>' + assetsHtml + "</article>" +
      '<article class="vf-card"><h3>生成队列</h3>' + (queueItem ? lib.renderDetailRows([
        { label: "Queue ID", value: queueItem.id },
        { label: "Task ID", value: queueItem.task_id },
        { label: "Prompt ID", value: queueItem.prompt_id },
        { label: "状态", html: lib.renderStatusBadge({ text: queueItem.status, tone: queueItem.status === "APPROVED" ? "success" : queueItem.status === "WAITING_GENERATION" ? "warning" : "neutral" }) },
        { label: "创建时间", value: queueItem.created_at },
        { label: "更新时间", value: queueItem.updated_at }
      ]) : '<div class="ad-empty-inline">暂无队列项</div>') + "</article>" +
      "</section>"
    );
  }

  function renderPromptPreview(prompt) {
    if (!prompt) return '<div class="ad-empty-inline">暂无 Prompt</div>';
    return '<pre class="vf-pre">' + esc(prompt.markdown || prompt.prompt_text || "") + '</pre>';
  }

  function renderQueuePanel(items, actionsBaseHref) {
    var rows = items || [];
    return lib.renderTable({
      stickyHeader: true,
      columns: [
        { key: "id", label: "Queue ID" },
        { key: "task_id", label: "Task ID" },
        { key: "prompt_id", label: "Prompt ID" },
        { key: "status", label: "状态", render: function (row) { return { html: lib.renderStatusBadge({ text: row.status, tone: row.status === "APPROVED" ? "success" : row.status === "WAITING_GENERATION" ? "warning" : "neutral" }) }; } },
        { key: "created_at", label: "创建时间" },
        { key: "updated_at", label: "更新时间" }
      ],
      rows: rows
    });
  }

  function renderHomeBoard(state) {
    var tasks = state.tasks || [];
    var queue = state.queue || [];
    return (
      '<section class="vf-hero">' +
      '<article class="vf-card">' +
      '<h2>Visual Factory L1</h2>' +
      '<p>探索点 -> 自动需求单 -> 自动 Prompt -> 待生图队列。当前版本仍保留人工提交 Gemini / 豆包 的流程，但消除手工拆单和手工写 Prompt 的重复劳动。</p>' +
      '<div class="vf-actions" style="margin-top:16px;">' +
      '<a class="btn btn-primary" href="' + esc(state.paths.taskList) + '">打开视觉任务</a>' +
      '<a class="btn" href="' + esc(state.paths.promptPreview) + '">预览 Prompt</a>' +
      '<a class="btn" href="' + esc(state.paths.generationQueue) + '">待生图队列</a>' +
      '</div>' +
      '<div class="vf-seed-banner" style="margin-top:16px;">' +
      '<strong>Ancient Tree / DRAGON_IMPRINT_LITE</strong>' +
      '<div>自动测试任务已可生成 art_requirement.json、prompt.md，并进入 WAITING_GENERATION。</div>' +
      '</div>' +
      '</article>' +
      '<aside class="vf-sidebar">' +
      '<div class="vf-stat"><div class="vf-stat__label">Visual Task</div><div class="vf-stat__value">' + tasks.length + '</div><div class="vf-stat__sub">已建任务</div></div>' +
      '<div class="vf-stat"><div class="vf-stat__label">Prompt Ready</div><div class="vf-stat__value">' + (queue.filter(function (item) { return item.status === "WAITING_GENERATION"; }).length) + '</div><div class="vf-stat__sub">待生图队列</div></div>' +
      '<div class="vf-stat"><div class="vf-stat__label">Reviewed</div><div class="vf-stat__value">' + (queue.filter(function (item) { return item.status === "APPROVED"; }).length) + '</div><div class="vf-stat__sub">已审核通过</div></div>' +
      '</aside>' +
      '</section>' +
      '<section class="vf-grid vf-grid--2">' +
      '<article class="vf-card">' + renderTaskTable(tasks.slice(0, 6), state.baseHref || "") + '</article>' +
      '<article class="vf-card"><h3>Generation Queue</h3>' + renderQueuePanel(queue.slice(0, 6), state.baseHref || "") + '</article>' +
      '</section>'
    );
  }

  return {
    renderTaskSummary: renderTaskSummary,
    renderTaskTable: renderTaskTable,
    renderTaskDetail: renderTaskDetail,
    renderPromptPreview: renderPromptPreview,
    renderQueuePanel: renderQueuePanel,
    renderHomeBoard: renderHomeBoard
  };
});

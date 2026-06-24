(function (global) {
  var STORAGE_KEY = "park_admin_operation_logs_v1";
  var DECLARATION_VERSION = "PARK_ACTIVITY_SUBMIT_DECLARATION_V1";
  var OPERATOR = { name: "园区负责人", role: "park_admin", parkName: "爱企谷" };
  var DEFAULT_ACTIVITY = {
    id: "activity_001",
    name: "爱企谷初见寻宝节"
  };

  var SEED_LOGS = [
    {
      logId: "park_log_seed_001",
      timestamp: "2026-06-18 10:20",
      operatorName: "园区负责人",
      operatorRole: "park_admin",
      parkName: "爱企谷",
      activityId: "activity_001",
      activityName: "爱企谷初见寻宝节",
      actionType: "创建活动草稿",
      beforeStatus: "—",
      afterStatus: "草稿",
      declarationAccepted: false,
      declarationVersion: null,
      summary: "创建活动草稿，填写基础信息与关联商家。",
      sourcePage: "park_admin_activity_new",
      deviceInfoPlaceholder: "Mock Browser",
      ipPlaceholder: "Mock IP"
    },
    {
      logId: "park_log_seed_002",
      timestamp: "2026-06-19 14:05",
      operatorName: "园区负责人",
      operatorRole: "park_admin",
      parkName: "爱企谷",
      activityId: "activity_001",
      activityName: "爱企谷初见寻宝节",
      actionType: "提交平台审核",
      beforeStatus: "草稿",
      afterStatus: "待平台审核",
      declarationAccepted: true,
      declarationVersion: DECLARATION_VERSION,
      summary: "已确认提交声明，活动进入平台发布检查流程。",
      sourcePage: "park_admin_activity_publish_check",
      deviceInfoPlaceholder: "Mock Browser",
      ipPlaceholder: "Mock IP"
    },
    {
      logId: "park_log_seed_003",
      timestamp: "2026-06-20 15:30",
      operatorName: "平台内容运营组",
      operatorRole: "platform_reviewer",
      parkName: "爱企谷",
      activityId: "activity_001",
      activityName: "爱企谷初见寻宝节",
      actionType: "平台检查返回",
      beforeStatus: "待平台审核",
      afterStatus: "已阻断",
      declarationAccepted: false,
      declarationVersion: null,
      summary: "礼遇配置审核未完成，返回阻断原因与优化意见。",
      sourcePage: "park_admin_activity_publish_check",
      deviceInfoPlaceholder: "Mock Platform",
      ipPlaceholder: "Mock IP"
    },
    {
      logId: "park_log_seed_004",
      timestamp: "2026-06-15 09:30",
      operatorName: "园区负责人",
      operatorRole: "park_admin",
      parkName: "爱企谷",
      activityId: "activity_001",
      activityName: "爱企谷初见寻宝节",
      actionType: "提交工单咨询",
      beforeStatus: "已阻断",
      afterStatus: "已阻断",
      declarationAccepted: false,
      declarationVersion: null,
      summary: "咨询活动发布审核进度，关联活动：爱企谷初见寻宝节。",
      sourcePage: "park_admin_tickets",
      deviceInfoPlaceholder: "Mock Browser",
      ipPlaceholder: "Mock IP"
    }
  ];

  function readAll() {
    try {
      var raw = global.localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return null;
  }

  function writeAll(logs) {
    try {
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch (e) { /* ignore */ }
  }

  function ensureSeed() {
    var logs = readAll();
    if (!logs || !logs.length) {
      writeAll(SEED_LOGS.slice());
      return SEED_LOGS.slice();
    }
    return logs;
  }

  function nextId() {
    return "park_log_" + Date.now();
  }

  function nowTimestamp() {
    var d = new Date();
    var pad = function (n) { return n < 10 ? "0" + n : String(n); };
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) +
      " " + pad(d.getHours()) + ":" + pad(d.getMinutes());
  }

  function appendLog(entry) {
    var logs = ensureSeed();
    var log = Object.assign({
      logId: nextId(),
      timestamp: nowTimestamp(),
      operatorName: OPERATOR.name,
      operatorRole: OPERATOR.role,
      parkName: OPERATOR.parkName,
      activityId: DEFAULT_ACTIVITY.id,
      activityName: DEFAULT_ACTIVITY.name,
      declarationAccepted: false,
      declarationVersion: null,
      deviceInfoPlaceholder: "Mock Browser",
      ipPlaceholder: "Mock IP"
    }, entry);
    logs.unshift(log);
    writeAll(logs);
    return log;
  }

  function getLogs(filter) {
    var logs = ensureSeed();
    if (!filter) return logs;
    if (filter.activityId) {
      logs = logs.filter(function (l) { return l.activityId === filter.activityId; });
    }
    if (filter.sourcePage) {
      logs = logs.filter(function (l) { return l.sourcePage === filter.sourcePage; });
    }
    if (filter.actionTypes) {
      logs = logs.filter(function (l) {
        return filter.actionTypes.indexOf(l.actionType) >= 0;
      });
    }
    if (filter.limit) logs = logs.slice(0, filter.limit);
    return logs;
  }

  function formatLogLine(log) {
    var statusPart = log.beforeStatus + " → " + log.afterStatus;
    if (log.beforeStatus === log.afterStatus) statusPart = log.afterStatus;
    return log.timestamp + "｜" + log.operatorName + "｜" + log.actionType + "｜" + statusPart;
  }

  function renderTimeline(container, logs, options) {
    if (!container) return;
    options = options || {};
    if (!logs.length) {
      container.innerHTML = '<p class="text-muted" style="margin:0;">暂无操作记录</p>';
      return;
    }
    container.innerHTML = logs.map(function (log) {
      return (
        '<div class="bo-audit-log-item">' +
          '<div class="bo-log-meta">' + formatLogLine(log) + "</div>" +
          '<div class="bo-log-summary">' + log.summary + "</div>" +
          (log.declarationAccepted && log.declarationVersion
            ? '<div class="bo-log-meta">声明确认：' + log.declarationVersion + "</div>"
            : "") +
        "</div>"
      );
    }).join("");
  }

  global.ParkOperationLog = {
    DECLARATION_VERSION: DECLARATION_VERSION,
    DEFAULT_ACTIVITY: DEFAULT_ACTIVITY,
    ensureSeed: ensureSeed,
    appendLog: appendLog,
    getLogs: getLogs,
    formatLogLine: formatLogLine,
    renderTimeline: renderTimeline
  };
})(window);

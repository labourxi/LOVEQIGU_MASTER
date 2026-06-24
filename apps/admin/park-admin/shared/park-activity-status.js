(function (global) {
  var PRE_LAUNCH_CODES = {
    DRAFT: true,
    PENDING_SUBMIT: true,
    PENDING: true,
    PENDING_REVIEW: true,
    NEED_INFO: true,
    BLOCKED: true,
    PENDING_SUPPLEMENT: true,
    PENDING_PUBLISH: true
  };

  var PRE_LAUNCH_LABELS = {
    "草稿": true,
    "待提交": true,
    "待处理": true,
    "待审核": true,
    "待平台审核": true,
    "已阻断": true,
    "待补充": true,
    "待发布": true
  };

  var ACTIVE_CODES = { ACTIVE: true, PUBLISHED: true, RELEASED: true };
  var ACTIVE_LABELS = { "进行中": true, "已发布": true };

  function normalizeStatus(status) {
    return status ? String(status).trim() : "";
  }

  function isPreLaunch(status) {
    var s = normalizeStatus(status);
    if (!s) return false;
    if (PRE_LAUNCH_CODES[s]) return true;
    if (PRE_LAUNCH_LABELS[s]) return true;
    return false;
  }

  function isActive(status) {
    var s = normalizeStatus(status);
    if (!s) return false;
    if (ACTIVE_CODES[s]) return true;
    if (ACTIVE_LABELS[s]) return true;
    return false;
  }

  function shouldShowPublishCheck(status) {
    return isPreLaunch(status);
  }

  function publishCheckLabel(status) {
    return shouldShowPublishCheck(status) ? "发布检查" : "查看历史检查结论";
  }

  function publishCheckHref(status, baseHref) {
    baseHref = baseHref || "../park_admin_activity_publish_check/index.html";
    if (shouldShowPublishCheck(status)) {
      return baseHref + "?mode=review";
    }
    return baseHref + "?mode=history";
  }

  global.ParkActivityStatus = {
    isPreLaunch: isPreLaunch,
    isActive: isActive,
    shouldShowPublishCheck: shouldShowPublishCheck,
    publishCheckLabel: publishCheckLabel,
    publishCheckHref: publishCheckHref,
    PRE_LAUNCH_CODES: PRE_LAUNCH_CODES,
    ACTIVE_CODES: ACTIVE_CODES
  };
})(window);

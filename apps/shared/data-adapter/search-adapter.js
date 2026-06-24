(function (global) {
  var MAX_DEFAULT = 8;
  var EMPTY_RESULT_MSG = "未找到相关结果，请尝试输入景区、商家、活动、卡券、探索点、信物或 AR 内容名称。";

  function getDeps() { return global.LQGMockSource; }
  function fmt(s, d) { return (global.LQGStatusMap && global.LQGStatusMap.formatStatus(s, d)) || { label: s }; }

  function buildIndex() {
    var mock = getDeps();
    var items = [];

    mock.parks.forEach(function (p) {
      items.push({
        id: p.id, type: "scenic", typeLabel: "景区", title: p.name,
        subtitle: "活动 " + p.activityCount + " · 商家 " + p.merchantCount,
        status: p.status, statusLabel: fmt(p.status, "generic").label,
        actionLabel: p.id === "park_001" ? "进入园区视图" : "查看景区",
        targetUrl: p.id === "park_001"
          ? "apps/admin/park-admin/park_admin_dashboard/index.html?asPlatform=1&parkId=" + p.id
          : "apps/admin/platform-admin/parks/index.html?parkId=" + p.id
      });
    });

    mock.merchants.forEach(function (m) {
      items.push({
        id: m.id, type: "merchant", typeLabel: "商家", title: m.name,
        subtitle: "所属景区：" + ((mock.get("parks", m.parkId) || {}).name || "—"),
        status: m.accountStatus, statusLabel: fmt(m.accountStatus, "generic").label,
        actionLabel: "查看商家",
        targetUrl: "apps/admin/park-admin/park_admin_merchants/index.html?asPlatform=1&parkId=" + m.parkId + "&merchantId=" + m.id
      });
    });

    mock.activities.forEach(function (a) {
      items.push({
        id: a.id, type: "activity", typeLabel: "活动", title: a.name,
        subtitle: "所属景区：" + ((mock.get("parks", a.parkId) || {}).name || "—"),
        status: a.status, statusLabel: fmt(a.status, "activity").label,
        actionLabel: "查看活动",
        targetUrl: "apps/admin/platform-admin/activities/index.html?activityId=" + a.id
      });
    });

    mock.coupons.forEach(function (c) {
      var merchant = mock.get("merchants", c.merchantId);
      items.push({
        id: c.id, type: "coupon", typeLabel: "卡券", title: c.name,
        subtitle: (merchant ? merchant.name : "—") + " · 领取 " + c.claimedCount + " · 核销 " + c.redeemedCount,
        status: c.status, statusLabel: fmt(c.status, "coupon").label,
        actionLabel: "查看卡券",
        targetUrl: "apps/admin/platform-admin/coupons/index.html?couponId=" + c.id
      });
    });

    mock.explorationPoints.forEach(function (p) {
      var act = mock.get("activities", p.activityId);
      items.push({
        id: p.id, type: "exploration_point", typeLabel: "探索点", title: p.name,
        subtitle: (act ? act.name : "—") + (p.relicId && p.arContentId ? " · 已绑定信物 / AR" : ""),
        status: p.status, statusLabel: fmt(p.status, "content").label,
        actionLabel: "查看探索点",
        targetUrl: "apps/admin/platform-admin/platform_exploration_points/index.html?pointId=" + p.id
      });
    });

    mock.relics.forEach(function (r) {
      var point = mock.get("explorationPoints", r.explorationPointId);
      items.push({
        id: r.id, type: "relic", typeLabel: "信物", title: r.name,
        subtitle: point ? point.name : "—",
        status: r.reviewStatus, statusLabel: fmt(r.reviewStatus, "review").label,
        actionLabel: "查看信物",
        targetUrl: "apps/admin/platform-admin/platform_relics/index.html?relicId=" + r.id
      });
    });

    mock.blessingContents.forEach(function (b) {
      items.push({
        id: b.id, type: "blessing", typeLabel: "祝福内容", title: b.title,
        subtitle: b.contentType + " · " + ((mock.get("explorationPoints", b.explorationPointId) || {}).name || "—"),
        status: b.reviewStatus, statusLabel: fmt(b.reviewStatus, "review").label,
        actionLabel: "查看祝福",
        targetUrl: "apps/admin/platform-admin/platform_blessing_content/index.html?contentId=" + b.id
      });
    });

    mock.arContents.forEach(function (a) {
      var point = mock.get("explorationPoints", a.explorationPointId);
      var relic = mock.get("relics", a.relicId);
      items.push({
        id: a.id, type: "ar_content", typeLabel: "AR内容", title: a.name,
        subtitle: (point ? point.name : "—") + " / " + (relic ? relic.name : "—"),
        status: a.publishStatus, statusLabel: fmt(a.publishStatus, "publish").label,
        actionLabel: "查看AR",
        targetUrl: "apps/admin/platform-admin/platform_ar_content/index.html?arId=" + a.id
      });
    });

    mock.artRequests.forEach(function (a) {
      items.push({
        id: a.id, type: "art_request", typeLabel: "美术需求单", title: a.title,
        subtitle: a.assetType + " · " + a.id,
        status: a.status, statusLabel: fmt(a.status, "content").label,
        actionLabel: "查看需求",
        targetUrl: "apps/admin/platform-admin/platform_art_requests/index.html?requestId=" + a.id
      });
    });

    return items;
  }

  function searchGlobal(keyword, options) {
    var q = (keyword || "").trim().toLowerCase();
    var limit = (options && options.limit) || MAX_DEFAULT;
    var expandAll = options && options.expandAll;

    if (!q) {
      return { items: [], total: 0, empty: true, emptyMessage: "请输入景区、商家、活动、卡券、探索点、信物或 AR 内容关键词。" };
    }

    var all = buildIndex().filter(function (item) {
      var hay = (item.title + " " + item.subtitle + " " + item.typeLabel + " " + item.statusLabel).toLowerCase();
      return hay.indexOf(q) >= 0;
    });

    if (!all.length) {
      return { items: [], total: 0, empty: true, emptyMessage: EMPTY_RESULT_MSG };
    }

    return {
      items: expandAll ? all : all.slice(0, limit),
      total: all.length,
      empty: false,
      hasMore: all.length > limit && !expandAll
    };
  }

  var adapter = { searchGlobal: searchGlobal, buildIndex: buildIndex, MAX_DEFAULT: MAX_DEFAULT };

  if (typeof module !== "undefined" && module.exports) module.exports = adapter;
  global.LQGSearchAdapter = adapter;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : global);

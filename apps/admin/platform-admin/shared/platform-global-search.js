(function (global) {
  var INDEX = [
    { type: "景区", typeKey: "scenic", id: "park_001", name: "爱企谷", meta: "活动 5 · 商家 28", status: "合作中", href: "../../park-admin/park_admin_dashboard/index.html?asPlatform=1&parkId=park_001", action: "进入园区视图" },
    { type: "景区", typeKey: "scenic", id: "park_002", name: "爱企谷湖畔景区", meta: "活动 2 · 商家 5", status: "合作中", href: "../../park-admin/park_admin_dashboard/index.html?asPlatform=1&parkId=park_002", action: "进入园区视图" },
    { type: "景区", typeKey: "scenic", id: "park_003", name: "爱企谷森林景区", meta: "活动 1 · 商家 3", status: "未启用", href: "../parks/index.html?parkId=park_003", action: "查看景区" },
    { type: "景区", typeKey: "scenic", id: "park_004", name: "爱企谷夜游景区", meta: "活动 0 · 商家 4", status: "待配置", href: "../parks/index.html?parkId=park_004", action: "查看景区" },
    { type: "商家", typeKey: "merchant", id: "merchant_001", name: "爱企谷咖啡", meta: "所属景区：爱企谷 · 核销率 38%", status: "合作中", href: "../../park-admin/park_admin_merchants/index.html?asPlatform=1&parkId=park_001&merchantId=merchant_001", action: "查看商家" },
    { type: "商家", typeKey: "merchant", id: "merchant_002", name: "探索书屋", meta: "所属景区：爱企谷 · 核销率 14%", status: "需关注", href: "../../park-admin/park_admin_merchants/index.html?asPlatform=1&parkId=park_001&merchantId=merchant_002", action: "查看商家" },
    { type: "商家", typeKey: "merchant", id: "merchant_003", name: "在地茶舍", meta: "所属景区：爱企谷 · 核销率 0%", status: "未活跃", href: "../../park-admin/park_admin_merchants/index.html?asPlatform=1&parkId=park_001&merchantId=merchant_003", action: "查看商家" },
    { type: "商家", typeKey: "merchant", id: "merchant_004", name: "爱企谷手作馆", meta: "所属景区：爱企谷 · 核销率 26%", status: "合作中", href: "../../park-admin/park_admin_merchants/index.html?asPlatform=1&parkId=park_001&merchantId=merchant_004", action: "查看商家" },
    { type: "活动", typeKey: "activity", id: "activity_001", name: "爱企谷初见寻宝节", meta: "所属景区：爱企谷", status: "进行中", href: "../activities/index.html?activityId=activity_001", action: "查看活动" },
    { type: "活动", typeKey: "activity", id: "activity_002", name: "爱企谷夏日探索", meta: "所属景区：爱企谷", status: "待审查", href: "../activities/index.html?activityId=activity_002", action: "查看活动" },
    { type: "活动", typeKey: "activity", id: "activity_003", name: "湖畔夜游节", meta: "所属景区：爱企谷湖畔", status: "待发布", href: "../activities/index.html?activityId=activity_003", action: "查看活动" },
    { type: "活动", typeKey: "activity", id: "activity_004", name: "森林寻踪活动", meta: "所属景区：爱企谷森林", status: "草稿", href: "../activities/index.html?activityId=activity_004", action: "查看活动" },
    { type: "卡券", typeKey: "coupon", id: "coupon_001", name: "咖啡到店礼", meta: "爱企谷咖啡 · 领取 312 · 核销 118", status: "已发布", href: "../coupons/index.html?couponId=coupon_001", action: "查看卡券" },
    { type: "卡券", typeKey: "coupon", id: "coupon_002", name: "书店阅读体验券", meta: "探索书屋 · 领取 86 · 核销 12", status: "需关注", href: "../coupons/index.html?couponId=coupon_002", action: "查看卡券" },
    { type: "卡券", typeKey: "coupon", id: "coupon_003", name: "手作体验券", meta: "爱企谷手作馆 · 领取 90 · 核销 24", status: "已发布", href: "../coupons/index.html?couponId=coupon_003", action: "查看卡券" },
    { type: "卡券", typeKey: "coupon", id: "coupon_004", name: "茶饮礼遇券", meta: "在地茶舍 · 领取 24 · 核销 0", status: "需关注", href: "../coupons/index.html?couponId=coupon_004", action: "查看卡券" },
    { type: "探索点", typeKey: "exploration_point", id: "ep_001", name: "入口广场", meta: "爱企谷初见寻宝节 · 已绑定信物 / AR", status: "待发布", href: "../platform_exploration_points/index.html?pointId=ep_001", action: "查看探索点" },
    { type: "探索点", typeKey: "exploration_point", id: "ep_002", name: "咖啡角", meta: "爱企谷初见寻宝节 · 祝福待补", status: "草稿", href: "../platform_exploration_points/index.html?pointId=ep_002", action: "查看探索点" },
    { type: "信物", typeKey: "relic", id: "relic_001", name: "初见印记", meta: "入口广场", status: "待审查", href: "../platform_relics/index.html?relicId=relic_001", action: "查看信物" },
    { type: "信物", typeKey: "relic", id: "relic_002", name: "咖啡回响", meta: "咖啡角", status: "草稿", href: "../platform_relics/index.html?relicId=relic_002", action: "查看信物" },
    { type: "祝福内容", typeKey: "blessing", id: "bless_001", name: "入口显现祝福", meta: "显现文案 · 入口广场 · 初见印记", status: "待审查", href: "../platform_blessing_content/index.html?contentId=bless_001", action: "查看祝福" },
    { type: "祝福内容", typeKey: "blessing", id: "bless_002", name: "咖啡角领取提示", meta: "领取提示 · 咖啡角", status: "草稿", href: "../platform_blessing_content/index.html?contentId=bless_002", action: "查看祝福" },
    { type: "AR内容", typeKey: "ar_content", id: "ar_001", name: "入口显现仪式", meta: "入口广场 / 初见印记", status: "待发布", href: "../platform_ar_content/index.html?arId=ar_001", action: "查看AR" },
    { type: "AR内容", typeKey: "ar_content", id: "ar_002", name: "咖啡角 AR 扫描", meta: "咖啡角 / 咖啡回响", status: "待生成", href: "../platform_ar_content/index.html?arId=ar_002", action: "查看AR" },
    { type: "美术需求单", typeKey: "art_request", id: "art_001", name: "初见印记视觉", meta: "信物视觉 · ART-2026-001", status: "待审查", href: "../platform_art_requests/index.html?requestId=art_001", action: "查看需求" },
    { type: "美术需求单", typeKey: "art_request", id: "art_002", name: "咖啡角探索点视觉", meta: "探索点视觉 · ART-2026-002", status: "生成中", href: "../platform_art_requests/index.html?requestId=art_002", action: "查看需求" }
  ];

  var MAX_RESULTS = 8;
  var EMPTY_HINT = "请输入景区、商家、活动、卡券、探索点、信物、AR 内容、美术需求或生成任务关键词。";
  var EMPTY_RESULT = "未找到相关结果，请尝试输入景区、商家、活动、探索点、信物、AR 内容、美术需求或生成任务名称。";

  function matchAll(query) {
    var q = (query || "").trim().toLowerCase();
    if (q.length < 1) return [];
    var index = INDEX.slice();
    if (global.LQGContentProductionAdapter && global.LQGContentProductionAdapter.buildSearchIndex) {
      index = index.concat(global.LQGContentProductionAdapter.buildSearchIndex());
    }
    return index.filter(function (item) {
      var hay = (item.name + " " + item.meta + " " + item.type + " " + item.status + " " + item.action).toLowerCase();
      return hay.indexOf(q) >= 0;
    });
  }

  function search(query) {
    return matchAll(query).slice(0, MAX_RESULTS);
  }

  function renderItem(item) {
    return (
      '<a class="bo-global-search-item" href="' + item.href + '" role="option">' +
        '<div class="bo-global-search-item__head">' +
          '<span class="bo-global-search-type">' + item.type + "</span>" +
          '<span class="bo-global-search-title">' + item.name + "</span>" +
        "</div>" +
        '<div class="bo-global-search-meta">' + item.meta + " · " + item.status + ' · <span class="bo-global-search-action">' + item.action + "</span></div>" +
      "</a>"
    );
  }

  function renderPanel(results, totalCount, expanded) {
    if (!results.length) {
      return '<div class="bo-global-search-empty">' + EMPTY_RESULT + "</div>";
    }
    var html = results.map(renderItem).join("");
    if (!expanded && totalCount > MAX_RESULTS) {
      html += '<button type="button" class="bo-global-search-more" id="bo-global-search-more">查看更多结果（' + totalCount + "）</button>";
    }
    return html;
  }

  function bind() {
    var root = document.getElementById("bo-global-search");
    var input = document.getElementById("bo-global-search-input");
    var button = document.getElementById("bo-global-search-button");
    var panel = document.getElementById("bo-global-search-panel");
    if (!input || !panel || !button) return;

    var expanded = false;

    function hidePanel() {
      panel.classList.add("hidden");
      expanded = false;
    }

    function showPanel() {
      panel.classList.remove("hidden");
    }

    function runSearch(fromButton) {
      var q = input.value.trim();
      if (!q) {
        if (fromButton) {
          panel.innerHTML = '<div class="bo-global-search-hint">' + EMPTY_HINT + "</div>";
          showPanel();
        } else {
          hidePanel();
        }
        return;
      }
      var all = matchAll(q);
      var visible = expanded ? all : all.slice(0, MAX_RESULTS);
      panel.innerHTML = renderPanel(visible, all.length, expanded);
      showPanel();
      var moreBtn = document.getElementById("bo-global-search-more");
      if (moreBtn) {
        moreBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          expanded = true;
          runSearch(false);
        });
      }
    }

    input.addEventListener("input", function () {
      expanded = false;
      var q = input.value.trim();
      if (!q) {
        hidePanel();
        return;
      }
      if (q.length >= 1) runSearch(false);
    });

    input.addEventListener("focus", function () {
      if (input.value.trim()) runSearch(false);
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        expanded = false;
        runSearch(true);
      }
      if (e.key === "Escape") {
        hidePanel();
        input.blur();
      }
    });

    button.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      expanded = false;
      runSearch(true);
      input.focus();
    });

    document.addEventListener("click", function (e) {
      if (!e.target.closest("#bo-global-search")) hidePanel();
    });
    panel.addEventListener("click", function (e) { e.stopPropagation(); });
  }

  global.PlatformGlobalSearch = {
    INDEX: INDEX,
    search: search,
    matchAll: matchAll,
    bind: bind
  };
})(window);

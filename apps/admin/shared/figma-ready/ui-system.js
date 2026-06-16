(function (global) {
  var L = global.AdminComponentLibrary;
  if (!L) return;

  function badge(tone, text) {
    return L.renderStatusBadge({ tone: tone, text: text });
  }

  var PLATFORM_NAV = {
    activeId: "dashboard",
    sections: [
      { title: "总览", items: [{ id: "dashboard", label: "运营总览", href: "./page-assembly.html" }] },
      { title: "审核发布", items: [
        { id: "reviews", label: "审核中心", href: "./review-center.html" },
        { id: "publish", label: "发布中心", href: "#" }
      ]},
      { title: "配置", items: [
        { id: "parks", label: "景区管理", href: "#" },
        { id: "merchants", label: "商家管理", href: "#" },
        { id: "coupons", label: "卡券中心", href: "./coupon-center.html" },
        { id: "activities", label: "活动管理", href: "#" }
      ]},
      { title: "服务", items: [
        { id: "tickets", label: "工单中心", href: "#" },
        { id: "training", label: "培训中心", href: "#" }
      ]},
      { title: "系统", items: [{ id: "settings", label: "系统设置", href: "#" }] }
    ]
  };

  var TOP_NAV = {
    brand: "游",
    title: "AR游伴 · 平台运营",
    subtitle: "预发环境 · Figma Ready UI System",
    env: "预发",
    user: "运营管理员",
    actions: [
      { label: "组件总览", href: "./overview.html" },
      { label: "退出", variant: "ghost" }
    ]
  };

  var REVIEW_ROWS = [
    { name: "爱企谷咖啡", submitter: "商家", status: badge("warning", "待审核"), time: "2026-06-15 09:00" },
    { name: "爱企谷书店", submitter: "商家", status: badge("success", "已通过"), time: "2026-06-14 10:30" },
    { name: "爱企谷到店核销券", submitter: "爱企谷咖啡", status: badge("warning", "待审核"), time: "2026-06-15 10:00" },
    { name: "书店阅读体验券", submitter: "爱企谷书店", status: badge("success", "已通过"), time: "2026-06-14 09:00" },
    { name: "爱企谷初见寻宝节", submitter: "爱企谷", status: badge("warning", "待审核"), time: "2026-06-15 11:00" },
    { name: "爱企谷夏日探索", submitter: "爱企谷", status: badge("success", "已通过"), time: "2026-06-10 09:00" }
  ];

  var COUPON_ROWS = [
    { name: "爱企谷到店核销券", merchant: "爱企谷咖啡", type: "兑换券", stock: "500", status: badge("warning", "待审核") },
    { name: "书店阅读体验券", merchant: "爱企谷书店", type: "礼遇券", stock: "200", status: badge("success", "已通过") },
    { name: "手作体验折扣券", merchant: "爱企谷手作馆", type: "折扣券", stock: "100", status: badge("danger", "已驳回") },
    { name: "初见到店礼", merchant: "爱企谷咖啡", type: "兑换券", stock: "1000", status: badge("success", "已通过") },
    { name: "园区联票体验券", merchant: "爱企谷", type: "兑换券", stock: "300", status: badge("success", "已通过") },
    { name: "阅读沙龙礼遇", merchant: "爱企谷书店", type: "礼遇券", stock: "80", status: badge("neutral", "草稿") }
  ];

  function platformShell(activeId, content) {
    var nav = JSON.parse(JSON.stringify(PLATFORM_NAV));
    nav.activeId = activeId;
    return L.renderAppShell({
      topNav: TOP_NAV,
      sideNav: nav,
      breadcrumb: { items: [{ label: "平台运营" }, { label: content.crumb || "" }] },
      content: content.html
    });
  }

  function buildDashboardPage() {
    return platformShell("dashboard", {
      crumb: "运营总览",
      html:
        L.renderPageHeader({
          title: "运营总览",
          description: "全平台商家、卡券、活动与审核状态 · 2026-06-20",
          actions: [{ label: "导出报告", variant: "primary" }]
        }) +
        '<div class="ad-grid ad-grid--12">' +
          '<div class="ad-span-3">' + L.renderKpiCard({ label: "待审核", value: "4", valueTone: "warning", subtext: "需尽快处理" }) + '</div>' +
          '<div class="ad-span-3">' + L.renderKpiCard({ label: "今日通过", value: "2", subtext: "较昨日 +1" }) + '</div>' +
          '<div class="ad-span-3">' + L.renderKpiCard({ label: "活跃活动", value: "3", valueTone: "success", subtext: "进行中" }) + '</div>' +
          '<div class="ad-span-3">' + L.renderKpiCard({ label: "入驻商家", value: "8", subtext: "2 个景区" }) + '</div>' +
          '<div class="ad-span-8"><section class="ad-surface"><h3 class="ad-card-title">近 7 日审核趋势</h3><div class="ad-chart-placeholder">折线图占位 · 单色赭石 #5C4033</div></section></div>' +
          '<div class="ad-span-4"><section class="ad-surface"><h3 class="ad-card-title">快捷入口</h3><div style="display:flex;flex-direction:column;gap:8px">' +
            L.renderButton({ label: "进入审核中心", variant: "primary", block: true, href: "./review-center.html" }) +
            L.renderButton({ label: "进入发布中心", block: true }) +
            L.renderButton({ label: "查看工单", block: true }) +
          '</div></section></div>' +
          '<div class="ad-span-12"><section class="ad-surface"><h3 class="ad-card-title">待办提醒</h3>' +
            L.renderTable({
              columns: [
                { key: "type", label: "类型" },
                { key: "name", label: "名称" },
                { key: "status", label: "状态" },
                { key: "time", label: "提交时间" },
                { key: "actions", label: "操作", render: function () { return L.renderButton({ label: "处理", variant: "ghost" }); } }
              ],
              rows: [
                { type: "商家审核", name: "爱企谷咖啡", status: badge("warning", "待审核"), time: "06-15 09:00" },
                { type: "卡券审核", name: "到店核销券", status: badge("warning", "待审核"), time: "06-15 10:00" },
                { type: "活动审核", name: "初见寻宝节", status: badge("warning", "待审核"), time: "06-15 11:00" }
              ]
            }) +
          '</section></div></div>'
    });
  }

  function buildReviewCenterPage() {
    return platformShell("reviews", {
      crumb: "审核中心",
      html:
        L.renderPageHeader({ title: "审核中心", description: "商家 · 卡券 · 活动审核" }) +
        L.renderTabBar({ activeId: "merchant", tabs: [
          { id: "merchant", label: "商家审核" },
          { id: "coupon", label: "卡券审核" },
          { id: "activity", label: "活动审核" }
        ]}) +
        L.renderFilterBar({
          chips: [
            { label: "全部", active: true },
            { label: "待审核" },
            { label: "已通过" },
            { label: "已驳回" }
          ],
          controls: [{ type: "search", placeholder: "搜索名称 / 提交方" }]
        }) +
        L.renderTable({
          stickyHeader: true,
          columns: [
            { key: "name", label: "名称" },
            { key: "submitter", label: "提交方" },
            { key: "status", label: "状态", width: "100px" },
            { key: "time", label: "提交时间", width: "160px" },
            { key: "actions", label: "操作", width: "80px", render: function () { return L.renderButton({ label: "查看", variant: "ghost" }); } }
          ],
          rows: REVIEW_ROWS
        }) +
        L.renderPagination({ total: 24, page: 1, totalPages: 2, pageSize: 20 }) +
        '<div style="margin-top:24px">' +
          L.renderDrawer({
            open: true,
            title: "审核详情 · 爱企谷咖啡",
            fields: [
              { label: "审核单号", value: "mrev_001" },
              { label: "商家名称", value: "爱企谷咖啡" },
              { label: "状态", html: badge("warning", "待审核") },
              { label: "提交时间", value: "2026-06-15 09:00" },
              { label: "审核意见", value: "—" }
            ],
            actions: [
              { label: "驳回", variant: "danger" },
              { label: "通过", variant: "success" }
            ]
          }) +
        '</div>'
    });
  }

  function buildCouponCenterPage() {
    return platformShell("coupons", {
      crumb: "卡券中心",
      html:
        L.renderPageHeader({
          title: "卡券中心",
          description: "全平台卡券配置与审核状态",
          actions: [{ label: "新建卡券", variant: "primary" }]
        }) +
        L.renderFilterBar({
          controls: [
            { type: "search", placeholder: "搜索卡券名称" },
            { label: "商家", type: "select", options: ["全部商家", "爱企谷咖啡", "爱企谷书店"] },
            { label: "状态", type: "select", options: ["全部状态", "待审核", "已通过", "已驳回"] }
          ],
          actions: [{ label: "重置", variant: "ghost" }]
        }) +
        L.renderTable({
          density: "comfortable",
          stickyHeader: true,
          columns: [
            { key: "name", label: "卡券名称" },
            { key: "merchant", label: "所属商家" },
            { key: "type", label: "类型", width: "88px" },
            { key: "stock", label: "库存", align: "right", width: "80px" },
            { key: "status", label: "审核状态", width: "96px" },
            { key: "actions", label: "操作", width: "120px", render: function (row) {
              return L.renderButton({ label: row.status.indexOf("待审核") >= 0 ? "审核" : "详情", variant: "ghost" });
            }}
          ],
          rows: COUPON_ROWS
        }) +
        L.renderPagination({ total: 128, page: 1, totalPages: 7, pageSize: 20 })
    });
  }

  function buildOverviewPage() {
    var sections = [
      { title: "Design Tokens · Colors", desc: "纸白 · 墨 · 赭石 · 语义色", html:
        '<div class="ad-gallery-row">' +
        ["#F7F5F0", "#FFFFFF", "#2B2118", "#5C4033", "#2C7A4B", "#B26B1B", "#A4412B", "#4A6670"].map(function (c) {
          return '<div><div class="ad-token-swatch" style="background:' + c + '"></div><div class="ad-token-label">' + c + '</div></div>';
        }).join('') + '</div>' },
      { title: "TopNav", desc: "高度 56px · sticky", html: L.renderTopNav(TOP_NAV) },
      { title: "SideNav", desc: "宽度 240px · Active 左 3px 赭石线", html: L.renderSideNav(PLATFORM_NAV) },
      { title: "PageHeader + Breadcrumb", desc: "H1 24px · 描述 14px secondary", html:
        L.renderBreadcrumb({ items: [{ label: "平台运营" }, { label: "组件总览" }] }) +
        L.renderPageHeader({ title: "组件总览", description: "Figma Ready · ADMIN_COMPONENT_LIBRARY_V1", actions: [{ label: "主操作", variant: "primary" }, { label: "次操作" }] }) },
      { title: "KpiCard", desc: "min-h 96px · KPI 28px tabular", html:
        '<div class="ad-grid ad-grid--12"><div class="ad-span-3">' + L.renderKpiCard({ label: "待审核", value: "4", valueTone: "warning" }) + '</div><div class="ad-span-3">' + L.renderKpiCard({ label: "今日核销", value: "18" }) + '</div></div>' },
      { title: "Button", desc: "圆角 8px · 默认/主/幽灵/成功/危险", html:
        '<div class="ad-gallery-row">' +
        L.renderButton({ label: "默认" }) + L.renderButton({ label: "主按钮", variant: "primary" }) +
        L.renderButton({ label: "幽灵", variant: "ghost" }) + L.renderButton({ label: "成功", variant: "success" }) +
        L.renderButton({ label: "危险", variant: "danger" }) + L.renderButton({ label: "大号主按钮", variant: "primary", size: "lg" }) +
        '</div>' },
      { title: "StatusBadge", desc: "12px · 8px 圆角（非胶囊）", html:
        '<div class="ad-gallery-row">' +
        ["neutral", "accent", "success", "warning", "danger", "info"].map(function (t) {
          return L.renderStatusBadge({ tone: t, text: t });
        }).join('') + '</div>' },
      { title: "FilterBar", desc: "筛选 chips + 搜索 + 操作右对齐", html: L.renderFilterBar({
        chips: [{ label: "全部", active: true }, { label: "待审核" }, { label: "已通过" }],
        controls: [{ type: "search", placeholder: "搜索" }],
        actions: [{ label: "导出" }]
      })},
      { title: "Table · comfortable / compact", desc: "行高 48px / 40px · 无斑马纹 · sticky header", html:
        L.renderTable({ stickyHeader: true, columns: [{ key: "a", label: "名称" }, { key: "b", label: "状态" }], rows: [{ a: "comfortable 48px", b: badge("success", "已通过") }] }) +
        '<div style="margin-top:16px"></div>' +
        L.renderTable({ density: "compact", columns: [{ key: "a", label: "名称" }, { key: "b", label: "数量", align: "right" }], rows: [{ a: "compact 40px", b: "128" }] }) },
      { title: "Pagination", desc: "右对齐 · 共 N 条", html: L.renderPagination({ total: 128, page: 2, totalPages: 7, pageSize: 20 }) },
      { title: "Empty / Loading / Error", desc: "虚线边框 · 无插画", html:
        L.renderEmptyState({ title: "暂无数据", description: "当列表为空时展示" }) +
        '<div style="margin-top:12px"></div>' + L.renderLoadingState({ title: "加载中" }) +
        '<div style="margin-top:12px"></div>' + L.renderErrorState({ title: "加载失败", description: "请稍后重试" }) },
      { title: "Modal", desc: "480px · 遮罩 24% · 16px 圆角", html: L.renderModal({
        open: true, title: "确认驳回", content: "驳回后商家需修改资料重新提交。",
        actions: [{ label: "取消" }, { label: "确认驳回", variant: "danger" }]
      })},
      { title: "Drawer", desc: "480px 右滑 · footer sticky", html: L.renderDrawer({
        open: true, title: "审核详情",
        fields: [{ label: "商家", value: "爱企谷咖啡" }, { label: "状态", html: badge("warning", "待审核") }],
        actions: [{ label: "驳回", variant: "danger" }, { label: "通过", variant: "success" }]
      })}
    ];

    return (
      '<div class="ad-app">' +
      L.renderTopNav(Object.assign({}, TOP_NAV, { title: "AR游伴 · UI System", subtitle: "组件总览 · Figma Ready V1" })) +
      '<main class="ad-content" style="max-width:1200px;margin:0 auto">' +
      L.renderPageHeader({ title: "后台组件总览", description: "Desktop First · 1440 主稿 · tokens.json 可导入 Figma" }) +
      sections.map(function (s) {
        return '<section class="ad-gallery-section"><h2 class="ad-gallery-section__title">' + s.title + '</h2><p class="ad-gallery-section__desc">' + s.desc + '</p>' + s.html + '</section>';
      }).join('') +
      '</main></div>'
    );
  }

  global.BackofficeUISystem = {
    buildOverviewPage: buildOverviewPage,
    buildDashboardPage: buildDashboardPage,
    buildReviewCenterPage: buildReviewCenterPage,
    buildCouponCenterPage: buildCouponCenterPage,
    badge: badge,
    PLATFORM_NAV: PLATFORM_NAV,
    TOP_NAV: TOP_NAV
  };
})(window);

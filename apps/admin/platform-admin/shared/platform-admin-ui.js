(function (global) {
  var lib = global.AdminComponentLibrary;

  var SECTIONS = [
    { title: "Overview", items: [{ id: "dashboard", label: "Dashboard", href: "../dashboard/index.html" }] },
    { title: "Scenic", items: [{ id: "parks", label: "Scenic Management", href: "../parks/index.html" }] },
    { title: "Merchant", items: [{ id: "merchants", label: "Merchant Management", href: "../merchants/index.html" }] },
    {
      title: "Activity Center",
      items: [
        { id: "activity-list", label: "Activity List", href: "../activities/index.html" },
        { id: "activity-create", label: "Create Activity", href: "../activities/create/index.html" },
        { id: "activity-edit", label: "Edit Activity", href: "../activities/edit/index.html" },
        { id: "activity-publish", label: "Publish Activity", href: "../activities/publish/index.html" },
        { id: "activity-close", label: "Close Activity", href: "../activities/close/index.html" }
      ]
    },
    {
      title: "Coupon Center",
      items: [
        { id: "coupon-templates", label: "Coupon Template", href: "../coupons/templates/index.html" },
        { id: "coupon-inventory", label: "Coupon Inventory", href: "../coupons/inventory/index.html" },
        { id: "coupon-statistics", label: "Coupon Statistics", href: "../coupons/statistics/index.html" },
        { id: "coupon-review", label: "Coupon Review", href: "../coupons/review/index.html" }
      ]
    },
    { title: "Review", items: [{ id: "reviews", label: "Review Center", href: "../reviews/index.html" }] },
    {
      title: "Verification Center",
      items: [
        { id: "verify-records", label: "Verification Records", href: "../verification/records/index.html" },
        { id: "verify-exceptions", label: "Verification Exception", href: "../verification/exceptions/index.html" },
        { id: "verify-verifiers", label: "Merchant Verifier Mgmt", href: "../verification/verifiers/index.html" },
        { id: "verify-ranking", label: "Verification Ranking", href: "../verification/ranking/index.html" }
      ]
    },
    {
      title: "Ticket Center",
      items: [
        { id: "ticket-merchant", label: "Merchant Tickets", href: "../tickets/merchants/index.html" },
        { id: "ticket-scenic", label: "Scenic Tickets", href: "../tickets/scenic/index.html" },
        { id: "ticket-technical", label: "Technical Tickets", href: "../tickets/technical/index.html" }
      ]
    },
    {
      title: "Message Center",
      items: [
        { id: "msg-training", label: "Training Notice", href: "../messages/training/index.html" },
        { id: "msg-activity", label: "Activity Notice", href: "../messages/activity/index.html" },
        { id: "msg-review", label: "Review Notice", href: "../messages/review/index.html" },
        { id: "msg-system", label: "System Notice", href: "../messages/system/index.html" }
      ]
    },
    { title: "Training", items: [{ id: "training", label: "Training Center", href: "../training/index.html" }] },
    { title: "Visual Factory", items: [{ id: "visual-task", label: "视觉任务", href: "../modules/visual-factory/index.html" }] }
  ];

  function badge(status) {
    if (global.BackofficeShell && global.BackofficeShell.STATUS_MAP[status]) {
      var s = global.BackofficeShell.STATUS_MAP[status];
      return lib.renderStatusBadge({ text: s.label, tone: s.cls.replace("badge-", "") });
    }
    var tone = "neutral";
    if (["APPROVED", "PUBLISHED", "ACTIVE", "READY", "RUNNING", "VERIFIED", "RESOLVED", "SENT"].indexOf(status) >= 0) tone = "success";
    if (["PENDING", "PENDING_REVIEW", "BLOCKED", "OPEN", "PROCESSING", "DRAFT", "OVERDUE", "WARNING", "NEED_INFO"].indexOf(status) >= 0) tone = "warning";
    if (["REJECTED", "ERROR", "FAILED", "CLOSED", "EXCEPTION", "PUBLISH_FAILED"].indexOf(status) >= 0) tone = "danger";
    return lib.renderStatusBadge({ text: status, tone: tone });
  }

  function shell(activeId, subtitle) {
    return {
      topnav: lib.renderTopNav({
        brand: "A",
        title: "Platform Admin · Phase2",
        subtitle: subtitle || "Mock Runtime · Desktop First",
        env: "MOCK",
        user: "operation_admin"
      }),
      sidenav: lib.renderSideNav({ activeId: activeId, sections: SECTIONS })
    };
  }

  function breadcrumbs(items) {
    return lib.renderBreadcrumb({ items: items || [{ label: "Platform Admin" }] });
  }

  function pageHeader(title, description, actions) {
    return lib.renderPageHeader({ title: title, description: description, actions: actions || [] });
  }

  function stateBlock(state, options) {
    var p = options || {};
    if (state === "loading") return lib.renderLoadingState({ title: p.title || "Loading", description: p.description || "Reading mock data" });
    if (state === "empty") return lib.renderEmptyState({ title: p.title || "No data", description: p.description || "No results for current filter" });
    if (state === "error") return lib.renderErrorState({ title: p.title || "Load failed", description: p.description || "Mock data read failed" });
    return "";
  }

  function stateSwitcher(activeState) {
    return (
      '<section class="ad-surface state-switcher">' +
      '<div class="state-switcher__title">Mock State</div>' +
      ["loading", "empty", "success", "error"].map(function (id) {
        return '<button class="ad-btn ' + (id === activeState ? "ad-btn--primary" : "") + '" data-state="' + id + '">' + id + '</button>';
      }).join("") +
      "</section>"
    );
  }

  function bindStateSwitcher(el, getState, setState, rerender) {
    if (!el) return;
    el.innerHTML = stateSwitcher(getState());
    el.querySelectorAll("[data-state]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setState(btn.getAttribute("data-state"));
        rerender();
      });
    });
  }

  function renderListPage(config) {
    if (!PlatformAdminMock.requireAuth()) return;
    var ui = global.PlatformAdminUI;
    var state = "loading";
    var rows = [];
    var query = "";
    var status = "ALL";
    var page = 1;
    var pageSize = config.pageSize || 5;

    var els = {
      topnav: document.getElementById("topnav"),
      sidenav: document.getElementById("sidenav"),
      breadcrumbs: document.getElementById("breadcrumbs"),
      header: document.getElementById("header"),
      stateSwitch: document.getElementById("state-switch"),
      filter: document.getElementById("filter"),
      content: document.getElementById("content")
    };

    function renderShell() {
      var s = shell(config.activeId, config.subtitle);
      els.topnav.innerHTML = s.topnav;
      els.sidenav.innerHTML = s.sidenav;
      els.breadcrumbs.innerHTML = breadcrumbs(config.breadcrumbs);
      els.header.innerHTML = pageHeader(config.title, config.description, config.actions);
      bindStateSwitcher(els.stateSwitch, function () { return state; }, function (v) { state = v; }, function () { renderAll(); });
    }

    function renderFilter() {
      if (!els.filter) return;
      var chipHtml = "";
      if (config.statusFilters) {
        chipHtml = '<div class="ad-filter-bar__group">' + config.statusFilters.map(function (s) {
          return '<button class="ad-btn ' + (s === status ? "ad-btn--primary" : "") + '" type="button">' + s + '</button>';
        }).join("") + "</div>";
      }
      els.filter.innerHTML = lib.renderFilterBar({
        controls: [{ type: "search", placeholder: config.searchPlaceholder || "Search" }]
      });
      if (chipHtml) {
        els.filter.querySelector(".ad-filter-bar").insertAdjacentHTML("afterbegin", chipHtml);
      }
      var search = els.filter.querySelector(".ad-input--search");
      if (search) {
        search.value = query;
        search.addEventListener("input", function (e) { query = e.target.value; page = 1; renderContent(); });
      }
      if (config.statusFilters) {
        els.filter.querySelectorAll(".ad-filter-bar__group .ad-btn").forEach(function (btn) {
          btn.addEventListener("click", function () {
            status = btn.textContent;
            page = 1;
            renderFilter();
            renderContent();
          });
        });
      }
    }

    function filtered() {
      return rows.filter(function (row) {
        var text = config.searchKeys.map(function (k) { return row[k] || ""; }).join(" ").toLowerCase();
        var q = !query || text.indexOf(query.toLowerCase()) >= 0;
        var st = status === "ALL" || !config.statusKey || row[config.statusKey] === status;
        return q && st;
      });
    }

    function renderContent() {
      if (state !== "success") {
        els.content.innerHTML = stateBlock(state, config.stateMessages);
        return;
      }
      var list = filtered();
      var totalPages = Math.max(1, Math.ceil(list.length / pageSize));
      if (page > totalPages) page = totalPages;
      var slice = list.slice((page - 1) * pageSize, page * pageSize);
      if (!slice.length) {
        els.content.innerHTML = stateBlock("empty", { title: "No records", description: "Try another filter" });
        return;
      }
      els.content.innerHTML =
        '<section class="ad-surface page-card">' +
        lib.renderTable({ columns: config.columns, rows: slice, stickyHeader: true }) +
        "</section>" +
        lib.renderPagination({ page: page, totalPages: totalPages, total: list.length, pageSize: pageSize });
      var pagBtns = els.content.querySelectorAll(".ad-pagination button");
      if (pagBtns[0]) pagBtns[0].addEventListener("click", function () { if (page > 1) { page--; renderContent(); } });
      if (pagBtns[1]) pagBtns[1].addEventListener("click", function () { if (page < totalPages) { page++; renderContent(); } });
    }

    function renderAll() {
      renderShell();
      renderFilter();
      renderContent();
    }

    async function boot() {
      renderAll();
      try {
        rows = await PlatformAdminMock.loadDataset(config.dataset);
        if (config.normalize) rows = config.normalize(rows);
        state = "success";
      } catch (_e) {
        state = "error";
      }
      renderAll();
    }

    boot();
  }

  function renderFormPage(config) {
    if (!PlatformAdminMock.requireAuth()) return;
    var state = "success";
    var els = {
      topnav: document.getElementById("topnav"),
      sidenav: document.getElementById("sidenav"),
      breadcrumbs: document.getElementById("breadcrumbs"),
      header: document.getElementById("header"),
      stateSwitch: document.getElementById("state-switch"),
      content: document.getElementById("content")
    };

    function renderAll() {
      var s = shell(config.activeId, config.subtitle);
      els.topnav.innerHTML = s.topnav;
      els.sidenav.innerHTML = s.sidenav;
      els.breadcrumbs.innerHTML = breadcrumbs(config.breadcrumbs);
      els.header.innerHTML = pageHeader(config.title, config.description, config.actions);
      bindStateSwitcher(els.stateSwitch, function () { return state; }, function (v) { state = v; }, renderAll);
      if (state !== "success") {
        els.content.innerHTML = stateBlock(state, config.stateMessages);
        return;
      }
      els.content.innerHTML = config.renderForm(lib, badge);
    }

    renderAll();
  }

  global.PlatformAdminUI = {
    sections: SECTIONS,
    shell: shell,
    badge: badge,
    breadcrumbs: breadcrumbs,
    pageHeader: pageHeader,
    stateBlock: stateBlock,
    stateSwitcher: stateSwitcher,
    bindStateSwitcher: bindStateSwitcher,
    renderListPage: renderListPage,
    renderFormPage: renderFormPage
  };
})(window);

(function (global) {
  var lib = global.AdminComponentLibrary;
  var ui = global.PlatformAdminUI;

  function act(name) {
    return function () {
      return { html: '<div class="table-actions"><a class="ad-btn" href="#">View</a></div>' };
    };
  }

  function colsActivityList() {
    return [
      { key: "activity_name", label: "Activity Name" },
      { key: "review_status", label: "Status", render: function (r) { return { html: ui.badge(r.review_status) }; } },
      { key: "park_id", label: "Scenic" },
      { key: "start_time", label: "Start" },
      { key: "end_time", label: "End" },
      { key: "actions", label: "Actions", render: function () {
        return { html: '<div class="table-actions"><a class="ad-btn" href="../edit/index.html">Edit</a><a class="ad-btn ad-btn--primary" href="../publish/index.html">Publish</a><a class="ad-btn ad-btn--danger" href="../close/index.html">Close</a></div>' };
      }}
    ];
  }

  var pages = {
    activityList: function () {
      ui.renderListPage({
        activeId: "activity-list",
        subtitle: "Activity Center · List",
        title: "Activity List",
        description: "Browse, filter and manage platform activities.",
        breadcrumbs: [{ label: "Platform Admin" }, { label: "Activity Center" }, { label: "Activity List" }],
        actions: [{ label: "Create Activity", href: "../create/index.html", variant: "primary" }],
        dataset: "platform_activity_review",
        searchKeys: ["activity_name", "park_id"],
        statusKey: "review_status",
        statusFilters: ["ALL", "PENDING", "APPROVED", "REJECTED"],
        searchPlaceholder: "Activity name / scenic",
        columns: colsActivityList()
      });
    },
    activityCreate: function () {
      ui.renderFormPage({
        activeId: "activity-create",
        subtitle: "Activity Center · Create",
        title: "Create Activity",
        description: "Mock form · no API",
        breadcrumbs: [{ label: "Platform Admin" }, { label: "Activity Center" }, { label: "Create Activity" }],
        actions: [{ label: "Save Draft" }, { label: "Submit Review", variant: "primary" }],
        renderForm: function (L) {
          return '<section class="ad-surface page-card detail-layout"><div class="detail-stack">' +
            L.renderInput({ label: "Activity Name", value: "爱企谷初见接福会", placeholder: "Display name" }) +
            L.renderSelect({ label: "Scenic", options: ["爱企谷", "测试园区"], value: "爱企谷" }) +
            L.renderInput({ label: "Start Time", value: "2026-07-01 09:00" }) +
            L.renderInput({ label: "End Time", value: "2026-07-07 18:00" }) +
            L.renderTextarea({ label: "Description", value: "Mock activity create form for Phase2 runtime." }) +
            '</div><aside class="ad-surface"><h3 class="ad-card-title">Publish Checklist</h3><ul class="hint-list"><li>Scenic bound</li><li>Merchants linked</li><li>Coupons configured</li></ul></aside></section>';
        }
      });
    },
    activityEdit: function () {
      ui.renderFormPage({
        activeId: "activity-edit",
        title: "Edit Activity",
        description: "Edit activity_001 · Mock Runtime",
        breadcrumbs: [{ label: "Platform Admin" }, { label: "Activity Center" }, { label: "Edit Activity" }],
        actions: [{ label: "Cancel", href: "../index.html" }, { label: "Save", variant: "primary" }],
        renderForm: function (L) {
          return '<section class="ad-surface page-card">' +
            L.renderInput({ label: "Activity ID", value: "activity_001", disabled: true }) +
            L.renderInput({ label: "Activity Name", value: "爱企谷初见接福会" }) +
            L.renderSelect({ label: "Status", options: ["PENDING", "APPROVED", "REJECTED"], value: "PENDING" }) +
            L.renderTextarea({ label: "Admin Notes", value: "Mock edit · localStorage not persisted in Phase2 list view." }) +
            '</section>';
        }
      });
    },
    activityPublish: function () {
      ui.renderFormPage({
        activeId: "activity-publish",
        title: "Publish Activity",
        description: "Release check before go-live",
        breadcrumbs: [{ label: "Platform Admin" }, { label: "Activity Center" }, { label: "Publish Activity" }],
        actions: [{ label: "Block", variant: "danger" }, { label: "Publish", variant: "primary" }],
        renderForm: function (L, b) {
          return '<section class="ad-surface page-card detail-stack">' +
            '<div class="detail-row"><div class="k">Activity</div><div>爱企谷初见接福会</div></div>' +
            '<div class="detail-row"><div class="k">Review</div><div>' + b("APPROVED") + '</div></div>' +
            '<div class="detail-row"><div class="k">Publish Check</div><div>' + b("READY") + '</div></div>' +
            L.renderTextarea({ label: "Release Notes", value: "Mock publish confirmation." }) +
            '</section>';
        }
      });
    },
    activityClose: function () {
      ui.renderFormPage({
        activeId: "activity-close",
        title: "Close Activity",
        description: "End running activity · Mock",
        breadcrumbs: [{ label: "Platform Admin" }, { label: "Activity Center" }, { label: "Close Activity" }],
        actions: [{ label: "Cancel" }, { label: "Confirm Close", variant: "danger" }],
        renderForm: function (L) {
          return '<section class="ad-surface page-card">' +
            L.renderSelect({ label: "Activity", options: ["爱企谷夏日探索", "爱企谷初见接福会"], value: "爱企谷夏日探索" }) +
            L.renderSelect({ label: "Close Reason", options: ["Schedule ended", "Manual closure", "Compliance"], value: "Schedule ended" }) +
            L.renderTextarea({ label: "Closure Notes", placeholder: "Optional notes for audit log" }) +
            '</section>';
        }
      });
    },
    couponTemplates: function () {
      ui.renderListPage({
        activeId: "coupon-templates",
        title: "Coupon Template",
        description: "Manage reusable coupon templates for merchants.",
        breadcrumbs: [{ label: "Platform Admin" }, { label: "Coupon Center" }, { label: "Coupon Template" }],
        actions: [{ label: "New Template", variant: "primary" }],
        dataset: "platform_coupon_templates",
        searchKeys: ["template_name", "merchant_name"],
        statusKey: "status",
        statusFilters: ["ALL", "ACTIVE", "DRAFT"],
        columns: [
          { key: "template_name", label: "Template" },
          { key: "coupon_type", label: "Type" },
          { key: "merchant_name", label: "Merchant" },
          { key: "status", label: "Status", render: function (r) { return { html: ui.badge(r.status) }; } },
          { key: "updated_at", label: "Updated" }
        ]
      });
    },
    couponInventory: function () {
      ui.renderListPage({
        activeId: "coupon-inventory",
        title: "Coupon Inventory",
        description: "Stock, claims and verification counts.",
        breadcrumbs: [{ label: "Platform Admin" }, { label: "Coupon Center" }, { label: "Coupon Inventory" }],
        dataset: "platform_coupon_inventory",
        searchKeys: ["coupon_name"],
        statusKey: "status",
        statusFilters: ["ALL", "ACTIVE", "CLOSED"],
        columns: [
          { key: "coupon_name", label: "Coupon" },
          { key: "stock_total", label: "Total", align: "right" },
          { key: "stock_remaining", label: "Remaining", align: "right" },
          { key: "claimed", label: "Claimed", align: "right" },
          { key: "verified", label: "Verified", align: "right" },
          { key: "status", label: "Status", render: function (r) { return { html: ui.badge(r.status) }; } }
        ]
      });
    },
    couponStatistics: function () {
      ui.renderFormPage({
        activeId: "coupon-statistics",
        title: "Coupon Statistics",
        description: "Daily claim / verify trend · Mock",
        breadcrumbs: [{ label: "Platform Admin" }, { label: "Coupon Center" }, { label: "Coupon Statistics" }],
        actions: [{ label: "Export", variant: "primary" }],
        renderForm: function (L, b) {
          return '<section class="page-kpi-grid" style="margin-bottom:16px">' +
            L.renderKpiCard({ label: "Total Claimed (7d)", value: "371" }) +
            L.renderKpiCard({ label: "Total Verified (7d)", value: "226" }) +
            L.renderKpiCard({ label: "Verify Rate", value: "60.9%" }) +
            L.renderKpiCard({ label: "Failed", value: "12", valueTone: "warning" }) +
            '</section><section class="ad-surface page-card"><div class="ad-chart-placeholder" style="height:220px;display:flex;align-items:center;justify-content:center;color:var(--ad-text-muted)">Coupon statistics chart placeholder</div></section>';
        }
      });
    },
    couponReview: function () {
      ui.renderListPage({
        activeId: "coupon-review",
        title: "Coupon Review",
        description: "Review merchant coupon submissions.",
        breadcrumbs: [{ label: "Platform Admin" }, { label: "Coupon Center" }, { label: "Coupon Review" }],
        dataset: "platform_coupon_review",
        searchKeys: ["coupon_name", "merchant_id"],
        statusKey: "review_status",
        statusFilters: ["ALL", "PENDING", "APPROVED", "REJECTED"],
        columns: [
          { key: "coupon_name", label: "Coupon" },
          { key: "coupon_type", label: "Type" },
          { key: "review_status", label: "Status", render: function (r) { return { html: ui.badge(r.review_status) }; } },
          { key: "submitted_at", label: "Submitted" },
          { key: "actions", label: "Actions", render: function () { return { html: '<div class="table-actions"><button class="ad-btn ad-btn--success">Approve</button><button class="ad-btn ad-btn--danger">Reject</button></div>' }; } }
        ]
      });
    },
    verifyRecords: function () {
      ui.renderListPage({
        activeId: "verify-records",
        title: "Verification Records",
        description: "All merchant verification transactions.",
        breadcrumbs: [{ label: "Platform Admin" }, { label: "Verification Center" }, { label: "Records" }],
        dataset: "platform_verification_records",
        searchKeys: ["coupon_code", "merchant_name", "verifier"],
        statusKey: "status",
        statusFilters: ["ALL", "VERIFIED", "FAILED"],
        columns: [
          { key: "coupon_code", label: "Code" },
          { key: "merchant_name", label: "Merchant" },
          { key: "verifier", label: "Verifier" },
          { key: "status", label: "Status", render: function (r) { return { html: ui.badge(r.status) }; } },
          { key: "verified_at", label: "Time" }
        ]
      });
    },
    verifyExceptions: function () {
      ui.renderListPage({
        activeId: "verify-exceptions",
        title: "Verification Exception",
        description: "Failed or disputed verifications.",
        breadcrumbs: [{ label: "Platform Admin" }, { label: "Verification Center" }, { label: "Exception" }],
        dataset: "platform_verification_exceptions",
        searchKeys: ["coupon_code", "merchant_name", "reason"],
        statusKey: "status",
        statusFilters: ["ALL", "OPEN", "PROCESSING", "RESOLVED"],
        columns: [
          { key: "coupon_code", label: "Code" },
          { key: "merchant_name", label: "Merchant" },
          { key: "reason", label: "Reason" },
          { key: "status", label: "Status", render: function (r) { return { html: ui.badge(r.status) }; } },
          { key: "reported_at", label: "Reported" }
        ]
      });
    },
    verifyVerifiers: function () {
      ui.renderListPage({
        activeId: "verify-verifiers",
        title: "Merchant Verifier Management",
        description: "Staff accounts authorized to verify coupons.",
        breadcrumbs: [{ label: "Platform Admin" }, { label: "Verification Center" }, { label: "Verifiers" }],
        actions: [{ label: "Add Verifier", variant: "primary" }],
        dataset: "platform_verifiers",
        searchKeys: ["name", "merchant_name"],
        statusKey: "status",
        statusFilters: ["ALL", "ACTIVE"],
        columns: [
          { key: "name", label: "Name" },
          { key: "merchant_name", label: "Merchant" },
          { key: "role", label: "Role" },
          { key: "verified_count", label: "Verified", align: "right" },
          { key: "status", label: "Status", render: function (r) { return { html: ui.badge(r.status) }; } }
        ]
      });
    },
    verifyRanking: function () {
      ui.renderListPage({
        activeId: "verify-ranking",
        title: "Verification Ranking",
        description: "Merchant verification leaderboard · Mock",
        breadcrumbs: [{ label: "Platform Admin" }, { label: "Verification Center" }, { label: "Ranking" }],
        dataset: "platform_verification_ranking",
        searchKeys: ["merchant_name"],
        statusFilters: null,
        columns: [
          { key: "rank", label: "Rank", align: "right" },
          { key: "merchant_name", label: "Merchant" },
          { key: "verified_count", label: "Verified", align: "right" },
          { key: "success_rate", label: "Success Rate", align: "right" }
        ]
      });
    },
    ticketMerchant: function () {
      ui.renderListPage({
        activeId: "ticket-merchant",
        title: "Merchant Tickets",
        description: "Support tickets from merchants.",
        breadcrumbs: [{ label: "Platform Admin" }, { label: "Ticket Center" }, { label: "Merchant Tickets" }],
        actions: [{ label: "New Ticket", variant: "primary" }],
        dataset: "platform_tickets_merchant",
        searchKeys: ["title", "merchant_name"],
        statusKey: "status",
        statusFilters: ["ALL", "OPEN", "PROCESSING", "RESOLVED"],
        columns: [
          { key: "ticket_id", label: "ID" },
          { key: "title", label: "Title" },
          { key: "merchant_name", label: "Merchant" },
          { key: "priority", label: "Priority", render: function (r) { return { html: ui.badge(r.priority) }; } },
          { key: "status", label: "Status", render: function (r) { return { html: ui.badge(r.status) }; } },
          { key: "created_at", label: "Created" }
        ]
      });
    },
    ticketScenic: function () {
      ui.renderListPage({
        activeId: "ticket-scenic",
        title: "Scenic Tickets",
        description: "Tickets from scenic / park operators.",
        breadcrumbs: [{ label: "Platform Admin" }, { label: "Ticket Center" }, { label: "Scenic Tickets" }],
        dataset: "platform_tickets_scenic",
        searchKeys: ["title", "park_name"],
        statusKey: "status",
        statusFilters: ["ALL", "OPEN", "RESOLVED"],
        columns: [
          { key: "ticket_id", label: "ID" },
          { key: "title", label: "Title" },
          { key: "park_name", label: "Scenic" },
          { key: "priority", label: "Priority", render: function (r) { return { html: ui.badge(r.priority) }; } },
          { key: "status", label: "Status", render: function (r) { return { html: ui.badge(r.status) }; } },
          { key: "created_at", label: "Created" }
        ]
      });
    },
    ticketTechnical: function () {
      ui.renderListPage({
        activeId: "ticket-technical",
        title: "Technical Tickets",
        description: "Platform and AR runtime technical issues.",
        breadcrumbs: [{ label: "Platform Admin" }, { label: "Ticket Center" }, { label: "Technical Tickets" }],
        dataset: "platform_tickets_technical",
        searchKeys: ["title", "component"],
        statusKey: "status",
        statusFilters: ["ALL", "OPEN", "PROCESSING"],
        columns: [
          { key: "ticket_id", label: "ID" },
          { key: "title", label: "Title" },
          { key: "component", label: "Component" },
          { key: "priority", label: "Priority", render: function (r) { return { html: ui.badge(r.priority) }; } },
          { key: "status", label: "Status", render: function (r) { return { html: ui.badge(r.status) }; } },
          { key: "created_at", label: "Created" }
        ]
      });
    },
    msgTraining: function () {
      ui.renderListPage({
        activeId: "msg-training",
        title: "Training Notice",
        description: "Training announcements to merchants and staff.",
        breadcrumbs: [{ label: "Platform Admin" }, { label: "Message Center" }, { label: "Training Notice" }],
        actions: [{ label: "Compose", variant: "primary" }],
        dataset: "platform_messages_training",
        searchKeys: ["title", "audience"],
        statusKey: "status",
        statusFilters: ["ALL", "SENT", "DRAFT"],
        columns: [
          { key: "title", label: "Title" },
          { key: "audience", label: "Audience" },
          { key: "status", label: "Status", render: function (r) { return { html: ui.badge(r.status) }; } },
          { key: "sent_at", label: "Sent" }
        ]
      });
    },
    msgActivity: function () {
      ui.renderListPage({
        activeId: "msg-activity",
        title: "Activity Notice",
        description: "Activity-related notifications.",
        breadcrumbs: [{ label: "Platform Admin" }, { label: "Message Center" }, { label: "Activity Notice" }],
        dataset: "platform_messages_activity",
        searchKeys: ["title", "activity_name"],
        statusKey: "status",
        statusFilters: ["ALL", "SENT", "DRAFT"],
        columns: [
          { key: "title", label: "Title" },
          { key: "activity_name", label: "Activity" },
          { key: "status", label: "Status", render: function (r) { return { html: ui.badge(r.status) }; } },
          { key: "sent_at", label: "Sent" }
        ]
      });
    },
    msgReview: function () {
      ui.renderListPage({
        activeId: "msg-review",
        title: "Review Notice",
        description: "Review queue and result notifications.",
        breadcrumbs: [{ label: "Platform Admin" }, { label: "Message Center" }, { label: "Review Notice" }],
        dataset: "platform_messages_review",
        searchKeys: ["title", "target"],
        statusKey: "status",
        statusFilters: ["ALL", "SENT"],
        columns: [
          { key: "title", label: "Title" },
          { key: "target", label: "Target" },
          { key: "status", label: "Status", render: function (r) { return { html: ui.badge(r.status) }; } },
          { key: "sent_at", label: "Sent" }
        ]
      });
    },
    msgSystem: function () {
      ui.renderListPage({
        activeId: "msg-system",
        title: "System Notice",
        description: "Platform maintenance and system alerts.",
        breadcrumbs: [{ label: "Platform Admin" }, { label: "Message Center" }, { label: "System Notice" }],
        dataset: "platform_messages_system",
        searchKeys: ["title"],
        statusKey: "status",
        statusFilters: ["ALL", "SENT", "DRAFT"],
        columns: [
          { key: "title", label: "Title" },
          { key: "level", label: "Level", render: function (r) { return { html: ui.badge(r.level === "WARNING" ? "WARNING" : "INFO") }; } },
          { key: "status", label: "Status", render: function (r) { return { html: ui.badge(r.status) }; } },
          { key: "sent_at", label: "Sent" }
        ]
      });
    }
  };

  global.PlatformPhase2Pages = pages;
})(window);

(function (global) {
  var BLESSING_TYPE_LABELS = {
    blessing: "祝福",
    revelation: "显现",
    echo: "回响",
    claim_hint: "领取提示",
    explore_hint: "探索提示"
  };

  var AR_TYPE_LABELS = {
    scan: "AR 扫描",
    revelation_ritual: "显现仪式",
    imprint_particle: "印记粒子",
    gate_open: "Gate 打开",
    placement_asset: "放置资产"
  };

  var TASK_TYPE_LABELS = {
    generate_relic_placeholder: "生成信物占位",
    generate_blessing_copy: "生成祝福文案",
    generate_ar_placeholder: "生成 AR 占位",
    generate_art_request: "生成美术需求单",
    submit_review: "提交审查",
    publish_runtime: "发布到 Runtime"
  };

  var REVIEW_SOURCE_MODULE = {
    exploration_point: "内容生产 / 探索点管理",
    relic: "内容生产 / 信物管理",
    blessing_content: "内容生产 / 祝福内容管理",
    ar_content: "内容生产 / AR内容管理",
    art_request: "内容生产 / 美术需求"
  };

  function getDeps() { return global.LQGMockSource; }

  function fmt(s, d) {
    return (global.LQGStatusMap && global.LQGStatusMap.formatStatus(s, d)) || { code: s, label: s };
  }

  function persistSession() {
    if (global.LQGAdapterSessionStore && global.LQGAdapterSessionStore.persistAfterWrite) {
      global.LQGAdapterSessionStore.persistAfterWrite();
    }
  }

  function ensureSession() {
    if (global.LQGAdapterSessionStore) {
      return global.LQGAdapterSessionStore.ensureSession(getDeps());
    }
    return global.LQGAdapterSession || {};
  }

  function nowIso() {
    var d = new Date();
    var pad = function (n) { return String(n).padStart(2, "0"); };
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) +
      "T" + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()) + "+08:00";
  }

  function nextId(prefix, list) {
    var max = 0;
    list.forEach(function (item) {
      var m = String(item.id || "").match(new RegExp("^" + prefix + "_(\\d+)$"));
      if (m) max = Math.max(max, parseInt(m[1], 10));
    });
    return prefix + "_" + String(max + 1).padStart(3, "0");
  }

  function appendTask(entry) {
    var s = ensureSession();
    var task = Object.assign({
      id: nextId("task", s.generationTasks),
      createdAt: nowIso(),
      updatedAt: nowIso()
    }, entry);
    s.generationTasks.unshift(task);
    return decorateTask(task);
  }

  function enrichReviewPublish(item, targetType) {
    var platform = global.LQGPlatformAdminAdapter;
    if (!platform) return item;
    var review = platform.getReviewStatusForTarget(targetType, item.id);
    var publish = platform.getPublishStatusForTarget(targetType, item.id);
    if (review) {
      item.reviewStatus = review.status;
      item.reviewStatusLabel = review.statusLabel;
    } else if (item.reviewStatus) {
      item.reviewStatusLabel = fmt(item.reviewStatus, "review").label;
    }
    if (publish) {
      item.publishStatus = publish.publishCheckStatus;
      item.publishStatusLabel = publish.publishCheckStatusLabel;
      item.runtimeStatus = publish.runtimeStatus;
      item.runtimeStatusLabel = publish.runtimeStatusLabel;
    } else if (item.publishStatus) {
      item.publishStatusLabel = fmt(item.publishStatus, "publish").label;
    }
    if (item.runtimeStatus) {
      item.runtimeStatusLabel = fmt(item.runtimeStatus, "runtime").label;
    }
    return item;
  }

  function decorateTask(t) {
    var mock = getDeps();
    return Object.assign({}, t, {
      taskTypeLabel: TASK_TYPE_LABELS[t.taskType] || t.taskType,
      statusLabel: fmt(t.status, "content").label,
      parkName: (mock.get("parks", t.parkId) || {}).name,
      activityName: (mock.get("activities", t.activityId) || {}).name
    });
  }

  function mapPoint(p) {
    var mock = getDeps();
    return enrichReviewPublish(Object.assign({}, p, {
      parkName: (mock.get("parks", p.parkId) || {}).name,
      activityName: (mock.get("activities", p.activityId) || {}).name,
      relicBound: !!p.relicId,
      blessingBound: !!p.blessingContentId,
      arBound: !!p.arContentId,
      artBound: !!p.artRequestId,
      statusLabel: fmt(p.status, "content").label,
      reviewStatusLabel: fmt(p.reviewStatus, "review").label,
      publishStatusLabel: fmt(p.publishStatus, "publish").label,
      runtimeStatusLabel: fmt(p.runtimeStatus, "runtime").label
    }), "exploration_point");
  }

  function getContentProductionDashboard() {
    var s = ensureSession();
    var mock = getDeps();
    var pendingReview = s.relics.concat(s.blessingContents, s.arContents, s.artRequests)
      .filter(function (x) { return x.reviewStatus === "PENDING_REVIEW"; }).length;
    var pendingPublish = s.publishRecords
      ? s.publishRecords.filter(function (p) { return p.runtimeStatus === "READY"; }).length
      : 0;
    var publishFailed = s.publishRecords
      ? s.publishRecords.filter(function (p) { return p.publishCheckStatus === "PUBLISH_FAILED"; }).length
      : 0;
    var gaps = [];
    s.explorationPoints.forEach(function (p) {
      if (!p.blessingContentId) gaps.push({ label: p.name + " · 祝福文案待补", status: "需补充" });
      if (!p.arContentId) gaps.push({ label: p.name + " · AR 绑定待完成", status: "待绑定" });
    });

    return {
      summary: "爱企谷初见寻宝节已完成 " + s.explorationPoints.length + " 个探索点、" +
        s.relics.length + " 组信物占位、" + s.blessingContents.length + " 条祝福文案、" +
        s.arContents.length + " 条 AR 显现配置，美术需求单 " + s.artRequests.length + " 张。",
      parkCount: mock.parks.length,
      activityCount: mock.activities.length,
      explorationPointCount: s.explorationPoints.length,
      relicCount: s.relics.length,
      blessingCount: s.blessingContents.length,
      arCount: s.arContents.length,
      artRequestCount: s.artRequests.length,
      generationTaskCount: s.generationTasks.length,
      pendingReview: pendingReview,
      pendingPublish: pendingPublish,
      publishFailed: publishFailed,
      gaps: gaps.slice(0, 5),
      recentTasks: s.generationTasks.slice(0, 5).map(decorateTask),
      risks: gaps.length ? [{ label: gaps.length + " 项内容待补齐或绑定" }] : []
    };
  }

  function getExplorationPoints(filters) {
    var list = ensureSession().explorationPoints.slice();
    if (filters && filters.activityId) {
      list = list.filter(function (p) { return p.activityId === filters.activityId; });
    }
    return list.map(mapPoint);
  }

  function getExplorationPointDetail(pointId) {
    var p = ensureSession().explorationPoints.find(function (x) { return x.id === pointId; });
    return p ? mapPoint(p) : null;
  }

  function findPoint(pointId) {
    return ensureSession().explorationPoints.find(function (p) { return p.id === pointId; }) || null;
  }

  function generateRelicPlaceholder(pointId, actor) {
    var s = ensureSession();
    var point = findPoint(pointId);
    if (!point) return { ok: false, message: "探索点不存在" };
    var relic;
    if (point.relicId) {
      relic = s.relics.find(function (r) { return r.id === point.relicId; });
    }
    if (!relic) {
      relic = {
        id: nextId("relic", s.relics),
        parkId: point.parkId,
        activityId: point.activityId,
        explorationPointId: pointId,
        name: point.name + "信物",
        chapter: "待配置",
        node: "待配置",
        level: "初遇",
        appearStatus: "GENERATED",
        copyStatus: "DRAFT",
        arStatus: "PENDING_BINDING",
        artStatus: "PENDING",
        reviewStatus: "DRAFT",
        publishStatus: "DRAFT",
        runtimeStatus: "NOT_READY",
        createdAt: nowIso(),
        updatedAt: nowIso()
      };
      s.relics.push(relic);
      point.relicId = relic.id;
    } else {
      relic.appearStatus = "GENERATED";
      relic.updatedAt = nowIso();
    }
    point.updatedAt = nowIso();
    var task = appendTask({
      taskName: "生成信物占位 · " + point.name,
      taskType: "generate_relic_placeholder",
      parkId: point.parkId,
      activityId: point.activityId,
      targetType: "exploration_point",
      targetId: pointId,
      executor: (actor && actor.actorId) || "content_ops",
      status: "GENERATED",
      log: "已为探索点生成信物占位：" + relic.name
    });
    persistSession();
    return {
      ok: true,
      status: "GENERATED",
      statusLabel: "已生成信物占位",
      message: "已为探索点生成信物占位。",
      relic: enrichReviewPublish(Object.assign({}, relic, {
        reviewStatusLabel: fmt(relic.reviewStatus, "review").label
      }), "relic"),
      generationTask: task
    };
  }

  function generateBlessingContent(pointId, options, actor) {
    var s = ensureSession();
    var point = findPoint(pointId);
    if (!point) return { ok: false, message: "探索点不存在" };
    var contentType = (options && options.contentType) || "blessing";
    var blessing = s.blessingContents.find(function (b) { return b.explorationPointId === pointId && b.contentType === contentType; });
    if (!blessing) {
      blessing = {
        id: nextId("bless", s.blessingContents),
        parkId: point.parkId,
        activityId: point.activityId,
        explorationPointId: pointId,
        relicId: point.relicId || "",
        title: point.name + BLESSING_TYPE_LABELS[contentType],
        contentType: contentType,
        content: "Mock 候选文案：在" + point.name + "，回响将随探索显现。",
        copyStatus: "GENERATED",
        reviewStatus: "DRAFT",
        publishStatus: "DRAFT",
        runtimeStatus: "NOT_READY",
        createdAt: nowIso(),
        updatedAt: nowIso()
      };
      s.blessingContents.push(blessing);
    } else {
      blessing.content = blessing.content || "Mock 候选文案已更新。";
      blessing.copyStatus = "GENERATED";
      blessing.updatedAt = nowIso();
    }
    point.blessingContentId = blessing.id;
    point.updatedAt = nowIso();
    var task = appendTask({
      taskName: "生成祝福文案 · " + point.name,
      taskType: "generate_blessing_copy",
      parkId: point.parkId,
      activityId: point.activityId,
      targetType: "exploration_point",
      targetId: pointId,
      executor: (options && options.executor) || "会话C",
      status: "GENERATED",
      log: "已生成祝福文案候选"
    });
    persistSession();
    return {
      ok: true,
      status: "GENERATED",
      statusLabel: "已生成祝福文案候选",
      message: "已生成祝福文案候选，待编辑后提交审查。",
      blessingContent: decorateBlessing(blessing),
      generationTask: task
    };
  }

  function generateARPlaceholder(pointId, actor) {
    var s = ensureSession();
    var point = findPoint(pointId);
    if (!point) return { ok: false, message: "探索点不存在" };
    var ar = point.arContentId ? s.arContents.find(function (a) { return a.id === point.arContentId; }) : null;
    if (!ar) {
      ar = {
        id: nextId("ar", s.arContents),
        parkId: point.parkId,
        activityId: point.activityId,
        explorationPointId: pointId,
        relicId: point.relicId || "",
        name: point.name + " AR 占位",
        arType: "scan",
        resourceStatus: "GENERATED",
        previewStatus: "READY",
        reviewStatus: "DRAFT",
        publishStatus: "DRAFT",
        runtimeStatus: "NOT_READY",
        configJson: "{}",
        createdAt: nowIso(),
        updatedAt: nowIso()
      };
      s.arContents.push(ar);
      point.arContentId = ar.id;
    } else {
      ar.resourceStatus = "GENERATED";
      ar.previewStatus = "READY";
      ar.updatedAt = nowIso();
    }
    if (point.relicId) {
      var relic = s.relics.find(function (r) { return r.id === point.relicId; });
      if (relic) {
        relic.arStatus = "BOUND";
        ar.relicId = relic.id;
      }
    }
    point.updatedAt = nowIso();
    var task = appendTask({
      taskName: "生成 AR 占位 · " + point.name,
      taskType: "generate_ar_placeholder",
      parkId: point.parkId,
      activityId: point.activityId,
      targetType: "exploration_point",
      targetId: pointId,
      executor: (actor && actor.actorId) || "content_ops",
      status: "GENERATED",
      log: "已生成 AR 内容占位"
    });
    persistSession();
    return {
      ok: true,
      status: "GENERATED",
      statusLabel: "已生成 AR 占位",
      message: "已生成 AR 内容占位，需绑定信物和美术资源。",
      arContent: decorateAR(ar),
      generationTask: task
    };
  }

  function generateArtRequest(targetType, targetId, options, actor) {
    var s = ensureSession();
    var mock = getDeps();
    var ctx = { parkId: "park_001", activityId: "activity_001", explorationPointId: "", relicId: "", arContentId: "" };
    var title = "美术需求";
    if (targetType === "exploration_point") {
      var p = findPoint(targetId);
      if (!p) return { ok: false, message: "目标不存在" };
      ctx = { parkId: p.parkId, activityId: p.activityId, explorationPointId: p.id, relicId: p.relicId || "", arContentId: p.arContentId || "" };
      title = p.name + "探索点视觉";
    } else if (targetType === "relic") {
      var r = s.relics.find(function (x) { return x.id === targetId; });
      if (!r) return { ok: false, message: "目标不存在" };
      ctx = { parkId: r.parkId, activityId: r.activityId, explorationPointId: r.explorationPointId, relicId: r.id, arContentId: "" };
      title = r.name + "视觉";
    }
    var art = {
      id: nextId("art", s.artRequests),
      title: title,
      assetType: (options && options.assetType) || "探索点视觉",
      parkId: ctx.parkId,
      activityId: ctx.activityId,
      explorationPointId: ctx.explorationPointId,
      relicId: ctx.relicId,
      arContentId: ctx.arContentId,
      toolSuggestion: (options && options.toolSuggestion) || "会话C",
      prompt: (options && options.prompt) || title + "，东方克制，温润金绿",
      status: "PENDING_REVIEW",
      reviewStatus: "PENDING_REVIEW",
      createdAt: nowIso(),
      updatedAt: nowIso()
    };
    s.artRequests.unshift(art);
    if (ctx.explorationPointId) {
      var pt = findPoint(ctx.explorationPointId);
      if (pt) pt.artRequestId = art.id;
    }
    var task = appendTask({
      taskName: "生成美术需求单 · " + title,
      taskType: "generate_art_request",
      parkId: ctx.parkId,
      activityId: ctx.activityId,
      targetType: targetType,
      targetId: targetId,
      executor: art.toolSuggestion,
      status: "PENDING_REVIEW",
      log: "已创建美术需求单"
    });
    persistSession();
    return {
      ok: true,
      status: "PENDING_REVIEW",
      statusLabel: "美术需求单已创建",
      message: "已创建美术需求单，可复制 Prompt 交由会话C / 豆包 / Gemini 继续生成。",
      artRequest: decorateArtRequest(art),
      generationTask: task
    };
  }

  function getTargetMeta(targetType, targetId) {
    var s = ensureSession();
    var mock = getDeps();
    if (targetType === "exploration_point") {
      var p = findPoint(targetId);
      return p ? { targetName: p.name, parkId: p.parkId, activityId: p.activityId } : null;
    }
    if (targetType === "relic") {
      var r = s.relics.find(function (x) { return x.id === targetId; });
      return r ? { targetName: r.name, parkId: r.parkId, activityId: r.activityId } : null;
    }
    if (targetType === "blessing_content") {
      var b = s.blessingContents.find(function (x) { return x.id === targetId; });
      return b ? { targetName: b.title, parkId: b.parkId, activityId: b.activityId } : null;
    }
    if (targetType === "ar_content") {
      var a = s.arContents.find(function (x) { return x.id === targetId; });
      return a ? { targetName: a.name, parkId: a.parkId, activityId: a.activityId } : null;
    }
    if (targetType === "art_request") {
      var ar = s.artRequests.find(function (x) { return x.id === targetId; });
      return ar ? { targetName: ar.title, parkId: ar.parkId, activityId: ar.activityId } : null;
    }
    return null;
  }

  function submitContentReview(targetType, targetId, payload, actor) {
    var s = ensureSession();
    var meta = getTargetMeta(targetType, targetId);
    if (!meta) return { ok: false, message: "内容对象不存在" };

    var review = {
      id: nextId("review", s.reviewRecords),
      targetType: targetType,
      targetId: targetId,
      targetName: meta.targetName,
      parkId: meta.parkId,
      activityId: meta.activityId,
      sourceModule: REVIEW_SOURCE_MODULE[targetType] || "内容生产",
      submittedBy: (actor && actor.actorId) || "content_ops",
      submittedRole: (actor && actor.actorRole) || "platform_admin",
      status: "PENDING_REVIEW",
      reviewConclusion: (payload && payload.summary) || "",
      blockReason: "", optimizationSuggestion: "", needSupplement: "", nextStepSuggestion: "",
      reviewerId: "", reviewerName: "", reviewedAt: "",
      createdAt: nowIso(),
      updatedAt: nowIso()
    };
    s.reviewRecords.unshift(review);

    function setReviewStatus(collection, id) {
      var item = s[collection].find(function (x) { return x.id === id; });
      if (item) {
        item.reviewStatus = "PENDING_REVIEW";
        item.updatedAt = nowIso();
      }
    }
    if (targetType === "exploration_point") setReviewStatus("explorationPoints", targetId);
    if (targetType === "relic") setReviewStatus("relics", targetId);
    if (targetType === "blessing_content") setReviewStatus("blessingContents", targetId);
    if (targetType === "ar_content") setReviewStatus("arContents", targetId);
    if (targetType === "art_request") setReviewStatus("artRequests", targetId);

    var task = appendTask({
      taskName: "提交审查 · " + meta.targetName,
      taskType: "submit_review",
      parkId: meta.parkId,
      activityId: meta.activityId,
      targetType: targetType,
      targetId: targetId,
      executor: (actor && actor.actorId) || "content_ops",
      status: "PENDING_REVIEW",
      log: "已提交平台审查中心"
    });

    persistSession();
    return {
      ok: true,
      status: "PENDING_REVIEW",
      statusLabel: "已提交审查",
      message: "内容已提交平台审查中心。",
      reviewRecord: review,
      generationTask: task
    };
  }

  function decorateBlessing(b) {
    var mock = getDeps();
    return enrichReviewPublish(Object.assign({}, b, {
      parkName: (mock.get("parks", b.parkId) || {}).name,
      activityName: (mock.get("activities", b.activityId) || {}).name,
      pointName: (mock.get("explorationPoints", b.explorationPointId) || {}).name,
      relicName: (mock.get("relics", b.relicId) || {}).name,
      contentTypeLabel: BLESSING_TYPE_LABELS[b.contentType] || b.contentType,
      copyStatusLabel: fmt(b.copyStatus, "content").label
    }), "blessing_content");
  }

  function decorateRelic(r) {
    var mock = getDeps();
    return enrichReviewPublish(Object.assign({}, r, {
      parkName: (mock.get("parks", r.parkId) || {}).name,
      activityName: (mock.get("activities", r.activityId) || {}).name,
      pointName: (mock.get("explorationPoints", r.explorationPointId) || {}).name,
      appearStatusLabel: fmt(r.appearStatus, "content").label,
      copyStatusLabel: fmt(r.copyStatus, "content").label,
      arStatusLabel: fmt(r.arStatus, "content").label,
      artStatusLabel: fmt(r.artStatus, "content").label
    }), "relic");
  }

  function decorateAR(a) {
    var mock = getDeps();
    return enrichReviewPublish(Object.assign({}, a, {
      parkName: (mock.get("parks", a.parkId) || {}).name,
      activityName: (mock.get("activities", a.activityId) || {}).name,
      pointName: (mock.get("explorationPoints", a.explorationPointId) || {}).name,
      relicName: (mock.get("relics", a.relicId) || {}).name,
      arTypeLabel: AR_TYPE_LABELS[a.arType] || a.arType,
      resourceStatusLabel: fmt(a.resourceStatus, "ar").label,
      previewStatusLabel: fmt(a.previewStatus, "ar").label
    }), "ar_content");
  }

  function decorateArtRequest(a) {
    var mock = getDeps();
    return enrichReviewPublish(Object.assign({}, a, {
      parkName: (mock.get("parks", a.parkId) || {}).name,
      activityName: (mock.get("activities", a.activityId) || {}).name,
      pointName: (mock.get("explorationPoints", a.explorationPointId) || {}).name,
      relicName: (mock.get("relics", a.relicId) || {}).name,
      statusLabel: fmt(a.status, "content").label
    }), "art_request");
  }

  function getRelics(filters) {
    return ensureSession().relics.map(decorateRelic);
  }

  function getRelicDetail(relicId) {
    var r = ensureSession().relics.find(function (x) { return x.id === relicId; });
    return r ? decorateRelic(r) : null;
  }

  function getBlessingContents(filters) {
    return ensureSession().blessingContents.map(decorateBlessing);
  }

  function getBlessingContentDetail(contentId) {
    var b = ensureSession().blessingContents.find(function (x) { return x.id === contentId; });
    return b ? decorateBlessing(b) : null;
  }

  function getARContents(filters) {
    return ensureSession().arContents.map(decorateAR);
  }

  function getARContentDetail(arId) {
    var a = ensureSession().arContents.find(function (x) { return x.id === arId; });
    return a ? decorateAR(a) : null;
  }

  function getArtRequests(filters) {
    return ensureSession().artRequests.map(decorateArtRequest);
  }

  function getArtRequestDetail(requestId) {
    var a = ensureSession().artRequests.find(function (x) { return x.id === requestId; });
    return a ? decorateArtRequest(a) : null;
  }

  function getGenerationTasks(filters) {
    return ensureSession().generationTasks.map(decorateTask);
  }

  function getGenerationTaskDetail(taskId) {
    var t = ensureSession().generationTasks.find(function (x) { return x.id === taskId; });
    return t ? decorateTask(t) : null;
  }

  function buildSearchIndex() {
    var items = [];
    getExplorationPoints().forEach(function (p) {
      items.push({
        type: "探索点", typeKey: "exploration_point", id: p.id, name: p.name,
        meta: (p.activityName || "") + " · " + (p.relicBound ? "已绑定信物" : "信物待生成"),
        status: p.reviewStatusLabel || "—",
        href: "../platform_exploration_points/index.html?pointId=" + p.id,
        action: "查看探索点"
      });
    });
    getRelics().forEach(function (r) {
      items.push({
        type: "信物", typeKey: "relic", id: r.id, name: r.name,
        meta: r.pointName || "", status: r.reviewStatusLabel || "—",
        href: "../platform_relics/index.html?relicId=" + r.id, action: "查看信物"
      });
    });
    getBlessingContents().forEach(function (b) {
      items.push({
        type: "祝福内容", typeKey: "blessing_content", id: b.id, name: b.title,
        meta: (b.contentTypeLabel || "") + " · " + (b.pointName || ""),
        status: b.reviewStatusLabel || "—",
        href: "../platform_blessing_content/index.html?contentId=" + b.id, action: "查看祝福"
      });
    });
    getARContents().forEach(function (a) {
      items.push({
        type: "AR内容", typeKey: "ar_content", id: a.id, name: a.name,
        meta: (a.pointName || "") + " / " + (a.relicName || ""),
        status: a.publishStatusLabel || "—",
        href: "../platform_ar_content/index.html?arId=" + a.id, action: "查看AR"
      });
    });
    getArtRequests().forEach(function (a) {
      items.push({
        type: "美术需求单", typeKey: "art_request", id: a.id, name: a.title,
        meta: a.assetType + " · " + a.toolSuggestion,
        status: a.statusLabel || "—",
        href: "../platform_art_requests/index.html?requestId=" + a.id, action: "查看需求"
      });
    });
    getGenerationTasks().forEach(function (t) {
      items.push({
        type: "生成任务", typeKey: "generation_task", id: t.id, name: t.taskName,
        meta: t.taskTypeLabel, status: t.statusLabel,
        href: "../platform_generation_tasks/index.html?taskId=" + t.id, action: "查看任务"
      });
    });
    return items;
  }

  var adapter = {
    BLESSING_TYPE_LABELS: BLESSING_TYPE_LABELS,
    AR_TYPE_LABELS: AR_TYPE_LABELS,
    getContentProductionDashboard: getContentProductionDashboard,
    getExplorationPoints: getExplorationPoints,
    getExplorationPointDetail: getExplorationPointDetail,
    generateRelicPlaceholder: generateRelicPlaceholder,
    generateBlessingContent: generateBlessingContent,
    generateARPlaceholder: generateARPlaceholder,
    generateArtRequest: generateArtRequest,
    submitContentReview: submitContentReview,
    getRelics: getRelics,
    getRelicDetail: getRelicDetail,
    getBlessingContents: getBlessingContents,
    getBlessingContentDetail: getBlessingContentDetail,
    getARContents: getARContents,
    getARContentDetail: getARContentDetail,
    getArtRequests: getArtRequests,
    getArtRequestDetail: getArtRequestDetail,
    getGenerationTasks: getGenerationTasks,
    getGenerationTaskDetail: getGenerationTaskDetail,
    buildSearchIndex: buildSearchIndex
  };

  if (typeof module !== "undefined" && module.exports) module.exports = adapter;
  global.LQGContentProductionAdapter = adapter;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : global);

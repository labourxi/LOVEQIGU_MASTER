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
    publish_runtime: "发布到 Runtime",
    exploration_point_generation_task: "探索点生成任务",
    batch_import_task: "批量导入任务"
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

  // ═════════════════════════════════════════════════════════════════
  // V5.9.23 — FULL CRUD METHODS
  // ═════════════════════════════════════════════════════════════════

  function getDefaultExplorationPoint() {
    return {
      id: "",
      parkId: "park_001",
      activityId: "activity_001",
      name: "",
      sceneType: "入口签到",
      locationName: "",
      latitude: 31.23,
      longitude: 121.47,
      checkinType: "GPS",
      status: "DRAFT",
      description: "",
      story: "",
      symbolicMeaning: "",
      arTriggerDescription: "",
      emotionalNarrative: "",
      visualHint: "",
      relicId: null,
      blessingContentId: null,
      arContentId: null,
      artRequestId: null,
      couponId: null,
      reviewStatus: "DRAFT",
      publishStatus: "DRAFT",
      runtimeStatus: "NOT_READY",
      createdAt: nowIso(),
      updatedAt: nowIso()
    };
  }

  function createExplorationPoint(data, actor) {
    var s = ensureSession();
    if (!data || !data.name) return { ok: false, message: "探索点名称不能为空" };
    var point = Object.assign(getDefaultExplorationPoint(), data, {
      id: nextId("ep", s.explorationPoints),
      status: "DRAFT",
      reviewStatus: "DRAFT",
      publishStatus: "DRAFT",
      runtimeStatus: "NOT_READY",
      createdAt: nowIso(),
      updatedAt: nowIso()
    });
    s.explorationPoints.push(point);
    var task = appendTask({
      taskName: "创建探索点 · " + point.name,
      taskType: "generate_relic_placeholder",
      parkId: point.parkId,
      activityId: point.activityId,
      targetType: "exploration_point",
      targetId: point.id,
      executor: (actor && actor.actorId) || "content_ops",
      status: "GENERATED",
      log: "已创建探索点：" + point.name
    });
    persistSession();
    return { ok: true, message: "探索点已创建", explorationPoint: mapPoint(point), generationTask: task };
  }

  function updateExplorationPoint(pointId, patch, actor) {
    var s = ensureSession();
    var index = -1;
    for (var i = 0; i < s.explorationPoints.length; i++) {
      if (s.explorationPoints[i].id === pointId) { index = i; break; }
    }
    if (index < 0) return { ok: false, message: "探索点不存在" };
    var point = s.explorationPoints[index];
    var allowed = [
      "name", "sceneType", "locationName", "latitude", "longitude", "checkinType",
      "description", "story", "symbolicMeaning", "arTriggerDescription",
      "emotionalNarrative", "visualHint", "parkId", "activityId"
    ];
    for (var key in patch) {
      if (patch.hasOwnProperty(key) && allowed.indexOf(key) >= 0) {
        point[key] = patch[key];
      }
    }
    point.updatedAt = nowIso();
    if (patch.status && ["DRAFT", "PUBLISHED", "ARCHIVED", "DELETED"].indexOf(patch.status) >= 0) {
      point.status = patch.status;
    }
    s.explorationPoints[index] = point;
    var task = appendTask({
      taskName: "更新探索点 · " + point.name,
      taskType: "generate_relic_placeholder",
      parkId: point.parkId,
      activityId: point.activityId,
      targetType: "exploration_point",
      targetId: pointId,
      executor: (actor && actor.actorId) || "content_ops",
      status: "GENERATED",
      log: "已更新探索点：" + point.name
    });
    persistSession();
    return { ok: true, message: "探索点已更新", explorationPoint: mapPoint(point), generationTask: task };
  }

  function deleteExplorationPoint(pointId, actor) {
    var s = ensureSession();
    var index = -1;
    for (var i = 0; i < s.explorationPoints.length; i++) {
      if (s.explorationPoints[i].id === pointId) { index = i; break; }
    }
    if (index < 0) return { ok: false, message: "探索点不存在" };
    s.explorationPoints[index].status = "DELETED";
    s.explorationPoints[index].updatedAt = nowIso();
    var task = appendTask({
      taskName: "删除探索点 · " + s.explorationPoints[index].name,
      taskType: "generate_relic_placeholder",
      parkId: s.explorationPoints[index].parkId,
      activityId: s.explorationPoints[index].activityId,
      targetType: "exploration_point",
      targetId: pointId,
      executor: (actor && actor.actorId) || "content_ops",
      status: "GENERATED",
      log: "探索点已删除：id=" + pointId
    });
    persistSession();
    return { ok: true, message: "探索点已删除", generationTask: task };
  }

  function hardDeleteExplorationPoint(pointId, actor) {
    var s = ensureSession();
    var index = -1;
    for (var i = 0; i < s.explorationPoints.length; i++) {
      if (s.explorationPoints[i].id === pointId) { index = i; break; }
    }
    if (index < 0) return { ok: false, message: "探索点不存在" };
    s.explorationPoints.splice(index, 1);
    persistSession();
    return { ok: true, message: "探索点已永久删除" };
  }

  function getExplorationPointList(filter) {
    var list = ensureSession().explorationPoints.slice();
    if (filter && filter.activityId) list = list.filter(function (p) { return p.activityId === filter.activityId; });
    if (filter && filter.status) list = list.filter(function (p) { return p.status === filter.status; });
    if (filter && filter.parkId) list = list.filter(function (p) { return p.parkId === filter.parkId; });
    if (filter && filter.query) {
      var q = filter.query.toLowerCase();
      list = list.filter(function (p) { return p.name.toLowerCase().indexOf(q) >= 0 || (p.description || "").toLowerCase().indexOf(q) >= 0; });
    }
    list = list.filter(function (p) { return p.status !== "DELETED"; });
    return list.map(mapPoint);
  }

  function batchImportExplorationPoints(pointsArray, actor) {
    if (!pointsArray || !pointsArray.length) return { ok: false, message: "导入数据为空" };
    var results = [];
    var errors = [];
    for (var i = 0; i < pointsArray.length; i++) {
      var result = createExplorationPoint(pointsArray[i], actor);
      if (result.ok) {
        results.push(result.explorationPoint);
      } else {
        errors.push({ index: i, name: pointsArray[i].name || "(unnamed)", error: result.message });
      }
    }
    var message = "成功导入 " + results.length + " / " + pointsArray.length + " 个探索点";
    if (errors.length) message += "，失败 " + errors.length + " 个";
    // Register batch import task
    appendTask({
      taskName: "批量导入 · " + results.length + "/" + pointsArray.length + " 个探索点",
      taskType: "batch_import_task",
      parkId: "park_001",
      activityId: "activity_001",
      targetType: "batch",
      targetId: "batch_" + nowIso(),
      executor: (actor && actor.actorId) || "content_ops",
      status: "GENERATED",
      log: message
    });
    return { ok: true, message: message, results: results, errors: errors };
  }

  function exportExplorationPoints() {
    var list = getExplorationPointList({});
    var exportData = {
      version: "V5.9.23",
      exportedAt: nowIso(),
      count: list.length,
      explorationPoints: list
    };
    return exportData;
  }

  function generateExplorationPointsBatch(theme, count) {
    count = count || 10;
    var templates = [
      { name: "四象入口", sceneType: "入口签到", locationName: "入口广场", description: "雾起之地，入口如封印展开。四象石柱分立两侧，地面刻痕隐现金色微光。", story: "四象石柱分立雾气两侧，地面刻痕如封印缓缓展开。你站在世界入口，古老的金色纹路正在苏醒。", symbolicMeaning: "入口即觉醒。四象代表四重生命状态，踏入即是连接开始。", arTriggerDescription: "扫描地面金色纹路，封印将显现第一枚信物印记。", emotionalNarrative: "站在门前，你感受到的不是开始，而是归来。", visualHint: "石柱上的刻痕在雾气中隐现金色微光，地面纹路如呼吸般明灭。" },
      { name: "雾林", sceneType: "自然探索", locationName: "爱企谷林区", description: "雾在林间流动，古木参天，根系如经络般在地面蔓延。", story: "每一棵树的年轮里都藏着一缕未被唤醒的记忆。", symbolicMeaning: "雾是时空的帷幕。林中每一片叶子都是未被阅读的信。", arTriggerDescription: "扫描树根处的玉色苔藓，雾气中浮现木之印记。", emotionalNarrative: "迷失不是错误，而是发现的另一种方式。", visualHint: "雾在树间聚散，偶尔露出深处隐约的光点。" },
      { name: "石径", sceneType: "自然探索", locationName: "爱企谷步道", description: "青石板铺成的小径蜿蜒向前，每一块石板都刻着不同的符号。", story: "岁月磨平了棱角，却未磨灭痕迹。", symbolicMeaning: "石径即是命途。每一步踩在古人走过的痕迹上。", arTriggerDescription: "扫描刻痕最深的石板，石之记忆将沿路径显现。", emotionalNarrative: "有些路不是为了抵达，而是为了让你走这一步。", visualHint: "石板上的刻痕在斜阳下显现深浅不一的影子。" },
      { name: "回声台", sceneType: "互动体验", locationName: "爱企谷中心广场", description: "圆形石台中央有一道浅浅的凹痕，像是被什么声音震出的印记。", story: "站在台上，能听见风穿过石壁的回响。", symbolicMeaning: "回声是时间的涟漪。曾经在这里发出的声音，仍在空气中振动。", arTriggerDescription: "站在凹痕前扫描，声波将转化成可视化的光纹。", emotionalNarrative: "有些声音发出来就没有消失过，只是等待被听见。", visualHint: "凹痕边缘有细微的晶状颗粒，在暗处发出柔和的白光。" },
      { name: "祈愿台", sceneType: "文化体验", locationName: "爱企谷文化区", description: "石台上刻着北斗七星的图案，每一颗星的位置都对应一个字的刻痕。", story: "台面中央有一枚未熄灭的香灰。", symbolicMeaning: "祈愿不是索取，而是将自己的愿望交给星辰。", arTriggerDescription: "扫描北斗七星图案，星辰将回应你的祈愿。", emotionalNarrative: "愿望说出来不是为了实现，而是为了被宇宙听见。", visualHint: "北斗刻痕在月光下会有微弱荧光。" },
      { name: "残卷阁", sceneType: "文化体验", locationName: "爱企谷文化区", description: "一间半塌的木阁，案上散落着残破的卷轴。", story: "墨迹已褪，但某些字句仍然可辨——它们在等一个能读懂的人。", symbolicMeaning: "残卷不是残缺，而是等待。每一段未完成的文字都是留给未来的一封信。", arTriggerDescription: "扫描残卷上的可辨字迹，文字将重新显现。", emotionalNarrative: "被遗忘的文字会等来最后一个读者。", visualHint: "卷轴上的墨迹在特定角度下显现淡金色。" },
      { name: "星痕池", sceneType: "自然探索", locationName: "爱企谷林区", description: "一池静水，水面上仿佛漂浮着碎裂的星光。", story: "池底的石头排列成古老的星图，但大多已经偏移。", symbolicMeaning: "星痕是天上星辰在大地上的投影。", arTriggerDescription: "扫描水面，碎裂的星光将重新汇聚成完整星图。", emotionalNarrative: "星辰从未消失，它们只是沉入水中等待被捞起。", visualHint: "水面平静时可见池底星图。某些石头会偶尔发出微光。" },
      { name: "风语桥", sceneType: "自然探索", locationName: "爱企谷溪流区", description: "一座古朴的石桥横跨溪流，桥栏上系着许多褪色的布条。", story: "风过时，布条轻轻飘动，像是在传递什么消息。", symbolicMeaning: "风是世上最古老的传信者。", arTriggerDescription: "扫描飘动的布条，风将把它承载的消息显现出来。", emotionalNarrative: "风会把你的话带到它该去的地方。", visualHint: "布条在风中飘动的节奏各不相同。" },
      { name: "旧忆碑林", sceneType: "文化体验", locationName: "爱企谷文化区", description: "数十块石碑错落而立，每一块上都刻着不同的名字和日期。", story: "有些已经被藤蔓覆盖，有些仍然清晰。", symbolicMeaning: "石碑不是终点，而是标记。每一个名字都是一个曾经存在于世界上的回响。", arTriggerDescription: "扫描被藤蔓覆盖的碑文，名字将重新显现并留下印记。", emotionalNarrative: "被记住的人不会真正消失。", visualHint: "藤蔓在石碑上生长成奇特的图案。" },
      { name: "归真之门", sceneType: "终点仪式", locationName: "爱企谷出口区", description: "一扇朴素的门立在径的尽头，门框上没有任何装饰。", story: "推开它，不是离开，而是回到开始的地方。", symbolicMeaning: "归真不是结束，而是圆满。门后不是新的世界，而是你已走过的路。", arTriggerDescription: "扫描门缝中的光，完整的探索图谱将在你面前展开。", emotionalNarrative: "所有的旅途都是一次归家。", visualHint: "门在雾中若隐若现。门缝中透出的光与入口处的金光是同一种颜色。" }
    ];
    var result = [];
    var seed = "theme_" + (theme || "default").replace(/[^a-zA-Z0-9_]/g, "");
    for (var i = 0; i < count && i < templates.length; i++) {
      result.push(Object.assign(getDefaultExplorationPoint(), templates[i], {
        name: (theme ? theme + " · " : "") + templates[i].name,
        sceneType: templates[i].sceneType,
        locationName: templates[i].locationName,
        latitude: 31.23 + (Math.random() * 0.01 - 0.005),
        longitude: 121.47 + (Math.random() * 0.01 - 0.005)
      }));
    }
    return result;
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
    buildSearchIndex: buildSearchIndex,
    // V5.9.23: Full CRUD
    createExplorationPoint: createExplorationPoint,
    updateExplorationPoint: updateExplorationPoint,
    deleteExplorationPoint: deleteExplorationPoint,
    hardDeleteExplorationPoint: hardDeleteExplorationPoint,
    getExplorationPointList: getExplorationPointList,
    batchImportExplorationPoints: batchImportExplorationPoints,
    exportExplorationPoints: exportExplorationPoints,
    generateExplorationPointsBatch: generateExplorationPointsBatch
  };

  if (typeof module !== "undefined" && module.exports) module.exports = adapter;
  global.LQGContentProductionAdapter = adapter;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : global);

/**
 * LOVEQIGU Phase 2 unified mock source.
 * Does not replace existing mock-store.js / redemption-store.js — pages migrate gradually.
 */
(function (global) {
  var mockSource = {
    mode: "mock",

    users: [
      { id: "user_001", nickname: "游客小游", avatar: "", phone: "138****0001", role: "visitor", currentParkId: "park_001", currentActivityId: "activity_001", createdAt: "2026-06-01T08:00:00+08:00", updatedAt: "2026-06-20T10:00:00+08:00" },
      { id: "user_10001", nickname: "探索者", avatar: "", phone: "138****0002", role: "visitor", currentParkId: "park_001", currentActivityId: "activity_001", createdAt: "2026-06-01T08:00:00+08:00", updatedAt: "2026-06-20T10:00:00+08:00" }
    ],

    userProgress: [
      {
        id: "up_001", userId: "user_001", parkId: "park_001", activityId: "activity_001",
        visitedPointIds: [], completedPointIds: [], collectedRelicIds: [],
        claimedCouponIds: ["claim_001"], redeemedCouponIds: [],
        currentChapter: "第一章", progressPercent: 0,
        updatedAt: "2026-06-20T10:00:00+08:00"
      }
    ],

    userPointStates: [
      {
        id: "ups_001", userId: "user_001", pointId: "ep_001", parkId: "park_001", activityId: "activity_001",
        status: "AVAILABLE", arrivedAt: "", checkedInAt: "", arScannedAt: "", relicRevealedAt: "", couponUnlockedAt: ""
      },
      {
        id: "ups_002", userId: "user_001", pointId: "ep_002", parkId: "park_001", activityId: "activity_001",
        status: "LOCKED", arrivedAt: "", checkedInAt: "", arScannedAt: "", relicRevealedAt: "", couponUnlockedAt: ""
      }
    ],

    userRelics: [],

    arScanSessions: [],

    parks: [
      { id: "park_001", name: "爱企谷", region: "华东", status: "ACTIVE", description: "初见寻宝活动主景区", contactName: "园区负责人", contactPhone: "021-****0001", merchantCount: 28, activityCount: 5, explorationPointCount: 8, createdAt: "2026-01-01T00:00:00+08:00", updatedAt: "2026-06-18T10:00:00+08:00" },
      { id: "park_002", name: "爱企谷湖畔景区", region: "华东", status: "ACTIVE", description: "", contactName: "", contactPhone: "", merchantCount: 5, activityCount: 2, explorationPointCount: 3, createdAt: "2026-02-01T00:00:00+08:00", updatedAt: "2026-06-10T10:00:00+08:00" },
      { id: "park_003", name: "爱企谷森林景区", region: "华南", status: "DISABLED", description: "", contactName: "", contactPhone: "", merchantCount: 3, activityCount: 1, explorationPointCount: 2, createdAt: "2026-03-01T00:00:00+08:00", updatedAt: "2026-05-01T10:00:00+08:00" }
    ],

    merchants: [
      { id: "merchant_001", parkId: "park_001", name: "爱企谷咖啡", category: "餐饮", contactName: "张店长", contactPhone: "138****1001", address: "爱企谷入口广场东侧", accountStatus: "ACTIVE", createdAt: "2026-01-15T00:00:00+08:00", updatedAt: "2026-06-20T09:00:00+08:00" },
      { id: "merchant_002", parkId: "park_001", name: "探索书屋", category: "文化", contactName: "王店员", contactPhone: "138****2001", address: "爱企谷书屋区", accountStatus: "ACTIVE", createdAt: "2026-01-20T00:00:00+08:00", updatedAt: "2026-06-19T14:00:00+08:00" },
      { id: "merchant_003", parkId: "park_001", name: "在地茶舍", category: "餐饮", contactName: "李掌柜", contactPhone: "138****3001", address: "爱企谷茶舍巷", accountStatus: "INACTIVE", createdAt: "2026-02-01T00:00:00+08:00", updatedAt: "2026-06-15T11:00:00+08:00" },
      { id: "merchant_004", parkId: "park_001", name: "爱企谷手作馆", category: "体验", contactName: "陈老师", contactPhone: "138****4001", address: "爱企谷手作坊", accountStatus: "ACTIVE", createdAt: "2026-02-10T00:00:00+08:00", updatedAt: "2026-06-18T16:00:00+08:00" }
    ],

    activities: [
      {
        id: "activity_001", parkId: "park_001", name: "爱企谷初见寻宝节", startDate: "2026-06-01", endDate: "2026-08-31",
        status: "ACTIVE", reviewStatus: "APPROVED", publishCheckStatus: "PUBLISHED", publishStatus: "PUBLISHED",
        description: "游客完成园区探索后可领取在地礼遇", linkedMerchantIds: ["merchant_001", "merchant_002", "merchant_003", "merchant_004"],
        linkedExplorationPointIds: ["ep_001", "ep_002"], declarationAccepted: true, declarationVersion: "PARK_ACTIVITY_SUBMIT_DECLARATION_V1",
        createdBy: "park_admin_001", merchantCount: 4, explorationPointCount: 2, couponCount: 2,
        createdAt: "2026-05-01T00:00:00+08:00", updatedAt: "2026-06-20T08:00:00+08:00"
      },
      {
        id: "activity_002", parkId: "park_001", name: "爱企谷夏日探索", startDate: "2026-07-01", endDate: "2026-09-30",
        status: "DRAFT", reviewStatus: "BLOCKED", publishCheckStatus: "BLOCKED", publishStatus: "DRAFT",
        description: "夏日主题探索活动草稿", linkedMerchantIds: ["merchant_001", "merchant_002"], linkedExplorationPointIds: ["ep_001"],
        declarationAccepted: false, declarationVersion: "", createdBy: "park_admin_001", merchantCount: 2, explorationPointCount: 1, couponCount: 0,
        createdAt: "2026-06-10T00:00:00+08:00", updatedAt: "2026-06-18T10:00:00+08:00"
      },
      {
        id: "activity_003", parkId: "park_002", name: "湖畔夜游节", startDate: "2026-08-01", endDate: "2026-08-31",
        status: "DRAFT", reviewStatus: "PENDING_REVIEW", publishCheckStatus: "PENDING_REVIEW", publishStatus: "DRAFT",
        description: "", linkedMerchantIds: [], linkedExplorationPointIds: [], declarationAccepted: true,
        declarationVersion: "PARK_ACTIVITY_SUBMIT_DECLARATION_V1", createdBy: "park_admin_002", merchantCount: 0, explorationPointCount: 0, couponCount: 0,
        createdAt: "2026-06-05T00:00:00+08:00", updatedAt: "2026-06-17T15:00:00+08:00"
      }
    ],

    reviewRecords: [
      {
        id: "review_001", targetType: "activity", targetId: "activity_002", targetName: "爱企谷夏日探索",
        parkId: "park_001", activityId: "activity_002", sourceModule: "园区发布检查",
        submittedBy: "park_admin_001", submittedRole: "park_admin", status: "BLOCKED",
        reviewConclusion: "礼遇配置待补充，暂不可发布",
        blockReason: "礼遇配置仍处于待补充状态，暂不可发布。",
        optimizationSuggestion: "建议补充游客完成探索后如何领取到店礼遇的路径说明，并明确各商家到店核销规则。",
        needSupplement: "请补充礼遇领取说明、参与商家承接说明、游客到店路径。",
        nextStepSuggestion: "修改后可再次提交发布检查。",
        reviewerId: "platform_ops", reviewerName: "平台内容运营组", reviewedAt: "2026-06-20T15:30:00+08:00",
        createdAt: "2026-06-19T14:05:00+08:00", updatedAt: "2026-06-20T15:30:00+08:00"
      },
      {
        id: "review_002", targetType: "activity", targetId: "activity_001", targetName: "爱企谷初见寻宝节",
        parkId: "park_001", activityId: "activity_001", sourceModule: "园区发布检查",
        submittedBy: "park_admin_001", submittedRole: "park_admin", status: "APPROVED",
        reviewConclusion: "已通过平台发布检查", blockReason: "", optimizationSuggestion: "",
        needSupplement: "", nextStepSuggestion: "活动已上线，请关注运营数据。",
        reviewerId: "platform_ops", reviewerName: "平台内容运营组", reviewedAt: "2026-06-18T11:00:00+08:00",
        createdAt: "2026-06-17T10:00:00+08:00", updatedAt: "2026-06-18T11:00:00+08:00"
      },
      {
        id: "review_activity_001", targetType: "activity", targetId: "activity_003", targetName: "湖畔夜游节",
        parkId: "park_002", activityId: "activity_003", sourceModule: "园区发布检查",
        submittedBy: "park_admin_002", submittedRole: "park_admin", status: "PENDING_REVIEW",
        reviewConclusion: "", blockReason: "", optimizationSuggestion: "", needSupplement: "", nextStepSuggestion: "",
        reviewerId: "", reviewerName: "", reviewedAt: "",
        createdAt: "2026-06-17T15:00:00+08:00", updatedAt: "2026-06-17T15:00:00+08:00"
      },
      {
        id: "review_relic_001", targetType: "relic", targetId: "relic_001", targetName: "初见印记",
        parkId: "park_001", activityId: "activity_001", sourceModule: "内容生产 / 信物管理",
        submittedBy: "content_ops", submittedRole: "platform_admin", status: "PENDING_REVIEW",
        reviewConclusion: "", blockReason: "", optimizationSuggestion: "", needSupplement: "", nextStepSuggestion: "",
        reviewerId: "", reviewerName: "", reviewedAt: "",
        createdAt: "2026-06-18T10:00:00+08:00", updatedAt: "2026-06-18T10:00:00+08:00"
      },
      {
        id: "review_ar_001", targetType: "ar_content", targetId: "ar_001", targetName: "入口显现仪式",
        parkId: "park_001", activityId: "activity_001", sourceModule: "内容生产 / AR内容管理",
        submittedBy: "content_ops", submittedRole: "platform_admin", status: "APPROVED",
        reviewConclusion: "AR 显现配置完整，可进入发布中心", blockReason: "", optimizationSuggestion: "",
        needSupplement: "", nextStepSuggestion: "等待平台发布占位",
        reviewerId: "platform_ops", reviewerName: "平台内容运营组", reviewedAt: "2026-06-19T16:00:00+08:00",
        createdAt: "2026-06-18T14:00:00+08:00", updatedAt: "2026-06-19T16:00:00+08:00"
      },
      {
        id: "review_ep_001", targetType: "exploration_point", targetId: "ep_002", targetName: "咖啡角",
        parkId: "park_001", activityId: "activity_001", sourceModule: "内容生产 / 探索点管理",
        submittedBy: "content_ops", submittedRole: "platform_admin", status: "NEED_INFO",
        reviewConclusion: "探索点配置待补充", blockReason: "",
        optimizationSuggestion: "建议补充祝福文案与 AR 绑定说明",
        needSupplement: "祝福文案、AR 绑定配置", nextStepSuggestion: "补充后重新提交审查",
        reviewerId: "platform_ops", reviewerName: "平台内容运营组", reviewedAt: "2026-06-20T11:00:00+08:00",
        createdAt: "2026-06-19T09:00:00+08:00", updatedAt: "2026-06-20T11:00:00+08:00"
      },
      {
        id: "review_coupon_001", targetType: "coupon", targetId: "coupon_002", targetName: "书店阅读体验券",
        parkId: "park_001", activityId: "activity_001", sourceModule: "礼遇配置",
        submittedBy: "merchant_002", submittedRole: "merchant_admin", status: "PENDING_REVIEW",
        reviewConclusion: "", blockReason: "", optimizationSuggestion: "", needSupplement: "", nextStepSuggestion: "",
        reviewerId: "", reviewerName: "", reviewedAt: "",
        createdAt: "2026-06-16T09:10:00+08:00", updatedAt: "2026-06-16T09:10:00+08:00"
      },
      {
        id: "review_art_001", targetType: "art_request", targetId: "art_001", targetName: "初见印记视觉",
        parkId: "park_001", activityId: "activity_001", sourceModule: "内容生产 / 美术需求",
        submittedBy: "content_ops", submittedRole: "platform_admin", status: "PENDING_REVIEW",
        reviewConclusion: "", blockReason: "", optimizationSuggestion: "", needSupplement: "", nextStepSuggestion: "",
        reviewerId: "", reviewerName: "", reviewedAt: "",
        createdAt: "2026-06-19T11:30:00+08:00", updatedAt: "2026-06-19T11:30:00+08:00"
      }
    ],

    publishRecords: [
      {
        id: "publish_activity_001", targetType: "activity", targetId: "activity_001", targetName: "爱企谷初见寻宝节",
        parkId: "park_001", activityId: "activity_001", reviewStatus: "APPROVED",
        publishCheckStatus: "PUBLISHED", runtimeStatus: "PUBLISHED", riskStatus: "NORMAL",
        publishedBy: "platform_ops", publisherName: "平台运营", publishedAt: "2026-06-01T09:00:00+08:00",
        log: "活动已发布（Mock Runtime 占位）",
        createdAt: "2026-06-18T11:00:00+08:00", updatedAt: "2026-06-01T09:00:00+08:00"
      },
      {
        id: "publish_ar_001", targetType: "ar_content", targetId: "ar_001", targetName: "入口显现仪式",
        parkId: "park_001", activityId: "activity_001", reviewStatus: "APPROVED",
        publishCheckStatus: "READY_TO_PUBLISH", runtimeStatus: "READY", riskStatus: "NORMAL",
        publishedBy: "", publisherName: "", publishedAt: "",
        log: "", createdAt: "2026-06-19T16:00:00+08:00", updatedAt: "2026-06-19T16:00:00+08:00"
      },
      {
        id: "publish_relic_001", targetType: "relic", targetId: "relic_001", targetName: "初见印记",
        parkId: "park_001", activityId: "activity_001", reviewStatus: "APPROVED",
        publishCheckStatus: "READY_TO_PUBLISH", runtimeStatus: "READY", riskStatus: "NORMAL",
        publishedBy: "", publisherName: "", publishedAt: "",
        log: "", createdAt: "2026-06-18T12:00:00+08:00", updatedAt: "2026-06-18T12:00:00+08:00"
      },
      {
        id: "publish_activity_003", targetType: "activity", targetId: "activity_003", targetName: "湖畔夜游节",
        parkId: "park_002", activityId: "activity_003", reviewStatus: "PENDING_REVIEW",
        publishCheckStatus: "BLOCKED", runtimeStatus: "NOT_READY", riskStatus: "BLOCKED",
        publishedBy: "", publisherName: "", publishedAt: "",
        log: "审查未完成，不可发布",
        createdAt: "2026-06-17T15:00:00+08:00", updatedAt: "2026-06-17T15:00:00+08:00"
      },
      {
        id: "publish_ep_002", targetType: "exploration_point", targetId: "ep_002", targetName: "咖啡角",
        parkId: "park_001", activityId: "activity_001", reviewStatus: "NEED_INFO",
        publishCheckStatus: "BLOCKED", runtimeStatus: "NOT_READY", riskStatus: "WARNING",
        publishedBy: "", publisherName: "", publishedAt: "",
        log: "待补充内容，暂不可发布",
        createdAt: "2026-06-20T11:00:00+08:00", updatedAt: "2026-06-20T11:00:00+08:00"
      },
      {
        id: "publish_failed_001", targetType: "relic", targetId: "relic_002", targetName: "咖啡回响",
        parkId: "park_001", activityId: "activity_001", reviewStatus: "APPROVED",
        publishCheckStatus: "PUBLISH_FAILED", runtimeStatus: "FAILED", riskStatus: "WARNING",
        publishedBy: "platform_ops", publisherName: "平台运营", publishedAt: "",
        log: "Mock：AR 资源未就绪导致发布失败",
        createdAt: "2026-06-20T10:00:00+08:00", updatedAt: "2026-06-20T10:30:00+08:00"
      }
    ],

    publishLogs: [
      {
        id: "plog_001", publishRecordId: "publish_activity_001", action: "CREATE_PUBLISH_RECORD",
        actorId: "platform_ops", actorRole: "platform_admin", actorName: "平台运营",
        beforeStatus: "NOT_READY", afterStatus: "READY",
        summary: "审查通过，创建活动发布记录",
        createdAt: "2026-06-18T11:00:00+08:00"
      },
      {
        id: "plog_002", publishRecordId: "publish_activity_001", action: "START_PUBLISH",
        actorId: "platform_ops", actorRole: "platform_admin", actorName: "平台运营",
        beforeStatus: "READY", afterStatus: "PUBLISHING",
        summary: "开始 Mock Runtime 发布",
        createdAt: "2026-06-01T08:55:00+08:00"
      },
      {
        id: "plog_003", publishRecordId: "publish_activity_001", action: "PUBLISH_SUCCESS",
        actorId: "platform_ops", actorRole: "platform_admin", actorName: "平台运营",
        beforeStatus: "PUBLISHING", afterStatus: "PUBLISHED",
        summary: "活动已发布到 Runtime 占位",
        createdAt: "2026-06-01T09:00:00+08:00"
      },
      {
        id: "plog_004", publishRecordId: "publish_failed_001", action: "PUBLISH_FAILED",
        actorId: "platform_ops", actorRole: "platform_admin", actorName: "平台运营",
        beforeStatus: "PUBLISHING", afterStatus: "FAILED",
        summary: "发布失败：AR 资源未就绪",
        createdAt: "2026-06-20T10:30:00+08:00"
      }
    ],

    explorationPoints: [
      {
        id: "ep_001", parkId: "park_001", activityId: "activity_001", name: "入口广场", sceneType: "入口签到",
        locationName: "主入口", latitude: 31.23, longitude: 121.47, checkinType: "GPS",
        status: "READY_TO_PUBLISH", relicId: "relic_001", couponId: "coupon_001", blessingContentId: "bless_001", arContentId: "ar_001",
        artRequestId: "art_001", reviewStatus: "APPROVED", publishStatus: "READY_TO_PUBLISH", runtimeStatus: "READY",
        createdAt: "2026-05-10T00:00:00+08:00", updatedAt: "2026-06-19T16:00:00+08:00"
      },
      {
        id: "ep_002", parkId: "park_001", activityId: "activity_001", name: "咖啡角", sceneType: "商家点位",
        locationName: "咖啡区", latitude: 31.231, longitude: 121.471, checkinType: "GPS",
        status: "DRAFT", relicId: "relic_002", blessingContentId: "bless_002", arContentId: null,
        artRequestId: null, reviewStatus: "DRAFT", publishStatus: "DRAFT", runtimeStatus: "NOT_READY",
        createdAt: "2026-05-12T00:00:00+08:00", updatedAt: "2026-06-20T14:00:00+08:00"
      }
    ],

    relics: [
      {
        id: "relic_001", parkId: "park_001", activityId: "activity_001", explorationPointId: "ep_001",
        name: "初见印记", chapter: "第一章", node: "初遇", level: "初遇",
        appearStatus: "CONFIGURED", copyStatus: "FINALIZED", arStatus: "BOUND", artStatus: "BOUND",
        reviewStatus: "PENDING_REVIEW", publishStatus: "READY_TO_PUBLISH", runtimeStatus: "READY",
        createdAt: "2026-05-15T00:00:00+08:00", updatedAt: "2026-06-18T11:00:00+08:00"
      },
      {
        id: "relic_002", parkId: "park_001", activityId: "activity_001", explorationPointId: "ep_002",
        name: "咖啡回响", chapter: "第二章", node: "协作", level: "协作",
        appearStatus: "PENDING_GENERATION", copyStatus: "DRAFT", arStatus: "PENDING_BINDING", artStatus: "PENDING",
        reviewStatus: "DRAFT", publishStatus: "DRAFT", runtimeStatus: "NOT_READY",
        createdAt: "2026-05-16T00:00:00+08:00", updatedAt: "2026-06-20T10:00:00+08:00"
      }
    ],

    blessingContents: [
      {
        id: "bless_001", parkId: "park_001", activityId: "activity_001", explorationPointId: "ep_001", relicId: "relic_001",
        title: "入口显现祝福", contentType: "revelation", content: "初见之时，印记将随回响显现。",
        copyStatus: "FINALIZED", reviewStatus: "PENDING_REVIEW", publishStatus: "DRAFT", runtimeStatus: "NOT_READY",
        createdAt: "2026-05-20T00:00:00+08:00", updatedAt: "2026-06-17T09:00:00+08:00"
      },
      {
        id: "bless_002", parkId: "park_001", activityId: "activity_001", explorationPointId: "ep_002", relicId: "relic_002",
        title: "咖啡角领取提示", contentType: "claim_hint", content: "",
        copyStatus: "DRAFT", reviewStatus: "DRAFT", publishStatus: "DRAFT", runtimeStatus: "NOT_READY",
        createdAt: "2026-05-21T00:00:00+08:00", updatedAt: "2026-06-19T15:00:00+08:00"
      }
    ],

    arContents: [
      {
        id: "ar_001", parkId: "park_001", activityId: "activity_001", explorationPointId: "ep_001", relicId: "relic_001",
        name: "入口显现仪式", arType: "revelation_ritual", resourceStatus: "GENERATED", previewStatus: "READY",
        reviewStatus: "APPROVED", publishStatus: "READY_TO_PUBLISH", runtimeStatus: "READY", configJson: "{}",
        createdAt: "2026-05-22T00:00:00+08:00", updatedAt: "2026-06-18T16:30:00+08:00"
      },
      {
        id: "ar_002", parkId: "park_001", activityId: "activity_001", explorationPointId: "ep_002", relicId: "relic_002",
        name: "咖啡角 AR 扫描", arType: "scan", resourceStatus: "PENDING_GENERATION", previewStatus: "DRAFT",
        reviewStatus: "DRAFT", publishStatus: "DRAFT", runtimeStatus: "NOT_READY", configJson: "{}",
        createdAt: "2026-05-23T00:00:00+08:00", updatedAt: "2026-06-20T11:00:00+08:00"
      }
    ],

    coupons: [
      { id: "coupon_001", parkId: "park_001", activityId: "activity_001", merchantId: "merchant_001", name: "咖啡到店礼", benefitType: "EXCHANGE", description: "到店享 8 折礼遇", issueTotal: 300, claimedCount: 180, redeemedCount: 72, claimRate: 0.6, redemptionRate: 0.4, startDate: "2026-06-01", endDate: "2026-08-31", status: "ACTIVE", createdAt: "2026-05-25T00:00:00+08:00", updatedAt: "2026-06-20T12:00:00+08:00" },
      { id: "coupon_002", parkId: "park_001", activityId: "activity_001", merchantId: "merchant_002", name: "书店阅读体验券", benefitType: "GIFT", description: "阅读体验 30 分钟", issueTotal: 200, claimedCount: 86, redeemedCount: 12, claimRate: 0.43, redemptionRate: 0.14, startDate: "2026-06-01", endDate: "2026-08-31", status: "ACTIVE", createdAt: "2026-05-26T00:00:00+08:00", updatedAt: "2026-06-19T10:00:00+08:00" }
    ],

    merchantStaff: [
      { id: "staff_001", merchantId: "merchant_001", name: "张店长", role: "merchant_admin", phone: "138****1001", status: "ACTIVE" },
      { id: "staff_002", merchantId: "merchant_001", name: "小李", role: "merchant_staff", phone: "138****1002", status: "ACTIVE" }
    ],

    couponClaims: [
      { id: "claim_001", couponId: "coupon_001", userId: "user_001", claimCode: "LQG-CAFE-1001", claimStatus: "UNUSED", claimedAt: "2026-06-20T10:15:00+08:00", redeemedAt: "", redeemedByStaffId: "", merchantId: "merchant_001", parkId: "park_001", activityId: "activity_001", sourcePointId: "ep_001", sourceRelicId: "relic_001" },
      { id: "claim_002", couponId: "coupon_001", userId: "user_10002", claimCode: "LQG-CAFE-1002", claimStatus: "USED", claimedAt: "2026-06-19T14:30:00+08:00", redeemedAt: "2026-06-19T15:05:00+08:00", redeemedByStaffId: "staff_001", merchantId: "merchant_001", parkId: "park_001", activityId: "activity_001" },
      { id: "claim_003", couponId: "coupon_002", userId: "user_10004", claimCode: "LQG-BOOK-2001", claimStatus: "UNUSED", claimedAt: "2026-06-18T09:00:00+08:00", redeemedAt: "", redeemedByStaffId: "", merchantId: "merchant_002", parkId: "park_001", activityId: "activity_001" },
      { id: "claim_004", couponId: "coupon_001", userId: "user_10005", claimCode: "LQG-CAFE-9999", claimStatus: "EXPIRED", claimedAt: "2026-05-01T12:00:00+08:00", redeemedAt: "", redeemedByStaffId: "", merchantId: "merchant_001", parkId: "park_001", activityId: "activity_001" },
      { id: "claim_005", couponId: "coupon_001", userId: "user_10006", claimCode: "LQG-CAFE-INVALID", claimStatus: "INVALID", claimedAt: "2026-06-10T12:00:00+08:00", redeemedAt: "", redeemedByStaffId: "", merchantId: "merchant_001", parkId: "park_001", activityId: "activity_001" }
    ],

    reviews: [
      { id: "rev_001", targetType: "EXPLORATION_POINT", targetId: "ep_001", parkId: "park_001", activityId: "activity_001", submittedBy: "platform_ops", submittedRole: "platform_admin", status: "PENDING_REVIEW", reviewConclusion: "", blockReason: "", optimizationSuggestion: "", reviewerId: "", reviewedAt: "", createdAt: "2026-06-18T10:00:00+08:00", updatedAt: "2026-06-18T10:00:00+08:00" },
      { id: "rev_002", targetType: "RELIC", targetId: "relic_001", parkId: "park_001", activityId: "activity_001", submittedBy: "content_ops", submittedRole: "platform_admin", status: "PENDING_REVIEW", reviewConclusion: "", blockReason: "", optimizationSuggestion: "", reviewerId: "", reviewedAt: "", createdAt: "2026-06-17T11:00:00+08:00", updatedAt: "2026-06-17T11:00:00+08:00" }
    ],

    publishes: [
      { id: "pub_001", targetType: "RELIC", targetId: "relic_001", parkId: "park_001", activityId: "activity_001", reviewStatus: "APPROVED", publishCheckStatus: "READY", runtimeStatus: "DRAFT", riskStatus: "NORMAL", publishedBy: "", publishedAt: "", log: "" },
      { id: "pub_002", targetType: "ACTIVITY", targetId: "activity_001", parkId: "park_001", activityId: "activity_001", reviewStatus: "APPROVED", publishCheckStatus: "READY", runtimeStatus: "PUBLISHED", riskStatus: "NORMAL", publishedBy: "platform_ops", publishedAt: "2026-06-01T09:00:00+08:00", log: "活动已发布" }
    ],

    workOrders: [
      { id: "tkt_001", sourceRole: "merchant_admin", sourceUserId: "merchant_001", parkId: "park_001", merchantId: "merchant_001", title: "核销码无法识别", type: "REDEMPTION_ISSUE", status: "OPEN", description: "扫码后提示无效", reply: "", createdAt: "2026-06-20T09:15:00+08:00", updatedAt: "2026-06-20T09:15:00+08:00" },
      { id: "tkt_002", sourceRole: "park_admin", sourceUserId: "park_admin_001", parkId: "park_001", merchantId: "", title: "活动发布检查咨询", type: "OTHER", status: "PROCESSING", description: "", reply: "平台运营已受理", createdAt: "2026-06-19T14:30:00+08:00", updatedAt: "2026-06-19T16:00:00+08:00" }
    ],

    operationLogs: [
      {
        id: "log_001", actorId: "park_admin_001", actorRole: "park_admin", parkId: "park_001", activityId: "activity_002",
        action: "SUBMIT_PUBLISH_CHECK", targetType: "activity", targetId: "activity_002",
        beforeStatus: "DRAFT", afterStatus: "PENDING_REVIEW", statementConfirmed: true,
        declarationVersion: "PARK_ACTIVITY_SUBMIT_DECLARATION_V1",
        summary: "已确认提交声明，提交活动进入平台发布检查。",
        createdAt: "2026-06-19T14:05:00+08:00"
      },
      {
        id: "log_002", actorId: "platform_ops", actorRole: "platform_admin", parkId: "park_001", activityId: "activity_002",
        action: "VIEW_REVIEW_RESULT", targetType: "activity", targetId: "activity_002",
        beforeStatus: "PENDING_REVIEW", afterStatus: "BLOCKED", statementConfirmed: false,
        declarationVersion: "", summary: "平台检查返回：礼遇配置待补充，活动已阻断。",
        createdAt: "2026-06-20T15:30:00+08:00"
      },
      {
        id: "log_003", actorId: "park_admin_001", actorRole: "park_admin", parkId: "park_001", activityId: "activity_001",
        action: "SUBMIT_PUBLISH_CHECK", targetType: "activity", targetId: "activity_001",
        beforeStatus: "DRAFT", afterStatus: "PENDING_REVIEW", statementConfirmed: true,
        declarationVersion: "PARK_ACTIVITY_SUBMIT_DECLARATION_V1",
        summary: "初见寻宝节提交发布检查。",
        createdAt: "2026-06-17T10:00:00+08:00"
      }
    ],

    artRequests: [
      {
        id: "art_001", title: "初见印记视觉", assetType: "信物视觉", parkId: "park_001", activityId: "activity_001",
        explorationPointId: "ep_001", relicId: "relic_001", arContentId: "ar_001",
        toolSuggestion: "会话C", prompt: "初见印记，东方克制，温润金绿，信物显现节点视觉",
        status: "PENDING_REVIEW", reviewStatus: "PENDING_REVIEW",
        createdAt: "2026-06-18T10:00:00+08:00", updatedAt: "2026-06-19T11:30:00+08:00"
      },
      {
        id: "art_002", title: "咖啡角探索点视觉", assetType: "探索点视觉", parkId: "park_001", activityId: "activity_001",
        explorationPointId: "ep_002", relicId: "relic_002", arContentId: "",
        toolSuggestion: "豆包", prompt: "咖啡角探索点，温暖木质与咖啡香气，商家协作点位",
        status: "PROCESSING", reviewStatus: "DRAFT",
        createdAt: "2026-06-19T15:30:00+08:00", updatedAt: "2026-06-20T14:00:00+08:00"
      }
    ],

    generationTasks: [
      {
        id: "task_001", taskName: "生成祝福文案 · 咖啡角", taskType: "generate_blessing_copy",
        parkId: "park_001", activityId: "activity_001", targetType: "exploration_point", targetId: "ep_002",
        executor: "会话C", status: "PROCESSING", log: "Mock 生成中：祝福文案候选",
        createdAt: "2026-06-20T14:00:00+08:00", updatedAt: "2026-06-20T14:00:00+08:00"
      },
      {
        id: "task_002", taskName: "发布到 Runtime · 初见印记", taskType: "publish_runtime",
        parkId: "park_001", activityId: "activity_001", targetType: "relic", targetId: "relic_001",
        executor: "平台运营", status: "READY_TO_PUBLISH", log: "等待平台发布占位",
        createdAt: "2026-06-18T11:00:00+08:00", updatedAt: "2026-06-18T11:00:00+08:00"
      }
    ]
  };

  function clone(val) {
    return JSON.parse(JSON.stringify(val));
  }

  mockSource.get = function (collection, id) {
    var list = mockSource[collection] || [];
    if (!id) return clone(list);
    return clone(list.find(function (item) { return item.id === id; }) || null);
  };

  mockSource.find = function (collection, predicate) {
    var list = mockSource[collection] || [];
    return clone(list.filter(predicate));
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = mockSource;
  }
  global.LQGMockSource = mockSource;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : global);

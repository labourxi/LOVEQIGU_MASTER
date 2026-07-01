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
        id: "ep_001", parkId: "park_001", activityId: "activity_001", name: "四象入口", sceneType: "入口签到",
        locationName: "入口广场", latitude: 31.23, longitude: 121.47, checkinType: "GPS",
        status: "PUBLISHED",
        description: "雾起之地，入口如封印展开。四象石柱分立两侧，地面刻痕隐现金色微光。",
        story: "四象石柱分立雾气两侧，地面刻痕如封印缓缓展开。你站在世界入口，古老的金色纹路正在苏醒。",
        symbolicMeaning: "入口即觉醒。四象代表四重生命状态，踏入即是连接开始。",
        arTriggerDescription: "扫描地面金色纹路，封印将显现第一枚信物印记。",
        emotionalNarrative: "站在门前，你感受到的不是开始，而是归来。",
        visualHint: "石柱上的刻痕在雾气中隐现金色微光，地面纹路如呼吸般明灭。",
        relicId: "relic_001", couponId: "coupon_001", blessingContentId: "bless_001", arContentId: "ar_001",
        artRequestId: "art_001", reviewStatus: "APPROVED", publishStatus: "PUBLISHED", runtimeStatus: "READY",
        createdAt: "2026-05-10T00:00:00+08:00", updatedAt: "2026-06-19T16:00:00+08:00"
      },
      {
        id: "ep_002", parkId: "park_001", activityId: "activity_001", name: "雾林", sceneType: "自然探索",
        locationName: "爱企谷林区", latitude: 31.235, longitude: 121.465, checkinType: "GPS",
        status: "PUBLISHED",
        description: "雾在林间流动，古木参天，根系如经络般在地面蔓延。每一棵树的年轮里都藏着一缕未被唤醒的记忆。",
        story: "雾在林间流动，古木参天。每一棵树的年轮里都藏着一缕未被唤醒的记忆。",
        symbolicMeaning: "雾是时空的帷幕。林中每一片叶子都是未被阅读的信。",
        arTriggerDescription: "扫描树根处的玉色苔藓，雾气中浮现木之印记。",
        emotionalNarrative: "迷失不是错误，而是发现的另一种方式。",
        visualHint: "雾在树间聚散，偶尔露出深处隐约的光点。树根处苔藓呈玉色。",
        relicId: "relic_002", blessingContentId: "bless_002", arContentId: "ar_002",
        artRequestId: "art_002", reviewStatus: "APPROVED", publishStatus: "PUBLISHED", runtimeStatus: "READY",
        createdAt: "2026-05-12T00:00:00+08:00", updatedAt: "2026-06-20T14:00:00+08:00"
      },
      {
        id: "ep_003", parkId: "park_001", activityId: "activity_001", name: "石径", sceneType: "自然探索",
        locationName: "爱企谷步道", latitude: 31.232, longitude: 121.473, checkinType: "GPS",
        status: "PUBLISHED",
        description: "青石板铺成的小径蜿蜒向前，每一块石板都刻着不同的符号。岁月磨平了棱角，却未磨灭痕迹。",
        story: "岁月磨平了棱角，却未磨灭痕迹。石板上的符号像是古老的文字。",
        symbolicMeaning: "石径即是命途。每一步踩在古人走过的痕迹上，你正在重复一场古老的仪式。",
        arTriggerDescription: "扫描刻痕最深的石板，石之记忆将沿路径显现。",
        emotionalNarrative: "有些路不是为了抵达，而是为了让你走这一步。",
        visualHint: "石板上的刻痕在斜阳下显现深浅不一的影子。某些石缝中透出微光。",
        reviewStatus: "APPROVED", publishStatus: "PUBLISHED", runtimeStatus: "READY",
        createdAt: "2026-05-15T00:00:00+08:00", updatedAt: "2026-06-18T10:00:00+08:00"
      },
      {
        id: "ep_004", parkId: "park_001", activityId: "activity_001", name: "回声台", sceneType: "互动体验",
        locationName: "爱企谷中心广场", latitude: 31.228, longitude: 121.469, checkinType: "GPS",
        status: "PUBLISHED",
        description: "圆形石台中央有一道浅浅的凹痕，像是被什么声音震出的印记。站在台上，能听见风穿过石壁的回响。",
        story: "圆形石台中央有一道浅浅的凹痕，像是被什么声音震出的印记。",
        symbolicMeaning: "回声是时间的涟漪。曾经在这里发出的声音，仍在空气中振动。",
        arTriggerDescription: "站在凹痕前扫描，声波将转化成可视化的光纹。",
        emotionalNarrative: "有些声音发出来就没有消失过，只是等待被听见。",
        visualHint: "凹痕边缘有细微的晶状颗粒，在暗处发出柔和的白光。",
        reviewStatus: "APPROVED", publishStatus: "PUBLISHED", runtimeStatus: "READY",
        createdAt: "2026-05-18T00:00:00+08:00", updatedAt: "2026-06-17T09:00:00+08:00"
      },
      {
        id: "ep_005", parkId: "park_001", activityId: "activity_001", name: "祈愿台", sceneType: "文化体验",
        locationName: "爱企谷文化区", latitude: 31.225, longitude: 121.475, checkinType: "GPS",
        status: "PUBLISHED",
        description: "石台上刻着北斗七星的图案，每一颗星的位置都对应一个字的刻痕。台面中央有一枚未熄灭的香灰。",
        story: "石台上刻着北斗七星的图案，台面中央有一枚未熄灭的香灰。",
        symbolicMeaning: "祈愿不是索取，而是将自己的愿望交给星辰。星星不会回应，但它们会记住。",
        arTriggerDescription: "扫描北斗七星图案，星辰将回应你的祈愿。",
        emotionalNarrative: "愿望说出来不是为了实现，而是为了被宇宙听见。",
        visualHint: "北斗刻痕在月光下会有微弱荧光。香灰处偶有热气升腾。",
        reviewStatus: "APPROVED", publishStatus: "PUBLISHED", runtimeStatus: "READY",
        createdAt: "2026-05-20T00:00:00+08:00", updatedAt: "2026-06-16T11:00:00+08:00"
      },
      {
        id: "ep_006", parkId: "park_001", activityId: "activity_001", name: "残卷阁", sceneType: "文化体验",
        locationName: "爱企谷文化区", latitude: 31.227, longitude: 121.478, checkinType: "GPS",
        status: "PUBLISHED",
        description: "一间半塌的木阁，案上散落着残破的卷轴。墨迹已褪，但某些字句仍然可辨——它们在等一个能读懂的人。",
        story: "墨迹已褪，但某些字句仍然可辨——它们在等一个能读懂的人。",
        symbolicMeaning: "残卷不是残缺，而是等待。每一段未完成的文字都是留给未来的一封信。",
        arTriggerDescription: "扫描残卷上的可辨字迹，文字将重新显现。",
        emotionalNarrative: "被遗忘的文字会等来最后一个读者。",
        visualHint: "卷轴上的墨迹在特定角度下显现淡金色。某些字句会随时间浮现又消失。",
        reviewStatus: "APPROVED", publishStatus: "PUBLISHED", runtimeStatus: "READY",
        createdAt: "2026-05-22T00:00:00+08:00", updatedAt: "2026-06-15T14:00:00+08:00"
      },
      {
        id: "ep_007", parkId: "park_001", activityId: "activity_001", name: "星痕池", sceneType: "自然探索",
        locationName: "爱企谷林区", latitude: 31.222, longitude: 121.472, checkinType: "GPS",
        status: "PUBLISHED",
        description: "一池静水，水面上仿佛漂浮着碎裂的星光。池底的石头排列成古老的星图，但大多已经偏移。",
        story: "一池静水，水面上仿佛漂浮着碎裂的星光。池底的石头排列成古老的星图。",
        symbolicMeaning: "星痕是天上星辰在大地上的投影。池水映照的不仅是天空，还有逝去的时间。",
        arTriggerDescription: "扫描水面，碎裂的星光将重新汇聚成完整星图。",
        emotionalNarrative: "星辰从未消失，它们只是沉入水中等待被捞起。",
        visualHint: "水面平静时可见池底星图。某些石头会偶尔发出微光。",
        reviewStatus: "APPROVED", publishStatus: "PUBLISHED", runtimeStatus: "READY",
        createdAt: "2026-05-25T00:00:00+08:00", updatedAt: "2026-06-14T10:00:00+08:00"
      },
      {
        id: "ep_008", parkId: "park_001", activityId: "activity_001", name: "风语桥", sceneType: "自然探索",
        locationName: "爱企谷溪流区", latitude: 31.229, longitude: 121.466, checkinType: "GPS",
        status: "PUBLISHED",
        description: "一座古朴的石桥横跨溪流，桥栏上系着许多褪色的布条。风过时，布条轻轻飘动，像是在传递什么消息。",
        story: "桥栏上系着许多褪色的布条。风过时，布条轻轻飘动，像是在传递什么消息。",
        symbolicMeaning: "风是世上最古老的传信者。布条上的每一个结都代表一个未说完的故事。",
        arTriggerDescription: "扫描飘动的布条，风将把它承载的消息显现出来。",
        emotionalNarrative: "风会把你的话带到它该去的地方。",
        visualHint: "布条在风中飘动的节奏各不相同。某些布条上有隐约的字迹。",
        reviewStatus: "APPROVED", publishStatus: "PUBLISHED", runtimeStatus: "READY",
        createdAt: "2026-05-28T00:00:00+08:00", updatedAt: "2026-06-13T16:00:00+08:00"
      },
      {
        id: "ep_009", parkId: "park_001", activityId: "activity_001", name: "旧忆碑林", sceneType: "文化体验",
        locationName: "爱企谷文化区", latitude: 31.226, longitude: 121.48, checkinType: "GPS",
        status: "DRAFT",
        description: "数十块石碑错落而立，每一块上都刻着不同的名字和日期。有些已经被藤蔓覆盖，有些仍然清晰。",
        story: "数十块石碑错落而立，每一块上都刻着不同的名字和日期。藤蔓覆盖下的故事仍在呼吸。",
        symbolicMeaning: "石碑不是终点，而是标记。每一个名字都是一个曾经存在于世界上的回响。",
        arTriggerDescription: "扫描被藤蔓覆盖的碑文，名字将重新显现并留下印记。",
        emotionalNarrative: "被记住的人不会真正消失。",
        visualHint: "藤蔓在石碑上生长成奇特的图案。某些碑文在雨中会变得更加清晰。",
        reviewStatus: "DRAFT", publishStatus: "DRAFT", runtimeStatus: "NOT_READY",
        createdAt: "2026-06-01T00:00:00+08:00", updatedAt: "2026-06-20T09:00:00+08:00"
      },
      {
        id: "ep_010", parkId: "park_001", activityId: "activity_001", name: "归真之门", sceneType: "终点仪式",
        locationName: "爱企谷出口区", latitude: 31.23, longitude: 121.482, checkinType: "GPS",
        status: "DRAFT",
        description: "一扇朴素的门立在径的尽头，门框上没有任何装饰。推开它，不是离开，而是回到开始的地方。",
        story: "一扇朴素的门立在径的尽头。推开它，不是离开，而是回到开始的地方。",
        symbolicMeaning: "归真不是结束，而是圆满。门后不是新的世界，而是你已走过的路。",
        arTriggerDescription: "扫描门缝中的光，完整的探索图谱将在你面前展开。",
        emotionalNarrative: "所有的旅途都是一次归家。",
        visualHint: "门在雾中若隐若现。门缝中透出的光与入口处的金光是同一种颜色。",
        reviewStatus: "DRAFT", publishStatus: "DRAFT", runtimeStatus: "NOT_READY",
        createdAt: "2026-06-05T00:00:00+08:00", updatedAt: "2026-06-19T16:30:00+08:00"
      },
      {
        id: "ep_011", parkId: "park_002", activityId: "activity_003", name: "湖畔观景台", sceneType: "入口签到",
        locationName: "爱企谷湖畔", latitude: 31.215, longitude: 121.455, checkinType: "GPS",
        status: "DRAFT",
        description: "湖畔观景台，远眺湖面波光粼粼。水天相接处，有一道若隐若现的光线。",
        story: "湖畔观景台，远眺湖面波光粼粼。水下的世界比水面更加广阔。",
        symbolicMeaning: "水面是一层帷幕。看穿它，才能看到真正的世界。",
        arTriggerDescription: "扫描湖面最亮的光斑，水下的记忆将浮现。",
        emotionalNarrative: "最深的平静不是静止，而是知道水下有什么。",
        visualHint: "日落时分湖面会泛起淡金色的涟漪。",
        reviewStatus: "DRAFT", publishStatus: "DRAFT", runtimeStatus: "NOT_READY",
        createdAt: "2026-06-10T00:00:00+08:00", updatedAt: "2026-06-18T08:00:00+08:00"
      },
      {
        id: "ep_012", parkId: "park_002", activityId: "activity_003", name: "林间小径", sceneType: "自然探索",
        locationName: "爱企谷湖畔林区", latitude: 31.218, longitude: 121.458, checkinType: "GPS",
        status: "DRAFT",
        description: "林间小径蜿蜒曲折，两旁是高大的梧桐树。地上铺满了金黄色的落叶。",
        story: "林间小径蜿蜒曲折，每一片落叶都是一封被时间寄出的信。",
        symbolicMeaning: "小径是森林的脉络。沿着它走，你会发现森林在呼吸。",
        arTriggerDescription: "扫描地上最完整的落叶，它将向你展示森林的记忆。",
        emotionalNarrative: "每一片落叶都知道它该落在哪里。",
        visualHint: "阳光穿过树冠在地上投下斑驳的光影。",
        reviewStatus: "DRAFT", publishStatus: "DRAFT", runtimeStatus: "NOT_READY",
        createdAt: "2026-06-12T00:00:00+08:00", updatedAt: "2026-06-17T12:00:00+08:00"
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

# REAL_AR_SDK_SELECTION_AND_SPIKE_PLAN_V1

## 1. 文档定位

本文件用于规划 LOVEQIGU / AR游伴 Phase 3 的真实 AR SDK 选型与 Spike 验证路线。

当前 mock AR 链路已经完成并冻结：

1. REAL_AR_DEVICE_INTEGRATION_V1
2. REAL_AR_RUNTIME_BRIDGE_PLAN_V1
3. REAL_AR_RUNTIME_BRIDGE_IMPLEMENTATION_V1
4. AR_RUNTIME_BRIDGE_USER_ADAPTER_WIRING_V1
5. AR_RUNTIME_BRIDGE_PAGE_STATE_ACCEPTANCE_V1
6. AR_MOCK_FLOW_REGRESSION_FREEZE_V1

当前 mock AR 链路已经能够覆盖：

1. 默认 fallback
2. AR success
3. camera denied
4. timeout
5. fallback complete
6. revealRelic 独立触发
7. coupon unlock 独立触发

本文件的目标不是接真实 AR SDK，而是在替换 mock bridge 之前，先完成真实 AR 能力选型、风险评估和 spike 路线规划。

本轮不接真实 AR SDK，不调用真实摄像头，不调用真实定位，不改 Runtime 数据结构。

---

## 2. 核心判断

当前项目不应立即接真实 AR SDK。

原因：

1. 微信小程序包体、权限、兼容性、审核和真机表现存在不确定性
2. 当前 mock AR 链路已经可支撑产品演示、页面状态、fallback 和信物显现流程
3. 真实 AR SDK 一旦直接接入，容易破坏已冻结的 mock flow
4. 不同 Android 设备表现差异较大
5. 景区现场网络、光照、设备性能不可控
6. fallback 仍然必须作为主体验兜底存在

因此推荐：

先做 SDK 选型与 spike，不直接替换 mock bridge。

---

## 3. AR 能力目标

真实 AR 能力只服务以下目标：

1. 探索点现场感
2. 信物显现前的仪式感
3. 用户确认「看见 / 找回」
4. 推动故事进度
5. 解锁礼遇

真实 AR 不服务：

1. 抽奖
2. 开盲盒
3. SSR 爆闪
4. 稀有奖励
5. 游戏战斗
6. 无意义炫技滤镜
7. 数字藏品领取页

---

## 4. 候选技术路线

### 4.1 路线 A：继续使用 Canvas / Lottie / 视频 fallback

定位：

最稳妥方案，可作为长期 fallback，也可作为低端设备主体验。

优点：

1. 包体可控
2. 兼容性好
3. 不依赖复杂 AR SDK
4. 审核风险低
5. 容易保持东方克制视觉
6. 已与当前 mock flow 兼容

缺点：

1. 现场空间感弱
2. 不是真实 AR
3. 用户可能认为互动感不足

适用：

1. 低端机
2. 权限拒绝
3. 网络弱
4. 小景区快速上线
5. 首版 MVP

结论：

必须保留，不能删除。

---

### 4.2 路线 B：微信小程序原生相机 + 轻 AR 覆层

定位：

使用小程序相机能力或相机页面，叠加 Canvas / 图片 / Lottie / 动效，实现轻量 AR 感。

优点：

1. 比完整 AR SDK 更轻
2. 包体压力较小
3. 更接近小程序生态
4. 可控性强
5. 适合「显现」而非复杂空间追踪

缺点：

1. 空间识别能力有限
2. 不是真正 3D AR
3. 需真机验证不同设备相机表现
4. 权限拒绝仍需 fallback

适用：

1. 景区点位显现
2. 扫码后相机叠加显现
3. 轻量仪式感
4. 首个真实设备 spike

结论：

推荐作为第一优先 spike 路线。

---

### 4.3 路线 C：WebAR / 第三方 AR SDK

定位：

接入第三方 WebAR 或 AR SDK，实现更完整的识别、跟踪、空间效果。

优点：

1. AR 感更强
2. 可支持图像识别 / marker
3. 可支持更复杂的空间显现

缺点：

1. 包体风险高
2. 小程序兼容性不确定
3. 审核与权限风险更高
4. 真机适配成本高
5. 可能影响小程序启动性能
6. 可能与 2MB / 分包限制冲突
7. 可能引入商业授权成本

适用：

1. 后续高价值景区
2. 单独 AR 分包
3. 明确有现场预算和设备测试条件
4. 已完成轻 AR spike 后

结论：

不建议作为第一步直接接入。仅作为备选研究。

---

### 4.4 路线 D：扫码 / 定位 / 视觉显现组合

定位：

现场通过二维码 / 点位码 / 定位校验完成可信触发，再使用 Canvas / Lottie / 轻相机叠加完成显现。

优点：

1. 可靠性高
2. 防伪能力强于纯前端 AR
3. 成本低
4. 对设备要求低
5. 更适合景区真实落地

缺点：

1. AR 感较弱
2. 需要景区物料配合
3. 需要 QR credential 规划配套

适用：

1. 景区真实上线
2. 商家联动
3. 小景区快速试点
4. 权限拒绝 fallback

结论：

推荐与路线 B 组合。

---

## 5. 推荐路线

推荐分三层：

### 第一层：稳定 fallback 层

保留当前：

1. Canvas 显现
2. Lottie 显现
3. 静态图 + 仪式文案
4. QR credential 备用流程

用途：

1. 低端机
2. 权限拒绝
3. 网络弱
4. SDK 初始化失败
5. AR timeout

### 第二层：轻 AR 相机覆层 spike

优先验证：

1. 小程序相机打开
2. 相机权限授权 / 拒绝
3. 相机预览上方叠加显现动效
4. 扫码 / 点位确认后显现
5. 成功后返回 bridge credential
6. fallback 保留

### 第三层：第三方 AR SDK 研究

仅研究，不立即接入：

1. 是否支持微信小程序
2. 包体大小
3. 授权费用
4. 真机兼容性
5. 分包可行性
6. 是否能封装在 ar-runtime-bridge 内部

---

## 6. Spike 验证范围

首轮 spike 不进入主项目页面。

建议创建独立 spike：

路径建议：

- `docs/ui_implementation/spikes/REAL_AR_SDK_SPIKE_NOTES_V1.md`
- 或 `apps/spikes/ar-camera-overlay/`

Spike 只验证：

1. 小程序相机权限
2. 低端 Android 表现
3. iPhone 表现
4. 相机预览上叠加 Canvas / Lottie
5. 资源加载耗时
6. 返回 mock credential
7. fallback 是否能切回
8. 包体影响
9. 弱网表现
10. 页面退出后资源释放

不验证：

1. 完整业务流程
2. 真实 userRelics 写入
3. 真实 couponClaims 写入
4. 真实 Runtime 发布
5. 大规模内容管理
6. 商业 AR SDK 深度集成

---

## 7. Spike 验收设备范围

至少覆盖：

1. iPhone 一台
2. Android 主流机一台
3. 低端 Android 一台
4. 微信开发者工具
5. 摄像头拒绝场景
6. 弱网场景
7. 页面切后台 / 返回场景
8. 页面退出 / 再进入场景

---

## 8. Spike 验收场景

### 场景 1：相机授权成功

预期：

1. 相机页面正常打开
2. 覆层动画可显示
3. 无明显卡顿
4. 可返回 mock credential
5. 可释放资源

标记：

AR_SPIKE_CAMERA_GRANTED_PASS = YES

### 场景 2：相机拒绝

预期：

1. 页面不崩溃
2. 显示「请允许摄像头权限，或使用备用显现流程」
3. 可进入 fallback

标记：

AR_SPIKE_CAMERA_DENIED_FALLBACK_PASS = YES

### 场景 3：低端机 fallback

预期：

1. 设备能力不足时推荐 fallback
2. fallback 可完成
3. 不阻断 revealRelic 后续流程

标记：

AR_SPIKE_LOW_END_FALLBACK_PASS = YES

### 场景 4：包体检查

预期：

1. 新增能力不显著拉高主包体
2. 如需资源，必须考虑分包 / CDN / 懒加载
3. 不影响首页启动

标记：

AR_SPIKE_PACKAGE_SIZE_REVIEW_PASS = YES

### 场景 5：资源释放

预期：

1. 页面退出后相机释放
2. 重进页面不异常
3. 多次进入不出现状态污染

标记：

AR_SPIKE_RESOURCE_DISPOSE_PASS = YES

---

## 9. 与 ar-runtime-bridge 的关系

未来真实 AR 接入必须只替换：

`apps/shared/data-adapter/ar-runtime-bridge.js`

内部实现。

不得改变：

1. `user-app-adapter.startARScan`
2. `user-app-adapter.completeARScan`
3. `user-app-adapter.completeARFallback`
4. `revealRelic`
5. `unlockCoupon`
6. 页面调用方式
7. Runtime 数据结构

真实 SDK 接入后仍应保持：

1. `detectDeviceCapabilities`
2. `requestCameraPermission`
3. `requestLocationPermission`
4. `startARSession`
5. `reportARProgress`
6. `completeARSession`
7. `completeFallback`
8. `disposeARSession`
9. `normalizeARError`

---

## 10. 风险清单

### 10.1 包体风险

风险：

1. 第三方 SDK 体积过大
2. 模型 / 贴图 / 动效资源过大
3. 小程序主包体受影响

控制：

1. 使用分包
2. 资源 CDN
3. 懒加载
4. 保持 fallback
5. Spike 先测包体

### 10.2 权限风险

风险：

1. 用户拒绝摄像头
2. 用户拒绝定位
3. 手机系统权限异常
4. 小程序授权弹窗影响体验

控制：

1. 提前文案解释
2. 拒绝后 fallback
3. 不在非 AR 页提前索权
4. 不因权限失败阻断主流程

### 10.3 兼容性风险

风险：

1. Android 设备差异大
2. 低端机卡顿
3. 微信版本差异
4. 开发者工具与真机表现不一致

控制：

1. 真机优先
2. 低端机 fallback
3. 不把真实 AR 作为唯一主路径
4. 记录设备矩阵

### 10.4 体验风险

风险：

1. AR 过度炫技
2. fallback 被用户理解为失败
3. 文案变成「跳过」
4. 信物被误解成数字藏品

控制：

1. 继续使用「显现 / 备用显现」
2. 不出现「跳过」
3. 不出现「SSR / 抽奖 / 爆奖」
4. 信物仍是故事进度资产

### 10.5 业务风险

风险：

1. AR 成功绕过打卡
2. AR 成功自动发信物
3. AR 成功自动发券
4. 前端 credential 可伪造

控制：

1. 服务端二次校验
2. revealRelic 独立触发
3. unlockCoupon 独立触发
4. credential 后续由服务端签发或校验

---

## 11. 不推荐立即做的事情

当前不推荐：

1. 直接替换 mock bridge
2. 直接采购第三方 AR SDK
3. 直接在主页面接真实相机
4. 直接把 AR 做成强依赖
5. 直接移除 fallback
6. 直接把 AR 结果写入 userRelics
7. 直接做复杂 3D 空间识别
8. 直接将 AR 资源打入主包

---

## 12. 推荐执行顺序

建议后续执行：

### Step 1：真实 AR 能力调研

1. 微信小程序 camera 能力
2. 第三方 SDK 小程序支持情况
3. 包体 / 分包限制
4. 真实设备权限表现

输出：

REAL_AR_CAPABILITY_RESEARCH_V1

### Step 2：轻 AR 相机覆层 Spike

1. 独立 spike 页面
2. 相机预览
3. Canvas / Lottie 覆层
4. fallback 切换
5. mock credential 返回

输出：

REAL_AR_CAMERA_OVERLAY_SPIKE_V1

### Step 3：真机验收

1. iPhone
2. Android
3. 低端 Android
4. 摄像头拒绝
5. 弱网
6. 页面退出释放

输出：

REAL_AR_SPIKE_DEVICE_ACCEPTANCE_V1

### Step 4：桥接层替换方案

1. 不改页面
2. 不改 user-app-adapter
3. 只替换 ar-runtime-bridge 内部实现
4. 保留 fallback

输出：

REAL_AR_RUNTIME_BRIDGE_REPLACEMENT_PLAN_V1

---

## 13. 本轮结论

本轮结论：

**不立即接真实 AR SDK。**

推荐先进入：

REAL_AR_CAPABILITY_RESEARCH_V1

然后再做：

REAL_AR_CAMERA_OVERLAY_SPIKE_V1

当前 mock AR flow 继续作为稳定基准保留。

---

## 14. 验收标记

REAL_AR_SDK_SELECTION_AND_SPIKE_PLAN_V1_CREATED = YES
REAL_AR_SDK_SELECTION_SCOPE_DEFINED = YES
REAL_AR_TECH_ROUTES_DEFINED = YES
REAL_AR_RECOMMENDED_ROUTE_DEFINED = YES
REAL_AR_SPIKE_SCOPE_DEFINED = YES
REAL_AR_SPIKE_DEVICE_SCOPE_DEFINED = YES
REAL_AR_SPIKE_ACCEPTANCE_SCENARIOS_DEFINED = YES
REAL_AR_BRIDGE_REPLACEMENT_BOUNDARY_DEFINED = YES
REAL_AR_RISK_LIST_DEFINED = YES
REAL_AR_DO_NOT_CONNECT_SDK_NOW = CONFIRMED
REAL_AR_KEEP_MOCK_FLOW_BASELINE = CONFIRMED
READY_FOR_REAL_AR_CAPABILITY_RESEARCH_V1 = YES

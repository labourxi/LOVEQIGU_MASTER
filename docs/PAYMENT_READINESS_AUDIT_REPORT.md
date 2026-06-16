# Payment Readiness Audit Report

**Mission:** 全系统支付逻辑与配置点审计  
**Product:** AR游伴 · WeChat Mini Program  
**Generated:** 2026-06-09  

---

## Executive Summary

| Marker | Value |
|--------|-------|
| **PAYMENT_LOGIC_IMPLEMENTED** | **NO** |
| **WECHAT_PAY_CONFIGURED** | **NO** |
| **PAYMENT_ENTRY_REQUIRES_CONFIG** | **NO** |
| **COMMERCIAL_SURFACE_READONLY** | **YES** |
| **REVIEW_SAFE_NO_PAYMENT** | **YES** |

**结论：** 当前仓库 **不存在可运行的支付逻辑**，也 **不存在需要立即配置的微信支付参数**。  
存在若干 **商业展示入口**（结缘商城、权益列表、卡券文案），均为 **只读占位**，不会触发交易。

---

## Scan Scope

| Layer | Path | Result |
|-------|------|--------|
| MiniApp pages | `apps/miniapp/pages/**` | 无支付 API 调用 |
| MiniApp services | `apps/miniapp/services/**` | 无订单/支付服务 |
| Runtime data | `data/` · `apps/miniapp/data/**` | 静态权益文案，无价格/订单字段 |
| Backend services | `services/**` | 占位目录，无支付实现 |
| Admin / H5 | `apps/admin` · `apps/h5` | 空占位 |
| Config / secrets | `.env*` · `project.config.json` | 无商户号、密钥、支付插件 |
| Docs / IA | `docs/architecture` · `docs/language` | 未来规划词汇，非运行时 |

---

## WeChat Pay API Scan

| Pattern | Matches |
|---------|---------|
| `wx.requestPayment` | **0** |
| `requestPayment` | **0** |
| `mch_id` / 商户号 | **0** |
| `prepay_id` / 统一下单 | **0** |
| `wx.request` (network) | **0** |
| `wx.login` | **0** |

**Verdict:** 小程序侧 **未集成** 微信支付 SDK 调用链。

---

## Commercial Surfaces (Navigation Only)

以下入口存在，但 **仅导航或只读展示**，无收银动作。

### 1. 结缘商城 · `pages/rights-center/index`

| Item | Detail |
|------|--------|
| Route | `/pages/rights-center/index` |
| Nav title | 结缘商城 |
| Behavior | 读取静态 rights 数据，展示权益列表 |
| Payment | **None** — 页面 copy 明确声明 order/payment/redemption connectors **not bound** |

Evidence:

```javascript
// apps/miniapp/pages/rights-center/index.js
copy: 'Rights data is visible in the shared model, but order, payment, and redemption connectors are still not bound.'
```

唯一交互：`onOpenCampaignClosure()` → `/pages/campaign-closure/index`（活动占位页）。

### 2. 首页 · 结缘模式

| Item | Detail |
|------|--------|
| Component | `components/affinity-home-panel` |
| Entry | 「我的权益」→ `/pages/rights-center/index` |
| Copy | 「卡券、结缘礼与核销状态」— 描述性文案 |
| Payment | **None** |

### 3. 景区详情 · 结缘商城 CTA

| Item | Detail |
|------|--------|
| Page | `pages/scenic-detail/index` |
| Button | 「前往结缘商城」 |
| Handler | `wx.navigateTo({ url: '/pages/rights-center/index' })` |
| Payment | **None** |

### 4. 其他商业相关页面

| Page | Role | Payment |
|------|------|---------|
| `campaign-closure` | Live Ops 模板展示 | NO |
| `digital-collectible` | 传播资产展示（≠ Relic） | NO |
| `next-activity` | 活动预告占位 | NO |

---

## Content Layer · Rights Data

各章节 `*_rights.json` / `chXX-rights.js` 含 L2 商业文案：

- **心愿值** — 探索记念积分概念（静态描述）
- **结缘礼** — 如「免费拿铁」「咖啡五折券」（静态描述）
- **卡券 / 核销** — rights 类型 `coupon_wallet` copy：**「卡券列表占位，未连接真实核销数据」**

**无以下字段：** `price` · `amount` · `order_id` · `payment_status` · `merchant_id`

数据来源：本地 JSON 镜像，经 `rights-service` → `chapter-runtime-registry` 只读加载。

---

## Configuration Audit

| Config surface | Status |
|----------------|--------|
| `apps/miniapp/project.config.json` | 仅 `appid` + 编译设置；**无支付插件** |
| `apps/miniapp/app.json` | **无 TabBar**；无支付权限声明 |
| `.env` / credentials | **不存在** |
| 微信商户平台绑定 | **未在代码中体现** |
| 支付回调 `notify_url` | **未定义** |

当前唯一运行时标识：

- `project.config.json` → `"appid": "wx08798a8141193bc6"`（小程序 AppID，非支付配置）

---

## Documentation Cross-Reference

| Document | Statement |
|----------|-----------|
| `docs/MVP_BUILD_REPORT.md` | Redemption, order, payment, 核销 APIs **not implemented** |
| `docs/DATA_MODEL_REPORT.md` | Rights redemption, payment, order, 核销 integrations **not implemented** |
| `docs/MVP_ACCEPTANCE_REPORT.md` | Rights Center **does not attempt** redemption, payment, or ordering |
| `docs/language/LOVEQIGU_LANGUAGE_CONSTITUTION_V1.md` | L1 词汇表定义「支付」「订单」「核销」— **语言规范，非实现** |
| `docs/architecture/LOVEQIGU_INFORMATION_ARCHITECTURE_V1.md` | 未来 Tab「结缘商城」— **IA 规划，未落地** |

---

## Review & Compliance Notes

### 当前提审状态

| Question | Answer |
|----------|--------|
| 是否需要配置微信支付？ | **否** |
| 用户能否完成真实交易？ | **否** |
| 是否存在隐藏支付入口？ | **否**（已全量扫描） |
| 结缘商城如何向审核说明？ | 商业展示面；支付与核销为后续版本，**当前不可下单** |

### 若审核员追问「结缘商城」

建议口径：

> AR游伴 结缘商城当前为 **权益与结缘礼的只读展示页**，数据来自探索进度静态模型。  
> **未接入** 微信支付、订单系统、卡券核销后端。用户 **无法** 在此页面完成购买或付费兑换。

---

## Future Payment Integration Checklist

当产品决定接入支付时，需 **从零建设** 以下能力（当前全部缺失）：

```text
用户点击购买/兑换
    → 后端创建订单
    → 微信统一下单 API
    → 返回 prepay_id + sign
    → 小程序 wx.requestPayment()
    → 支付回调 notify_url
    → 权益发放 / 卡券写入
```

| # | Layer | Required work |
|---|-------|---------------|
| 1 | 微信商户平台 | 开通商户号 · 绑定小程序 AppID · 配置支付授权目录 |
| 2 | 后端 | 统一下单 · 签名 · 支付回调 · 订单状态机 · 幂等 |
| 3 | 小程序 | 订单确认页 · `wx.requestPayment` · 支付结果页 |
| 4 | 业务 | 心愿值账户 · 卡券领取/核销 · 会员订阅（若做） |
| 5 | 配置 | 商户号 · API 密钥 · 证书 · notify_url · 环境变量管理 |
| 6 | 合规 | 微信支付类目 · 用户协议 · 退款策略 · 隐私说明更新 |

**建议新增路径（尚未存在）：**

- `services/payment/` — 后端支付服务
- `apps/miniapp/services/payment/` — 小程序支付桥接
- `apps/miniapp/pages/order-confirm/` — 订单确认页（IA 规划）
- `.env.example` — 支付密钥模板（勿提交真实密钥）

---

## Verdict

| Marker | Value |
|--------|-------|
| **PAYMENT_LOGIC_IMPLEMENTED** | **NO** |
| **WECHAT_PAY_CONFIGURED** | **NO** |
| **PAYMENT_ENTRY_REQUIRES_CONFIG** | **NO** |
| **COMMERCIAL_SURFACE_READONLY** | **YES** |
| **REVIEW_SAFE_NO_PAYMENT** | **YES** |

---

`PAYMENT_READINESS_AUDIT_COMPLETE = YES`

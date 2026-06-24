# MERCHANT_ADMIN_CULTURAL_IDENTITY_PATCH_V1

## 1. 问题说明：当前商家后台文化识别不足

浏览器验收结论：商家后台功能清晰、操作效率良好，但整体偏普通 SaaS / 卡券核销后台，缺少 AR游伴「东方克制型运营后台」与「探索礼遇」业务语境。

**症状：**
- 文案多用「卡券 / 经营 / 服务费」等通用词
- 视觉缺少旧金边线、章签标签等克制文化元素
- 易被误解为电商促销或优惠券后台

---

## 2. 设计规范重申

商家后台须同时满足：**清晰 · 可信 · 稳定 · 可操作 · 低学习成本 · 品牌识别 · 探索礼遇语境 · 克制东方气质**

**不做：** 普通蓝白 SaaS、电商促销页、用户端强文化沉浸、大图纹理动效

---

## 3. 商家后台文化定位

**定位语：** 东方克制型运营后台 · 商家轻量版

**业务语境：** 游客探索 → 领取在地礼遇 → 到店核销 → 活动协作结算

**允许：** 旧金左边线、深绿主按钮、米白暖灰背景、章签标签、边注说明块  
**禁止：** 卷轴、山水纹理、星图动效、金光粒子、大 Hero

---

## 4. 术语修正说明

| 原表述 | 修正为 |
|--------|--------|
| 今日经营摘要 | 今日礼遇摘要 |
| 卡券码 / 核销码 | 礼遇码（用户可见层） |
| 服务费 | 探索礼遇协作服务费 |
| 卡券问题 | 礼遇问题 |
| 卡券说明 | 礼遇说明 |
| 促销 / 营销券 | 不使用 |

侧栏导航名称保持既有信息架构（我的卡券、核销记录等），页面内文案强化探索礼遇语境。

---

## 5. 页面文案修正说明

| 页面 | 主要调整 |
|------|----------|
| `merchant_dashboard` | 今日礼遇摘要、到店核销、在地礼遇、协作账单 |
| `merchant_coupons` | 探索后可到店使用的在地礼遇、探索礼遇标签 |
| `merchant_coupon_detail` | 探索礼遇、游客探索后出示礼遇码 |
| `merchant_scan` | 礼遇码核销、旧金 ritual 标题 |
| `merchant_redemptions` | 探索礼遇核销记录、边注说明 |
| `merchant_finance` | 探索礼遇协作服务费 |
| `merchant_tickets` | 礼遇核销 / 活动协作问题 |
| `merchant_help` | 礼遇 / 核销 / 结算 / 联系平台 四类 |
| `merchant_redemption_detail` | 字段标签中文化（礼遇码、在地礼遇） |

顶栏品牌副标：`探索礼遇 · 在地协作`（`backoffice-shell.js`）

---

## 6. 视觉轻量补强说明

**新增共享类（`backoffice.css`）：**

| 类名 | 用途 |
|------|------|
| `.bo-cultural-note` | 顶栏旧金副标 |
| `.bo-ritual-label` | 扫码区小标题（礼遇码核销） |
| `.bo-gift-tag` | 章签式「探索礼遇」标签 |
| `.bo-section-side-note` | 边注说明块（左金线） |
| `.bo-merchant-accent-line` | 内容区左金线强调 |

**商家主题增强：**
- 摘要块左金线 + 暖米渐变
- 卡片标题底部分隔线
- 扫码区轻金边框
- 帮助块左金线

**无新增图片资源。**

---

## 7. 修改文件清单

| 文件 | 变更 |
|------|------|
| `apps/admin/shared/backoffice.css` | 文化识别类 + 商家主题微调 |
| `apps/admin/shared/backoffice-shell.js` | 顶栏品牌副标 |
| `merchant_dashboard/index.html` | 礼遇摘要文案 |
| `merchant_coupons/index.html` | 在地礼遇语境 |
| `merchant_coupon_detail/index.html` | 探索礼遇规则 |
| `merchant_scan/index.html` | 礼遇码核销 |
| `merchant_redemptions/index.html` | 核销记录说明 |
| `merchant_redemption_detail/index.html` | 字段标签 |
| `merchant_finance/index.html` | 协作服务费 |
| `merchant_tickets/index.html` | 工单说明 |
| `merchant_help/index.html` | 帮助分类与 FAQ |
| `docs/ui_implementation/MERCHANT_ADMIN_CULTURAL_IDENTITY_PATCH_V1.md` | 本文档 |

---

## 8. 不改动项

- Runtime 数据结构
- 业务接口与权限逻辑
- 后台架构与路由
- 顶栏角色边界（`MERCHANT_ADMIN_TOPBAR_ROLE_ENTRY_FIX_V1` 已生效，未回退）
- 扫码核销主操作流程
- 大图 / 动效资源

---

## 9. 风险点

| 风险 | 缓解 |
|------|------|
| 术语混用（卡券 vs 礼遇） | 导航保留「卡券」，页面内统一探索礼遇语境 |
| 文化元素过多 | 仅 CSS 类 + 文案，无装饰图 |
| 操作效率下降 | 扫码按钮与表格结构未改 |

---

## 10. 验收标记

```
MERCHANT_ADMIN_CULTURAL_IDENTITY_PATCH_V1_CREATED = YES
MERCHANT_ADMIN_CULTURAL_IDENTITY_RESTATED = YES
MERCHANT_ADMIN_EXPLORE_GIFT_CONTEXT_ADDED = YES
MERCHANT_ADMIN_GENERIC_COUPON_BACKOFFICE_FEEL_REDUCED = YES
MERCHANT_ADMIN_LIGHT_CULTURAL_STYLE_ADDED = YES
MERCHANT_ADMIN_OPERATION_EFFICIENCY_PRESERVED = YES
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
READY_FOR_MERCHANT_ADMIN_BROWSER_REVIEW_CONTINUE = YES
```

---

*文档版本：V1 · 2026-06-16 · 对应任务 MERCHANT_ADMIN_CULTURAL_IDENTITY_PATCH_V1*

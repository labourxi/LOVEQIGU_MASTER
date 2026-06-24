# MERCHANT_ADMIN_WARM_TONE_POLISH_V1

## 1. 本轮问题说明

商家后台在信息结构、权限可见性、布局可读性方面已通过验收，但视觉气质仍偏冷、灰、工具化，缺少「温润、可信、在地礼遇感」的东方克制型运营后台气质。

**验收判断：**
- `MERCHANT_ADMIN_VISUAL_TONE_TOO_COOL = YES`
- `NEXT_ACTION = WARM_TONE_POLISH_ONLY`

---

## 2. 暖色调调整目标

在**不改结构、不改逻辑**前提下，仅通过共享 CSS 变量与商家作用域样式，将整体从冷灰系统后台微调为暖米白 / 暖灰金 / 温润墨绿 / 旧金强调的克制运营后台。

---

## 3. 背景色调整说明

| Token | 暖化值 | 用途 |
|-------|--------|------|
| `--bg-page` | `#F7F3EC` | 页面底色 |
| `--bg-panel` | `#FCFAF6` | 卡片 / 顶栏 / 侧栏 |
| `body:has(.bo-app--merchant)` | `#F7F3EC` | 整页暖底 |

---

## 4. 卡片与边框调整说明

| Token | 暖化值 |
|-------|--------|
| `--border` | `#E7D8BF` |
| 指标卡底色 | `#FBF8F2` |
| 高亮指标卡 | `#FFFDF8` → `#F8F2E8` 渐变 |
| `--shadow` | `0 6px 18px rgba(70, 50, 28, 0.06)` |

卡片、筛选栏、输入框统一使用暖边框，避免冷灰描边。

---

## 5. 主色深绿调整说明

| Token | 暖化值 |
|-------|--------|
| `--accent` | `#23463B`（温润墨绿） |
| `--accent-hover` | `#1F4037` |
| `--accent-light` | `#E7F1EA`（选中浅绿） |

用于：扫码核销主按钮、Logo、导航选中文字、主 CTA。

---

## 6. 金色强调调整说明

| Token | 暖化值 |
|-------|--------|
| `--accent-gold` | `#C9A96B` |
| `--notice-border` | `#D2B173` |

用于：侧栏选中金线、摘要左边线、章签标签、文化副标。

---

## 7. 状态标签调整说明（商家作用域）

| 状态 | 背景 | 边框 | 文字 |
|------|------|------|------|
| 成功 / 生效 / 已核销 | `#E7F1EA` | `#BFD8C8` | `#256246` |
| 待处理 / 待付款 | `#FFF4E2` | `#EBCB95` | `#9A5F12` |
| 异常 / 失败 | `#FBEAEA` | `#E6B9B9` | `#9A2F2F` |
| 中性 / 草稿 | `#F2EFE9` | `#D8D0C3` | `#6D6458` |

低饱和、可读、无英文回流。

---

## 8. 表格视觉调整说明

| 项 | 暖化值 |
|----|--------|
| 表头背景 `--table-head-bg` | `#F6F0E7` |
| 行分隔 `--table-border` | `#E9DDCA` |
| hover `--table-row-hover` | `#FBF6ED` |

核销记录表格可读性保持不变，仅色调温润。

---

## 9. 修改文件清单

| 文件 | 变更 |
|------|------|
| `apps/admin/shared/backoffice.css` | `.bo-app--merchant` 暖色 token + 组件暖化覆盖 |
| `docs/ui_implementation/MERCHANT_ADMIN_WARM_TONE_POLISH_V1.md` | 本文档 |

**未修改：**
- 各 `merchant_*/index.html`（共享 CSS 级联生效）
- `backoffice-shell.js`、Runtime、接口、权限
- `figma-ready/tokens.*`（商家页不引用，避免影响其它端）

---

## 10. 不改动项

- Runtime 数据结构
- 业务接口与权限逻辑
- 页面信息结构与路由
- 园区 / 超管后台色彩
- 大图 / 纹理 / 动效

---

## 11. 风险点

| 风险 | 缓解 |
|------|------|
| 暖色过重显促销 | 金色仅作边线与小标签，不大面积铺金 |
| 对比度下降 | 文字色保持 `#352F28` / `#6A5135`，状态色仍分明 |
| 平台端受影响 | 所有暖化限定在 `.bo-app--merchant` 作用域 |

---

## 12. 验收页面清单

1. `merchant_dashboard`
2. `merchant_coupons` / `merchant_coupon_detail`
3. `merchant_scan` / `merchant_redemptions` / `merchant_redemption_detail`
4. `merchant_finance`
5. `merchant_tickets` / `merchant_ticket_new` / `merchant_ticket_detail`
6. `merchant_help`
7. `merchant_account` / `merchant_staff`

---

## 13. 下一步建议

1. 浏览器全页走查暖色一致性
2. Phase 1 商家后台最终验收签字
3. 园区后台暖色可参考本 token 独立任务实施

---

## 14. 验收标记

```
MERCHANT_ADMIN_WARM_TONE_POLISH_V1_CREATED = YES
MERCHANT_ADMIN_BACKGROUND_WARMED = YES
MERCHANT_ADMIN_CARD_BORDER_WARMED = YES
MERCHANT_ADMIN_PRIMARY_GREEN_WARMED = YES
MERCHANT_ADMIN_ACCENT_GOLD_WARMED = YES
MERCHANT_ADMIN_NOTICE_TONE_WARMED = YES
MERCHANT_ADMIN_STATUS_TAG_WARMED = YES
MERCHANT_ADMIN_TABLE_TONE_WARMED = YES
MERCHANT_ADMIN_SHADOW_WARMED = YES
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
READY_FOR_MERCHANT_ADMIN_FINAL_ACCEPTANCE = YES
```

---

*文档版本：V1 · 2026-06-16 · 对应任务 MERCHANT_ADMIN_WARM_TONE_POLISH_V1*

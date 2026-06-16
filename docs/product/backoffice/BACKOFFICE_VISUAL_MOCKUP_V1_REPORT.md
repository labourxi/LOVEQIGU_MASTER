# BACKOFFICE_VISUAL_MOCKUP_V1 · 实施报告

**日期：** 2026-06-07  
**类型：** 视觉设计规范（非代码）  
**状态：** `BACKOFFICE_VISUAL_MOCKUP_V1_COMPLETE = YES`

---

## 摘要

基于 `BACKOFFICE_DESIGN_SYSTEM_V1` 与 `ADMIN_COMPONENT_LIBRARY_V1`，完成 AR游伴后台 **5 页视觉稿规范**，供 Figma / 设计团队执行高保真静态稿。本交付为 **视觉说明文档**，不含 HTML/CSS 实现。

---

## 交付物

| 文件 | 内容 |
|------|------|
| `docs/product/backoffice/BACKOFFICE_VISUAL_MOCKUP_V1.md` | 五页完整视觉稿规范 + 全局语言 + 表格高级感专章 |

---

## 五页覆盖

| # | 页面 | 后台 | 核心视觉焦点 |
|---|------|------|--------------|
| 1 | Platform Dashboard | 平台运营 | KPI 四宫格 + 趋势 + 待办表 |
| 2 | Merchant Dashboard | 商家工作台 | 扫码 CTA 双入口 + 低信息密度 |
| 3 | Park Dashboard | 园区管理 | 活动生命周期表 + 创建活动主路径 |
| 4 | Review Center | 平台运营 | Tab 审核 + 大数据表格 + 480px Drawer |
| 5 | Coupon Center | 平台运营 | 卡券列表 + 列冻结 + 批量操作条 |

每页均含：**页面结构图 · 视觉说明 · 组件使用 · 颜色说明 · 布局说明**

---

## 视觉原则落实

| 原则 | 落实方式 |
|------|----------|
| 东方克制 | 纸白 `#F7F5F0` · 墨棕文字 · 赭石仅作 accent |
| 企业级 | 飞书/企微式顶侧分栏 · 表格优先 |
| 高端文旅 | 「纸上行旅，金石为界」气质指引 · 无景区大图 Banner |
| 留白 | KPI 不超过 4 个 · 区块 gap 24px |
| 轻量金石感 | 1px 石线 · 赭石点缀 · 禁止金属渐变 |

| 禁止项 | 文档中均已标注 Avoid |
|--------|---------------------|
| 游戏化/二次元/赛博/强渐变/电竞 | ✓ |
| 传统政务蓝灰/红头/斑马纹大表 | ✓ |

---

## 表格高级感专章（§0.6）

针对 Review Center、Coupon Center 等 **50–100+ 行** 场景，规范明确：

- 行高 48px · 无斑马纹 · muted 表头
- 列宽语义化 · 数字右对齐 tabular
- Badge 仅用于状态列 · 行 hover 浅底
- sticky 表头 · 可选列冻结 · 紧凑模式 40px（平台内部）
- 空态留白 + 单 CTA，无大插画

参考对齐：**飞书表格呼吸感 + 有赞商家可读性**

---

## 参考产品映射

| 能力 | 主要参考 |
|------|----------|
| 布局壳层 | 飞书 |
| 审核流 | 微信公众平台 + 飞书审批 |
| 商家 KPI / 核销 | 有赞 |
| 角色分层 | 企业微信 |
| 卡券列表 | 有赞商品列表 |

---

## 建议 Figma Frame（8 帧）

1. Platform Dashboard  
2. Merchant Dashboard  
3. Park Dashboard  
4. Review Center（列表）  
5. Review Center（Drawer 展开）  
6. Coupon Center（默认）  
7. Coupon Center（Dense 100+ 行）  
8. Shared Components（引用组件库）

---

## 与代码原型关系

| 层 | 状态 | 说明 |
|----|------|------|
| 视觉稿 V1（本文档） | ✅ 完成 | 设计执行依据 |
| UI 原型 PHASE_UI_BUILD_V1 | ✅ 已有 | `apps/admin/` 可对照迭代 |
| Figma 高保真 | 待设计团队 | 按本文档 + 组件库绘制 |

视觉稿 **不要求** 修改 Runtime / API / 数据库。

---

## 结论

BACKOFFICE_VISUAL_MOCKUP_V1 目标达成：五页后台视觉结构、色彩、组件与布局均已规格化，表格大数据场景的高级感与反政务风策略已写入专章。

```
BACKOFFICE_VISUAL_MOCKUP_V1_COMPLETE = YES
```

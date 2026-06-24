# AR游伴 · 功能规格（初稿）

**文件 ID：** `01_product/feature_spec.md`  
**版本：** V1 初稿  

---

## 1. 概念定义

功能规格描述 **可交付、可测试** 的产品能力，按空间运营系统划分，不按游戏关卡划分。

---

## 2. 结构说明

### 2.1 功能域

| 域 ID | 名称 | MVP |
|-------|------|-----|
| F-HOME | 首页与进入 | YES |
| F-MAP | 探索地图 | YES |
| F-POINT | 探索点详情 | YES |
| F-XR | 显现流程 | YES |
| F-RELIC | 信物档案 | YES |
| F-RIGHTS | 权益中心 | YES |
| F-PROFILE | 个人中心 | YES |
| F-ADMIN-P | 平台后台 | YES |
| F-ADMIN-K | 景区后台 | YES |
| F-ADMIN-M | 商家门户 | YES |
| F-STAR | 星图/经络 | PARTIAL |
| F-NFT | 数字藏品 | 传播独立 |

---

## 3. 流程说明（核心功能）

### F-HOME-001 进入景区

- **触发：** 首页按钮 `onEnterScenic`
- **输出：** `XR_USER_TRIGGER` + 跳转探索地图
- **失败：** toast「功能开发中」

### F-XR-001 显现主备双路径

- **输入：** `startARScan(pointId)`
- **分支：** AR | FALLBACK
- **输出：** `AR_SCANNED` 可 revealRelic

### F-RELIC-001 信物显现

- **前置：** `canRevealRelic`
- **动作：** `revealRelic`
- **存储：** `userRelics`

---

## 4. 示例（验收用例）

```gherkin
Given 用户未探索 ep_001
When 完成显现并 revealRelic
Then userRelics 含 ep_001 对应信物
And event-complete 显示完成提示
```

---

## 5. 可执行说明

| 功能 | 代码入口 | 校验 |
|------|----------|------|
| 安全导航 | `utils/safe-interaction.js` | production_ui_stability |
| XR UI 解耦 | `components/ar-marker-xr-scene` | xr_ui_decouple |
| 试点动效 | `services/pilot/*` | pilot_scene_product |

完整路由见 `product_overview.md` 附录 B。

---

*非 MVP 功能变更须更新 `02_technical/system_boundary.md`*

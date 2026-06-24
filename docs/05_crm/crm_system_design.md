# AR游伴 · CRM 系统设计

**文件 ID：** `05_crm/crm_system_design.md`  
**版本：** V1 初稿  

---

## 1. 概念定义

AR游伴 的 CRM 不是独立 Salesforce 式产品，而是 **探索行为链 → 关系数据 → 运营动作** 的景区侧能力。

MVP：**行为报表 + 信物档案 + 权益转化**；复杂 CRM 暂缓。

---

## 2. 结构说明

### 2.1 三方视图

| 视图 | 用户 | 核心对象 |
|------|------|----------|
| 平台 | 运营 | 审查、发布、全站 KPI |
| 景区 | 园区 | 探索进度、信物、活动 |
| 商家 | 门店 | 核销、礼遇、活动效果 |

### 2.2 数据语法统一

```text
userId + parkId + activityId + pointId + relicId + couponClaimId
```

### 2.3 工程载体

| 能力 | 路径 |
|------|------|
| 用户进度 | `services/user-progress/` |
| Mock 适配 | `apps/shared/data-adapter/` |
| 商家核销 | `merchant-portal` |
| 景区看板 | `park-admin` |

---

## 3. 流程说明

```text
行为事件采集 → 结构化存储 → 看板聚合 → 运营动作（路径优化/活动投放）
```

| 事件 | 运营动作 |
|------|----------|
| 路径放弃率高 | 调整推荐点 |
| 显现失败率高 | 设备/备用策略 |
| 权益未领取 | 商家提醒 |

---

## 4. 示例

景区看板指标：

```json
{
  "activityId": "activity_001",
  "completedPoints": 2,
  "totalPoints": 3,
  "relicCount": 2,
  "benefitCount": 1,
  "completionRate": 67
}
```

---

## 5. 可执行说明

- MVP 不交付：会员等级、自动分账、POS  
- 新指标须定义采集点（见 `user_behavior_model.md`）  
- 隐私：用户行为脱敏导出  

---

*关联：`relic_data_model.md` · `user_behavior_model.md`*

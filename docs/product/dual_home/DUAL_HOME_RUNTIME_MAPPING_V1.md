# DUAL_HOME_RUNTIME_MAPPING_V1

Version: V1
Status: READY

---

## 1. 概述

该文件定义 LOVEQIGU 双首页（Home Shell）各模式与 Runtime 数据源的映射关系，为 Cursor 前端实现提供规范。

---

## 2. 首页模式与数据源映射

| 首页模式     | 模块     | 数据源                            | 字段/示例                                 | 输出组件              |
| -------- | ------ | ------------------------------ | ------------------------------------- | ----------------- |
| Explore  | 当前章节卡片 | `data/story/chX_chapters.json` | `chapter_code`, `title`, `completion` | ChapterCard       |
| Explore  | 最近获得信物 | `data/relics/chX_relics.json`  | `relic_name`, `status`                | RelicCard         |
| Explore  | 故事档案   | `data/story/chX_chapters.json` | `story_archive`                       | StoryArchivePanel |
| Affinity | 我的权益   | `data/rights/chX_rights.json`  | `rights_type`, `available`            | RightsPanel       |
| Affinity | 活动中心   | `runtime/campaign_feed.json`   | `campaign_id`, `status`               | CampaignPanel     |
| Affinity | 下次活动   | `runtime/campaign_feed.json`   | `next_campaign`                       | NextCampaignCard  |
| Campaign | 活动模式预留 | `runtime/campaign_feed.json`   | `active_campaigns`                    | CampaignShell     |

> 注意：Campaign 模式仅预留，后台控制开启。

---

## 3. Mapping 规则

1. **优先级顺序**

```text
Campaign Override > User State > Last Mode > Source Attribution
```

2. Explore Mode 读取最新章节进度、信物完成情况、Story Archive
3. Affinity Mode 读取权益信息、活动中心、下次活动
4. Campaign Mode 仅在后台开启时读取活动数据
5. 数字藏品仅在 Completion Event 显示
6. 禁止直接修改 CH01~CH07 数据

---

## 4. Admin Home Policy 对应

| 字段                | 说明                       |
| ----------------- | ------------------------ |
| default_mode      | 初始首页模式（Explore/Affinity） |
| forced_mode       | 强制覆盖首页模式                 |
| campaign_override | 是否开启 Campaign Mode       |
| experiment_group  | A/B 测试组，控制首页模式偏好         |

---

## 5. 数据绑定示意

```json
{
  "home_shell": "Explore",
  "explore": {
    "current_chapter": "ch07_field_echo",
    "recent_relics": ["Echo Seed", "Echo Reflection"],
    "story_archive": ["CH01~CH07"]
  },
  "affinity": {
    "rights": ["Echo Seal", "Connection Token"],
    "campaign_center": ["Spring Festival", "Anniversary Event"],
    "next_campaign": "Mid-Autumn"
  },
  "campaign": {
    "active_campaigns": []
  }
}
```

---

## 6. 输出目标

* `DUAL_HOME_RUNTIME_MAPPING_V1.md`
* 作为 Cursor **P4｜DUAL_HOME_IMPLEMENTATION_V1** 的前端实现规范
* 包含 Explore / Affinity / Campaign 模块映射
* 包含 Admin Home Policy 字段说明

---

## 7. 禁止事项

* 不修改 CH01~CH07 Canon
* 不修改已冻结章节内容
* 不新增 Lore / 新神明 / 新文明 / 新历史 / 新组织

---

## 8. 下一步

1. 保存该文件到：

```text
LOVEQIGU_MASTER/docs/product/dual_home/DUAL_HOME_RUNTIME_MAPPING_V1.md
```

2. Cursor 执行 **77｜DUAL_HOME_IMPLEMENTATION_V1**
3. 生成前端组件、页面占位、模式切换逻辑
4. 输出报告：`DUAL_HOME_IMPLEMENTATION_V1_REPORT.md`

---

### 当前负责人

```text
会话A（PRODUCT）
```

### 是否需要 Cursor

```text
否
```

完成后，双首页开发可正式进入 P4 阶段。

# EXPLORATION_POINT_SCALING_V1

Version: V1

Status:

PRODUCT_PROPOSAL

---

## Problem

当前章节工厂：

Story Nodes = 5

Relics = 6

Rights = 5

AR Events = 6

属于固定工厂。

但真实运营后：

探索点数量可能持续增加。

例如：

CH04

5探索点

↓

12探索点

↓

20探索点

↓

50探索点

固定工厂将无法支撑。

---

## Product Goal

允许：

一个章节

拥有 N 个探索点。

系统自动完成：

Story Placeholder

Relic Placeholder

AR Placeholder

Art Requirement

Runtime Registration

而无需手工创建。

---

## Expansion Principles

原则一：

章节结构固定

探索点结构可扩展

原则二：

探索点数量

不等于

章节数量

原则三：

新增探索点

不修改已冻结内容

原则四：

新增探索点

自动生成配套资产占位

---

## Checkpoint Model

每个探索点：

checkpoint

拥有：

checkpoint_id

chapter_id

checkpoint_type

runtime_status

art_status

publish_status

---

## Relic Generation Rule

默认规则：

1 Exploration Point

↓

1 Relic Placeholder

可配置：

1 Exploration Point

↓

N Relic Placeholder

由 generation_rule 控制。

---

## AR Generation Rule

默认规则：

1 Exploration Point

↓

1 AR Placeholder

支持：

Location Gate

Awareness Prompt

Guide Sequence

Completion Scene

自动映射。

---

## Art Requirement Rule

新增探索点后：

自动生成：

Art Requirement

内容包括：

主图

图标

AR贴图

分享海报

状态：

Queued

In Production

Approved

Published

---

## Admin Operations

后台按钮：

新增探索点

生成信物占位

生成AR占位

生成美术需求单

提交审查

发布Runtime

---

## Scaling Targets

V1

5 → 20 探索点

V2

20 → 100 探索点

V3

100+ 探索点

跨章节运营

---

## Success Criteria

新增探索点：

不需要程序员改代码

不需要修改已冻结章节

不需要手工创建信物JSON

不需要手工创建AR JSON

后台自动生成占位资产

Autopilot 自动接管后续流程

---

Status:

READY_FOR_ADMIN_SCALING_VALIDATION

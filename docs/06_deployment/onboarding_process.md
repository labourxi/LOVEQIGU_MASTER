# AR游伴 · 入驻流程

**文件 ID：** `06_deployment/onboarding_process.md`  
**版本：** V1 初稿  

---

## 1. 概念定义

入驻 = 景区/商家/平台账号具备 **可运营最小权限** 并完成首条内容发布。

---

## 2. 结构说明

### 2.1 景区入驻

| 步骤 | 动作 | 系统 |
|------|------|------|
| 1 | 签约 | 商务 |
| 2 | 创建 park | platform-admin/parks |
| 3 | 创建 activity | activities |
| 4 | 配置 3 探索点 | content production |
| 5 | 审查发布 | reviews → publish |
| 6 | 开通景区账号 | park-admin |

### 2.2 商家入驻

| 步骤 | 动作 |
|------|------|
| 1 | 景区邀请 |
| 2 | merchant-portal 账号 |
| 3 | 绑定探索点权益 |
| 4 | 核销演练 |

### 2.3 平台代管

`asPlatform=1&parkId=` 平台代管视图（已有 IA）。

---

## 3. 流程说明

```text
平台创建景区 → 景区录入商家 → 内容生产线 → 发布 → C端可见
```

---

## 4. 示例

商家门户首登检查：

```text
[ ] 可见分配的探索点
[ ] 可查看礼遇核销 Mock
[ ] 不可见其他景区数据
```

---

## 5. 可执行说明

- 后台路径：`apps/admin/`  
- IA：`docs/ui_implementation/ROLE_BASED_ADMIN_NAVIGATION_V1.md`  
- 权限：`AUTH_ROLE_IDENTITY_PLAN_V1.md`  

---

*试点打包：`pilot_deployment_sop.md`*

# AR游伴 · 探索点接入规范

**文件 ID：** `06_deployment/scenic_spot_integration.md`  
**版本：** V1 初稿  

---

## 1. 概念定义

探索点 = 空间中可触发探索与信物的最小部署单元。

---

## 2. 结构说明

### 2.1 接入清单

| 项 | 必填 |
|----|------|
| point_id | YES |
| point_name | YES |
| park_id / activity_id | YES |
| GPS 或 Marker | 二选一 |
| relic 绑定 | YES |
| 权益绑定（可选） | 推荐 |
| 显现资源包 | YES |

### 2.2 代码锚点

- 配置：merchant-event / adapter mock-source  
- 页面：`merchant-event/detail` · `ar-entry?pointId=`  
- Runtime：`data/runtime/ar_factory/*`

---

## 3. 流程说明

```text
勘测 → 信物定义 → 内容生产 → 审查发布 → 后台录入
     → 小程序验证 → 现场标定 → 上线
```

---

## 4. 示例

URL：

```text
/pages/ar-entry/index?pointId=ep_001
/pages/merchant-event/detail/index?pointId=ep_001
```

勘测表：见 `pilot_deployment_sop.md` §4.1

---

## 5. 可执行说明

```bash
node scripts/user_frontend/validate_build.js
```

单点验收：detail → ar-entry → lottie → event-complete

---

*商业接入：`docs/ar-business-integration-standard-v1.md`*

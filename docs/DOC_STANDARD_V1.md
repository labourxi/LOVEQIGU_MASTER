# AR游伴 · 工程文档标准 V1

**适用范围：** `docs/01_*` … `docs/07_*`  
**状态：** FROZEN_FOR_ENGINEERING  

---

## 1. 强制章节（顺序固定）

| # | 章节 | 英文名 | 必填内容 |
|---|------|--------|----------|
| 1 | 定义 | Definition | 输入/输出/边界/术语 |
| 2 | 结构设计 | System Design | 模块、表、图 |
| 3 | 流程 | Flow | 状态机或步骤序列 |
| 4 | 数据模型 | Data Model | JSON schema / 字段表 |
| 5 | 示例 | Example | 可运行或可复制用例 |
| 6 | 执行说明 | Execution Notes | 命令、检查清单、门禁 |

## 2. 术语（全库唯一）

| 术语 | 英文键 | 禁止混用 |
|------|--------|----------|
| AR游伴 | `ARYOUBAN` | 其他项目名 |
| XR Runtime | `xr-runtime` | AR引擎、特效系统 |
| 信物 | `relic` | 藏品、道具、NFT |
| 空间 | `space` | 仅指场域，世界用 `world` |
| 事件总线 | `event-bus` | 消息队列（非 MQ 产品） |
| 探索地图 | `explore-map` | 打卡地图 |
| 权益中心 | `rights-center` | 积分商城 |

详见：`docs/TERMINOLOGY_REGISTRY_V1.md`

## 3. 禁止写法

- 愿景句、口号句、未定义形容词
- 无结构的「我们将」「致力于」
- 无 schema 的数据描述
- 信物与 digital_collectible 混表

## 4. 文档元数据头（每文件顶部）

```markdown
**文档 ID：** `path/to/file.md`
**版本：** V1.1-ENG
**状态：** ENGINEERING_STANDARD
**输入：** ...
**输出：** ...
```

## 5. 变更协议

1. 改状态机 → `xr_state_machine.md` + 代码  
2. 改事件 → `event_bus_contract.md`  
3. 改收费 → `pricing_scenarios.md`  
4. 改试点 → `pilot_deployment_sop.md` + `failure_recovery_sop.md`

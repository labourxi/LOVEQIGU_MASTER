# AR游伴系统冻结总纲 V1

## 1. 信物系统结构

- 28星宿（四象分组）
- 四象：青龙 / 朱雀 / 白虎 / 玄武
- 经络：12正经
- 穴位：365节点（仅数据节点，不独立视觉）

---

## 2. 点亮机制

- 星宿状态：unlit / half / full
- 四象触发：由7宿完成度激活
- 经络机制：
  - 穴位点亮  节点亮
  - 连续点亮  经络流动

---

## 3. XR运行规则（强约束）

禁止：
- 启动即初始化XR
- import即执行scene
- 全量mesh加载

必须：
- 用户触发后初始化XR
- 分帧加载
- 点亮驱动渲染
- XR仅负责渲染，不负责计算

---

## 4. 系统原则

- 信物 = 核心资产
- 宝物 = 表现层
- 数据驱动渲染
- 不允许UI驱动结构

---

## 5. 冻结声明

本文件为系统级冻结文档：

- 不可修改结构定义
- 不可动态更改规则
- 仅允许版本升级（V2/V3）

# PRODUCTION RULE UPDATE

All production runtime MUST use V2 structure files only:

* `STAR_28_STRUCTURE_FREEZE_V2.json`
* `FOUR_SYMBOL_STRUCTURE_FREEZE_V2.json`
* `MERIDIAN_365_STRUCTURE_FREEZE_V2.json`

V1 files are deprecated and must not be referenced in runtime.

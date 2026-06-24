# XR运行冻结规则

## 禁止项
- 禁止启动即初始化XR Scene
- 禁止 import 即执行render
- 禁止全量mesh加载

## 必须项
- 用户触发后才初始化XR
- 分帧加载资源
- 点亮驱动渲染
- 数据驱动场景生成

## 原则
- XR = 渲染层，不是启动层
- 所有计算必须延迟执行

## PRODUCTION RULE UPDATE

- XR runtime only accepts V2 data structures.
- Legacy fallback parsing is disabled.
- V1 and V2 schema merge is forbidden.
- Runtime must not reference any V1 structure file.

# AR游伴 World System v0.3.1

AR游伴 **World System** 是一个可在浏览器本地运行的世界运行时。落地页（landing）呈现「星光之门」世界入口，探索页（explore）由 `world_generator` 动态生成上海城市世界碎片。

## 项目结构

```
ar-youban-world-system/
├── index.html          # 入口，跳转至 landing
├── bootstrap.js        # 唯一运行时入口
├── pages/
│   ├── landing/        # 世界入口页
│   └── explore/        # 今日探索页（内容由引擎生成）
├── system/
│   ├── world_engine/   # 状态机、记忆、生成器、信物
│   └── visual/         # 视觉 token 与动效循环
└── render/
    ├── renderer.js         # legacy 卡片渲染
    └── stream_renderer.js  # V0.3 流式渲染
```

## 如何运行

本项目使用 ES Modules，**不能**直接用 `file://` 打开，需要本地静态 HTTP 服务。

### 方式一：Python（推荐）

```bash
cd ar-youban-world-system
python -m http.server 8080
```

浏览器访问：<http://localhost:8080/>

### 方式二：Node.js

```bash
npx --yes serve .
```

## 页面说明

### landing（世界入口）

- 路径：`pages/landing/index.html`
- 蓝金「星光之门」视觉：星轨、银河弧、东方雾气、台阶路径、远处人物锚点
- 唯一 CTA：「进入探索」
- 状态机：`REST → PERCEPTION → REVELATION → TRANSITION` → 跳转 explore

### explore（今日探索）

- 路径：`pages/explore/index.html`
- `.world-container` 为空容器，由 `world_generator` + `renderStream` 流式注入
- 生成上海探索碎片（外滩夜行、武康路午后、朵云书院等），非占位文案
- 卡片按 `visual` 字段呈现不同城市氛围渐变

## world_engine 简介

| 模块 | 职责 |
|------|------|
| `state_machine.js` | 世界状态（REST / PERCEPTION / REVELATION / TRANSITION），含 300ms 状态锁 |
| `world_state_listener.js` | 监听状态变化，驱动 CTA 与页面跳转 |
| `perception_system.js` | 感知锚点与滚动触发 |
| `revelation_engine.js` | 显现爆发与 `state-reveal` 样式 |
| `world_memory.js` | session 记忆、`resonance` 与事件记录 |
| `memory_gc.js` | 记忆上限回收（200 条，批量清理 50） |
| `world_generator.js` | 根据 state + memory 生成上海探索 content（title / subtitle / emotion / visual / hint） |
| `generator.js` | 带 400ms 节流与缓存的安全生成入口 |
| `relic_system.js` | 信物（记忆碎片）创建与存储 |
| `world_runtime.js` | `enterExplore()` 串联记忆、生成与信物 |

运行时唯一入口为根目录 `bootstrap.js`：初始化状态机、动效循环，并按 `data-page` 绑定 landing 或 explore。

## 版本

- **v0.3.1** — 视觉还原：Landing 星光之门、Explore 上海城市碎片与流式卡片氛围
- **v0.3** — world_generator → content → stream UI
- **v0.1** — GitHub baseline

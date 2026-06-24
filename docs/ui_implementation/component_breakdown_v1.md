# component_breakdown_v1

## 1. 页面级组件拆解

### Landing
- LandingPage
- LogoBlock
- AmbientBackground
- CentralMapPreview
- PrimaryCTAButton
- FooterTagline

### Explore Home
- ExploreHomePage
- TopBar
- LocationLabel
- SearchButton
- ExplorationFeed
- ExplorationCard
- SearchOverlay

## 2. 组件职责说明

### LandingPage
- 作用：承接首屏入口，建立“进入探索世界”的第一印象
- 视觉责任：控制留白、焦点、氛围和主 CTA
- 交互责任：只负责进入探索首页
- 可复用：中等，可作为各入口页的统一壳层

### LogoBlock
- 作用：提供最小品牌识别
- 视觉责任：轻、居中、低干扰
- 交互责任：通常无
- 可复用：高

### AmbientBackground
- 作用：构建首屏世界感底色
- 视觉责任：墨色、雾化、深层次
- 交互责任：无
- 可复用：高

### CentralMapPreview
- 作用：承载“未被完全点亮的世界”主视觉
- 视觉责任：不完整、微发光、低强度深度
- 交互责任：可作为视觉焦点，不承载复杂操作
- 可复用：中

### PrimaryCTAButton
- 作用：唯一主动作入口
- 视觉责任：浅色半透明、克制、可感知
- 交互责任：明确进入探索
- 可复用：高

### FooterTagline
- 作用：完成情绪收口
- 视觉责任：低存在感、轻文案
- 交互责任：无
- 可复用：中

### ExploreHomePage
- 作用：探索世界入口首页
- 视觉责任：城市、记忆、线索感
- 交互责任：承接搜索、浏览、进入点位
- 可复用：高

### TopBar
- 作用：承接城市 / 状态 / 轻搜索入口
- 视觉责任：克制、轻、非工具化
- 交互责任：搜索、状态切换
- 可复用：高

### LocationLabel
- 作用：表达当前位置与探索语境
- 视觉责任：轻标识
- 交互责任：无或极少
- 可复用：高

### SearchButton
- 作用：打开轻搜索浮层
- 视觉责任：轻量、非按钮墙
- 交互责任：进入搜索
- 可复用：高

### ExplorationFeed
- 作用：承载探索卡片流
- 视觉责任：沉浸感、层次感
- 交互责任：滚动浏览、进入卡片
- 可复用：高

### ExplorationCard
- 作用：展示探索点、描述、信物线索
- 视觉责任：雾化背景、诗性标题、弱信物提示
- 交互责任：进入探索点详情
- 可复用：高

### SearchOverlay
- 作用：轻搜索承接层
- 视觉责任：弱存在感
- 交互责任：关键词检索
- 可复用：高

## 3. 前端还原优先级

### P0
- LandingPage 主视觉
- ExploreHome 探索卡片流
- 顶部栏克制化
- CTA 视觉统一

### P1
- 轻动效
- 搜索浮层
- 背景层次感

### P2
- 粒子 / 雾化细节
- 微动效增强

## 4. 验收标准
COMPONENT_BREAKDOWN_V1_DEFINED = YES

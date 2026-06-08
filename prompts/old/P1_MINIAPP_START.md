# P1 MINIAPP START TASK

You are working inside LOVEQIGU_MASTER.

Before making changes, read:

- AGENTS.md
- docs/canon/*
- docs/world/*
- docs/language/*
- docs/architecture/*

Goal:

Build the first compliant LOVEQIGU WeChat Mini Program structure.

Requirements:

1. Follow Canon, World Bible, Language Constitution, and Terminology.
2. Do not invent new lore.
3. Do not fill Canon gaps.
4. Do not mix Relic with Digital Collectible.
5. Use official terminology only.

Core pages to create or align:

- apps/miniapp/pages/index
- apps/miniapp/pages/explore-map
- apps/miniapp/pages/relics
- apps/miniapp/pages/rights-center
- apps/miniapp/pages/profile
- apps/miniapp/pages/ar-entry

Terminology:

- 探索地图, not 打卡地图
- 权益中心, not 积分商城
- 信物, not 数字藏品
- 心愿值, not 愿力
- 合真, not 归真
- 回响, not 回应
- 祝禁, not 祝由

Page goals:

1. index:
   - Dual-home entry
   - Explore Map entrance
   - My Relics entrance
   - AR entrance
   - Rights Center entrance

2. explore-map:
   - Placeholder list of exploration points
   - No check-in wording

3. relics:
   - Show Relics as story progression assets
   - Never call them digital collectibles

4. rights-center:
   - Commercial/rights language only
   - Do not mix ritual/worldview language

5. ar-entry:
   - Placeholder entry for AR_GATE_OPEN_V1
   - Placeholder entry for AR_IMPRINT_PARTICLES_V1

6. profile:
   - Explorer profile
   - Exploration records
   - No ranking or gamified level language

Implementation rules:

- Use WeChat Mini Program native structure.
- Update app.json page routes.
- Keep code simple and inspectable.
- Use placeholder data only.
- Do not connect real APIs yet.
- Do not delete existing docs.
- Do not modify Canon files.
- If conflict appears, stop and explain.

After edits:

Report:
1. Files changed
2. Pages created
3. Terminology compliance
4. Any unresolved issues
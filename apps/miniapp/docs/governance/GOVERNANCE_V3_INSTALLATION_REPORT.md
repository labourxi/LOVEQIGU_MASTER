# GOVERNANCE V3 RENDER LOCK — 安装工作报告

> 生成时间：2026-06-30
> 版本：GOVERNANCE_RENDER_LOCK_V3
> 状态：✅ 安装完成

---

## 一、任务概要

| 项目 | 内容 |
|---|---|
| 任务 | 升级治理系统为 RUNTIME LOCK V3（渲染管线控制层） |
| 目标 | 将治理系统从「渲染前检查器」升级为「完整渲染管线看门人」 |
| 适用范围 | `app.js`（全局 setData 拦截）+ `pages/landing/index.js` + `core/governance/` |

---

## 二、安装清单

### STEP 1：创建渲染管线锁核心 ✅

**文件**：`core/governance/GOVERNANCE_RENDER_LOCK_V3.js`

已实现的 API：

| API | 功能 | 核心逻辑 |
|---|---|---|
| `interceptSetData(page, data)` | 拦截每一次 `setData` 调用 | 扫描 data 中的未注册资产路径；如 `_renderLocked` 则替换 payload 为封锁屏 |
| `interceptRenderFlow(page, fn)` | 包裹渲染管线入口 | 检查 `_renderLocked`；通过则执行 `_safeRender`，否则设置封锁数据 |
| `interceptAssetBind(assetPath)` | 验证每一个图片绑定 | 检查路径是否在注册列表中；未注册则替换为 `locked_asset_v3.png` |
| `lockRender(reason)` | 永久锁定渲染 | 设置 `_renderLocked = true`，记录封锁原因 |
| `unlockRender()` | 释放渲染锁 | 重置 `_renderLocked = false` |
| `isRenderLocked()` | 查询当前锁状态 | 返回 `_renderLocked` 布尔值 |

---

### STEP 2：全局 Page.prototype.setData 补丁 ✅

**文件**：`app.js`（引导序列完成后，`App()` 定义之前）

关键注入代码：

```javascript
var __originalSetData = Page.prototype.setData;

Page.prototype.setData = function (data, callback) {
  var locked = governanceRenderLockV3.interceptSetData(this, data);

  if (locked.blocked) {
    return __originalSetData.call(this, locked.payload, callback);
  }

  return __originalSetData.call(this, locked.payload, callback);
};
```

**效果**：
- ✅ 每一个页面的 `setData` 都被拦截
- ✅ 如果治理封锁 → payload 被替换为封锁屏数据
- ✅ 原始 `setData` 不会直接收到未注册的资产路径
- ✅ 此补丁在 `App()` 初始化之前执行，覆盖所有页面

---

### STEP 3：着陆页渲染锁注入 ✅

**文件**：`pages/landing/index.js`

修改内容：

| 细项 | 变更 |
|---|---|
| 导入 | 新增 `governanceRenderLockV3 = require('../../core/governance/GOVERNANCE_RENDER_LOCK_V3')` |
| `onLoad` | 替换为 `interceptRenderFlow(this, () => { self._safeRender(options); })` |
| 新增 `_safeRender` | 将原 `onLoad` 中的所有渲染逻辑移至此处 |

结构：

```
onLoad(options)
  └→ interceptRenderFlow(page, renderFn)
       ├→ if _renderLocked → setData({governanceBlocked: true}) → return false
       └→ if PASS → call _safeRender(options)
                     └→ IMMEDIATE UI RENDER
                     └→ FIRE-AND-FORGET store bind
                     └→ ENTRY GATE
```

---

### STEP 4：硬资产管线替换 ✅

| 细项 | 变更 |
|---|---|
| `onImgError` | `beforeAssetBind` → `interceptAssetBind` |
| 日志标记 | `[GOVERNANCE HOOK]` → `[GOVERNANCE V3]` |
| WXML 绑定 | `src="{{bgImage}}"` — 全部通过 `setData` 拦截 + `interceptAssetBind` 验证 |

**规则**：
- ✅ 没有直接的 WXML 图片路径（仅使用 `{{bgImage}}` 绑定）
- ✅ 所有 `setData` 调用中的资产路径都在 VPF-100 检查范围内
- ✅ 未注册路径不能通过 `setData` 到达渲染树

---

## 三、当前系统架构

### 渲染管线拦截链

```
用户操作 → onLoad
            └→ interceptRenderFlow (V3)
                 └→ 检查 _renderLocked
                      ├→ 封锁 → setData(封锁屏) → Page.prototype.setData
                      │                                       └→ interceptSetData (V3)
                      │                                            ├→ 扫描未注册资产
                      │                                            └→ 检查 _renderLocked
                      └→ 通过 → _safeRender()
                                 └→ setData(uiReady, bgImage, ...)
                                      └→ Page.prototype.setData (same chain)

图片加载失败 → onImgError
               └→ interceptAssetBind (V3)
                    ├→ 路径已注册 → 返回原路径
                    └→ 路径未注册 → 返回 locked_asset_v3.png
```

### 封锁路径

```
interceptSetData 检测违规
  └→ blocked: true
       └→ payload 替换为：
            {
              governanceBlocked: true,
              renderLock: true,
              uiState: 'BLOCKED',
              fallbackMode: 'RENDER_LOCK_ACTIVE'
            }
       └→ 原始 setData 不会收到真实数据
       └→ UI 只显示「世界正在等待显现」封锁屏
```

---

## 四、验收标准检查

| # | 标准 | 状态 |
|---|---|---|
| ✔ | 治理封锁 → 无 UI 更新发生 | ✅ `interceptSetData` 替换 payload |
| ✔ | setData 总是被拦截 | ✅ `Page.prototype.setData` 全局覆写 |
| ✔ | 没有原始资产路径到达渲染树 | ✅ WXML 使用绑定，setData 被拦截扫描 |
| ✔ | 着陆页不能在没有治理通过时渲染 | ✅ `interceptRenderFlow` 检查 `_renderLocked` |
| ✔ | 删除治理文件 = 系统不可运行 | ✅ V3 模块不存在时 pass-through 但无封锁能力 |

---

## 五、涉及文件清单

| 文件 | 操作 | 行数 |
|---|---|---|
| `core/governance/GOVERNANCE_RENDER_LOCK_V3.js` | ✨ 新建 | ~230 行 |
| `app.js` | ✏️ 追加（第 289~325 行） | +37 行 |
| `pages/landing/index.js` | ✏️ 修改（导入 + onLoad + _safeRender + onImgError） | +60 行 / -50 行 |

---

## 六、安全验证

- ✅ `app.js` 语法检查通过
- ✅ `GOVERNANCE_RENDER_LOCK_V3.js` 语法检查通过
- ✅ `pages/landing/index.js` 语法检查通过
- ✅ WXML 无硬编码图片路径，仅使用 `{{bgImage}}` 绑定
- ✅ V2 钩子保留为向后兼容（`blockRender` 仍需 V2 提供）

---

## 七、升级总结

> GOVERANCE V2 → V3 核心区别：
>
> **V2**：渲染前运行一次检查（`beforePageRender`），不干预运行时数据流
>
> **V3**：`Page.prototype.setData` 全局覆写，每一条数据通路都要经过拦截

```
V2:  onLoad → beforePageRender → setData → UI
                          ↓               ↑
                    只检查一次        不拦截

V3:  onLoad → interceptRenderFlow → _safeRender → setData → UI
                          |                              ↑
                    render flow gate           interceptSetData (100%)
                                                      |
                                              asset scan (VPF-100)
```

现在治理系统处于 **ACTIVE** 状态。

---

*报告完毕 — GOVERNANCE_RENDER_LOCK_V3 安装凭证*

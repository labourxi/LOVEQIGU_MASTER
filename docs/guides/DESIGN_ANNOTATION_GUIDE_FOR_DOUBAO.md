# 小程序 Landing Page 设计图标注方法说明书

> **目标**：将一张完整的设计图拆分为 Portal 背景 + CSS 按钮覆盖层，适配微信小程序
> **执行者**：豆包（图像理解 + JSON 输出）
> **输入**：一张 Landing Page 设计图（任意比例/尺寸）
> **输出**：一份 JSON 标注文件，描述每个 UI 元素的类型和位置

---

## 第一步：观察设计图

拿到设计图后，先分析它包含哪些 UI 元素。典型的 Landing Page 包含以下元素：

| 元素 | 必填 | 说明 |
|------|------|------|
| Portal / 背景场景 | 是 | 占据页面大部分区域的主体视觉元素 |
| 标题文字 | 否 | 页面主标题，如"爱企谷"、"AR游伴"等 |
| 微信登录按钮 | 是 | 微信一键登录按钮 |
| 导航入口 | 是 | 4 个业务入口：探索、地图、权益、我的 |
| 底部提示文字 | 否 | 如"登录后进入爱企谷探索世界" |
| 其他装饰元素 | 否 | 光晕、粒子、雾气等 |

---

## 第二步：标注坐标

### 坐标系规则

- 以 **图片左上角** 为原点 `(0, 0)`
- X 轴向右为正，Y 轴向下为正
- 图片右下角坐标为 `(width, height)`
- 使用**绝对像素坐标**（不是百分比）

### 标注格式

输出严格 JSON 格式：

```json
{
  "image_width": 2048,
  "image_height": 2048,
  "elements": [
    {
      "id": "login_button",
      "type": "button",
      "label": "微信一键登录",
      "bounding_box": {
        "left": 400,
        "top": 1650,
        "width": 1248,
        "height": 120
      },
      "visual_notes": "绿色按钮，白色微信图标，圆角"
    },
    {
      "id": "nav_explore",
      "type": "nav_item",
      "label": "探索",
      "bounding_box": {
        "left": 300,
        "top": 1820,
        "width": 200,
        "height": 160
      }
    },
    {
      "id": "title",
      "type": "text",
      "label": "AR游伴",
      "bounding_box": {
        "left": 800,
        "top": 120,
        "width": 448,
        "height": 80
      }
    }
  ]
}
```

---

## 第三步：标注要点

### 3.1 需要标注的元素

所有**可交互**或**关键视觉**元素都必须标注：

1. **微信登录按钮**
   - 必须标注：精确位置、尺寸
   - 描述：颜色、图标、文字内容、形状（圆角矩形/胶囊等）

2. **导航入口**（一般 4 个水平排列）
   - 必须标注：每个按钮的精确位置和尺寸
   - 描述：是否有 icon、文字内容、排列方式

3. **标题/副标题文字**
   - 建议标注：位置和区域
   - 描述：文字内容、大小、颜色、字体风格

4. **Portal / 场景区域**
   - 标注为 `type: "scene"`，描述这个区域的主体视觉
   - 这将作为背景层，不会被按钮覆盖层遮挡

5. **其他按钮**（如果有次要 CTA，如"进入探索"等）
   - 标注位置和尺寸

### 3.2 不需要标注的元素

- 纯装饰性光晕、粒子、雾（它们属于 portal 场景的一部分）
- 背景纹理、渐变

### 3.3 坐标精度要求

- 交互元素（按钮、导航）：**精度在 10px 以内**
- 视觉元素（标题、场景区）：**精度在 30px 以内**即可
- 如果按钮有圆角，标注矩形包围盒（bounding_box）即可

---

## 第四步：输出示例

以下是一个完整的设计图标注示例：

```json
{
  "image_width": 2048,
  "image_height": 2048,
  "image_source": "landing_v4_design.png",
  "style_notes": "整体风格：深色背景 + 金色 portal + 底部绿色微信按钮 + 4个金色导航icon",
  "elements": [
    {
      "id": "scene_portal",
      "type": "scene",
      "description": "全页 portal 背景，金色光环 + 深紫能量 + 粒子光晕，居中构图",
      "bounding_box": {
        "left": 0,
        "top": 0,
        "width": 2048,
        "height": 2048
      },
      "zones": {
        "portal_center": { "left": 400, "top": 200, "width": 1248, "height": 1400 },
        "void_area": { "left": 0, "top": 0, "width": 2048, "height": 2048 }
      }
    },
    {
      "id": "title",
      "type": "text",
      "label": "AR游伴",
      "position_hint": "top_center",
      "bounding_box": {
        "left": 850,
        "top": 80,
        "width": 348,
        "height": 72
      },
      "visual_notes": "金色发光文字，thin style，有微光晕"
    },
    {
      "id": "login_button",
      "type": "button",
      "label": "微信一键登录",
      "action": "wechat_login",
      "position_hint": "bottom_center",
      "bounding_box": {
        "left": 300,
        "top": 1600,
        "width": 1448,
        "height": 110
      },
      "visual_notes": "绿色背景（#07C160），白色微信 icon 在左，白色文字'微信一键登录'，大圆角胶囊形"
    },
    {
      "id": "nav_explore",
      "type": "nav_item",
      "label": "探索",
      "action": "navigate_explore",
      "position_hint": "bottom_left",
      "bounding_box": {
        "left": 212,
        "top": 1760,
        "width": 180,
        "height": 180
      },
      "visual_notes": "金色 icon + 文字，竖排：icon在上，'探索'在下"
    },
    {
      "id": "nav_map",
      "type": "nav_item",
      "label": "地图",
      "action": "navigate_map",
      "bounding_box": {
        "left": 622,
        "top": 1760,
        "width": 180,
        "height": 180
      },
      "visual_notes": "同 explore 风格"
    },
    {
      "id": "nav_rewards",
      "type": "nav_item",
      "label": "权益",
      "action": "navigate_rewards",
      "bounding_box": {
        "left": 1033,
        "top": 1760,
        "width": 180,
        "height": 180
      },
      "visual_notes": "同 explore 风格"
    },
    {
      "id": "nav_profile",
      "type": "nav_item",
      "label": "我的",
      "action": "navigate_profile",
      "bounding_box": {
        "left": 1443,
        "top": 1760,
        "width": 180,
        "height": 180
      },
      "visual_notes": "同 explore 风格"
    },
    {
      "id": "bottom_hint",
      "type": "text",
      "label": "登录后进入爱企谷探索世界",
      "position_hint": "bottom_center",
      "bounding_box": {
        "left": 400,
        "top": 1960,
        "width": 1248,
        "height": 40
      },
      "visual_notes": "灰色小字，居中，半透明"
    }
  ]
}
```

---

## 第五步：输出文件

将标注结果保存为 JSON 文件，放在项目 `assets/design-annotations/` 目录下：

```
assets/design-annotations/landing_v4_annotations.json
```

文件名规则：设计图文件名（不含后缀）+ `_annotations.json`

---

## 检查清单

输出前确认：

- [ ] 所有交互按钮都标注了精确的 bounding_box
- [ ] 每个元素都有 type（scene/button/nav_item/text）
- [ ] 按钮都有 action（wechat_login / navigate_xxx）
- [ ] 坐标使用绝对像素值（不是百分比）
- [ ] 描述了按钮的视觉风格（颜色、圆角、icon 等）
- [ ] 标注了 image_width 和 image_height

---

## 完整工作流

```
你（用户）
  │
  ├── 提供设计图给豆包
  ├── 提供本说明书给豆包
  │
  ▼
豆包
  │
  ├── 观察设计图
  ├── 标注每个 UI 元素的位置
  ├── 输出 JSON 标注文件
  │
  ▼
你（用户）
  │
  ├── 将设计图 + 标注 JSON 交给我
  │
  ▼
我（Cursor）
  │
  ├── 读取 JSON 标注
  ├── 将 Portal 区域裁切为背景
  ├── 用 CSS 精确还原每个按钮（坐标映射到 rpx）
  ├── 绑定点击事件
  └── 部署上线
```

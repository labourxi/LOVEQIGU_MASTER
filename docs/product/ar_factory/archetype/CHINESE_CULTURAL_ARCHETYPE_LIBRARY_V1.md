# CHINESE_CULTURAL_ARCHETYPE_LIBRARY_V1

```yaml
document_id: CHINESE_CULTURAL_ARCHETYPE_LIBRARY_V1
version: V1
status: FROZEN
freeze_date: 2026-06-18
owner: ART / PRODUCT
priority: P0
```

---

## 文档定位

建立：

中国文化原型库

(Cultural Archetype Library)

---

## 用途

为：

AR Factory

提供：

```text
地标

↓

文化原型

↓

AR显现

↓

Runtime Package
```

的核心知识层。

---

## 核心原则

用户传播的不是：

AR特效

---

用户传播的是：

遇见了谁

---

因此：

文化原型

优先级

高于

AR效果

---

## Factory链路

```text
地标识别

↓

文化原型匹配

↓

AR效果生成

↓

Runtime Package
```

---

## 一级分类

- 神兽系
- 神明系
- 先贤系
- 自然系
- 福运系

---

## P0文化原型

### TOP1 · 财神

传播指数：**100**

适用：

商业街 · 古镇 · 商圈 · 店铺 · 文旅街区

推荐效果：

- 财神赐福
- 元宝流金
- 财运降临

---

### TOP2 · 金凤凰

传播指数：**99**

适用：

梧桐树 · 古树 · 园林 · 植物园 · 花园

推荐效果：

- 金凤凰栖梧桐
- 凤凰展翼
- 祥云托举

---

### TOP3 · 花神

传播指数：**98**

适用：

花海 · 樱花园 · 牡丹园 · 梅园 · 荷花池

推荐效果：

- 花神降临
- 花瓣聚合
- 花海苏醒

---

### TOP4 · 金龙

传播指数：**97**

适用：

山峰 · 江河 · 湖泊 · 峡谷 · 龙脉景区

禁止：

古树类直接推荐金龙

推荐效果：

- 龙脉化金龙
- 金龙腾云
- 龙气流转

---

### TOP5 · 孔子

传播指数：**92**

适用：

书院 · 学院 · 文庙 · 博物馆

推荐效果：

- 竹简展开
- 孔子讲学
- 古文显现

---

## P1文化原型

- 嫦娥
- 鲤鱼化龙
- 灶王爷
- 土地公
- 李白

---

## Factory推荐规则

示例：

| 地标 | 推荐 |
| --- | --- |
| 千年梧桐 | 金凤凰 |
| 黄山山峰 | 金龙 |
| 商业古街 | 财神 |
| 百年书院 | 孔子 |

---

## 新增引擎定义

```yaml
engine_id: CULTURAL_ARCHETYPE_ENGINE
```

### 功能

输入：

- 地标照片
- 地标类型
- 景区介绍
- 商家类型

输出：

- `recommended_archetype`
- `confidence_score`
- `recommended_effects`

---

## Factory架构升级

### 旧版

```text
地标

↓

AR效果
```

### 新版

```text
地标

↓

文化原型

↓

AR效果

↓

Runtime Package
```

---

## 冻结记录

```yaml
freeze_status: FROZEN
review_status: APPROVED
viral_priority_applied: YES
factory_mapping_defined: YES
```

---

## 输出

```yaml
CHINESE_CULTURAL_ARCHETYPE_LIBRARY_V1_COMPLETE: YES
STATUS: FROZEN
READY_FOR_CULTURAL_ARCHETYPE_ENGINE: YES
```

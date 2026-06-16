# MERCHANT_AND_PARK_ADMIN_MVP_SCOPE_REFINEMENT_V1

## 1. Product Decision

- merchant_portal_positioning: 商家参与平台活动的轻量工作台
- park_admin_positioning: 园区活动与商家协同管理台
- design_principle: 低配合度、低学习成本、核心功能优先
- first_version_goal: 看数据、管卡券、收通知、提工单、查帮助

## 2. Merchant Portal MVP

### 2.1 Coupon Module

字段与能力：

- coupon_id
- coupon_name
- activity_id
- activity_name
- status
- issued_count
- claimed_count
- redeemed_count
- unredeemed_count
- redemption_rate
- valid_from
- valid_to
- redemption_records

### 2.2 Merchant Data Dashboard

指标：

- today_claimed_count
- today_redeemed_count
- total_claimed_count
- total_redeemed_count
- redemption_rate
- active_coupon_count
- related_activity_count
- seven_day_claim_trend
- seven_day_redeem_trend

### 2.3 Finance Module

字段与能力：

- bill_id
- bill_period
- bill_type
- amount
- status
- payment_notice
- payment_due_date
- paid_at
- invoice_note
- platform_note

状态：

- PENDING_PAYMENT
- PAID
- OVERDUE
- CANCELLED

### 2.4 Account Management

字段与能力：

- merchant_id
- merchant_name
- contact_name
- contact_phone
- login_account
- password_change
- role

角色预留：

- owner
- staff

### 2.5 Ticket Module

工单类型：

- COUPON_ISSUE
- REDEMPTION_ISSUE
- BILLING_ISSUE
- ACTIVITY_PARTICIPATION
- TECH_REQUEST
- OTHER

工单状态：

- OPEN
- IN_PROGRESS
- RESOLVED
- CLOSED

### 2.6 Help / FAQ

栏目：

- coupon_data_help
- redemption_help
- billing_help
- ticket_help
- faq
- platform_contact

## 3. Park Admin MVP

### 3.1 Merchant Data Dashboard

指标：

- total_merchant_count
- active_merchant_count
- participating_merchant_count
- total_coupon_issued_count
- total_coupon_claimed_count
- total_coupon_redeemed_count
- overall_redemption_rate
- top_redeemed_merchants
- low_activity_merchants

### 3.2 Activity Data Dashboard

指标：

- activity_id
- activity_name
- status
- participating_merchant_count
- linked_coupon_count
- total_claimed_count
- total_redeemed_count
- redemption_rate
- view_count_optional
- scan_count_optional

### 3.3 Activity Management

能力：

- create_activity
- edit_activity_basic_info
- select_participating_merchants
- bind_coupons
- set_activity_time
- publish_activity
- pause_activity
- end_activity

活动状态：

- DRAFT
- PENDING_REVIEW
- PUBLISHED
- PAUSED
- ENDED

### 3.4 Rule-based Optimization Suggestions

规则：

- HIGH_CLAIM_LOW_REDEEM: 领取高、核销低，建议优化到店引导
- LOW_MERCHANT_PARTICIPATION: 商家参与少，建议增加商家权益
- HIGH_REDEEM_MERCHANT: 商家核销高，建议加大曝光
- LOW_ACTIVITY_CLAIM: 活动领取低，建议增加首页推荐
- COUPON_EXPIRING_UNUSED: 卡券过期多，建议延长有效期或提醒用户

### 3.5 Ticket Module

能力：

- view_merchant_tickets
- reply_ticket
- update_ticket_status
- submit_platform_ticket
- link_ticket_to_merchant
- link_ticket_to_activity

## 4. Out of Scope for MVP

以下功能第一版暂不开发：

- 商家自主创建复杂营销活动
- 多级财务结算系统
- 分账系统
- 复杂员工权限
- CRM
- 用户画像
- 自动化营销
- 复杂报表导出
- 多门店连锁管理
- 商家素材中心
- AI 自动生成完整活动方案

## 5. MVP Data Objects

请定义以下数据对象草案：

- merchant_profile
- merchant_coupon
- coupon_redemption_record
- merchant_bill
- merchant_ticket
- park_activity
- park_activity_coupon_link
- park_activity_merchant_link
- park_admin_dashboard_summary
- rule_based_optimization_suggestion

每个对象需要包含：

- id
- status
- created_at
- updated_at
- owner_scope
- 示例字段
- 示例 JSON

### 5.1 merchant_profile

示例字段：

- merchant_id
- merchant_name
- contact_name
- contact_phone
- login_account
- role

示例 JSON：

```json
{
  "id": "merchant_001",
  "status": "ACTIVE",
  "created_at": "2026-06-15T00:00:00+08:00",
  "updated_at": "2026-06-15T00:00:00+08:00",
  "owner_scope": "merchant",
  "merchant_id": "merchant_001",
  "merchant_name": "爱企谷咖啡",
  "contact_name": "张三",
  "contact_phone": "13800000000",
  "login_account": "merchant_001",
  "role": "owner"
}
```

### 5.2 merchant_coupon

示例字段：

- coupon_id
- coupon_name
- activity_id
- status
- issued_count
- claimed_count
- redeemed_count

示例 JSON：

```json
{
  "id": "coupon_001",
  "status": "ACTIVE",
  "created_at": "2026-06-15T00:00:00+08:00",
  "updated_at": "2026-06-15T00:00:00+08:00",
  "owner_scope": "merchant",
  "coupon_id": "coupon_001",
  "coupon_name": "爱企谷到店核销券",
  "activity_id": "activity_001",
  "status_label": "PUBLISHED",
  "issued_count": 100,
  "claimed_count": 65,
  "redeemed_count": 38
}
```

### 5.3 coupon_redemption_record

示例字段：

- record_id
- coupon_id
- merchant_id
- redeemed_at
- redeemed_by

示例 JSON：

```json
{
  "id": "redeem_001",
  "status": "COMPLETED",
  "created_at": "2026-06-15T00:00:00+08:00",
  "updated_at": "2026-06-15T00:00:00+08:00",
  "owner_scope": "merchant",
  "record_id": "redeem_001",
  "coupon_id": "coupon_001",
  "merchant_id": "merchant_001",
  "redeemed_at": "2026-06-15T10:00:00+08:00",
  "redeemed_by": "user_001"
}
```

### 5.4 merchant_bill

示例字段：

- bill_id
- bill_period
- bill_type
- amount
- status
- payment_due_date

示例 JSON：

```json
{
  "id": "bill_001",
  "status": "PENDING_PAYMENT",
  "created_at": "2026-06-15T00:00:00+08:00",
  "updated_at": "2026-06-15T00:00:00+08:00",
  "owner_scope": "merchant",
  "bill_id": "bill_001",
  "bill_period": "2026-06",
  "bill_type": "SERVICE_FEE",
  "amount": 299.0,
  "payment_due_date": "2026-07-01"
}
```

### 5.5 merchant_ticket

示例字段：

- ticket_id
- ticket_type
- status
- title
- merchant_id

示例 JSON：

```json
{
  "id": "ticket_001",
  "status": "OPEN",
  "created_at": "2026-06-15T00:00:00+08:00",
  "updated_at": "2026-06-15T00:00:00+08:00",
  "owner_scope": "merchant",
  "ticket_id": "ticket_001",
  "ticket_type": "COUPON_ISSUE",
  "title": "卡券领取数异常",
  "merchant_id": "merchant_001"
}
```

### 5.6 park_activity

示例字段：

- activity_id
- activity_name
- status
- start_time
- end_time

示例 JSON：

```json
{
  "id": "activity_001",
  "status": "DRAFT",
  "created_at": "2026-06-15T00:00:00+08:00",
  "updated_at": "2026-06-15T00:00:00+08:00",
  "owner_scope": "park_admin",
  "activity_id": "activity_001",
  "activity_name": "爱企谷首场探索活动",
  "start_time": "2026-06-20T00:00:00+08:00",
  "end_time": "2026-06-30T23:59:59+08:00"
}
```

### 5.7 park_activity_coupon_link

示例字段：

- link_id
- activity_id
- coupon_id
- status

示例 JSON：

```json
{
  "id": "link_coupon_001",
  "status": "ACTIVE",
  "created_at": "2026-06-15T00:00:00+08:00",
  "updated_at": "2026-06-15T00:00:00+08:00",
  "owner_scope": "park_admin",
  "link_id": "link_coupon_001",
  "activity_id": "activity_001",
  "coupon_id": "coupon_001"
}
```

### 5.8 park_activity_merchant_link

示例字段：

- link_id
- activity_id
- merchant_id
- status

示例 JSON：

```json
{
  "id": "link_merchant_001",
  "status": "ACTIVE",
  "created_at": "2026-06-15T00:00:00+08:00",
  "updated_at": "2026-06-15T00:00:00+08:00",
  "owner_scope": "park_admin",
  "link_id": "link_merchant_001",
  "activity_id": "activity_001",
  "merchant_id": "merchant_001"
}
```

### 5.9 park_admin_dashboard_summary

示例字段：

- total_merchant_count
- active_merchant_count
- participating_merchant_count
- overall_redemption_rate

示例 JSON：

```json
{
  "id": "dashboard_summary_001",
  "status": "SNAPSHOT",
  "created_at": "2026-06-15T00:00:00+08:00",
  "updated_at": "2026-06-15T00:00:00+08:00",
  "owner_scope": "park_admin",
  "total_merchant_count": 20,
  "active_merchant_count": 12,
  "participating_merchant_count": 8,
  "overall_redemption_rate": 0.42
}
```

### 5.10 rule_based_optimization_suggestion

示例字段：

- suggestion_id
- rule_code
- title
- description
- priority

示例 JSON：

```json
{
  "id": "suggestion_001",
  "status": "ACTIVE",
  "created_at": "2026-06-15T00:00:00+08:00",
  "updated_at": "2026-06-15T00:00:00+08:00",
  "owner_scope": "park_admin",
  "suggestion_id": "suggestion_001",
  "rule_code": "HIGH_CLAIM_LOW_REDEEM",
  "title": "领取高、核销低",
  "description": "建议优化到店引导",
  "priority": "MEDIUM"
}
```

## 6. MVP Page Skeleton

商家端页面：

- merchant_dashboard
- merchant_coupons
- merchant_coupon_detail
- merchant_finance
- merchant_account
- merchant_tickets
- merchant_help

园区负责人端页面：

- park_admin_dashboard
- park_admin_merchants
- park_admin_activities
- park_admin_activity_detail
- park_admin_tickets

## 7. Review Gates

商家端：

- 卡券由平台 / 园区创建或审核后生效
- 商家不可绕过审核直接发布卡券
- 财务数据只读为主
- 工单可提交但需平台处理

园区负责人端：

- 活动发布前必须检查：
  - 是否有活动名称
  - 是否有活动时间
  - 是否有关联商家
  - 是否有关联卡券
  - 是否通过平台发布检查

## 8. Implementation Recommendation

第一阶段建议实现顺序：

1. schema + mock data
2. merchant dashboard
3. merchant coupon list + detail
4. merchant ticket
5. park admin dashboard
6. park activity list + detail
7. park activity publish check
8. smoke test

## 9. Governance Notes

- 不覆盖冻结文件
- 不影响 Visual Factory 相关文件
- 不改变当前 Runtime 发布状态
- 所有发布类动作必须保留 PENDING / BLOCKED / APPROVED / RELEASED 状态
- 所有新增 schema 必须有示例 JSON
- 所有新增页面必须先用 mock data


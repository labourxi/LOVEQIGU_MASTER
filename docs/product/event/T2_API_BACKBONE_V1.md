# T2_API_BACKBONE_V1

## Objective

建立 LOVEQIGU 首场活动统一 API 骨架，解决首场活动运营流里零 HTTP API 的问题。

## Scope

- API backbone only
- mock data only
- no database
- no runtime changes
- no release changes

## Registered Endpoints

- `GET /api/merchant/dashboard`
- `GET /api/merchant/coupons`
- `GET /api/merchant/tickets`
- `GET /api/park/dashboard`
- `GET /api/park/activities`
- `GET /api/platform/dashboard`
- `GET /api/platform/reviews`
- `GET /api/event/list`
- `GET /api/event/detail/{id}`
- `GET /api/event/tasks`
- `GET /api/event/assets`

## Response Contract

```json
{
  "success": true,
  "message": "ok",
  "data": {}
}
```

## Data Sources

- `data/merchant_portal/*.mock.json`
- `data/park_admin/*.mock.json`
- `data/platform_admin/*.mock.json`
- `data/merchant_event/*.mock.json`


# production_receipt_v1

任务：
VISUAL_LANDING_PRODUCTION_V1 / batch_001

执行时间：
2026-06-23T09:31:00Z — 2026-06-23T09:34:00Z

生产线：
`scripts/visual_autopilot/visual_landing_production_batch_001_v1.py`  
（复用 `visual_factory_batch_exporter_v1.request_gemini_image` + `SeedreamArkProvider`）

执行结果：
- Prompt Pack 已写入：YES
- 生产线已调用：YES
- Gemini 调用：YES
- 豆包调用：YES
- Gemini 成功：NO（4/4 失败）
- 豆包成功：YES（4/4 成功）
- Landing 成功产出数量：2
- Explore Home 成功产出数量：2
- 总成功数量：4
- 总失败数量：4

## 失败明细

### Gemini（全部失败）

原因：`HTTP 429 RESOURCE_EXHAUSTED`  
模型：`gemini-3.1-flash-image`  
说明：免费层配额 limit=0，当日/当分钟请求额度已耗尽。

受影响文件：
- `landing_page_final_v1__gemini__v1.png`
- `landing_page_final_v1__gemini__v2.png`
- `explore_home_final_v1__gemini__v1.png`
- `explore_home_final_v1__gemini__v2.png`

### 豆包（全部成功）

引擎：`doubao-seedream-5-0-260128`（Seedream Ark）  
端点：`https://ark.cn-beijing.volces.com/api/v3/images/generations`  
密钥来源：`ARK_API_KEY`

成功文件：
- `landing_page_final_v1__doubao__v1.png`（1545946 bytes）
- `landing_page_final_v1__doubao__v2.png`（1180676 bytes）
- `explore_home_final_v1__doubao__v1.png`（2149364 bytes）
- `explore_home_final_v1__doubao__v2.png`（2413852 bytes）

## 通道说明

- 本次为**单通道有效产出**（豆包），双通道已尝试。
- Gemini 失败原因为账户配额，非 Prompt Pack 或生产线脚本错误。
- 首批图未伪造；失败记录已保留。

结论：
FIRST_BATCH_VISUAL_OUTPUT_READY_FOR_REVIEW = YES

（满足最低保底：Landing 2 张 + Explore Home 2 张；双引擎完整集待 Gemini 配额恢复后补跑。）

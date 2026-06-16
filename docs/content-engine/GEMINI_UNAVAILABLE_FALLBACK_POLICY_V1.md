# GEMINI_UNAVAILABLE_FALLBACK_POLICY_V1

## Purpose

定义当 Gemini 自动评审不可用时，内容工厂如何安全降级。

## Trigger Conditions

以下情况触发 fallback：

- NETWORK_TIMEOUT
- ENDPOINT_UNREACHABLE
- SDK_TIMEOUT_UNSUPPORTED
- http_status = null
- Gemini health check fail
- minimal judge request fail
- candidate judge timeout
- multi candidate ranking fail due to Gemini timeout

## Fallback State

系统进入：

MANUAL_REVIEW_REQUIRED

## Safety Rules

- 不允许自动 APPROVED
- 不允许自动 RELEASED
- 不允许更新 Registry 为 released
- 不允许 Dashboard 显示为 pass
- 不允许 CONTENT_FACTORY_V1_FREEZE = YES
- 不允许 REAL_PRODUCTION_VALIDATION_V1_COMPLETE = YES

## Allowed Actions

允许：

- 保存 Gemini prompt
- 保存 negative prompt
- 保存 candidate metadata
- 保存失败诊断
- 人工上传外部生成图
- 人工填写 review_notes
- 人工选择 APPROVED / APPROVED_WITH_WARNING / REJECTED / NEEDS_REGENERATION
- Approval 通过后再进入 Release / Registry / Dashboard

## Manual Review Required Fields

人工审查必须填写：

- reviewer
- review_time
- image_source
- image_file
- prompt_used
- visual_match_score
- policy_match_score
- issue_notes
- decision

## State Transition

GEMINI_TIMEOUT
 MANUAL_REVIEW_REQUIRED
 HUMAN_APPROVED / HUMAN_REJECTED
 APPROVAL_PENDING
 RELEASE_ALLOWED only after approval

## Final Safety Decision

- release_allowed = NO until human approval
- registry_update_allowed = NO until human approval
- dashboard_pass_allowed = NO until human approval
- validation_complete_allowed = NO until human approval

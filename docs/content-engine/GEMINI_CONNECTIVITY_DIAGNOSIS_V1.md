# GEMINI_CONNECTIVITY_DIAGNOSIS_V1

## Current Context
- REAL_PRODUCTION_GLOBAL_WATCHDOG_V1 = PASS
- MULTI_CANDIDATE_RANKING_TIMEOUT_DIAGNOSIS_V1 = PASS
- REAL_PRODUCTION_VALIDATION_V1_COMPLETE = NO
- CONTENT_FACTORY_V1_FREEZE = NO
- runtime_publish_status = BLOCKED

## API Key Detection
- key_detected: `YES`
- env_var_name: `GEMINI_API_KEY`
- key_masked_preview: `AQ.A...Wp6w`
- missing_key_reason: `Gemini key detected.`

## Model Configuration
- model: `gemini-2.5-flash`
- endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
- sdk_or_http_client: `urllib.request`
- request_timeout_enabled: `YES`

## Health Check
- health_check_started: `2026-06-15T04:11:48.642961Z`
- health_check_timeout_seconds: `10`
- health_check_http_status: `None`
- health_check_result: `FAIL`
- health_check_exception_type: `TimeoutExpired`
- health_check_exception_message: `Gemini request timed out after 10 seconds.`
- health_check_elapsed_seconds: `10.032`

## Minimal Judge Request
- judge_request_started: `2026-06-15T04:12:18.673149Z`
- judge_timeout_seconds: `30`
- judge_http_status: `None`
- judge_result: `FAIL`
- judge_response_summary: `{}`
- judge_exception_type: `TimeoutExpired`
- judge_exception_message: `Gemini request timed out after 30 seconds.`
- judge_elapsed_seconds: `30.03`

## Root Cause Classification
- NETWORK_TIMEOUT

## Recommendation
- retry_after_network_available

## Safety Decision
- release_allowed = NO
- registry_update_allowed = NO
- dashboard_pass_allowed = NO
- validation_complete_allowed = NO

# Fallback Decision
- fallback_policy_created: `YES`
- fallback_state: `MANUAL_REVIEW_REQUIRED`
- fallback_reason: `Gemini NETWORK_TIMEOUT`
- automatic_release_allowed: NO
- manual_review_required: YES

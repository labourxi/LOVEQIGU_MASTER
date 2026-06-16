# GEMINI_JUDGE_FAILURE_DIAGNOSIS_V1

## Current Result
- REAL_PRODUCTION_VALIDATION_V1_COMPLETE = NO
- CONTENT_FACTORY_V1_FREEZE = NO
- Gemini Judge Status = FAIL

## Failure Point
- stage: `candidate_judge`
- http_status: `None`
- exception_type: `None`
- exception_message: `None`

## Timeout Guard
- timeout_guard_enabled: `YES`
- health_check_timeout_seconds: `10`
- judge_timeout_seconds: `30`
- total_gemini_stage_timeout_seconds: `60`
- timeout_triggered: `YES`
- timeout_stage: `candidate_judge`
- exception_type: `None`
- exception_message: `None`

## API Key Check
- key_detected: `YES`
- env_var_name: `missing`
- key_masked_preview: `****`

## Model Check
- model: `doubao-seedream-5-0-260128`
- endpoint: ``
- request_format_valid: `YES`

## Response Check
- http_status: `None`
- response_body_summary: `{}`
- parsed_review_result: `none`

## Root Cause
- cause: Gemini API request timed out / did not return HTTP 200 for the judge request. Latest candidate ranking report shows HTTP status null for all candidates, with per-candidate timeout failures. The key was detected, so the failure is downstream of credential loading.

## Fix Recommendation
- recommendation: Investigate outbound network connectivity, proxy/firewall policy, and Google API reachability from the Codex runtime. Preserve the current non-release state until Gemini returns HTTP 200.

## Safety Decision
- release_allowed: NO
- registry_update_allowed: NO
- dashboard_pass_allowed: NO
- validation_complete_allowed: NO

# REAL_PRODUCTION_GLOBAL_WATCHDOG_V1

## Watchdog Status
- global_watchdog_enabled: `YES`
- total_timeout_seconds: `90`
- visual_stage_timeout_seconds: `60`
- gemini_judge_timeout_seconds: `30`
- candidate_judge_timeout_seconds: `30`
- multi_candidate_ranking_timeout_seconds: `60`

## Last Run Result
- validation_exited_within_90_seconds: `YES`
- timeout_triggered: `YES`
- timeout_stage: `candidate_judge`
- elapsed_seconds: `30.07`
- exception_type: `None`
- exception_message: `None`

## Stage Trace
- MULTI_CANDIDATE_RANKING_STARTED: started_at=755606.183, ended_at=755606.183, duration_seconds=0.0, status=STARTED
- CANDIDATE_JUDGE_STARTED: started_at=755606.183, ended_at=755606.183, duration_seconds=0.0, status=STARTED
- CANDIDATE_JUDGE_STARTED: started_at=755606.204, ended_at=755606.204, duration_seconds=0.0, status=STARTED
- CANDIDATE_JUDGE_STARTED: started_at=755606.205, ended_at=755606.205, duration_seconds=0.0, status=STARTED
- CANDIDATE_JUDGE_STARTED: started_at=755606.205, ended_at=755606.205, duration_seconds=0.0, status=STARTED
- CANDIDATE_JUDGE_STARTED: started_at=755606.206, ended_at=755606.206, duration_seconds=0.0, status=STARTED
- CANDIDATE_JUDGE_TIMEOUT: started_at=755606.183, ended_at=755636.21, duration_seconds=30.027, status=TIMEOUT
- CANDIDATE_JUDGE_TIMEOUT: started_at=755606.204, ended_at=755636.217, duration_seconds=30.012, status=TIMEOUT
- CANDIDATE_JUDGE_TIMEOUT: started_at=755606.205, ended_at=755636.22, duration_seconds=30.015, status=TIMEOUT
- CANDIDATE_JUDGE_TIMEOUT: started_at=755606.205, ended_at=755636.24, duration_seconds=30.035, status=TIMEOUT
- CANDIDATE_JUDGE_TIMEOUT: started_at=755606.206, ended_at=755636.244, duration_seconds=30.038, status=TIMEOUT
- MULTI_CANDIDATE_RANKING_FAILED: started_at=755606.183, ended_at=755636.244, duration_seconds=30.061, status=FAILED
- MULTI_CANDIDATE_RANKING_EXITED: started_at=755636.244, ended_at=755636.244, duration_seconds=0.0, status=FAILED

## Watchdog Safety Decision
- REAL_PRODUCTION_VALIDATION_V1_COMPLETE = NO
- CONTENT_FACTORY_V1_FREEZE = NO
- runtime_publish_status = BLOCKED
- release_allowed = NO
- registry_update_allowed = NO
- dashboard_pass_allowed = NO

# Fallback Decision
- fallback_policy_created: `YES`
- fallback_state: `MANUAL_REVIEW_REQUIRED`
- fallback_reason: `Gemini NETWORK_TIMEOUT`
- automatic_release_allowed: NO
- manual_review_required: `YES`

# MULTI_CANDIDATE_RANKING_TIMEOUT_DIAGNOSIS_V1

## Current Diagnosis
- stuck_stage: `MULTI_CANDIDATE_RANKING_STARTED`
- global_watchdog_triggered: `NO`
- global_watchdog_passed: `YES`
- ranking_stage_timeout_enabled: `YES`
- candidate_judge_timeout_enabled: `YES`

## Ranking Timeout Config
- multi_candidate_ranking_timeout_seconds: `60`
- candidate_judge_timeout_seconds: `30`
- max_candidates: `5`
- execution_mode: `parallel`

## Last Ranking Run
- ranking_exited_within_60_seconds: `YES`
- timeout_triggered: `YES`
- timeout_candidate_id: `ASTRAL_RELIC`
- failed_candidate_count: `0`
- timeout_candidate_count: `5`
- completed_candidate_count: `0`
- ranking_result: `MANUAL_REVIEW_REQUIRED`

## Candidate Trace
- candidate_id: `SCROLL_RELIC` | status: `TIMEOUT` | http_status: `None` | exception_type: `TimeoutExpired` | exception_message: `Candidate judge timeout exceeded.` | duration_seconds: `30.027`
- candidate_id: `BRONZE_RELIC` | status: `TIMEOUT` | http_status: `None` | exception_type: `TimeoutExpired` | exception_message: `Candidate judge timeout exceeded.` | duration_seconds: `30.012`
- candidate_id: `STONE_RELIC` | status: `TIMEOUT` | http_status: `None` | exception_type: `TimeoutExpired` | exception_message: `Candidate judge timeout exceeded.` | duration_seconds: `30.015`
- candidate_id: `JADE_RELIC` | status: `TIMEOUT` | http_status: `None` | exception_type: `TimeoutExpired` | exception_message: `Candidate judge timeout exceeded.` | duration_seconds: `30.035`
- candidate_id: `ASTRAL_RELIC` | status: `TIMEOUT` | http_status: `None` | exception_type: `TimeoutExpired` | exception_message: `Candidate judge timeout exceeded.` | duration_seconds: `30.038`

## Safety Decision
- REAL_PRODUCTION_VALIDATION_V1_COMPLETE = NO
- CONTENT_FACTORY_V1_FREEZE = NO
- runtime_publish_status = BLOCKED
- release_allowed = NO
- registry_update_allowed = NO
- dashboard_pass_allowed = NO
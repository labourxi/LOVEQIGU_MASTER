# REAL_PRODUCTION_VALIDATION_V1_REPORT

## Summary
- freeze: `NO`
- overall_status: `MANUAL_REVIEW_REQUIRED`

## Task
- task_id: `jiao_su`
- task_type: `new_relic`
- task_target: `角宿`

## Factory Results
- relic_id: `jiao_su_relic`
- story_id: `jiao_su_story`
- winner_image: `assets\visual-autopilot\winner\winner.jpg`
- gemini_score: `0`
- approval_result: `MANUAL_REVIEW_REQUIRED`
- release_id: ``

## Step Results
- `Parser`: `PASS`
  - detail: `new_relic`
- `Planner`: `PASS`
  - detail: `new_relic`
- `Dispatcher`: `PASS`
  - detail: `RelicFactory`
- `RelicFactory`: `PASS`
  - detail: `D:\LOVEQIGU_MASTER\data\relics\generated\jiao_su_relic.json`
- `StoryFactory`: `PASS`
  - detail: `D:\LOVEQIGU_MASTER\data\story\generated\jiao_su_story.json`
- `VisualFactory`: `MANUAL_REVIEW_REQUIRED`
  - detail: `Gemini unavailable: NETWORK_TIMEOUT`
- `GeminiJudge`: `MANUAL_REVIEW_REQUIRED`
  - detail: `Gemini unavailable: NETWORK_TIMEOUT`
- `HumanReviewGate`: `MANUAL_REVIEW_REQUIRED`
  - detail: `MANUAL_REVIEW_REQUIRED`
- `ApprovalConsole`: `BLOCKED`
  - detail: `SKIPPED`
- `ReleaseManager`: `BLOCKED`
  - detail: `SKIPPED`
- `Registry`: `BLOCKED`
  - detail: `SKIPPED`
- `Dashboard`: `BLOCKED`
  - detail: `SKIPPED`

## Registry Record
- assets_json: `runtime\registry\assets.json`
- releases_json: `runtime\registry\releases.json`
- visual_asset_registered: `BLOCKED`
- story_asset_registered: `BLOCKED`
- relic_asset_registered: `BLOCKED`
- release_registry_release_id: ``
- release_registry_count: `0`

## Dashboard Delta
- asset_visual_delta: `0`
- asset_story_delta: `0`
- asset_relic_delta: `0`
- release_approved_delta: `0`
- release_pending_delta: `0`
- factory_daily_delta: `0`
- factory_total_delta: `0`
- visual_winner_delta: `0`
- visual_candidate_delta: `0`

## Failure Points
- Visual factory failed: {'status': 'failed', 'factory': 'VisualFactory', 'error': {'generated_at': '2026-06-15T04:55:21.787941Z', 'status': 'MANUAL_REVIEW_REQUIRED', 'prompt': 'Ancient Eastern celestial relic for Jiao Su, Jiao Mansion constellation seal, jade glyph artifacts, museum artifact lighting, soft golden dust particles, ancient manuscript background', 'variation_count': 5, 'generated_count': 0, 'judged_count': 5, 'judge_source': 'GEMINI', 'variations': [{'key': 'SCROLL_RELIC', 'filename': 'candidate_A.txt', 'path': 'assets\\visual-autopilot\\prompts\\candidate_A.txt', 'prompt': 'Ancient Eastern celestial relic for Jiao Su, Jiao Mansion constellation seal, jade glyph artifacts, museum artifact lighting, soft golden dust particles, ancient manuscript background. Variant theme: SCROLL_RELIC. Ancient scroll relic composition with layered manuscript textures, hanging silk scroll fragments, seal script details, sacred whitespace, museum lighting, refined Chinese antiquity.'}, {'key': 'BRONZE_RELIC', 'filename': 'candidate_B.txt', 'path': 'assets\\visual-autopilot\\prompts\\candidate_B.txt', 'prompt': 'Ancient Eastern celestial relic for Jiao Su, Jiao Mansion constellation seal, jade glyph artifacts, museum artifact lighting, soft golden dust particles, ancient manuscript background. Variant theme: BRONZE_RELIC. Bronze relic composition with ancient cast-metal texture, ritual vessel silhouette, patina surface, engraved star markings, solemn museum display, quiet whitespace.'}, {'key': 'STONE_RELIC', 'filename': 'candidate_C.txt', 'path': 'assets\\visual-autopilot\\prompts\\candidate_C.txt', 'prompt': 'Ancient Eastern celestial relic for Jiao Su, Jiao Mansion constellation seal, jade glyph artifacts, museum artifact lighting, soft golden dust particles, ancient manuscript background. Variant theme: STONE_RELIC. Stone relic composition with carved stele geometry, weathered mineral surface, epigraphic inscription, archaeological lighting, restrained negative space, sacred stillness.'}, {'key': 'JADE_RELIC', 'filename': 'candidate_D.txt', 'path': 'assets\\visual-autopilot\\prompts\\candidate_D.txt', 'prompt': 'Ancient Eastern celestial relic for Jiao Su, Jiao Mansion constellation seal, jade glyph artifacts, museum artifact lighting, soft golden dust particles, ancient manuscript background. Variant theme: JADE_RELIC. Jade relic composition with translucent jade texture, carved talisman form, constellation glyphs, imperial green tones, soft highlight control, elegant whitespace.'}, {'key': 'ASTRAL_RELIC', 'filename': 'candidate_E.txt', 'path': 'assets\\visual-autopilot\\prompts\\candidate_E.txt', 'prompt': 'Ancient Eastern celestial relic for Jiao Su, Jiao Mansion constellation seal, jade glyph artifacts, museum artifact lighting, soft golden dust particles, ancient manuscript background. Variant theme: ASTRAL_RELIC. Astral relic composition with celestial seal motifs, star chart geometry, ritual glow, manuscript backdrop, cosmic alignment, ceremonial whitespace.'}], 'judged': [{'candidate': '', 'candidate_id': 'SCROLL_RELIC', 'prompt_key': 'SCROLL_RELIC', 'prompt_file': 'candidate_A.txt', 'judge_source': 'GEMINI', 'key_found': True, 'key_source': 'GEMINI_API_KEY', 'status': 'TIMEOUT', 'scores': {'oriental_score': 0, 'ancient_score': 0, 'mystery_score': 0, 'whitespace_score': 0, 'relic_fit_score': 0, 'total_score': 0}, 'review_reason': {'oriental_reason': '', 'ancient_reason': '', 'mystery_reason': '', 'whitespace_reason': '', 'relic_fit_reason': ''}, 'review_text': '', 'http_status': None, 'latency_ms': 30026, 'exception_type': 'TimeoutExpired', 'exception_message': 'Candidate judge timeout exceeded.', 'image_path': '', 'duration_seconds': 30.027, 'timeout_triggered': True}, {'candidate': '', 'candidate_id': 'BRONZE_RELIC', 'prompt_key': 'BRONZE_RELIC', 'prompt_file': 'candidate_B.txt', 'judge_source': 'GEMINI', 'key_found': True, 'key_source': 'GEMINI_API_KEY', 'status': 'TIMEOUT', 'scores': {'oriental_score': 0, 'ancient_score': 0, 'mystery_score': 0, 'whitespace_score': 0, 'relic_fit_score': 0, 'total_score': 0}, 'review_reason': {'oriental_reason': '', 'ancient_reason': '', 'mystery_reason': '', 'whitespace_reason': '', 'relic_fit_reason': ''}, 'review_text': '', 'http_status': None, 'latency_ms': 30012, 'exception_type': 'TimeoutExpired', 'exception_message': 'Candidate judge timeout exceeded.', 'image_path': '', 'duration_seconds': 30.012, 'timeout_triggered': True}, {'candidate': '', 'candidate_id': 'STONE_RELIC', 'prompt_key': 'STONE_RELIC', 'prompt_file': 'candidate_C.txt', 'judge_source': 'GEMINI', 'key_found': True, 'key_source': 'GEMINI_API_KEY', 'status': 'TIMEOUT', 'scores': {'oriental_score': 0, 'ancient_score': 0, 'mystery_score': 0, 'whitespace_score': 0, 'relic_fit_score': 0, 'total_score': 0}, 'review_reason': {'oriental_reason': '', 'ancient_reason': '', 'mystery_reason': '', 'whitespace_reason': '', 'relic_fit_reason': ''}, 'review_text': '', 'http_status': None, 'latency_ms': 30015, 'exception_type': 'TimeoutExpired', 'exception_message': 'Candidate judge timeout exceeded.', 'image_path': '', 'duration_seconds': 30.015, 'timeout_triggered': True}, {'candidate': '', 'candidate_id': 'JADE_RELIC', 'prompt_key': 'JADE_RELIC', 'prompt_file': 'candidate_D.txt', 'judge_source': 'GEMINI', 'key_found': True, 'key_source': 'GEMINI_API_KEY', 'status': 'TIMEOUT', 'scores': {'oriental_score': 0, 'ancient_score': 0, 'mystery_score': 0, 'whitespace_score': 0, 'relic_fit_score': 0, 'total_score': 0}, 'review_reason': {'oriental_reason': '', 'ancient_reason': '', 'mystery_reason': '', 'whitespace_reason': '', 'relic_fit_reason': ''}, 'review_text': '', 'http_status': None, 'latency_ms': 30034, 'exception_type': 'TimeoutExpired', 'exception_message': 'Candidate judge timeout exceeded.', 'image_path': '', 'duration_seconds': 30.035, 'timeout_triggered': True}, {'candidate': '', 'candidate_id': 'ASTRAL_RELIC', 'prompt_key': 'ASTRAL_RELIC', 'prompt_file': 'candidate_E.txt', 'judge_source': 'GEMINI', 'key_found': True, 'key_source': 'GEMINI_API_KEY', 'status': 'TIMEOUT', 'scores': {'oriental_score': 0, 'ancient_score': 0, 'mystery_score': 0, 'whitespace_score': 0, 'relic_fit_score': 0, 'total_score': 0}, 'review_reason': {'oriental_reason': '', 'ancient_reason': '', 'mystery_reason': '', 'whitespace_reason': '', 'relic_fit_reason': ''}, 'review_text': '', 'http_status': None, 'latency_ms': 30037, 'exception_type': 'TimeoutExpired', 'exception_message': 'Candidate judge timeout exceeded.', 'image_path': '', 'duration_seconds': 30.038, 'timeout_triggered': True}], 'ranking': [{'candidate': '', 'candidate_id': 'SCROLL_RELIC', 'prompt_key': 'SCROLL_RELIC', 'total_score': 0}, {'candidate': '', 'candidate_id': 'BRONZE_RELIC', 'prompt_key': 'BRONZE_RELIC', 'total_score': 0}, {'candidate': '', 'candidate_id': 'STONE_RELIC', 'prompt_key': 'STONE_RELIC', 'total_score': 0}, {'candidate': '', 'candidate_id': 'JADE_RELIC', 'prompt_key': 'JADE_RELIC', 'total_score': 0}, {'candidate': '', 'candidate_id': 'ASTRAL_RELIC', 'prompt_key': 'ASTRAL_RELIC', 'total_score': 0}], 'winner': {'candidate': '', 'candidate_id': 'SCROLL_RELIC', 'prompt_key': 'SCROLL_RELIC', 'prompt_file': 'candidate_A.txt', 'judge_source': 'GEMINI', 'key_found': True, 'key_source': 'GEMINI_API_KEY', 'status': 'TIMEOUT', 'scores': {'oriental_score': 0, 'ancient_score': 0, 'mystery_score': 0, 'whitespace_score': 0, 'relic_fit_score': 0, 'total_score': 0}, 'review_reason': {'oriental_reason': '', 'ancient_reason': '', 'mystery_reason': '', 'whitespace_reason': '', 'relic_fit_reason': ''}, 'review_text': '', 'http_status': None, 'latency_ms': 30026, 'exception_type': 'TimeoutExpired', 'exception_message': 'Candidate judge timeout exceeded.', 'image_path': '', 'duration_seconds': 30.027, 'timeout_triggered': True}, 'backup': {'candidate': '', 'candidate_id': 'SCROLL_RELIC', 'prompt_key': 'SCROLL_RELIC', 'prompt_file': 'candidate_A.txt', 'judge_source': 'GEMINI', 'key_found': True, 'key_source': 'GEMINI_API_KEY', 'status': 'TIMEOUT', 'scores': {'oriental_score': 0, 'ancient_score': 0, 'mystery_score': 0, 'whitespace_score': 0, 'relic_fit_score': 0, 'total_score': 0}, 'review_reason': {'oriental_reason': '', 'ancient_reason': '', 'mystery_reason': '', 'whitespace_reason': '', 'relic_fit_reason': ''}, 'review_text': '', 'http_status': None, 'latency_ms': 30026, 'exception_type': 'TimeoutExpired', 'exception_message': 'Candidate judge timeout exceeded.', 'image_path': '', 'duration_seconds': 30.027, 'timeout_triggered': True}, 'winner_path': '', 'ranking_path': 'assets\\visual-autopilot\\judge\\ranking.json', 'judge_report_path': 'assets\\visual-autopilot\\judge\\judge_report.json', 'notes': ['Timeout triggered at candidate_judge for ASTRAL_RELIC.'], 'prompts_written': 5, 'timeout_guard_enabled': 'YES', 'timeout_triggered': True, 'timeout_stage': 'candidate_judge', 'timeout_candidate_id': 'ASTRAL_RELIC', 'stage_trace': [{'stage': 'MULTI_CANDIDATE_RANKING_STARTED', 'candidate_id': '', 'started_at': 755606.183, 'ended_at': 755606.183, 'duration_seconds': 0.0, 'status': 'STARTED'}, {'stage': 'CANDIDATE_JUDGE_STARTED', 'candidate_id': 'SCROLL_RELIC', 'started_at': 755606.183, 'ended_at': 755606.183, 'duration_seconds': 0.0, 'status': 'STARTED'}, {'stage': 'CANDIDATE_JUDGE_STARTED', 'candidate_id': 'BRONZE_RELIC', 'started_at': 755606.204, 'ended_at': 755606.204, 'duration_seconds': 0.0, 'status': 'STARTED'}, {'stage': 'CANDIDATE_JUDGE_STARTED', 'candidate_id': 'STONE_RELIC', 'started_at': 755606.205, 'ended_at': 755606.205, 'duration_seconds': 0.0, 'status': 'STARTED'}, {'stage': 'CANDIDATE_JUDGE_STARTED', 'candidate_id': 'JADE_RELIC', 'started_at': 755606.205, 'ended_at': 755606.205, 'duration_seconds': 0.0, 'status': 'STARTED'}, {'stage': 'CANDIDATE_JUDGE_STARTED', 'candidate_id': 'ASTRAL_RELIC', 'started_at': 755606.206, 'ended_at': 755606.206, 'duration_seconds': 0.0, 'status': 'STARTED'}, {'stage': 'CANDIDATE_JUDGE_TIMEOUT', 'candidate_id': 'SCROLL_RELIC', 'started_at': 755606.183, 'ended_at': 755636.21, 'duration_seconds': 30.027, 'status': 'TIMEOUT'}, {'stage': 'CANDIDATE_JUDGE_TIMEOUT', 'candidate_id': 'BRONZE_RELIC', 'started_at': 755606.204, 'ended_at': 755636.217, 'duration_seconds': 30.012, 'status': 'TIMEOUT'}, {'stage': 'CANDIDATE_JUDGE_TIMEOUT', 'candidate_id': 'STONE_RELIC', 'started_at': 755606.205, 'ended_at': 755636.22, 'duration_seconds': 30.015, 'status': 'TIMEOUT'}, {'stage': 'CANDIDATE_JUDGE_TIMEOUT', 'candidate_id': 'JADE_RELIC', 'started_at': 755606.205, 'ended_at': 755636.24, 'duration_seconds': 30.035, 'status': 'TIMEOUT'}, {'stage': 'CANDIDATE_JUDGE_TIMEOUT', 'candidate_id': 'ASTRAL_RELIC', 'started_at': 755606.206, 'ended_at': 755636.244, 'duration_seconds': 30.038, 'status': 'TIMEOUT'}, {'stage': 'MULTI_CANDIDATE_RANKING_FAILED', 'candidate_id': '', 'started_at': 755606.183, 'ended_at': 755636.244, 'duration_seconds': 30.061, 'status': 'FAILED'}, {'stage': 'MULTI_CANDIDATE_RANKING_EXITED', 'candidate_id': '', 'started_at': 755636.244, 'ended_at': 755636.244, 'duration_seconds': 0.0, 'status': 'FAILED'}], 'ranking_result': 'MANUAL_REVIEW_REQUIRED', 'fallback_state': 'NONE'}}
- Gemini judge did not return valid HTTP 200 reviews: GEMINI
- Visual acceptance not met because Gemini review was not fully valid.
- Gemini judge failure blocked human review, approval, release, registry, and dashboard stages by design.
- Gemini network timeout triggered MANUAL_REVIEW_REQUIRED fallback package creation.

## Conclusion
- `CONTENT_FACTORY_V1_FREEZE = NO`
- `REAL_PRODUCTION_VALIDATION_V1_COMPLETE = NO`
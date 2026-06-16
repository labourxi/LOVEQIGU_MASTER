# 66｜ADMIN_CONTENT_MODEL_V1

Objective

Prepare the content administration data model for future checkpoint expansion.

This is NOT a full admin panel implementation.

Only establish the underlying content model and future operational workflow.

Read First

- LOVEQIGU_AUTOPILOT_V1_ARCHITECTURE.md
- docs/AUTOPILOT_IMPLEMENTATION_REPORT.md
- docs/AUTOPILOT_V1_OPERATIONALIZATION_REPORT.md
- docs/RUNTIME_ALIGNMENT_REPORT.md

Constraints

- Do not modify Canon
- Do not modify CH01–CH03 frozen content
- Do not create CH04
- Do not create actual admin UI pages
- Data model only

--------------------------------------------------
PART 1
CONTENT ADMIN DATA MODEL
--------------------------------------------------

Design data structures for:

1. checkpoint

Purpose:

Represent a future exploration point.

Suggested fields:

- checkpoint_id
- chapter_id
- map_region
- title
- placeholder_status
- runtime_status
- relic_template_ref
- ar_template_ref
- audit_status
- publish_status

--------------------------------------------------

2. relic_template

Purpose:

Future relic generation blueprint.

Suggested fields:

- relic_template_id
- chapter_id
- relic_type
- rarity_level
- required_art
- required_story
- required_rights
- dc_enabled
- status

--------------------------------------------------

3. art_requirement

Purpose:

Automatically generated art task sheet.

Suggested fields:

- art_requirement_id
- source_checkpoint
- asset_type
- asset_name
- asset_description
- priority
- status

--------------------------------------------------

4. generation_rule

Purpose:

Autopilot generation rule set.

Suggested fields:

- rule_id
- trigger
- target_object
- generation_action
- audit_required
- freeze_required
- runtime_publish_required

--------------------------------------------------
PART 2
SUPER ADMIN OPERATIONS
--------------------------------------------------

Document future admin actions.

No UI implementation.

Only describe operation model.

Operation A

新增探索点

Expected process:

checkpoint
↓

placeholder
↓

audit

--------------------------------------------------

Operation B

生成信物占位

Expected process:

checkpoint
↓

relic_template
↓

placeholder relic

--------------------------------------------------

Operation C

生成AR占位

Expected process:

checkpoint
↓

AR placeholder
↓

runtime bridge

--------------------------------------------------

Operation D

生成美术需求单

Expected process:

checkpoint
↓

art_requirement
↓

asset queue

--------------------------------------------------

Operation E

提交审查

Expected process:

audit
↓

governance gate
↓

OMX

--------------------------------------------------

Operation F

发布到Runtime

Expected process:

freeze
↓

runtime registry
↓

runtime publish

--------------------------------------------------
PART 3
AUTOPILOT COMPATIBILITY
--------------------------------------------------

Explain how future Autopilot V1 will consume:

checkpoint

relic_template

art_requirement

generation_rule

without manual coding.

--------------------------------------------------
PART 4
OUTPUT
--------------------------------------------------

Generate:

docs/ADMIN_CONTENT_MODEL_V1_REPORT.md

Include:

1. Data structures
2. Future admin operations
3. Autopilot integration model
4. Runtime publishing model
5. Scalability analysis

Success Marker:

ADMIN_CONTENT_MODEL_V1_COMPLETE = YES
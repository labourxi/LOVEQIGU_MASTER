# EVENT_LIFECYCLE_ENGINE_V1

## 1. Purpose

活动生命周期引擎用于统一定义活动从草稿、审核、发布、运行到结束归档的状态流，覆盖商家、园区审核和平台审核的完整路径。

## 2. Status Model

- DRAFT
- SUBMITTED
- PARK_REVIEW
- PLATFORM_REVIEW
- APPROVED
- PUBLISHED
- RUNNING
- FINISHED
- ARCHIVED
- REJECTED

## 3. Transition Rules

- DRAFT -> SUBMITTED
- SUBMITTED -> PARK_REVIEW
- PARK_REVIEW -> PLATFORM_REVIEW
- PLATFORM_REVIEW -> APPROVED / REJECTED
- APPROVED -> PUBLISHED
- PUBLISHED -> RUNNING
- RUNNING -> FINISHED
- FINISHED -> ARCHIVED
- REJECTED -> terminal
- ARCHIVED -> terminal

## 4. Mock Case

Default case: `爱企谷初见寻宝节`

The mock lifecycle file covers:

- normal publish path
- review rejection path
- activity finish path

## 5. Engine Contract

Input:

- `current_status`

Output:

- `allowed_next_status`

## 6. Validation

Validation checks:

- all statuses are legal
- all transitions are legal
- mock data matches the transition table

## 7. Implementation Notes

- no API
- no database
- no Runtime
- no Release
- no Visual Factory
- no Content Factory


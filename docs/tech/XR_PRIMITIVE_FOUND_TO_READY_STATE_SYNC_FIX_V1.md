# XR_PRIMITIVE_FOUND_TO_READY_STATE_SYNC_FIX_V1

## Problem

真机诊断已确认：

- surface_box_query_result = FOUND
- scene_query_result = FOUND
- primitive_node_query_result = FOUND
- primitive_object_query_result = FOUND

但页面仍显示：

- primitive_object_visible = NO
- primitive_sample_status = PRIMITIVE_RENDER_BLOCKED
- primitive_block_reason = PRIMITIVE_OBJECT_QUERY_NOT_FOUND

## Root Cause

selector 诊断结果与页面状态汇总逻辑不同步，FOUND 没有正确转为 READY。

## Fix

- found_to_ready_state_sync_added:
- contradiction_normalizer_added:
- primitive_object_query_found_sets_visible:
- primitive_node_query_found_sets_visible:
- block_reason_cleared_when_found:

## Expected Result

用户点击运行 Primitive 节点诊断后，如果 object 或 node 为 FOUND：

- PRIMITIVE_OBJECT_VISIBLE = YES
- PRIMITIVE_SAMPLE_STATUS = PRIMITIVE_RENDER_READY
- PRIMITIVE_BLOCK_REASON = 空

## Manual Verification Required

用户需要：

1. 打开 XR Primitive Sample
2. 点击运行 Primitive 节点诊断
3. 查看：
   - PRIMITIVE_NODE_QUERY_RESULT
   - PRIMITIVE_OBJECT_QUERY_RESULT
   - PRIMITIVE_OBJECT_VISIBLE
   - PRIMITIVE_SAMPLE_STATUS
   - PRIMITIVE_BLOCK_REASON

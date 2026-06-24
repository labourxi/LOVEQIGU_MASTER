# XR_MERCHANT_EVENT_DETAIL_WXML_STRUCTURE_FIX_V1

## Problem

merchant-event/detail/index.wxml failed to compile after XR route fix.

Error:

end tag missing, near `view`

## Diagnosis

The XR button route fix likely introduced or exposed an unbalanced view tag around the wx:else fallback block.

## Fix

- merchant_event_detail_wxml_structure_fixed:
- wx_if_else_structure_preserved:
- xr_button_route_preserved:
- renderer_internals_unchanged:
- marker_added: NO
- anchor_added: NO
- business_data_added: NO

## Expected Result

merchant-event/detail page compiles again.
XR button still opens:

/xr_demo/miniprogram/pages/xr-scenic-point-render/index

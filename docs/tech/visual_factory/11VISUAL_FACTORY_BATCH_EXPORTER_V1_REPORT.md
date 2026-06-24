# 11VISUAL_FACTORY_BATCH_EXPORTER_V1_REPORT

## Purpose
Implement the last missing visual factory export layer: batch directory packaging, review sheet export, and batch manifest export.

## Input Case
- batch_id: `golden_phoenix_v1`
- subject: `11 金凤凰`
- prompt: `11 金凤凰，金凤凰主题最小视觉批次，金色羽纹与发光轮廓，纯净背景，清晰主体，精致工艺感，无文字，无水印。`

## Accepted Output Directory
- `data\visual_factory\batches\golden_phoenix_v1`

## Exported Files
- `GOLDEN_PHOENIX_GEMINI_R1_01.png` <- `assets\visual-autopilot\candidates\seedream_ark_1781361910.jpg` (local_fallback)
- `GOLDEN_PHOENIX_GEMINI_R1_02.png` <- `assets\visual-autopilot\candidates\seedream_ark_1781394406832243400_1.jpg` (local_fallback)
- `GOLDEN_PHOENIX_DOUBAO_R1_01.png` <- `assets\visual-autopilot\candidates\seedream_ark_1782013215266012400_1.jpg` (live_api)
- `GOLDEN_PHOENIX_DOUBAO_R1_02.png` <- `assets\visual-autopilot\candidates\seedream_ark_1782013238580491300_2.jpg` (live_api)

## Review Sheet
- `data\visual_factory\batches\golden_phoenix_v1\review_sheet.csv`

## Batch Manifest
- `data\visual_factory\batches\golden_phoenix_v1\batch_manifest.json`

## Provider Status
- Gemini: `fallback`
- Doubao: `success`

## Acceptance Result
```yaml
REVIEW_SHEET_READY: YES
BATCH_MANIFEST_READY: YES
BATCH_EXPORT_READY: YES
VISUAL_FACTORY_AUTOMATION_LEVEL: L3
```

## Notes
- Human approval remains required after export.
- The exporter keeps batch artifacts separate from runtime/release state.

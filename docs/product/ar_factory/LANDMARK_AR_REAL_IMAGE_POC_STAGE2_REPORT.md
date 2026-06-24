# LANDMARK_AR_REAL_IMAGE_POC_STAGE2_REPORT

## Purpose

Validate real-image Stage1 outputs through Factory Package → Runtime Package → Schema validation → Runtime loader.

## Input

- `data/ar_factory/poc/landmark_tree_v1/`
- subject_analysis.json
- anchor.json
- anchor_quality.json
- position_guide.png
- alignment_overlay.png

## Generated Files

- `data/ar_factory/poc/landmark_tree_v1/factory_package.json`
- `data/ar_factory/poc/landmark_tree_v1/runtime_package.json`
- `data/ar_factory/poc/landmark_tree_v1/schema_validation.json`
- `scripts/ar_factory/runtime_package_loader.py`

## Results

- FACTORY_PACKAGE_GENERATED: YES
- RUNTIME_PACKAGE_GENERATED: YES
- SCHEMA_VALIDATION: PASS
- RUNTIME_LOAD_TEST: PASS

## Schema Validation Detail

- factory_package.passed: True
- runtime_package.passed: True

## Runtime Loader Detail

- loader_passed: True
- ar_entity.ar_id: landmark_tree_v1
- anchor_type: image_anchor
- ar_runtime_flow_stages: 7

## Final Verdict

- READY_FOR_RUNTIME_INTEGRATION: YES

## Notes

- This stage validates package generation and runtime read path only.
- No WeChat AR, device AR, AR SDK, or AR rendering was connected.
- Real photos and real OpenCV anchor from Stage1 feed the factory/runtime packages.
- Publish gate (anchor_score >= 0.65) remains advisory; packages are draft status.

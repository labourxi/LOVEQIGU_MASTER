# LANDMARK_AR_REAL_IMAGE_POC_V1_REPORT

## Inputs
- `data/ar_factory/poc/landmark_tree_v1/`
- `tree_full.jpg`
- `tree_near.jpg`
- `tree_far.jpg`
- `tree_left45.jpg`
- `tree_right45.jpg`
- `tree_trunk.jpg`
- `position_a.jpg`
- `position_b.jpg`

## Required Status
- REAL_IMAGE_INPUT = YES
- SUBJECT_ANALYSIS = PASS
- ANCHOR_EXTRACTION = PASS
- ANCHOR_QUALITY = PASS
- POSITION_GUIDE = PASS
- ALIGNMENT_OVERLAY = PASS

## Generated Files
- `data\ar_factory\poc\landmark_tree_v1\subject_analysis.json`: OK
- `data\ar_factory\poc\landmark_tree_v1\anchor.json`: OK
- `data\ar_factory\poc\landmark_tree_v1\anchor_quality.json`: OK
- `data\ar_factory\poc\landmark_tree_v1\position_guide.png`: OK
- `data\ar_factory\poc\landmark_tree_v1\alignment_overlay.png`: OK

## Output Summary
- subject_type: tree
- landmark_type: ancient_tree
- confidence: 0.99
- input_images: 8
- feature_points: 93235
- distribution_score: 0.7529
- stability_score: 0.0042
- overall_score: 0.6148

## Verdict
- POC_STAGE_1_PASS = YES
- READY_FOR_FACTORY_PACKAGE = YES

## Notes
- This run used the real 8-photo dataset under `data/ar_factory/poc/landmark_tree_v1/`.
- OpenCV ORB + AKAZE were used for anchor extraction; Pillow was used for the guide and overlay renderings.
- No factory package or runtime package was generated in this stage.
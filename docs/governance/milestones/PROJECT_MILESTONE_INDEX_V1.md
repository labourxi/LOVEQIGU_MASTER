# PROJECT_MILESTONE_INDEX_V1

```yaml
project: LOVEQIGU / AR游伴
module: Project Milestone Index
version: V1
status: ACTIVE
updated_at: 2026-06-21
```

---

## CURRENT_MILESTONES

```yaml
VISUAL_FACTORY_L3_READY:
  status: YES
  source: docs/governance/milestones/AR_FACTORY_MILESTONE_FREEZE_V1.md
  evidence: VISUAL_FACTORY_AUTOMATION_LEVEL=L3

WECHAT_XR_RENDERER_MVP_READY:
  status: YES
  source: docs/governance/milestones/AR_FACTORY_MILESTONE_FREEZE_V1.md
  evidence:
    - XR_PAGE_OPENED=YES
    - XR_CAMERA_READY=YES
    - XR_SCENE_READY=YES
    - XR_RENDER_READY=YES
    - RUNTIME_TO_XR_MAPPING_READY=YES

AR_FACTORY_CORE_PIPELINE_READY:
  status: YES
  source: docs/governance/milestones/AR_FACTORY_MILESTONE_FREEZE_V1.md
  evidence:
    - REAL_IMAGE_POC=PASS
    - FACTORY_PACKAGE=PASS
    - RUNTIME_PACKAGE=PASS
    - AR_RUNTIME_FLOW=PASS

READY_FOR_ANCHOR_TRACKING:
  status: YES
  source: docs/governance/milestones/AR_FACTORY_MILESTONE_FREEZE_V1.md
  evidence: NEXT_TECH_PATH includes ANCHOR_TRACKING_SPIKE_V1

ANCHOR_TRACKING_SPIKE_V1:
  status: FAIL
  source: docs/governance/milestones/ANCHOR_TRACKING_SPIKE_V1_FREEZE.md
  evidence:
    - XR_CAMERA_READY=YES
    - XR_SCENE_READY=YES
    - XR_RENDER_READY=YES
    - ANCHOR_CREATED=NO
    - OBJECT_BOUND_TO_ANCHOR=NO
    - WORLD_LOCKED=NO

REAL_AR_STATUS:
  status: FAIL
  source: docs/governance/milestones/11REAL_AR_STATUS_FREEZE_V1.md
  evidence:
    - XR_RENDERER=PASS
    - ANCHOR_TRACKING=FAIL
    - MARKER_AR=FAIL
    - VISUAL_FACTORY=PASS
    - AR_FACTORY=PASS
    - CURRENT_PROJECT_STAGE=XR_RENDERER_ONLY
    - REAL_AR_READY=NO
    - ROOT_BLOCKER=MARKER_RUNTIME
```

---

## INDEX_RULES

- This index only records frozen or accepted milestone states.
- The source of truth for the freeze is `docs/governance/milestones/AR_FACTORY_MILESTONE_FREEZE_V1.md`.
- The XR renderer MVP record does not change renderer internals or runtime package schema.
- Future spike entries must be appended here after a real review or acceptance event.

---

## NEXT_UPDATE

- `MARKER_AR_SPIKE_V1`
- `DRAGON_EFFECT_SPIKE_V1`

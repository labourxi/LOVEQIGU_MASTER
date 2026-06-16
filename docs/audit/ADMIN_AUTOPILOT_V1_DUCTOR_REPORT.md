# Admin Autopilot V1 Ductor Report

Generated: 2026-06-08T09:05:58.522Z
Exit code: 0

## Command

```bash
python dry-run --checkpoint test_cp_001 --chapter CH04 --report D:\LOVEQIGU_MASTER\docs\ADMIN_AUTOPILOT_V1_REPORT.md --sandbox
```

## Stdout

```
{
  "operational": true,
  "integrity": {
    "ok": true,
    "missing": [],
    "changed": []
  },
  "gate": {
    "verdict": "PASS",
    "integrity": {
      "ok": true,
      "missing": [],
      "changed": []
    },
    "sandbox_state": {
      "checkpoint": true,
      "relic_template": true,
      "art_requirement": true,
      "runtime_registry": true,
      "published_registry": false
    },
    "sandbox_only": true,
    "runtime_registry_draft_only": true,
    "report_exists": true,
    "warnings": [],
    "chapter": "CH04",
    "checkpoint_id": "test_cp_001"
  },
  "files_created": [
    "sandbox\\admin\\checkpoints\\test_cp_001.json",
    "sandbox\\admin\\relic_templates\\test_cp_001_relic_template.json",
    "sandbox\\admin\\art_requirements\\test_cp_001_art_requirement.json",
    "sandbox\\admin\\runtime_registry\\draft_registry.json"
  ],
  "warnings": [
    "sandbox materialized at sandbox\\admin",
    "dry-run completed in sandbox only"
  ],
  "report": "docs\\ADMIN_AUTOPILOT_V1_REPORT.md"
}
```

## Stderr

```

```

## Main Report

- docs\ADMIN_AUTOPILOT_V1_REPORT.md

DUCTOR_EXIT_CODE = 0

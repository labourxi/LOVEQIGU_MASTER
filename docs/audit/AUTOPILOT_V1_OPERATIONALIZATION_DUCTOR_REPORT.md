# LOVEQIGU Autopilot V1 Ductor Report

Generated: 2026-06-08T07:39:50.321Z
Exit code: 0

## Command

```bash
python dry-run --chapter CH04 --mode dry-run --sandbox
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
  "report_exists": true,
  "no_ch04_production": {
    "ok": true,
    "blocked": []
  },
  "gates": {
    "omx": {
      "returncode": 0,
      "stdout": "Cursor Content Engine audit status: WARN\nYAML files scanned: 20\nFAIL issues: 0\nWARN issues: 51\nMarkdown report: D:\\LOVEQIGU_MASTER\\docs\\CONTENT_ENGINE_CURSOR_AUDIT_REPORT.md\nJSON report: D:\\LOVEQIGU_MASTER\\docs\\CONTENT_ENGINE_CURSOR_AUDIT_REPORT.json\nLOVEQIGU_CONTENT_ENGINE_CURSOR_AUDIT_COMPLETE = YES\nOMX checks run: 5\nPassed: 5\nFailed: 0\nWarnings: 1\nViolations: 0\nReport: D:\\LOVEQIGU_MASTER\\docs\\OMX_REPORT.md\n"
    },
    "governance": {
      "returncode": 1,
      "status": "WARN",
      "stdout": "WARN\nFiles scanned: 20\nViolations: 0\nWarnings: 1\nReport: D:\\LOVEQIGU_MASTER\\docs\\CONTENT_ENGINE_GOVERNANCE_V2_REPORT.md\nCONTENT_ENGINE_GOVERNANCE_V2_COMPLETE = YES\n"
    }
  },
  "ductor": {
    "returncode": 0,
    "stdout": "invoked via Ductor wrapper",
    "stderr": ""
  },
  "warnings": [
    "sandbox materialized at sandbox\\autopilot\\CH04",
    "dry-run completed without touching production paths"
  ],
  "files_created": [
    "sandbox/autopilot/CH04/placeholder/story.json",
    "sandbox/autopilot/CH04/placeholder/relics.json",
    "sandbox/autopilot/CH04/placeholder/rights.json",
    "sandbox/autopilot/CH04/placeholder/ar.json",
    "sandbox/autopilot/CH04/fill/story.json",
    "sandbox/autopilot/CH04/fill/relics.json",
    "sandbox/autopilot/CH04/fill/rights.json",
    "sandbox/autopilot/CH04/fill/ar.json",
    "sandbox/autopilot/CH04/docs/content/DIGITAL_COLLECTIBLE_REGISTRY_CH04.md",
    "sandbox/autopilot/CH04/reports/freeze.md"
  ],
  "commands_tested": [
    "python -m py_compile scripts/autopilot/run_autopilot_v1.py",
    "python -m py_compile scripts/autopilot/autopilot_v1_gate.py",
    "node scripts/ductor/run_autopilot_v1.js --chapter CH04 --mode dry-run --sandbox",
    "python scripts/autopilot/autopilot_v1_gate.py --chapter CH04 --mode dry-run"
  ]
}
```

## Stderr

```

```

## Main Report

- docs\AUTOPILOT_V1_OPERATIONALIZATION_REPORT.md

DUCTOR_EXIT_CODE = 0

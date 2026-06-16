# PRODUCT_CANON_CODE_ALIGNMENT_AUDIT_V1

Objective

Audit whether current MiniApp code matches the frozen product canon.

Read first:

- docs/PROJECT_KNOWLEDGE_SYNC_REPORT.md
- docs/PROJECT_CONTEXT_REGISTRY_V1.md
- docs/PROJECT_CONTEXT_PREFLIGHT_V1_REPORT.md

Product canon files to check:

- LOVEQIGU_BLESSING_COLLECTION_CANON_V1
- LOVEQIGU_HOMEPAGE_CANON_V1
- LOVEQIGU_POINTS_AND_RIGHTS_CANON_V1
- LOVEQIGU_EXPLORE_MAP_CANON_V1
- LOVEQIGU_SCENIC_LANDING_PAGE_CANON_V1

Code scope:

- apps/miniapp/pages/
- apps/miniapp/components/
- apps/miniapp/services/
- apps/miniapp/app.json
- apps/miniapp/project.config.json
- data/
- services/

Audit dimensions:

1. Homepage consistency
2. Explore map consistency
3. Blessing collection consistency
4. Points and rights consistency
5. Scenic landing page consistency
6. Terminology consistency
7. Brand consistency: AR游伴 as product brand, 爱企谷 only as test scenic area
8. Forbidden positioning: not AR game, not digital collectible platform
9. Runtime/data consistency
10. User-visible copy consistency

Do not modify code.

Audit only.

Output:

docs/PRODUCT_CANON_CODE_ALIGNMENT_AUDIT_REPORT.md

Include:

- PASS items
- WARN items
- FAIL items
- exact file paths
- exact mismatch description
- recommended fixpack items

Success marker:

PRODUCT_CANON_CODE_ALIGNMENT_AUDIT_COMPLETE = YES
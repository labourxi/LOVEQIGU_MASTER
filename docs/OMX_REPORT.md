# OMX_REPORT

Generated: 2026-06-09T15:27:22.233Z
Repository: `D:\LOVEQIGU_MASTER`

## Summary

Checks run: 5
Checks passed: 3
Checks failed: 2
Warnings: 1
Violations: 19
Duration ms: 132

## Dry Run

Source files were read only. The only generated output is this report.

## check-json

Status: Passed

Details:

- Scanned 76 JSON files under apps/miniapp.

Warnings:

- None.

Violations:

- None.

## check-routes

Status: Passed

Details:

- Registered pages: 22.

Warnings:

- None.

Violations:

- None.

## check-terminology

Status: Failed

Details:

- Loaded 70 terminology replacement pairs.
- Scanned 338 Mini Program text/config files.

Warnings:

- None.

Violations:

- apps/miniapp/data/story/ch01_chapters.json: found outdated term "确认" from T-N5-009; expected "确认章成".
- apps/miniapp/data/story/ch02_chapters.json: found outdated term "确认" from T-N5-009; expected "确认章成".
- apps/miniapp/data/story/ch03_chapters.json: found outdated term "确认" from T-N5-009; expected "确认章成".
- apps/miniapp/data/story/ch04_chapters.json: found outdated term "确认" from T-N5-009; expected "确认章成".
- apps/miniapp/data/story/ch05_chapters.json: found outdated term "确认" from T-N5-009; expected "确认章成".
- apps/miniapp/data-js/story/ch01_chapters.js: found outdated term "确认" from T-N5-009; expected "确认章成".
- apps/miniapp/data-js/story/ch02_chapters.js: found outdated term "确认" from T-N5-009; expected "确认章成".
- apps/miniapp/data-js/story/ch03_chapters.js: found outdated term "确认" from T-N5-009; expected "确认章成".
- apps/miniapp/data-js/story/ch04_chapters.js: found outdated term "确认" from T-N5-009; expected "确认章成".
- apps/miniapp/data-js/story/ch05_chapters.js: found outdated term "确认" from T-N5-009; expected "确认章成".
- apps/miniapp/pages/rights-center/index.js: found outdated term "尚未" from T-N4-006; expected "尚未开放".
- apps/miniapp/services/chapter/ch01-story.js: found outdated term "确认" from T-N5-009; expected "确认章成".
- apps/miniapp/services/chapter/ch02-story.js: found outdated term "确认" from T-N5-009; expected "确认章成".
- apps/miniapp/services/chapter/ch03-story.js: found outdated term "确认" from T-N5-009; expected "确认章成".
- apps/miniapp/services/chapter/ch04-story.js: found outdated term "确认" from T-N5-009; expected "确认章成".
- apps/miniapp/services/chapter/ch05-story.js: found outdated term "确认" from T-N5-009; expected "确认章成".

## check-canon

Status: Failed

Details:

- Loaded 3 Canon documents for validation context.
- Scanned 307 Mini Program content files.

Warnings:

- None.

Violations:

- apps/miniapp/pages/seals/index.js: potential Canon-sensitive term "成就" requires review.
- apps/miniapp/pages/seals/index.json: potential Canon-sensitive term "成就" requires review.
- apps/miniapp/pages/synthesis/index.wxml: potential Canon-sensitive term "成就" requires review.

## check-content-engine-cursor

Status: Passed

Details:

- Cursor audit status: WARN.
- Scanned 20 Content Engine YAML files.
- FAIL issues: 0.
- WARN issues: 51.

Warnings:

- Cursor Content Engine audit has warnings under report-only governance mode.

Violations:

- None.

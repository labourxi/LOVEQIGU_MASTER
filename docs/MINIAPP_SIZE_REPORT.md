# MINIAPP SIZE REPORT

Scope: `apps/miniapp`

## Baseline

- Original package size: `2,371,324` bytes
- Original largest asset: `apps/miniapp/assets/images/home-hero.png` at `2,296,920` bytes

## Compression Applied

- Converted the hero image from PNG to JPEG
- New asset: `apps/miniapp/assets/images/home-hero.jpg`
- New hero image size: `100,397` bytes
- Updated `apps/miniapp/pages/index/index.js` to reference the JPEG asset
- Removed the original PNG asset

## Result

- Compressed package size: `174,801` bytes
- Total reduction: `2,196,523` bytes
- Reduction ratio: `92.63%`
- Final package size is below the 2 MB target

## Validation

- Package size check: `PASS`
- Route integrity check: `PASS`
  - `pages/index/index`
  - `pages/explore-map/index`
  - `pages/story-archive/index`
  - `pages/relic-archive/index`
- Terminology scan: `PASS`
  - No forbidden legacy terms were found in `apps/miniapp`
- Syntax check: `PASS`
  - `node --check apps/miniapp/pages/index/index.js`

## Notes

- The reduction was achieved without changing the MiniApp route set.
- No functionality was removed; only the hero image asset was replaced with a smaller encoded version.

`MINIAPP_PACKAGE_SIZE_REDUCTION_COMPLETE = YES`

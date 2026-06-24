#!/usr/bin/env node
/**
 * Miniapp media resource audit: large files, cross-root refs, base64 embeds.
 */
const fs = require('fs');
const path = require('path');

const MINIAPP_ROOT = path.resolve(__dirname, '../../apps/miniapp');
const MEDIA_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.mp3', '.wav', '.m4a', '.aac']);
const CODE_EXT = new Set(['.js', '.wxss', '.wxml']);
const THRESHOLD_KB = 200;

function walk(dir, onFile) {
  if (!fs.existsSync(dir)) return;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, onFile);
    else onFile(p);
  }
}

function scanLargeMedia() {
  const all = [];
  walk(MINIAPP_ROOT, (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    if (!MEDIA_EXT.has(ext)) return;
    const stat = fs.statSync(filePath);
    const kb = Math.round((stat.size / 1024) * 100) / 100;
    all.push({ path: filePath, kb, ext: ext.slice(1) });
  });
  return all.filter((x) => x.kb > THRESHOLD_KB).sort((a, b) => b.kb - a.kb);
}

function resolveRelative(fromFile, relPath) {
  const dir = path.dirname(fromFile);
  return path.normalize(path.resolve(dir, relPath));
}

function isOutsideMiniapp(resolved) {
  const rel = path.relative(MINIAPP_ROOT, resolved);
  return rel.startsWith('..') || path.isAbsolute(rel) === false && rel.includes('..');
}

function isMediaPath(p) {
  const lower = p.toLowerCase();
  return /\.(png|jpe?g|webp|gif|bmp|mp3|wav|m4a|aac)(\?|$|['")\s])/i.test(lower) ||
    /\/assets\//i.test(lower) ||
    /\.(png|jpe?g|webp|gif|bmp|mp3|wav|m4a|aac)$/i.test(lower);
}

function scanCrossRootRefs() {
  const violations = [];
  const mediaExtRe = /\.(png|jpe?g|webp|gif|bmp|mp3|wav|m4a|aac)(\?|$)/i;

  walk(MINIAPP_ROOT, (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    if (!CODE_EXT.has(ext)) return;
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/);

    lines.forEach((line, idx) => {
      if (!line.includes('../')) return;

      const pathRe = /(['"`])((?:\.\.[\\/][^'"`\n]+)+)\1/g;
      let m;
      while ((m = pathRe.exec(line)) !== null) {
        const rel = m[2];
        if (rel.startsWith('http')) continue;
        const resolved = resolveRelative(filePath, rel.split('?')[0]);
        if (!isOutsideMiniapp(resolved)) continue;

        const isMedia = mediaExtRe.test(rel) || mediaExtRe.test(path.extname(rel));
        const isStaticRef = /require\s*\(|@import|src\s*=|url\s*\(|background-image/i.test(line);
        const isAssetLike = /assets|AR_ENGINE|images\/|audio\//i.test(rel);

        if (isMedia || isStaticRef || isAssetLike) {
          violations.push({
            file: filePath,
            line: idx + 1,
            code: line.trim(),
            rel,
            resolved
          });
        }
      }
    });
  });

  return violations;
}

function scanBase64() {
  const hits = [];
  walk(MINIAPP_ROOT, (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    if (!['.js', '.wxss', '.wxml', '.json'].includes(ext)) return;
    const content = fs.readFileSync(filePath, 'utf8');
    const re = /data:(image\/[^;]+|audio\/[^;]+);base64,([A-Za-z0-9+/=\s]+)/g;
    let m;
    while ((m = re.exec(content)) !== null) {
      const b64 = m[2].replace(/\s/g, '');
      const rawBytes = Math.floor((b64.length * 3) / 4);
      const kb = Math.round((rawBytes / 1024) * 100) / 100;
      const line = content.slice(0, m.index).split(/\r?\n/).length;
      hits.push({
        file: filePath,
        line,
        mime: m[1],
        kb,
        b64Len: b64.length
      });
    }
  });
  return hits.sort((a, b) => b.kb - a.kb);
}

function scanMissingManifestAssets() {
  const missing = [];
  walk(MINIAPP_ROOT, (filePath) => {
    if (!filePath.endsWith('.js') && !filePath.endsWith('.json')) return;
    const content = fs.readFileSync(filePath, 'utf8');
    const re = /\/assets\/[^'"\s]+\.(png|jpe?g|webp|gif|bmp|mp3|wav|m4a|aac)/gi;
    let m;
    while ((m = re.exec(content)) !== null) {
      const uri = m[0];
      const rel = uri.replace(/^\//, '');
      const disk = path.join(MINIAPP_ROOT, rel);
      if (!fs.existsSync(disk)) {
        const line = content.slice(0, m.index).split(/\r?\n/).length;
        missing.push({ file: filePath, line, uri, expected: disk });
      }
    }
  });
  return missing;
}

function scanAllMedia() {
  const all = [];
  walk(MINIAPP_ROOT, (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    if (!MEDIA_EXT.has(ext)) return;
    const kb = Math.round((fs.statSync(filePath).size / 1024) * 100) / 100;
    all.push({ path: filePath, kb, ext: ext.slice(1) });
  });
  return all.sort((a, b) => b.kb - a.kb);
}

function main() {
  const allMedia = scanAllMedia();
  const large = allMedia.filter((x) => x.kb > THRESHOLD_KB);
  const cross = scanCrossRootRefs();
  const base64 = scanBase64();
  const base64Over = base64.filter((x) => x.kb > THRESHOLD_KB);
  const missingManifest = scanMissingManifestAssets();

  const payload = {
    allMediaCount: allMedia.length,
    allMediaTop: allMedia.slice(0, 15),
    largeMedia: large,
    crossRootRefs: cross,
    base64All: base64,
    base64Over200: base64Over,
    missingManifestAssets: missingManifest,
    summary: {
      largeMediaCount: large.length,
      crossRootRefCount: cross.length,
      base64Total: base64.length,
      base64Over200Count: base64Over.length,
      missingManifestCount: missingManifest.length
    }
  };

  const outPath = path.join(__dirname, '_miniapp-media-audit.json');
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf8');
  console.log(JSON.stringify(payload.summary, null, 2));
  return payload;
}

if (require.main === module) main();
module.exports = { scanLargeMedia, scanCrossRootRefs, scanBase64, MINIAPP_ROOT };

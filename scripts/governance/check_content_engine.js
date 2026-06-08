const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const contentEngineRoot = path.join(repoRoot, 'CONTENT_ENGINE');
const docsRoot = path.join(repoRoot, 'docs');
const reportPath = path.join(docsRoot, 'CONTENT_ENGINE_GOVERNANCE_V2_REPORT.md');
const cursorReportPath = path.join(docsRoot, 'CONTENT_ENGINE_CURSOR_AUDIT_REPORT.json');

const governedFields = ['rarity', 'reward', 'wish_value', 'tier', 'level', 'grade', 'rank', 'presentation_tier'];

function walkYamlFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkYamlFiles(fullPath));
    } else if (/\.ya?ml$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function getLines(filePath) {
  return fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
}

function getFileText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function getTopLevelAssetKind(filePath, text) {
  if (/asset_type:\s*RELIC\b/i.test(text)) {
    return 'relic';
  }
  if (/asset_type:\s*DIGITAL_COLLECTIBLE\b/i.test(text)) {
    return 'digital_collectible';
  }
  if (/schema:\s*LOVEQIGU_ATOM/i.test(text) || filePath.includes(`${path.sep}ATOM_LIBRARY${path.sep}`)) {
    return 'atom';
  }
  if (/schema:\s*LOVEQIGU_AR_EVENT/i.test(text) || filePath.includes(`${path.sep}AR_EVENT_LIBRARY${path.sep}`)) {
    return 'ar_event';
  }
  return 'unknown';
}

function splitRecords(lines, keys) {
  const records = [];
  let current = null;
  const keyPattern = keys.join('|');

  lines.forEach((line, index) => {
    if (new RegExp(`^\\s*-\\s*(?:${keyPattern}):`).test(line)) {
      if (current) {
        records.push(current);
      }
      current = {
        startLine: index + 1,
        lines: [line],
      };
      return;
    }

    if (current) {
      current.lines.push(line);
    }
  });

  if (current) {
    records.push(current);
  }

  return records;
}

function hasActualField(lines, field) {
  return lines.some((line) => new RegExp(`^\\s*${field}:`).test(line));
}

function countActualFieldOccurrences(lines, field) {
  return lines.reduce((count, line) => (new RegExp(`^\\s*${field}:`).test(line) ? count + 1 : count), 0);
}

function loadCursorSummary() {
  if (!fs.existsSync(cursorReportPath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(cursorReportPath, 'utf8'));
  } catch {
    return null;
  }
}

function createResult() {
  return {
    status: 'PASS',
    scannedFiles: 0,
    counts: {
      atom: 0,
      token: 0,
      collectible: 0,
      arEvent: 0,
    },
    governedFields: Object.fromEntries(governedFields.map((field) => [field, 0])),
    violations: [],
    warnings: [],
    notes: [],
  };
}

function addViolation(result, file, line, rule, message) {
  result.status = 'FAIL';
  result.violations.push({
    file: path.relative(repoRoot, file).replace(/\\/g, '/'),
    line,
    rule,
    message,
  });
}

function addWarning(result, message) {
  if (result.status !== 'FAIL') {
    result.status = 'WARN';
  }
  result.warnings.push(message);
}

function scanAtoms(filePath, lines, result) {
  const records = splitRecords(lines, ['atom_id', 'id']);
  result.counts.atom += records.length;

  for (const record of records) {
    for (const field of ['reward', 'rarity']) {
      if (hasActualField(record.lines, field)) {
        addViolation(result, filePath, record.startLine, 'ATOM_FORBIDDEN_FIELD', `Atom must not use '${field}'.`);
      }
    }
  }
}

function scanRelics(filePath, lines, result) {
  const records = splitRecords(lines, ['relic_id', 'token_id']);
  result.counts.token += records.length;

  for (const record of records) {
    for (const field of ['rarity', 'reward']) {
      if (hasActualField(record.lines, field)) {
        addViolation(result, filePath, record.startLine, 'RELIC_FORBIDDEN_FIELD', `Relic token must not use '${field}'.`);
      }
    }
  }
}

function scanDigitalCollectibles(filePath, lines, result) {
  const records = splitRecords(lines, ['collectible_id', 'token_id']);
  result.counts.collectible += records.length;

  for (const record of records) {
    if (hasActualField(record.lines, 'presentation_tier')) {
      result.notes.push(`${path.relative(repoRoot, filePath).replace(/\\/g, '/')}:${record.startLine} presentation_tier present.`);
    }
  }
}

function scanArEvents(filePath, lines, result) {
  const records = splitRecords(lines, ['event_id']);
  result.counts.arEvent += records.length;

  const usesV2Shape = records.some((record) => hasActualField(record.lines, 'reward') || hasActualField(record.lines, 'next_event'));

  if (!usesV2Shape) {
    for (const record of records) {
      if (!hasActualField(record.lines, 'interaction')) {
        addViolation(result, filePath, record.startLine, 'AR_V1_MISSING_INTERACTION', 'Legacy AR Event must retain interaction.');
      }

      const hasLegacyContext =
        hasActualField(record.lines, 'code') &&
        hasActualField(record.lines, 'chapter_id') &&
        hasActualField(record.lines, 'node_id') &&
        hasActualField(record.lines, 'output_refs');

      if (!hasLegacyContext) {
        addViolation(result, filePath, record.startLine, 'AR_V1_CONTEXT_MISSING', 'Legacy AR Event must keep V1 context.');
      }
    }
    return;
  }

  records.forEach((record, index) => {
    const hasReward = hasActualField(record.lines, 'reward');
    const hasNextEvent = hasActualField(record.lines, 'next_event');

    if (!hasReward) {
      addViolation(result, filePath, record.startLine, 'AR_V2_MISSING_REWARD', 'V2 AR Event must define reward.');
    } else {
      if (!hasActualField(record.lines, 'wish_value')) {
        addViolation(result, filePath, record.startLine, 'AR_V2_MISSING_WISH_VALUE', 'V2 AR Event reward must carry wish_value.');
      }

      const hasTokenUnlock = hasActualField(record.lines, 'token_unlock');
      const hasCollectibleUnlock = hasActualField(record.lines, 'collectible_unlock');
      if (!hasTokenUnlock && !hasCollectibleUnlock) {
        addViolation(
          result,
          filePath,
          record.startLine,
          'AR_V2_MISSING_UNLOCK',
          'V2 AR Event reward must identify Relic or Digital Collectible unlocks.',
        );
      }
    }

    if (!hasNextEvent) {
      addViolation(result, filePath, record.startLine, 'AR_V2_MISSING_NEXT_EVENT', 'V2 AR Event must define next_event.');
      return;
    }

    const nextEventLine = record.lines.find((line) => /^\s*next_event:/.test(line)) || '';
    if (/next_event:\s*none\b/i.test(nextEventLine) && index !== records.length - 1) {
      addViolation(result, filePath, record.startLine, 'AR_V2_CHAIN_BROKEN', 'Only the last AR Event may end the chain.');
    }
  });
}

function scanFile(filePath, result) {
  const text = getFileText(filePath);
  const lines = text.split(/\r?\n/);
  const kind = getTopLevelAssetKind(filePath, text);

  result.scannedFiles += 1;

  for (const field of governedFields) {
    result.governedFields[field] += countActualFieldOccurrences(lines, field);
  }

  if (kind === 'atom') {
    scanAtoms(filePath, lines, result);
    return;
  }

  if (kind === 'relic') {
    scanRelics(filePath, lines, result);
    return;
  }

  if (kind === 'digital_collectible') {
    scanDigitalCollectibles(filePath, lines, result);
    return;
  }

  if (kind === 'ar_event') {
    scanArEvents(filePath, lines, result);
  }
}

function renderReport(result, cursorSummary) {
  const violationCount = result.violations.length;
  const warningCount = result.warnings.length;

  const violationsByRule = new Map();
  for (const item of result.violations) {
    violationsByRule.set(item.rule, (violationsByRule.get(item.rule) || 0) + 1);
  }

  const summaryRows = [
    ['YAML files scanned', String(result.scannedFiles)],
    ['Atom records', String(result.counts.atom)],
    ['Token / Relic records', String(result.counts.token)],
    ['Collectible / Digital Collectible records', String(result.counts.collectible)],
    ['AR Event records', String(result.counts.arEvent)],
    ['Violations', String(violationCount)],
    ['Warnings', String(warningCount)],
  ];

  const fieldRows = governedFields.map((field) => `| \`${field}\` | ${result.governedFields[field]} |`).join('\n');
  const ruleRows = Array.from(violationsByRule.entries())
    .map(([rule, count]) => `| ${rule} | ${count} |`)
    .join('\n');
  const violationRows = result.violations.length
    ? result.violations.map((item) => `- ${item.file}:${item.line} ${item.rule} - ${item.message}`).join('\n')
    : '- None.';
  const warningRows = result.warnings.length
    ? result.warnings.map((item) => `- ${item}`).join('\n')
    : '- None.';

  const cursorSection = cursorSummary
    ? `- Cursor audit status: ${cursorSummary.status}
- Cursor audit warnings: ${cursorSummary.warnCount}
- Cursor audit violations: ${cursorSummary.failCount}`
    : '- Cursor audit report unavailable.';

  return `# CONTENT_ENGINE Governance V2 Report

Generated: ${new Date().toISOString()}
Scope: \`CONTENT_ENGINE/**/*.yaml\`
Status: ${result.status}

## Summary

| Metric | Count |
|---|---:|
${summaryRows.map(([label, value]) => `| ${label} | ${value} |`).join('\n')}

## Cursor Compatibility

${cursorSection}

## Governed Field Scan

| Field | Occurrences |
|---|---:|
${fieldRows}

## Violation Rules

| Rule | Count |
|---|---:|
${ruleRows || '| None | 0 |'}

## WARN

${warningRows}

## Violations

${violationRows}

## Notes

- Governance V2 uses schema-aware checks instead of line-grep false positives.
- Legacy AR Event V1 records are accepted when they retain \`code\`, \`chapter_id\`, \`node_id\`, \`output_refs\`, and \`interaction\`.
- Digital Collectible records may carry \`presentation_tier\` as an allowed presentation field.
- Existing Content Engine YAML files were not modified.

CONTENT_ENGINE_GOVERNANCE_V2_COMPLETE = YES
`;
}

function run() {
  const result = createResult();
  const files = walkYamlFiles(contentEngineRoot);
  const cursorSummary = loadCursorSummary();

  for (const filePath of files) {
    scanFile(filePath, result);
  }

  if (cursorSummary && cursorSummary.status === 'WARN') {
    addWarning(result, `Cursor audit compatibility loaded with ${cursorSummary.warnCount} warnings.`);
  } else if (cursorSummary && cursorSummary.status === 'PASS') {
    result.notes.push('Cursor audit compatibility loaded with PASS status.');
  } else {
    addWarning(result, 'Cursor audit compatibility report not found or unreadable.');
  }

  if (result.violations.length === 0 && result.warnings.length === 0) {
    result.status = 'PASS';
  } else if (result.violations.length === 0) {
    result.status = 'WARN';
  } else {
    result.status = 'FAIL';
  }

  const report = renderReport(result, cursorSummary);
  fs.mkdirSync(docsRoot, { recursive: true });
  fs.writeFileSync(reportPath, report, 'utf8');

  console.log(result.status);
  console.log(`Files scanned: ${result.scannedFiles}`);
  console.log(`Violations: ${result.violations.length}`);
  console.log(`Warnings: ${result.warnings.length}`);
  console.log(`Report: ${reportPath}`);
  console.log('CONTENT_ENGINE_GOVERNANCE_V2_COMPLETE = YES');

  return result;
}

if (require.main === module) {
  const result = run();
  process.exit(result.status === 'PASS' ? 0 : 1);
}

module.exports = { run };

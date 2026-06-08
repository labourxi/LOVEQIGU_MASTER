const fs = require('fs');
const path = require('path');
const { ROOT } = require('./omx-utils');

const checks = [
  require('./check-json'),
  require('./check-routes'),
  require('./check-terminology'),
  require('./check-canon'),
  require('./check-content-engine-cursor'),
];

function statusText(result) {
  return result.passed ? 'Passed' : 'Failed';
}

function renderList(items, emptyText) {
  if (!items.length) {
    return `- ${emptyText}`;
  }
  return items.map((item) => `- ${item}`).join('\n');
}

function renderReport(results, startedAt, endedAt) {
  const passed = results.filter((result) => result.passed).length;
  const failed = results.length - passed;
  const warnings = results.reduce((count, result) => count + result.warnings.length, 0);
  const violations = results.reduce((count, result) => count + result.violations.length, 0);

  const sections = results.map((result) => `## ${result.name}

Status: ${statusText(result)}

Details:

${renderList(result.details, 'No additional details.')}

Warnings:

${renderList(result.warnings, 'None.')}

Violations:

${renderList(result.violations, 'None.')}
`).join('\n');

  return `# OMX_REPORT

Generated: ${endedAt.toISOString()}
Repository: \`${ROOT}\`

## Summary

Checks run: ${results.length}
Checks passed: ${passed}
Checks failed: ${failed}
Warnings: ${warnings}
Violations: ${violations}
Duration ms: ${endedAt.getTime() - startedAt.getTime()}

## Dry Run

Source files were read only. The only generated output is this report.

${sections}`;
}

function run() {
  const startedAt = new Date();
  const results = checks.map((check) => check.run());
  const endedAt = new Date();
  const report = renderReport(results, startedAt, endedAt);
  const reportPath = path.join(ROOT, 'docs', 'OMX_REPORT.md');

  fs.writeFileSync(reportPath, report, 'utf8');

  const passed = results.filter((result) => result.passed).length;
  const failed = results.length - passed;
  const warningCount = results.reduce((count, result) => count + result.warnings.length, 0);
  const violationCount = results.reduce((count, result) => count + result.violations.length, 0);

  console.log(`OMX checks run: ${results.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Warnings: ${warningCount}`);
  console.log(`Violations: ${violationCount}`);
  console.log(`Report: ${reportPath}`);

  return { results, reportPath };
}

if (require.main === module) {
  const { results } = run();
  process.exit(results.every((result) => result.passed) ? 0 : 1);
}

module.exports = { run };

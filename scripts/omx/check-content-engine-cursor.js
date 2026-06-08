const { createResult, detail, fail, warn } = require('./omx-utils');
const cursorAudit = require('../cursor/run_content_audit');

function run() {
  const result = createResult('check-content-engine-cursor');
  const audit = cursorAudit.run();

  detail(result, `Cursor audit status: ${audit.status}.`);
  detail(result, `Scanned ${audit.scannedFiles} Content Engine YAML files.`);
  detail(result, `FAIL issues: ${audit.failCount}.`);
  detail(result, `WARN issues: ${audit.warnCount}.`);

  if (audit.status === 'FAIL') {
    fail(result, 'Cursor Content Engine audit failed. Downstream workflow must stop.');
  }

  if (audit.status === 'WARN') {
    warn(result, 'Cursor Content Engine audit has warnings under report-only governance mode.');
  }

  return result;
}

module.exports = { run };

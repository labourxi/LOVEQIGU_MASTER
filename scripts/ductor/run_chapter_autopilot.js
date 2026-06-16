const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const REPORT = path.join(ROOT, 'docs/automation/LOVEQIGU_AUTOPILOT_V1_REPORT.md');

const result = spawnSync('python', [path.join(ROOT, 'scripts/autopilot/run_chapter_autopilot.py'), 'validate', '--mode', 'content', '--all'], {
  cwd: ROOT,
  encoding: 'utf8',
});

const stdout = result.stdout || '';
const stderr = result.stderr || '';
const exitCode = result.status ?? 1;

let reportBody = `# LOVEQIGU Autopilot V1 — Ductor Run

Generated: ${new Date().toISOString()}
Exit code: ${exitCode}

## Console

\`\`\`
${stdout.trim()}
${stderr.trim()}
\`\`\`
`;

if (fs.existsSync(REPORT)) {
  reportBody += `\n## Merged Report\n\nSee ${path.relative(ROOT, REPORT)}\n`;
}

fs.mkdirSync(path.dirname(REPORT), { recursive: true });
if (!fs.existsSync(REPORT)) {
  fs.writeFileSync(REPORT, reportBody, 'utf8');
}

console.log(stdout);
if (stderr) console.error(stderr);
process.exit(exitCode);

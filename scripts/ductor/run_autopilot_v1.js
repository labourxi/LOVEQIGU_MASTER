const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const PY_RUNNER = path.join(ROOT, 'scripts', 'autopilot', 'run_autopilot_v1.py');
const DUCTOR_REPORT = path.join(ROOT, 'docs', 'audit', 'AUTOPILOT_V1_OPERATIONALIZATION_DUCTOR_REPORT.md');

function parseArgs(argv) {
  const out = { chapter: 'CH04', mode: 'dry-run', sandbox: false, noWrite: false, report: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--chapter') out.chapter = argv[++i];
    else if (arg === '--mode') out.mode = argv[++i];
    else if (arg === '--sandbox') out.sandbox = true;
    else if (arg === '--no-write') out.noWrite = true;
    else if (arg === '--report') out.report = argv[++i];
  }
  return out;
}

function buildPythonArgs(opts) {
  const args = [PY_RUNNER, opts.mode, '--chapter', opts.chapter, '--mode', opts.mode];
  if (opts.sandbox) args.push('--sandbox');
  if (opts.noWrite) args.push('--no-write');
  if (opts.report) args.push('--report', opts.report);
  return args;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const reportPath = opts.report || path.join(ROOT, 'docs', 'AUTOPILOT_V1_OPERATIONALIZATION_REPORT.md');
  const result = spawnSync('python', buildPythonArgs(opts), {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, LOVEQIGU_AUTOPILOT_DUCTOR: '1' },
  });

  const stdout = result.stdout || '';
  const stderr = result.stderr || '';
  const exitCode = result.status ?? 1;

  const body = [
    '# LOVEQIGU Autopilot V1 Ductor Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Exit code: ${exitCode}`,
    '',
    '## Command',
    '',
    '```bash',
    ['python', ...buildPythonArgs(opts).slice(1)].join(' '),
    '```',
    '',
    '## Stdout',
    '',
    '```',
    stdout.trim(),
    '```',
    '',
    '## Stderr',
    '',
    '```',
    stderr.trim(),
    '```',
    '',
    `## Main Report`,
    '',
    `- ${path.relative(ROOT, reportPath)}`,
    '',
    `DUCTOR_EXIT_CODE = ${exitCode}`,
    '',
  ].join('\n');

  fs.mkdirSync(path.dirname(DUCTOR_REPORT), { recursive: true });
  fs.writeFileSync(DUCTOR_REPORT, body, 'utf8');

  process.stdout.write(stdout);
  process.stderr.write(stderr);
  process.exit(exitCode);
}

if (require.main === module) {
  main();
}

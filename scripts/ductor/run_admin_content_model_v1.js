const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const PY_RUNNER = path.join(ROOT, 'scripts', 'autopilot', 'run_admin_content_model_v1.py');
const DUCTOR_REPORT = path.join(ROOT, 'docs', 'audit', 'ADMIN_AUTOPILOT_V1_DUCTOR_REPORT.md');
const MAIN_REPORT = path.join(ROOT, 'docs', 'ADMIN_AUTOPILOT_V1_REPORT.md');

function parseArgs(argv) {
  const out = {
    command: 'dry-run',
    checkpoint: 'test_cp_001',
    chapter: 'CH04',
    sandbox: false,
    report: MAIN_REPORT,
    noWrite: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--mode' || arg === '--command') out.command = argv[++i];
    else if (arg === '--checkpoint') out.checkpoint = argv[++i];
    else if (arg === '--chapter') out.chapter = argv[++i];
    else if (arg === '--sandbox') out.sandbox = true;
    else if (arg === '--no-write') out.noWrite = true;
    else if (arg === '--report') out.report = argv[++i];
  }

  return out;
}

function buildPyArgs(opts) {
  const args = [PY_RUNNER, opts.command, '--checkpoint', opts.checkpoint, '--chapter', opts.chapter, '--report', opts.report];
  if (opts.sandbox) args.push('--sandbox');
  if (opts.noWrite) args.push('--no-write');
  return args;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const pyArgs = buildPyArgs(opts);
  const result = spawnSync('python', pyArgs, {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, LOVEQIGU_ADMIN_DUCTOR: '1' },
  });

  const stdout = result.stdout || '';
  const stderr = result.stderr || '';
  const exitCode = result.status ?? 1;

  const reportLines = [
    '# Admin Autopilot V1 Ductor Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Exit code: ${exitCode}`,
    '',
    '## Command',
    '',
    '```bash',
    ['python', ...pyArgs.slice(1)].join(' '),
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
    '## Main Report',
    '',
    `- ${path.relative(ROOT, opts.report)}`,
    '',
    `DUCTOR_EXIT_CODE = ${exitCode}`,
    '',
  ];

  fs.mkdirSync(path.dirname(DUCTOR_REPORT), { recursive: true });
  fs.writeFileSync(DUCTOR_REPORT, reportLines.join('\n'), 'utf8');

  process.stdout.write(stdout);
  process.stderr.write(stderr);
  process.exit(exitCode);
}

if (require.main === module) {
  main();
}

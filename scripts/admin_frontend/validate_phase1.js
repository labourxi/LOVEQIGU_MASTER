const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "..");
const files = [
  "apps/admin/shared/admin-frontphase1.js",
  "apps/admin/shared/admin-frontphase1.css",
  "apps/admin/shared/backoffice.css",
  "apps/admin/shared/backoffice-shell.js",
  "apps/admin/platform-admin/index.html",
  "apps/admin/merchant-portal/index.html",
  "apps/admin/park-admin/index.html",
  "docs/product/platform/ADMIN_FRONTEND_IMPLEMENTATION_V1.md",
  "docs/product/platform/ADMIN_FRONTEND_IMPLEMENTATION_V1_REPORT.md"
];

const checks = [
  { file: "apps/admin/shared/backoffice.css", needles: ["#c83a30", "badge-gold", "bo-portal-switcher"] },
  { file: "apps/admin/shared/backoffice-shell.js", needles: ["switches", "Platform Admin", "Merchant Admin", "Park Admin"] },
  { file: "apps/admin/platform-admin/index.html", needles: ["phase1-home", "role-switch", "state-switch", "Merchant Center", "Park Center"] },
  { file: "apps/admin/merchant-portal/index.html", needles: ["phase1-home", "role-switch", "state-switch", "Coupon Center", "Verification Center"] },
  { file: "apps/admin/park-admin/index.html", needles: ["phase1-home", "role-switch", "state-switch", "Merchant Overview", "Activity Overview"] }
];

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

const missing = files.filter((f) => !exists(f));
const failed = [];
for (const item of checks) {
  if (!exists(item.file)) {
    failed.push(item.file);
    continue;
  }
  const txt = read(item.file).toLowerCase();
  const hit = item.needles.every((needle) => txt.includes(needle.toLowerCase()));
  if (!hit) failed.push(item.file);
}

if (missing.length || failed.length) {
  console.log("ADMIN_FRONTEND_BUILD_FAILED");
  if (missing.length) console.log("missing:", missing.join(", "));
  if (failed.length) console.log("failed:", failed.join(", "));
  process.exitCode = 1;
} else {
  console.log("ADMIN_FRONTEND_BUILD_STARTED = YES");
  console.log("ADMIN_FRONTEND_PHASE1_PASS");
}

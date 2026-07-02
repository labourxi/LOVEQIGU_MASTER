#!/usr/bin/env python3
"""
AUTO COMMIT + VERSION GENERATOR — LOVEQIGU / AR游伴

使用方式:
  python scripts/auto_commit.py                         # 自动 commit（无参数）
  python scripts/auto_commit.py "自定义 commit 消息"     # 带自定义消息
  python scripts/auto_commit.py --dry-run               # 仅预览，不执行

功能:
  1. 检测 git diff 涉及的文件，自动归类到规范/脚本/运行时
  2. 自动计算次版本号（patch/minor/major）
  3. 更新 VERSION_DB.json 的版本记录
  4. 生成符合历史的 commit message
  5. 执行 git add + git commit
"""

import json, os, subprocess, sys, re, datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VERSION_DB = ROOT / "VERSION_DB.json"
SCRIPTS_DIR = ROOT / "scripts"


# ── 文件分类规则 ──
CATEGORIES = {
    "spec_frozen": {
        "label": "SPEC FREEZE",
        "emoji": "doc",
        "globs": [r"docs/freeze/"],
        "priority": 1,
    },
    "spec_governance": {
        "label": "GOVERNANCE",
        "emoji": "shield",
        "globs": [r"docs/governance/"],
        "priority": 2,
    },
    "script_core": {
        "label": "CORE ENGINE",
        "emoji": "engine",
        "globs": [
            r"scripts/ar_visual_ratio_engine\.py",
            r"scripts/audit_design_v2\.py",
            r"scripts/qa_scoring_engine\.py",
        ],
        "priority": 3,
    },
    "script_generation": {
        "label": "GENERATION",
        "emoji": "gen",
        "globs": [r"scripts/generate_.*\.py", r"scripts/deploy_.*\.py"],
        "priority": 4,
    },
    "runtime_miniapp": {
        "label": "MINIAPP RUNTIME",
        "emoji": "app",
        "globs": [r"apps/miniapp/"],
        "priority": 5,
    },
    "runtime_shared": {
        "label": "SHARED",
        "emoji": "shared",
        "globs": [r"apps/shared/"],
        "priority": 6,
    },
    "cursor_config": {
        "label": "CURSOR CONFIG",
        "emoji": "config",
        "globs": [r"\.cursor/"],
        "priority": 7,
    },
    "version_db": {
        "label": "VERSION DB",
        "emoji": "ver",
        "globs": [r"VERSION_DB\.json"],
        "priority": 0,
    },
    "other": {
        "label": "MISC",
        "emoji": "misc",
        "globs": [],
        "priority": 99,
    },
}


def run_git(*args):
    """Run git command, return stdout."""
    result = subprocess.run(
        ["git"] + list(args),
        capture_output=True, text=True, cwd=ROOT,
    )
    if result.returncode != 0:
        print(f"[WARN] git {' '.join(args)} failed: {result.stderr.strip()}")
        return ""
    return result.stdout.strip()


def get_changed_files():
    """Get all changed (staged + unstaged + untracked) files."""
    files = set()

    # Staged changes
    staged = run_git("diff", "--cached", "--name-only")
    for f in staged.splitlines():
        f = f.strip()
        if f:
            files.add(f)

    # Unstaged changes
    unstaged = run_git("diff", "--name-only")
    for f in unstaged.splitlines():
        f = f.strip()
        if f:
            files.add(f)

    # Untracked files
    untracked = run_git("ls-files", "--others", "--exclude-standard")
    for f in untracked.splitlines():
        f = f.strip()
        if f:
            files.add(f)

    return sorted(files)


def classify_file(filepath):
    """Classify a file into a category."""
    for cat_name, cat_info in CATEGORIES.items():
        for pattern in cat_info["globs"]:
            if re.search(pattern, filepath):
                return cat_name
    return "other"


def bump_version(current_version, bump_type="patch"):
    """
    Bump version string like V5.9.18.
    bump_type: 'patch' (default), 'minor', 'major'
    """
    match = re.match(r"V?(\d+)\.(\d+)\.(\d+)", current_version)
    if not match:
        return "V0.0.1"

    major, minor, patch = int(match.group(1)), int(match.group(2)), int(match.group(3))

    if bump_type == "major":
        major += 1
        minor = 0
        patch = 0
    elif bump_type == "minor":
        minor += 1
        patch = 0
    else:
        patch += 1

    return f"V{major}.{minor}.{patch}"


def determine_bump_type(categories_found):
    """
    Auto-detect bump type based on what changed.
    - spec freeze / governance → minor bump
    - core engine → minor bump
    - generation / runtime → patch bump
    - cursor config → patch bump
    - only untracked new files → patch bump
    """
    has_spec = any(c in ("spec_frozen", "spec_governance") for c in categories_found)
    has_script = any(c in ("script_core",) for c in categories_found)

    if has_spec:
        return "minor"
    if has_script:
        return "minor"
    return "patch"


def generate_commit_message(categories_found, changed_files, user_message=None):
    """Generate structured commit message."""
    today = datetime.date.today().strftime("%Y-%m-%d")

    # Build category tags
    tags = []
    for cat in sorted(set(categories_found), key=lambda c: CATEGORIES.get(c, {}).get("priority", 99)):
        info = CATEGORIES.get(cat, {"label": "MISC", "emoji": "misc"})
        tags.append(f"[{info['label']}]")

    tag_str = " ".join(tags)

    # Auto-message based on categories
    desc_lines = []
    if "spec_frozen" in categories_found:
        desc_lines.append("规范冻结更新")
    if "script_core" in categories_found:
        desc_lines.append("核心引擎更新")
    if "script_generation" in categories_found:
        desc_lines.append("生成管线更新")
    if "runtime_miniapp" in categories_found:
        desc_lines.append("小程序运行时更新")

    # File summary
    file_summaries = {}
    for f in changed_files:
        cat = classify_file(f)
        if cat not in file_summaries:
            file_summaries[cat] = []
        file_summaries[cat].append(f)

    # Build message
    lines = []
    if user_message:
        lines.append(f"{tag_str} {user_message}")
    else:
        desc = " + ".join(desc_lines) if desc_lines else "更新"
        lines.append(f"{tag_str} {desc}")

    lines.append("")
    lines.append(f"> Date: {today}")

    for cat, files in sorted(file_summaries.items(), key=lambda x: CATEGORIES.get(x[0], {}).get("priority", 99)):
        info = CATEGORIES.get(cat, {"label": "MISC", "emoji": "misc"})
        label = f"{info['label']}"
        for f in files:
            lines.append(f">   {label}: {f}")

    lines.append("")
    return "\n".join(lines)


def update_version_db(new_version, categories_found, changed_files):
    """Update VERSION_DB.json with new version entry."""
    if not VERSION_DB.exists():
        print("[WARN] VERSION_DB.json not found, skipping version DB update")
        return False

    try:
        db = json.loads(VERSION_DB.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, Exception):
        print("[WARN] VERSION_DB.json parse error, skipping update")
        return False

    # Build description from categories
    desc_parts = []
    if "spec_frozen" in categories_found:
        desc_parts.append("规范冻结")
    if "script_core" in categories_found:
        desc_parts.append("核心引擎")
    if "script_generation" in categories_found:
        desc_parts.append("生成管线")
    if "runtime_miniapp" in categories_found:
        desc_parts.append("运行时")
    desc = " + ".join(desc_parts) if desc_parts else "更新"

    # Update system version
    db["system"]["major"] = int(new_version.split(".")[0].replace("V", ""))
    db["system"]["minor"] = int(new_version.split(".")[1])
    db["system"]["patch"] = int(new_version.split(".")[2])
    db["system"]["human"] = f"{new_version} (stable)"
    db["system"]["updated"] = datetime.date.today().strftime("%Y-%m-%d")
    db["system"]["commit_prefix"] = new_version

    # Add history entry
    db["history"].insert(0, {
        "version": new_version,
        "date": datetime.date.today().strftime("%Y-%m-%d"),
        "description": desc,
    })

    VERSION_DB.write_text(json.dumps(db, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"[OK] VERSION_DB.json updated: {new_version}")
    return True


def hook_mode():
    """
    --hook 模式：在 pre-commit 阶段运行。
    检测 staged 文件，自动 bump 版本号，更新 VERSION_DB.json。
    """
    staged = run_git("diff", "--cached", "--name-only").splitlines()
    staged = [s.strip() for s in staged if s.strip()]
    if not staged:
        return 0

    # 检测是否已经包含了 VERSION_DB 更新
    if any("VERSION_DB.json" in s for s in staged):
        return 0  # 本次 commit 已经包含版本更新

    cats = [classify_file(f) for f in staged]
    unique = sorted(set(cats), key=lambda c: CATEGORIES.get(c, {}).get("priority", 99))

    current = "V0.0.1"
    if VERSION_DB.exists():
        try:
            db = json.loads(VERSION_DB.read_text(encoding="utf-8"))
            current = db["system"]["human"].split(" ")[0]
        except Exception:
            pass

    has_spec = any(c in ("spec_frozen", "spec_governance") for c in cats)
    bump = "minor" if has_spec else "patch"
    new_ver = bump_version(current, bump)

    if new_ver == current:
        return 0

    desc_parts = {"spec_frozen": "规范冻结", "script_core": "核心引擎",
                  "script_gen": "生成管线", "runtime_miniapp": "运行时"}
    desc = " + ".join(desc_parts.get(c, "") for c in unique if c in desc_parts) or "更新"

    try:
        db = json.loads(VERSION_DB.read_text(encoding="utf-8"))
        db["system"]["major"] = int(new_ver.split(".")[0].replace("V", ""))
        db["system"]["minor"] = int(new_ver.split(".")[1])
        db["system"]["patch"] = int(new_ver.split(".")[2])
        db["system"]["human"] = f"{new_ver} (stable)"
        db["system"]["updated"] = datetime.date.today().strftime("%Y-%m-%d")
        db["system"]["commit_prefix"] = new_ver
        db["history"].insert(0, {
            "version": new_ver,
            "date": datetime.date.today().strftime("%Y-%m-%d"),
            "description": desc,
        })
        VERSION_DB.write_text(json.dumps(db, indent=2, ensure_ascii=False), encoding="utf-8")
        run_git("add", "VERSION_DB.json")
        print(f"[AUTO VERSION] {current} -> {new_ver} ({bump})")
    except Exception as e:
        print(f"[AUTO VERSION] WARN: failed to update version: {e}")

    return 0


def main():
    # ── Hook mode ──
    if "--hook" in sys.argv:
        sys.exit(hook_mode())

    dry_run = "--dry-run" in sys.argv
    user_message = None
    for arg in sys.argv[1:]:
        if not arg.startswith("--"):
            user_message = arg
            break

    print("=" * 60)
    print("AUTO COMMIT + VERSION GENERATOR")
    print("=" * 60)

    # 1. Get changed files
    changed_files = get_changed_files()
    if not changed_files:
        print("[INFO] No changes detected. Nothing to commit.")
        return

    print(f"\nChanged files ({len(changed_files)}):")
    for f in changed_files:
        print(f"  {f}")

    # 2. Classify files
    categories_found = [classify_file(f) for f in changed_files]
    unique_cats = sorted(set(categories_found), key=lambda c: CATEGORIES.get(c, {}).get("priority", 99))

    print(f"\nCategories: {', '.join(CATEGORIES.get(c, {}).get('label', c) for c in unique_cats)}")

    # 3. Determine version bump
    current_version = "V0.0.0"
    if VERSION_DB.exists():
        try:
            db = json.loads(VERSION_DB.read_text(encoding="utf-8"))
            current_version = db["system"]["human"].split(" ")[0]
        except Exception:
            pass

    # Check latest git tag too
    git_latest = run_git("describe", "--tags", "--abbrev=0")
    if git_latest and not git_latest.startswith(current_version):
        # Use the higher one
        pass  # Keep VERSION_DB as source of truth

    bump_type = determine_bump_type(categories_found)
    new_version = bump_version(current_version, bump_type)

    print(f"\nVersion: {current_version} → {new_version} ({bump_type})")

    # 4. Generate commit message
    commit_msg = generate_commit_message(categories_found, changed_files, user_message)

    print(f"\nCommit message:\n{'-' * 40}")
    print(commit_msg)
    print(f"{'-' * 40}")

    if dry_run:
        print("\n[Dry-run] No changes made.")
        return

    # 5. Update VERSION_DB
    update_version_db(new_version, categories_found, changed_files)

    # 6. Git add + commit
    print("\n[GIT] Adding all changed files...")
    run_git("add", "-A")

    # Use a temp file for commit message (avoids encoding issues)
    msg_file = ROOT / ".git/COMMIT_EDITMSG_AUTO"
    msg_file.write_text(commit_msg, encoding="utf-8")

    print("[GIT] Committing...")
    result = subprocess.run(
        ["git", "commit", "-F", str(msg_file)],
        capture_output=True, text=True, cwd=ROOT,
    )

    if msg_file.exists():
        msg_file.unlink()

    if result.returncode == 0:
        print(f"\n[OK] Commit successful: {new_version}")
        if result.stdout:
            print(result.stdout.strip())
    else:
        print(f"\n[FAIL] Commit failed:")
        print(result.stderr.strip())


if __name__ == "__main__":
    main()

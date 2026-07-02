#!/usr/bin/env python3
"""
安装 Git pre-commit hook — 将 hooks 复制到 .git/hooks/ 目录

用法：
  python scripts/install_hooks.py

此操作将确保每次 git commit 时自动更新版本号。
"""
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HOOK_SRC = ROOT / ".git/hooks/pre-commit"

if HOOK_SRC.exists():
    HOOK_SRC.chmod(0o755)
    print(f"[OK] Pre-commit hook ready: {HOOK_SRC}")
    print("[HINT] Now every 'git commit' will auto-bump version.")
    print("[HINT] To skip: git commit --no-verify")
else:
    print("[FAIL] pre-commit hook file not found!")
    print(f"       Expected at: {HOOK_SRC}")

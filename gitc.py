#!/usr/bin/env python3
"""
gitc — Git Commit with Auto Version
====================================

替代 'git commit'，自动管理版本号。

用法:
  python gitc.py "commit message"    # 带消息 commit
  python gitc.py                      # 打开默认编辑器
  python gitc.py --dry-run            # 预览不执行
  python gitc.py --push               # commit + push

跳过 version bump:
  python gitc.py --no-bump "message"  # 只 commit，不升级版本号

相当于:
  git commit → auto_commit.py → version bump → VERSION_DB update → commit
"""

import sys
from scripts.auto_commit import main

if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env bash
# AUTO COMMIT HOOK — .cursor/hooks/auto-commit.sh
#
# Triggered by subagentStop. Reads JSON from stdin, checks if the
# subagent made file changes, and if so runs auto_commit.py.
#
# Fail open: if anything goes wrong, allow the subagent to finish.

input=$(cat)

# Only run when there are actual file changes
changed_files=$(git -C "$(dirname "$0")/../.." diff --name-only 2>/dev/null)
untracked=$(git -C "$(dirname "$0")/../.." ls-files --others --exclude-standard 2>/dev/null)

if [ -z "$changed_files" ] && [ -z "$untracked" ]; then
  echo '{ "permission": "allow" }'
  exit 0
fi

# Check we're not in the middle of a rebase or merge
if git -C "$(dirname "$0")/../.." rev-parse --verify MERGE_HEAD 2>/dev/null; then
  echo '{ "permission": "allow" }'
  exit 0
fi

if [ -f "$(dirname "$0")/../../.git/REBASE_HEAD" ]; then
  echo '{ "permission": "allow" }'
  exit 0
fi

# Run auto-commit in dry-run mode first to preview
python "$(dirname "$0")/../../scripts/auto_commit.py" --dry-run 2>&1 | head -20

# If the user specifically asked for commit, do it properly
# Otherwise just signal that changes exist
echo '{ 
  "permission": "allow",
  "agent_message": "[AUTO] 检测到文件变更。如需自动版本号 + commit，请运行: python scripts/auto_commit.py"
}'
exit 0

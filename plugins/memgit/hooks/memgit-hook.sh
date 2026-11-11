#!/bin/sh
# Runs one memgit hook for the Claude Code plugin. The plugin installs nothing
# on PATH: the MCP server arrives through `npx memgit-mcp`, which keeps memgit
# in ~/.memgit-npm-venv. This finds that copy (or one already on PATH) and stays
# silent when there is none yet, which is the case in the first seconds of the
# first session. A hook must never fail a session.
#
# Usage: memgit-hook.sh resume | prompt-recall | context-recall | action-gate | stop-guard

# Someone who also ran `memgit setup hooks` already has these hooks in their own
# settings; running them twice would inject every digest twice.
if grep -qs 'memgit.* hook \|memgit.* resume --plain' "$HOME/.claude/settings.json"; then
  exit 0
fi

MEMGIT="$(command -v memgit 2>/dev/null)"
[ -x "$MEMGIT" ] || MEMGIT="$HOME/.memgit-npm-venv/bin/memgit"
[ -x "$MEMGIT" ] || exit 0

case "$1" in
  resume) "$MEMGIT" resume --plain 2>/dev/null || true ;;
  prompt-recall|context-recall|action-gate|stop-guard) "$MEMGIT" hook "$1" 2>/dev/null || true ;;
esac
exit 0

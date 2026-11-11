// Runs one memgit hook for the Claude Code plugin.
// Usage: node memgit-hook.mjs resume | prompt-recall | context-recall | action-gate | stop-guard
//
// The plugin's MCP server installs memgit into ~/.memgit-npm-venv. This finds that copy, or
// one already on PATH, and stays silent when there is none yet (the first seconds of the first
// session). A hook must never fail a session, so every error ends in exit 0.

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { delimiter, join } from "node:path";

const WIN = process.platform === "win32";
const HOOKS = new Set(["prompt-recall", "context-recall", "action-gate", "stop-guard"]);
const name = process.argv[2];

function alreadyInSettings() {
  // Someone who ran memgit setup hooks has these hooks in their own settings already;
  // running them twice would inject every digest twice.
  try {
    const s = readFileSync(join(homedir(), ".claude", "settings.json"), "utf8");
    return /memgit.* hook |memgit.* resume --plain/.test(s);
  } catch {
    return false;
  }
}

function findMemgit() {
  const exe = WIN ? "memgit.exe" : "memgit";
  for (const dir of (process.env.PATH || "").split(delimiter)) {
    if (dir && existsSync(join(dir, exe))) return join(dir, exe);
  }
  const venv = join(homedir(), ".memgit-npm-venv", WIN ? "Scripts" : "bin", exe);
  return existsSync(venv) ? venv : null;
}

function main() {
  if (name !== "resume" && !HOOKS.has(name)) return;
  if (alreadyInSettings()) return;
  const memgit = findMemgit();
  if (!memgit) return;
  const args = name === "resume" ? ["resume", "--plain"] : ["hook", name];
  // stdin carries the hook's JSON event; memgit reads it and writes its answer to stdout.
  spawnSync(memgit, args, { stdio: ["inherit", "inherit", "ignore"], timeout: 30000 });
}

try {
  main();
} catch {}
process.exit(0);

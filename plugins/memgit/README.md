# memgit for Claude Code

memgit gives Claude Code one memory that carries across sessions, machines and AI tools. Each memory is a short fact, rule or lesson with a version history, so you can search it, see what changed and roll a bad edit back. Claude Code's own memory stays on the machine it was written on; memgit keeps the same memory on every machine you work from.

## Install

Inside Claude Code:

    /plugin marketplace add code4161/claude-plugins
    /plugin install memgit@memgit

The plugin needs Node.js and Python 3.11 or newer. On first start, server/bin/memgit-mcp.js (the memgit-mcp launcher, shipped inside the plugin) installs memgit at the plugin's version from PyPI into ~/.memgit-npm-venv and creates the memory store in ~/.memgit-store.

## What it does

The MCP server gives Claude tools to search, read and save memories. The plugin's hooks run hooks/memgit-hook.mjs, which calls the installed memgit command:

- At session start, the most relevant memories and the state of tracked work arrive as context.
- With each prompt, and after Claude reads or searches files, matching memories are added.
- When a session ends, Claude is reminded to save what it learned.

The hooks stay silent until memgit is installed, and skip themselves if you already set memgit hooks up in your own Claude Code settings.

## Sync between machines

Everything stays on your machine unless you turn sync on. Two commands connect a machine to memgit cloud, which syncs end-to-end encrypted:

    memgit cloud signup
    memgit cloud login

The first creates an account with a 14-day trial; the second connects each further machine. Details and pricing are at https://memgit.dev.

## Source and licence

Source code: https://github.com/code4161/memgit. Licence: MIT.

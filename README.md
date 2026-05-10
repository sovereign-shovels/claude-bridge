# claude-bridge

> Shared context bus. What you copy in Cursor is what Claude Desktop sees.

**Status:** v0.1 — ready to use.

**Sovereignty:** sovereign-by-construction. Local socket daemon. No cloud.

---

## Install

```bash
git clone https://github.com/sovereign-shovels/claude-bridge.git
cd claude-bridge
npm install
npm run build
```

## Usage

```bash
# Start the bridge
node dist/index.js
# Or with custom Ollama URL:
OLLAMA_URL=http://localhost:11434 node dist/index.js
```

The bridge listens on `http://localhost:3456` and:
- Accepts `/context` POSTs (clipboard, selection, file changes)
- Serves `/context` GET for recent context
- Proxies `/v1/messages` to Ollama with context injection

---

## License

Apache 2.0. See [LICENSE](./LICENSE).

## Part of sovereign-shovels

This repo is part of the [sovereign-shovels](https://github.com/sovereign-shovels) portfolio.

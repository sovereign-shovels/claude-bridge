---
repo: claude-bridge
rank: 12
score: 0.5
sprint: deferred (high build cost, validate via miner first)
substrate_anchor: Claude
build_estimate: "5–8 weeks for v0.1 — high build cost is the main risk"
status: planned
---

# PRD v1.0 — claude-bridge

> **One-liner:** Shared context bus. What you copy in Cursor is what Claude Desktop sees. What you select in your terminal is what your IDE knows.
>
> **Substrate:** Claude Desktop + Cursor + terminal users who want shared context
> **Launch channels:** r/ClaudeAI, r/cursor, AI Twitter, HN
> **Build estimate (v0.1):** 5–8 weeks for v0.1 — high build cost is the main risk

---

## What problem does this solve

Claude Desktop knows what you're saying. Cursor knows what you're editing. Your terminal knows what you just selected. None of them know about the others. claude-bridge is a local context bus: a daemon that broadcasts clipboard, active selection, and recent files over a local socket so subscribers can pull the right context.

## Why this is a shovel and not a product

Nobody owns this. The cross-OS implementation is genuinely hard, which is why nobody owns it. Validate via miner demand before committing engineering weeks.

---

## v0.1 — what ships

Local socket daemon. Clipboard watcher. Active-selection broadcaster. Recent-files publisher. Subscribers in IDE/terminal/Claude Desktop pull context on demand.

### Acceptance criteria for v0.1

A v0.1 release is publishable to GitHub when ALL of these are true:

- [ ] Core functionality described above works on the primary developer machine.
- [ ] At least one local-only configuration is documented and tested (no cloud required).
- [ ] BYO endpoint / BYO key configuration is documented.
- [ ] README explains: what it is, who it's for, how to install, how to configure, what it doesn't do.
- [ ] LICENSE present (Apache 2.0 unless overridden).
- [ ] No hardcoded keys or vendor URLs anywhere.
- [ ] No telemetry / phone-home.
- [ ] At least one passing test for the main code path.
- [ ] CI green.
- [ ] AGENTS.md compliance reviewed.

## v0.5 — first major evolution

Context filtering rules. Privacy zones (don't broadcast inside terminal X). Multi-machine sync via Tailscale.

## v1.0 — fuller scope

Pluggable subscribers. Browser extension. Mobile companion.

---

## Architecture sketch

### Stack

Local socket daemon in Rust. Per-OS clipboard/selection adapters. Subscribers as small client libs in TS/Python.

### Provider abstraction

The shovel MUST expose a provider abstraction even if v0.1 only uses one
provider. Suggested shape:

```
interface Provider {
  name: string;
  endpoint: URL;
  apiKeyEnvVar: string;
  call(input: ProviderInput): Promise<ProviderOutput>;
}
```

The default config in v0.1 must point to a free, local provider where
applicable, and document how to swap in any other.

### Configuration

Configuration order of precedence (highest to lowest):

1. Command-line flags
2. Environment variables (prefix: `CLAUDE_BRIDGE_*`)
3. User config file (`~/.config/claude-bridge/config.toml` on Linux/Mac, equivalent on Windows)
4. Default config (shipped, but never with secrets)

---

## Anti-scope (do NOT build)

Not a clipboard manager. Not a snippet store. Not a productivity suite. Context-bus only.

---

## Tombstone risk and mitigation

**Risk:** Low. Nobody owns this.

**Mitigation:** Ship fast (v0.1 in 5–8 weeks for v0.1 — high build cost is the main risk). Build community early
(launch on r/ClaudeAI, r/cursor, AI Twitter, HN). Even if upstream absorbs the feature, accumulated
stars and the community are the audience-build payoff.

**Kill signal:** Cross-OS robustness is genuinely hard. May get killed by complexity, not competition.

If the kill signal triggers, the maintainer must announce within one week and
either (a) refocus on a remaining gap, (b) merge gracefully into upstream if
they're receptive, or (c) mark the repo as archived with a clear pointer to the
replacement.

---

## Launch plan

### Pre-launch checklist

- [ ] Repo on GitHub at `github.com/sovereign-shovels/claude-bridge`
- [ ] README polished (see template in `_templates/`)
- [ ] At least 3 issues / discussions seeded (real ones, not placeholder)
- [ ] LICENSE, CODE_OF_CONDUCT, CONTRIBUTING present
- [ ] Demo asset (gif, screenshot, or short video — depending on category)
- [ ] First-launch post drafted for primary launch channel

### Day-1 launch

Post to: r/ClaudeAI, r/cursor, AI Twitter, HN

Subject template (adjust per channel):
- Show HN: `Show HN: claude-bridge – Shared context bus. What you copy in Cursor is what Claude Desktop sees. What you select in your terminal is what your IDE knows.`
- Reddit: `[OSS] Shared context bus. What you copy in Cursor is what Claude Desktop sees. What you select in your terminal is what your IDE knows.` with full post explaining the gap and the build
- Twitter/X: thread leading with the demo gif

### Week-1 follow-up

- Respond to every issue and comment within 24h.
- Ship at least one bugfix release based on launch feedback.
- Cross-post to secondary channels.

### Month-1 review

- Assess star velocity and community formation.
- If kill signal triggered, follow tombstone protocol above.
- If trajectory is healthy, plan v0.5.

---

## Cross-references

- Constitution: [[AGENTS]]
- Public README: [[README]]
- Progress frontmatter: [[progress]]
- Internal knowledge graph: [[knowledge-graph]]

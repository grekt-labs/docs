---
type: skill
name: code-variants
description: When and how to show code variants (tabs)
agent: docs-writer
---

# Code Variants

Use tabs/variants only when the user needs to choose between equivalent alternatives.

## When to Use Tabs

✅ **Package managers** (when showing installation):
```
::: code-group
```bash [npm]
npm install -g grekt
```
```bash [pnpm]
pnpm add -g grekt
```
```bash [bun]
bun add -g grekt
```
:::
```

✅ **Config formats** (when both are valid):
```
::: code-group
```yaml [YAML]
targets:
  - claude
```
```json [JSON]
{
  "targets": ["claude"]
}
```
:::
```

## When NOT to Use Tabs

❌ **Single canonical way** — If grekt only supports YAML config, don't show JSON.

❌ **Same command, different shells** — Don't show bash/zsh/fish variants unless there's actual difference.

❌ **Minor syntax differences** — Don't tab for `grekt add foo` vs `grekt add "foo"`.

## Rule of Thumb

Ask: "Does the user need to choose between these?"
- Yes → Use tabs
- No → Show one example

## VitePress Syntax

```markdown
::: code-group

```bash [npm]
npm install -g grekt
```

```bash [pnpm]
pnpm add -g grekt
```

:::
```

Keep variant names short: `npm`, `pnpm`, `YAML`, `JSON`.

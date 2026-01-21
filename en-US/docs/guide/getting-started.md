# Getting Started

grekt manages AI configurations (agents, skills, commands...) and syncs them to tools like Claude, Cursor...

## Installation

::: warning EARLY ACCESS
grekt is in early development.
:::

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

## Quick Start

### 1. Initialize

```bash
grekt init
```

Select your targets (Claude, Cursor, etc.). Creates:

```
project/
├── .grekt/artifacts/   # Downloaded artifacts
├── grekt.yaml          # Config
└── grekt.lock          # Lockfile
```

### 2. Add artifacts

```bash
# From registry
grekt add @grekt/code-review

# From GitHub
grekt add github:user/repo

# From GitLab
grekt add gitlab:group/repo
```

### 3. Sync

```bash
grekt sync --dry-run  # Preview
grekt sync            # Apply
```

### 4. List

```bash
grekt list
```

## Configuration

```yaml
# grekt.yaml
targets:
  - claude
  - cursor
autoSync: false
artifacts:
  code-review: "1.0.0"
```

```bash
grekt config list
grekt config set autoSync true
```

## Next Steps

- [Artifacts](/en-US/docs/guide/artifacts) — Structure and components
- [Targets](/en-US/docs/guide/targets) — Sync destinations
- [Authentication](/en-US/docs/guide/authentication) — Tokens for private repos

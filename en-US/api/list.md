---
description: "List installed artifacts or browse available artifacts in a remote registry."
---

# grekt list

List installed artifacts or browse a remote registry.

```bash
grekt list [scope]
grekt ls [scope]
```

## Arguments

| Argument | Description |
|----------|-------------|
| `[scope]` | Registry scope to browse remote artifacts (e.g., `@myorg`). Omit to list local artifacts. |

## Options

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

## Remote browsing

When a scope is provided, grekt resolves the registry configured for that scope in `.grekt/config.yaml` and fetches available artifacts from it.

Remote browsing is only supported for self-hosted registries (GitHub and GitLab). For the public registry, use [explore.grekt.com](https://explore.grekt.com).

## Examples

### List installed artifacts

```bash
grekt list
```

```
Installed artifacts:

  code-review@1.0.0  2.1 KB
    agent: agent.md
    skills: testing.md, debugging.md

  docs-helper@2.1.0  5.3 KB
    agent: agent.md
    skills: markdown.md

────────────────────────────────────────
  Total: 7.4 KB (~1,850 tokens)
```

### Browse a remote registry

```bash
grekt list @myorg
```

```
Artifacts in @myorg:

  @myorg/agent-tools    1.2.0  Multi-purpose agent toolkit
  @myorg/code-review    3.0.1  Automated code review agent
  @myorg/docs-writer    0.5.0  Documentation generator

  3 artifacts found
```

## Related

- [GitHub registry](/en-US/docs/guide/sources/github)
- [GitLab registry](/en-US/docs/guide/sources/gitlab)
- [Registries overview](/en-US/docs/guide/sources/overview)

# grekt workspace

Manage monorepo workspaces.

```bash
grekt workspace <command>
```

## Commands

| Command | Description |
|---------|-------------|
| `list` | List all artifacts in the workspace |

## grekt workspace list

List all artifacts discovered in the workspace.

```bash
grekt workspace list
```

### Output

```bash
$ grekt workspace list

ℹ Found 3 artifact(s) in workspace:

  @myorg/auth-rules v1.2.0
    backend/auth-rules

  @myorg/api-rules v2.0.0
    backend/api-rules

  @myorg/ui-rules v1.0.0
    frontend/ui-rules
```

## Configuration

Create `grekt-workspace.yaml` at your repository root:

```yaml
workspaces:
  - "backend/*"
  - "frontend/*"
```

Patterns use glob syntax:

| Pattern | Matches |
|---------|---------|
| `backend/*` | Direct children of `backend/` |
| `backend/**` | All descendants of `backend/` |
| `packages/*/artifacts` | Specific path pattern |

A directory is considered an artifact if it contains `grekt.yaml`.

## Related commands

- [grekt version --exec](/en-US/api/version) — Version with external tools
- [grekt publish --changed](/en-US/api/publish) — Publish changed artifacts
- [Monorepo guide](/en-US/docs/guide/managing/monorepo) — Full workflow

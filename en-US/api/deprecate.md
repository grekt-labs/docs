# grekt deprecate

Mark an artifact version as deprecated.

```bash
grekt deprecate <artifact@version>
```

::: info S3 Registry Only
This command only works with S3-compatible registries (Cloudflare R2, AWS S3, MinIO).
For GitHub/GitLab sources, use their native release management.
:::

## Options

| Option | Description |
|--------|-------------|
| `-m, --message <message>` | Deprecation message (default: "This version is deprecated") |
| `-r, --registry <name>` | Registry from credentials (default: "default") |

## Examples

```bash
# Deprecate with default message
grekt deprecate @author/agent@1.0.0

# Deprecate with custom message
grekt deprecate @author/agent@1.0.0 -m "Security vulnerability, use 2.x"

# Deprecate on specific registry
grekt deprecate @author/agent@1.0.0 -r company -m "Use v2 for new API"
```

## Behavior

When a version is deprecated:

1. Users see a warning when installing that version
2. The version remains available (not deleted)
3. `grekt versions` shows it with a deprecation indicator

```bash
$ grekt add @author/agent@1.0.0
⚠ This version is deprecated: Security vulnerability, use 2.x
✓ Installed @author/agent@1.0.0
```

## Use Cases

- Security vulnerabilities discovered in old versions
- Breaking changes in external APIs the agent depends on
- Recommending users upgrade to newer versions
- Marking versions with known bugs

## Related Commands

- [grekt undeprecate](/en-US/api/undeprecate) — Remove deprecation
- [grekt versions](/en-US/api/versions) — List versions with deprecation status
- [grekt info](/en-US/api/info) — Show artifact metadata

# grekt deprecate

Mark an artifact version as deprecated.

```bash
grekt deprecate <artifact@version>
```

## Options

| Option | Description |
|--------|-------------|
| `-m, --message <message>` | Deprecation message (default: "This version is deprecated") |
| `-r, --registry <name>` | Registry from credentials (default: "default") |
| `--s3` | Use S3-compatible storage (legacy mode) |

## Examples

```bash
# Deprecate with default message
grekt deprecate @author/agent@1.0.0

# Deprecate with custom message
grekt deprecate @author/agent@1.0.0 -m "Security vulnerability, use 2.x"

# Legacy: deprecate on S3 registry
grekt deprecate @author/agent@1.0.0 --s3 -r company
```

## Authentication

Requires authentication via `grekt login`:

```bash
$ grekt deprecate @author/agent@1.0.0
✗ Not logged in
ℹ Run 'grekt login' first
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

## S3 Legacy Mode

For backwards compatibility with S3-compatible storage, use `--s3`:

```bash
grekt deprecate @author/agent@1.0.0 --s3
```

Requires S3 credentials. See [grekt publish](/en-US/api/publish#s3-legacy-mode).

## Related Commands

- [grekt undeprecate](/en-US/api/undeprecate) — Remove deprecation
- [grekt versions](/en-US/api/versions) — List versions with deprecation status
- [grekt login](/en-US/api/login) — Log in to registry

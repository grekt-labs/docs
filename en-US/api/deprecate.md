# grekt deprecate

Mark an artifact version as deprecated.

```bash
grekt deprecate <artifact@version>
```

## Options

| Option | Description |
|--------|-------------|
| `-m, --message <message>` | Deprecation message (default: "This version is deprecated") |

## Examples

```bash
# Deprecate with default message
grekt deprecate @author/agent@1.0.0

# Deprecate with custom message
grekt deprecate @author/agent@1.0.0 -m "Security vulnerability, use 2.x"
```

## Authentication

Authentication depends on the registry:

- **Public registry:** `grekt login` (stores token in `~/.grekt/credentials.yaml`)
- **GitLab / GitHub:** `GITLAB_TOKEN`, `GITHUB_TOKEN`, or token in `.grekt/config.yaml`

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

## Use cases

- Security vulnerabilities in old versions
- Breaking changes in external dependencies
- Recommending users upgrade to newer versions
- Marking versions with known bugs

## Related commands

- [grekt undeprecate](/en-US/api/undeprecate) — Remove deprecation
- [grekt versions](/en-US/api/versions) — List versions with deprecation status

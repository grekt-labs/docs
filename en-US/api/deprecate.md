# grekt deprecate

Mark an artifact version as deprecated.

```bash
grekt deprecate <artifact@version> [message]
```

## Arguments

| Argument | Description |
|----------|-------------|
| `artifact@version` | Full artifact ID with version (e.g., `@scope/name@1.0.0`) |
| `message` | Optional deprecation message shown to users |

## Example

```bash
grekt deprecate @myorg/tool@1.0.0 "Security vulnerability, upgrade to 1.0.1"
```

## Use cases

- Security vulnerabilities in old versions
- Breaking changes in external dependencies
- Recommending users upgrade to newer versions
- Marking versions with known bugs

::: warning Registry only
This command only works with the official grekt registry. For artifacts hosted on GitHub or GitLab, use [grekt delete](/en-US/api/delete) to remove versions entirely — deprecation is not supported.
:::

## Related commands

- [grekt undeprecate](/en-US/api/undeprecate) — Remove deprecation
- [grekt versions](/en-US/api/versions) — List versions with deprecation status
- [grekt upgrade](/en-US/api/upgrade) — Upgrade to non-deprecated versions

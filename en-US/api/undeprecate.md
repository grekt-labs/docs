---
description: "Remove the deprecation status from a previously deprecated artifact version."
---

# grekt undeprecate

Remove deprecation from an artifact version.

```bash
grekt undeprecate <artifact@version>
```

## Arguments

| Argument | Description |
|----------|-------------|
| `artifact@version` | Full artifact ID with version (e.g., `@scope/name@1.0.0`) |

## Example

```bash
grekt undeprecate @myorg/tool@1.0.0
```

## Use cases

- Deprecation was added by mistake
- Issue was fixed in the same version (hotfix)
- Version is now considered safe again

::: warning Registry only
This command only works with the official grekt registry. For artifacts hosted on GitHub or GitLab, deprecation is not supported.
:::

## Related commands

- [grekt deprecate](/en-US/api/deprecate) - Mark a version as deprecated
- [grekt versions](/en-US/api/versions) - List versions with deprecation status

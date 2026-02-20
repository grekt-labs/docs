---
description: "List all published versions of an artifact available in the registry."
---

# grekt versions

List all available versions of an artifact.

```bash
grekt versions <artifact>
```

## Options

| Option | Description |
|--------|-------------|
| `-r, --registry <name>` | Registry from credentials (default: "default") |

## Examples

```bash
# List versions
grekt versions @author/agent

# From specific registry
grekt versions @author/agent -r company
```

## Output

Versions are sorted by semantic versioning (highest first), not by publish date:

```bash
$ grekt versions @author/code-reviewer

@author/code-reviewer
  latest: 10.0.0

  10.0.0 (latest)
  2.1.0
  2.0.0
  1.1.0 ⚠ deprecated: "Use 2.x for new API support"
  1.0.0 ⚠ deprecated: "Security fix in 1.1.0"
```

Note: `10.0.0` appears first because it's the highest version (10 > 2 > 1), even if `2.1.0` was published more recently.

## Installing specific versions

```bash
# Install latest
grekt add @author/agent

# Install specific version
grekt add @author/agent@1.0.0
```

## Related commands

- [grekt info](/en-US/api/info) - Show artifact summary
- [grekt outdated](/en-US/api/outdated) - Check for updates
- [grekt upgrade](/en-US/api/upgrade) - Upgrade outdated artifacts
- [grekt deprecate](/en-US/api/deprecate) - Mark a version as deprecated
- [grekt add](/en-US/api/add) - Install an artifact

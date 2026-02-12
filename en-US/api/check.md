# grekt check

Check artifact integrity and context size.

```bash
grekt check
```

## What it checks

1. **Integrity** - SHA256 checksums against lockfile
2. **Overlaps** - Files with same name across artifacts
3. **Context** - Total size and estimated tokens

## Output

```
Checking artifacts...

✓ @scope/my-artifact v1.0.0 - OK
⚠ @scope/testing v2.0.0 - DRIFT DETECTED
  • Modified: skills/analyze.md

Context summary:
  Total size: 12.4 KB (~3,100 tokens)

✓ All artifacts healthy
```

## Status

| Status | Meaning |
|--------|---------|
| OK | All checksums match |
| DRIFT DETECTED | Local modifications |
| MISSING FILES | Expected files not found |
| NOT IN LOCKFILE | Artifact not tracked |

## When to use

- After modifying files manually
- Before `grekt sync`
- To monitor context budget

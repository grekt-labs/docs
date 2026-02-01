# grekt pack

Create a tarball from an artifact without publishing.

```bash
grekt pack <path>
```

## Arguments

| Argument | Description |
|----------|-------------|
| `<path>` | Path to artifact directory |

## Examples

```bash
# Pack an artifact
grekt pack ./my-artifact

# Output
Packing @author/my-artifact@1.0.0...
  Components: 3
    - 1 agent
    - 2 skill(s)

✓ Created @author-my-artifact.tar.gz
  Path: .grekt/tmp/@author-my-artifact.tar.gz
```

## Behavior

1. Validates the manifest (`grekt.yaml`)
2. Validates version is valid semver
3. Scans for valid components
4. Auto-generates `components` section in manifest
5. Creates tarball in `.grekt/tmp/`

::: info Auto-generated components
The `components` field in the packaged `grekt.yaml` is **auto-generated**. Your original file is not modified — only the tarball contains the generated field.

This helps AI tools discover what's inside the artifact without scanning every file.
:::

The tarball can be:
- Inspected before publishing
- Moved manually to another location

## Output location

Tarballs are created in `.grekt/tmp/` inside the project root:

```
project/
├── .grekt/
│   └── tmp/
│       └── @author-my-artifact.tar.gz
├── grekt.yaml
└── ...
```

## Related commands

- [grekt publish](/en-US/api/publish) — Pack and publish to registry
- [grekt version](/en-US/api/version) — Auto-version artifacts

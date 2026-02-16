# Handling artifacts

How to add, update, and remove artifacts from your project.

## Adding

Install from the registry, GitHub, or GitLab:

```bash
grekt add @scope/my-artifact
grekt add github:user/repo
grekt add gitlab:group/repo
```

Use `--choose` to select specific components instead of installing everything:

```bash
grekt add @scope/my-artifact --choose
```

Use `--core` to copy the artifact directly into your AI tool's context (instead of lazy indexing), or `--core-sym` to create symlinks instead of copies:

```bash
grekt add @scope/my-artifact --core
grekt add @scope/my-artifact --core-sym
```

See [`grekt add`](/en-US/api/add) for all options and source formats.

## Upgrading

Check what's outdated and upgrade:

```bash
# See which artifacts have newer versions
grekt outdated

# Upgrade everything
grekt upgrade

# Upgrade a specific artifact
grekt upgrade @scope/my-artifact
```

Component selections from `--choose` are preserved across upgrades. If the new version adds or removes components, the selector re-opens with previous items pre-checked.

See [`grekt upgrade`](/en-US/api/upgrade) for details.

## Removing

```bash
grekt remove @scope/my-artifact
```

Run `grekt sync` after removing to update your AI tool's context.

See [`grekt remove`](/en-US/api/remove) for details.

## Checking integrity

Verify that installed artifacts match the lockfile:

```bash
grekt check
```

This detects local modifications, missing files, and conflicts.

## Listing

```bash
grekt list
```

Shows all installed artifacts with their versions and sync modes.

## Deprecation

Artifact authors can mark versions as deprecated to signal issues or recommend upgrades:

```bash
grekt deprecate @scope/my-artifact@1.0.0 "Use 2.0.0 instead"
grekt undeprecate @scope/my-artifact@1.0.0
```

Deprecated versions still install but show a warning. See [`grekt deprecate`](/en-US/api/deprecate).

# grekt outdated

Check for outdated artifacts in your project.

```bash
grekt outdated
```

::: info Public Registry Only
This command only checks artifacts from the public registry. GitHub and GitLab sources are skipped (check repository releases directly).
:::

## Output

```bash
$ grekt outdated

Outdated artifacts:

  Artifact              Current   Latest
  @scope/my-artifact    1.0.0     2.1.0
  @scope/utils          2.0.0     2.5.0

Run 'grekt add <artifact>' to update

2 artifact(s) up to date
```

When all artifacts are current:

```bash
$ grekt outdated

All artifacts are up to date
```

## How it works

1. Reads your `grekt.lock` file
2. Filters out `github:` and `gitlab:` sources
3. Checks the registry for the latest version of each artifact
4. Compares versions using semantic versioning

## Updating artifacts

Upgrade all outdated artifacts at once:

```bash
grekt upgrade
```

Or update a specific artifact:

```bash
grekt upgrade @scope/my-artifact
grekt add @scope/my-artifact
```

Both `upgrade` and `add` preserve component selections from `--choose`.

## Related commands

- [grekt upgrade](/en-US/api/upgrade) — Upgrade outdated artifacts
- [grekt add](/en-US/api/add) — Add or update an artifact
- [grekt versions](/en-US/api/versions) — List all versions
- [grekt list](/en-US/api/list) — List installed artifacts

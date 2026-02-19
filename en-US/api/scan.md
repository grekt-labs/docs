# grekt scan

Scan artifacts for security issues using AgentVerus. Runs entirely on your machine, no data leaves the system.

```bash
grekt scan [source] [--json]
```

## Arguments

| Argument | Description |
|----------|-------------|
| `source` | Optional. Artifact source to scan. Omit to scan all installed artifacts. |

Supported source formats:

- `@scope/name` or `@scope/name@1.0.0` - registry artifact
- `github:user/repo` - GitHub repository
- `gitlab:user/repo` - GitLab repository
- `./path/to/dir` - local directory

## Options

| Option | Description |
|--------|-------------|
| `--json` | Output results as JSON |

## Examples

Scan all installed artifacts:

```bash
grekt scan
```

Scan a registry artifact before installing:

```bash
grekt scan @scope/my-artifact
```

Scan a GitHub source:

```bash
grekt scan github:user/repo
```

Scan a local directory:

```bash
grekt scan ./my-artifact
```

JSON output:

```bash
grekt scan @scope/my-artifact --json
```

## Output

```
Scanning @scope/my-artifact...

  Score: 95 / 100
  Badge: certified

  Findings (1):

    i [info] ASST-007: Minor pattern detected
      Evidence: "example evidence text"
      → Review and verify this is intentional
```

## See also

- [Security scanning guide](/en-US/docs/guide/managing/security-scanning) for trust badges, risk labels, and scanner details

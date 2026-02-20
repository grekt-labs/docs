---
description: "Scan artifacts for security issues locally using AgentVerus, with no data leaving the machine."
---

# grekt scan

Scan artifacts for security issues using AgentVerus. Runs entirely on your machine, no data leaves the system.

```bash
grekt scan [source] [--json] [--fail-on <badge>]
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
| `--fail-on <badge>` | Exit with code 1 if any artifact badge meets or exceeds this threshold |

Valid `--fail-on` values: `certified`, `conditional`, `suspicious`, `rejected`.

Trusted artifacts (marked with `trusted: true` in grekt.yaml) are excluded from `--fail-on` evaluation when scanning all installed artifacts.

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

Fail CI if any artifact is suspicious or worse:

```bash
grekt scan --fail-on suspicious
```

Fail CI for anything not certified:

```bash
grekt scan --fail-on conditional
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

## CI usage

Use `--fail-on` to block merges when artifacts don't meet your security threshold:

```yaml
# GitHub Actions example
- name: Scan artifacts
  run: grekt scan --fail-on suspicious
```

If a known-risky artifact should not block the pipeline, mark it as trusted:

```bash
grekt trust @sketchy/tool
```

Trusted artifacts show `(trusted)` in the summary table and are excluded from `--fail-on` evaluation.

## See also

- [Security scanning guide](/en-US/docs/guide/managing/security-scanning) for trust badges, risk labels, and scanner details
- [grekt trust](/en-US/api/trust) - Mark an artifact as trusted
- [grekt untrust](/en-US/api/untrust) - Remove trusted status

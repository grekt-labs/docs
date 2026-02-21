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

- `@scope/name` or `@scope/name@1.0.0` — registry artifact
- `github:user/repo` — GitHub repository
- `gitlab:user/repo` — GitLab repository
- `./path/to/dir` — local directory

## Options

| Option | Description |
|--------|-------------|
| `--json` | Output results as JSON |
| `--fail-on <badge>` | Exit with code 1 if any artifact badge meets or exceeds this threshold |

Valid `--fail-on` values: `certified`, `conditional`, `suspicious`, `rejected`.

## Trust and `--fail-on`

Artifacts signed with a valid HMAC signature (via [`grekt trust`](/en-US/api/trust)) are excluded from `--fail-on` evaluation. This requires `GREKT_TRUST_KEY` to be set in the environment during scanning.

- **Without `GREKT_TRUST_KEY`**: All artifacts are evaluated against the threshold (safe default).
- **With `GREKT_TRUST_KEY`**: Only artifacts with a matching HMAC signature are treated as trusted.

For the full CI/CD setup, see [Security gating](/en-US/docs/guide/ci-cd/security-gating).

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

Fail if any artifact is suspicious or worse:

```bash
grekt scan --fail-on suspicious
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

- [Security gating in CI/CD](/en-US/docs/guide/ci-cd/security-gating) — Pipeline setup, thresholds, HMAC trust workflow
- [Security scanning guide](/en-US/docs/guide/managing/security-scanning) — Trust badges, risk labels, scanner details
- [grekt trust](/en-US/api/trust) — Sign an artifact as trusted
- [grekt untrust](/en-US/api/untrust) — Remove trusted status

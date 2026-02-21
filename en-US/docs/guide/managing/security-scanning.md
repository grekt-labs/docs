---
description: "How grekt automatically scans published artifacts for prompt injection, tool poisoning, and other AI security threats."
---

# Security scanning

Every published artifact is automatically scanned for security threats. Scanning is nonblocking: your publish completes immediately, scans run in the background.

## Scanners

| Scanner | Type | Runs on | Detects |
|---------|------|---------|---------|
| AgentVerus | Local, zero network | Registry, CLI (`grekt scan`) | Prompt injection, data exfiltration, credential harvesting (11 ASST categories) |
| Snyk scan | AI-powered API | Registry only | Tool poisoning, toxic flows, malicious patterns |

Both run in parallel on registry publishes. If one fails, the other still completes.

:::info
Snyk scan only runs on the public registry, where the risk of malicious content is higher. Self-hosted registries and local scans use AgentVerus exclusively.
:::

## Trust badges

AgentVerus assigns a badge based on the score and findings:

| Badge | Score | Meaning |
|-------|-------|---------|
| Certified | 90+ | No high severity findings |
| Conditional | 75-89 | Minor concerns, 2 or fewer high findings |
| Suspicious | 50-74 | Multiple findings detected |
| Rejected | <50 | Critical findings detected |

## Risk labels

Snyk provides risk scores from 0 to 1 for each artifact:

- `destructive` - likelihood of destructive operations
- `private_data` - likelihood of accessing sensitive data
- `untrusted_content` - likelihood of unsafe content processing
- `is_public_sink` - likelihood of sending data to public endpoints

## Local scanning with the CLI

You can scan artifacts locally using the `grekt scan` command. The scanner runs entirely on your machine, no data leaves your system.

### Scan all installed artifacts

```bash
grekt scan
```

### Scan a remote artifact before installing

```bash
grekt scan @author/name
grekt scan @author/name@1.0.0
grekt scan github:user/repo
grekt scan gitlab:user/repo
```

The artifact is downloaded to a temporary directory, scanned, and the temp directory is cleaned up automatically.

### Scan a local directory

```bash
grekt scan ./path/to/artifact
```

### JSON output

```bash
grekt scan @author/name --json
grekt scan --json
```

## CI/CD integration

Use `--fail-on` to enforce a security threshold in your pipeline, combined with HMAC signed trust to allow reviewed exceptions.

See [Security gating](/en-US/docs/guide/ci-cd/security-gating) for the full setup guide with pipeline examples, trust key configuration, and threshold recommendations.

## FAQ

**Is scanning blocking?** No. Artifacts are available immediately after publish.

**Can I rescan?** Republish the same version. Previous results are overwritten.

**What if a scanner fails?** Each runs independently. Failed scans show `status: "failed"` with an error message.

**What content is analyzed?** All text files in the artifact: `.md` files as prompts, code files (`.ts`, `.js`, `.py`, `.sh`, etc.) as tools, config files as resources. Binary files are skipped. Content is capped at 2MB per scan.

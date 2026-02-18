# Security Scanning

Every published artifact is automatically scanned for security threats. Scanning is **nonblocking** — your publish completes immediately, scans run in the background.

## Scanners

| Scanner | Type | Detects |
|---------|------|---------|
| **AgentVerus** | Local, zero network | Prompt injection, data exfiltration, credential harvesting (11 ASST categories) |
| **Snyk scan** | AI powered API | Tool poisoning, toxic flows, malicious patterns |

Both run in parallel. If one fails, the other still completes.

## Trust Badges

AgentVerus assigns a badge based on the score and findings:

| Badge | Score | Meaning |
|-------|-------|---------|
| Certified | 90+ | No high severity findings |
| Conditional | 75-89 | Minor concerns, 2 or fewer high findings |
| Suspicious | 50-74 | Multiple findings detected |
| Rejected | <50 | Critical findings detected |

## Risk Labels

Snyk provides risk scores from 0 to 1 for each artifact:

- `destructive` — likelihood of destructive operations
- `private_data` — likelihood of accessing sensitive data
- `untrusted_content` — likelihood of unsafe content processing
- `is_public_sink` — likelihood of sending data to public endpoints

## Viewing Results

Results are available via the registry API:

```
GET /security-scans?artifactId=@scope/name&version=1.0.0
```

Omit `version` to get results for the latest version. No authentication required.

## FAQ

**Is scanning blocking?** No. Artifacts are available immediately after publish.

**Can I rescan?** Republish the same version. Previous results are overwritten.

**What if a scanner fails?** Each runs independently. Failed scans show `status: "failed"` with an error message.

**What content is analyzed?** All text files in the artifact: `.md` files as prompts, code files (`.ts`, `.js`, `.py`, `.sh`, etc.) as tools, config files as resources. Binary files are skipped. Content is capped at 2MB per scan.

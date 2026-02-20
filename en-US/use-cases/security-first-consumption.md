---
description: "Scan and verify third party AI artifacts before installation. Use grekt's security scanning to detect prompt injection and data exfiltration risks."
---

# Security first artifact consumption

Scan and verify third party artifacts before they touch your codebase. Trust but verify.

## The problem

Third-party AI configurations are powerful but risky. An artifact that instructs your AI tool could:

- Contain **prompt injection** that overrides your safety rules
- Include instructions to **exfiltrate data** through crafted outputs
- Introduce **subtle behavioral changes** that are hard to notice
- Ship malicious updates in a **patch version** that bypasses review

You want to use community artifacts, but you need to know what you're installing.

## The solution

### 1. Scan before installing

Use `grekt scan` to analyze an artifact before adding it:

```bash
grekt scan @community/code-assistant
```

The scanner uses AgentVerus (local, zero network) to check for prompt injection, data exfiltration, and other risk patterns. Artifacts on the public registry also get Snyk AI powered analysis for tool poisoning and toxic flows.

### 2. Review scan results

Artifacts receive a trust badge based on their AgentVerus score:

- **Certified** (90+) - No high severity findings
- **Conditional** (75-89) - Minor concerns
- **Suspicious** (50-74) - Multiple findings
- **Rejected** (<50) - Critical findings

Snyk adds risk labels like `destructive`, `private_data`, `untrusted_content`, and `is_public_sink` to flag specific behaviors.

### 3. Use trust signals

Look for trust badges when browsing the registry:

```bash
grekt info @trusted-org/vetted-agent
```

Published artifacts carry their scan results, so you can evaluate risk before installing.

## Result

Your workflow becomes:

1. **Discover** an artifact you want to use
2. **Scan** it for risks before installing
3. **Review** any findings manually
4. **Install** with confidence

Security doesn't slow you down. It runs alongside your normal workflow.

## Related

- [Security scanning](/en-US/docs/guide/managing/security-scanning) - Full scanning guide
- [grekt scan](/en-US/api/scan) - Scan command reference
- [grekt info](/en-US/api/info) - Inspect artifact details

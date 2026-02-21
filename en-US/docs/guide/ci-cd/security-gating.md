---
description: "Enforce artifact security thresholds in CI/CD pipelines using grekt scan, HMAC signed trust, and fail-on gates."
---

# Security gating

Block risky artifacts from reaching production. Use `grekt scan --fail-on` to enforce security thresholds in your pipeline while allowing reviewed exceptions through cryptographic trust.

## The problem

Your team installs `@vendor/ai-helper` or `@internal/our-insecure-artifact`. It scores 62 (suspicious) because the scanner flags a pattern that looks like data exfiltration. But your team reviewed it, it's a known tradeoff, and the artifact is critical for your workflow.

Without trust, `grekt scan --fail-on suspicious` blocks every PR. You don't want to lower the threshold for everyone just because of one reviewed artifact.

## The solution

The repo owner signs reviewed artifacts with a secret key. CI verifies the signature and lets them through, while still blocking any new unsigned artifact that hits the threshold.

1. **Repo owner** generates a trust key once with `grekt trust --generate-key`
2. **Repo owner** stores the key as a CI secret (`GREKT_TRUST_KEY`) and in their local env
3. **Repo owner** reviews the artifact and signs it with `grekt trust @vendor/ai-helper`
4. **CI** runs `grekt scan --fail-on suspicious` with the same key
5. Signed artifact passes the gate. Any new unsigned risky artifact still blocks the pipeline.

## Setup

### Generate a trust key

```bash
grekt trust --generate-key
```

This prints a key in the format `grk_trust_<64 hex chars>`. This key is the shared secret between whoever signs artifacts and CI.

::: warning
Do not run `--generate-key` inside a CI pipeline. The key will appear in logs. Generate it locally and add it as a secret.
:::

### Add the key to your environment

Add `GREKT_TRUST_KEY` as a CI secret and set it locally for the person signing artifacts:

```bash
export GREKT_TRUST_KEY="grk_trust_..."
```

## Pipeline configuration

### GitHub Actions

```yaml
name: Artifact security gate

on: [pull_request]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2

      - name: Install grekt
        run: bun install -g grekt

      - name: Install artifacts
        run: grekt install

      - name: Security gate
        env:
          GREKT_TRUST_KEY: ${{ secrets.GREKT_TRUST_KEY }}
        run: grekt scan --fail-on suspicious
```

### GitLab CI

```yaml
artifact-security:
  stage: test
  script:
    - bun install -g grekt
    - grekt install
    - grekt scan --fail-on suspicious
  variables:
    GREKT_TRUST_KEY: $GREKT_TRUST_KEY
```

## Signing artifacts

When your team reviews an artifact and decides it's acceptable despite its scan findings:

```bash
grekt trust @sketchy/tool
```

This writes an HMAC SHA256 signature to `grekt.yaml`:

```yaml
artifacts:
  "@sketchy/tool":
    version: "1.0.0"
    mode: lazy
    trusted: "grk_sig_a1b2c3..."
```

Commit the updated `grekt.yaml`. CI will verify the signature and skip that artifact during `--fail-on` evaluation.

The signature covers only the artifact ID, not the version. Trust persists across version bumps.

### Revoking trust

```bash
grekt untrust @sketchy/tool
```

Removes the signature. The artifact will be evaluated again on the next scan.

## Choosing a threshold

`--fail-on` accepts a trust badge level. Any artifact at or above the threshold blocks the pipeline.

| Threshold | Blocks | Use case |
|-----------|--------|----------|
| `rejected` | Only rejected | Minimal, catch only critical issues |
| `suspicious` | Suspicious + rejected | Recommended, catches most real threats |
| `conditional` | Conditional + suspicious + rejected | Strict, only certified artifacts pass |
| `certified` | Everything | All artifacts must be certified |

```bash
# Recommended for most teams
grekt scan --fail-on suspicious

# Strict environments
grekt scan --fail-on conditional
```

## Security model

- **Without `GREKT_TRUST_KEY` in CI**: All trust is ignored. Every artifact is evaluated. This is the safe default for teams that haven't set up trust yet.
- **With `GREKT_TRUST_KEY` in CI**: Only artifacts with a valid HMAC signature matching the key are treated as trusted.
- **`trusted: true` in yaml**: Rejected. Only cryptographic signatures are accepted. Manually writing `true` does not bypass the gate.
- **Forged signatures**: Rejected via constant time HMAC comparison.
- **Signature from a different key**: Rejected. The signing key and CI key must match.
- **Copied signatures**: A signature for `@scope/a` does not work on `@scope/b`. Signatures are bound to the artifact ID.

## Workflow summary

1. Developer adds an artifact and opens a PR
2. CI runs `grekt install` then `grekt scan --fail-on`
3. For each artifact:
   - Badge below threshold → **pass**
   - Badge hits threshold + valid signature → **pass**
   - Badge hits threshold + no signature or invalid → **block PR**
4. Repo owner reviews the blocked artifact, signs it if OK, pushes
5. CI re-runs and the signed artifact passes

## Related

- [Security scanning](/en-US/docs/guide/managing/security-scanning) — How scanning works, trust badges, risk labels
- [grekt scan](/en-US/api/scan) — Command reference
- [grekt trust](/en-US/api/trust) — Command reference
- [grekt untrust](/en-US/api/untrust) — Command reference

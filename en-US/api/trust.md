---
description: "Cryptographically sign an artifact as trusted using HMAC, so it is excluded from --fail-on checks during security scanning."
---

# grekt trust

Sign an artifact as trusted using HMAC SHA256. Trusted artifacts are excluded from `--fail-on` evaluation in `grekt scan`.

```bash
grekt trust <artifact>
grekt trust --generate-key
```

## Arguments

| Argument | Description |
|----------|-------------|
| `artifact` | Artifact ID (e.g., `@scope/name`). Optional when using `--generate-key`. |

## Options

| Option | Description |
|--------|-------------|
| `--generate-key` | Generate a new `GREKT_TRUST_KEY` for HMAC signing |

## Environment variables

| Variable | Description |
|----------|-------------|
| `GREKT_TRUST_KEY` | Required for signing. Generate with `--generate-key`. |

## What it does

Signs the artifact ID with HMAC SHA256 using your `GREKT_TRUST_KEY` and writes the signature to `grekt.yaml`:

```yaml
# Before
artifacts:
  "@sketchy/tool": "1.0.0"

# After
artifacts:
  "@sketchy/tool":
    version: "1.0.0"
    mode: lazy
    trusted: "grk_sig_a1b2c3..."
```

The signature covers only the artifact ID (not the version), so trust persists across version bumps.

## Security model

- Only the holder of `GREKT_TRUST_KEY` can produce valid signatures
- `trusted: true` (plain boolean) is **rejected** — only HMAC signatures are accepted
- Without `GREKT_TRUST_KEY` set, all trust is ignored (safe default)
- Forged signatures fail HMAC verification using constant-time comparison

## Examples

Generate a new trust key:

```bash
grekt trust --generate-key
```

Sign an artifact:

```bash
export GREKT_TRUST_KEY="grk_trust_..."
grekt trust @sketchy/tool
```

::: warning
Trusting an artifact does not make it safe. It only tells grekt to skip it during `--fail-on` evaluation. Always review the scan findings before trusting.
:::

## Related

- [Security gating in CI/CD](/en-US/docs/guide/ci-cd/security-gating) — Full setup guide with pipeline examples
- [grekt untrust](/en-US/api/untrust) — Remove trusted status
- [grekt scan](/en-US/api/scan) — Scan artifacts with `--fail-on` threshold

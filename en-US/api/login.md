# grekt login

Log in to a grekt registry.

```bash
grekt login
```

## Options

| Option | Description |
|--------|-------------|
| `-r, --registry <url>` | Registry URL (default: "https://registry.grekt.com") |
| `--token <token>` | Use token directly (for CI/CD) |

## Examples

```bash
# Interactive login (opens browser)
grekt login

# Login to custom registry
grekt login -r https://registry.company.com

# CI/CD: use token directly
grekt login --token $GREKT_TOKEN
```

## Behavior

### Interactive Mode

1. Opens browser to registry's auth page
2. User authenticates in browser
3. Token is received and saved to `~/.grekt/credentials.yaml`

```bash
$ grekt login
ℹ Opening browser for authentication...

  If the browser doesn't open, visit:
  https://registry.grekt.com/auth/cli?redirect=...

✓ Logged in
```

### CI/CD Mode

With `--token`, saves the token directly without browser flow:

```bash
grekt login --token $GREKT_TOKEN
```

## Credential Storage

Tokens are stored in `~/.grekt/credentials.yaml`:

```yaml
default:
  url: https://registry.grekt.com
  token: grk_xxxxxxxxxxxx
```

## Environment Variable

`GREKT_TOKEN` takes priority over credentials file:

```bash
export GREKT_TOKEN=grk_xxxxxxxxxxxx
grekt publish ./artifact  # Uses env token
```

## Related Commands

- [grekt logout](/en-US/api/logout) — Log out from registry
- [grekt whoami](/en-US/api/whoami) — Show current user
- [grekt publish](/en-US/api/publish) — Publish artifacts (requires auth)

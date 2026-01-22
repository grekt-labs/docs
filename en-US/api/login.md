# grekt login

Log in to the grekt registry.

```bash
grekt login
```

## Options

| Option | Description |
|--------|-------------|
| `--email <email>` | Email for non-interactive login |
| `--password <password>` | Password for non-interactive login |

## Examples

```bash
# Interactive login (opens browser)
grekt login

# Non-interactive login (CI/CD)
grekt login --email user@example.com --password $PASSWORD
```

## Behavior

### Interactive Mode

1. Opens browser to authentication page
2. User authenticates (GitHub, email, etc.)
3. Session is saved to `~/.grekt/session.yaml`

```bash
$ grekt login
ℹ Opening browser for authentication...

  If the browser doesn't open, visit:
  https://...

✓ Logged in
```

### Non-Interactive Mode

For CI/CD environments without a browser:

```bash
grekt login --email user@example.com --password $PASSWORD
```

Both `--email` and `--password` are required together.

## Session Storage

Sessions are stored in `~/.grekt/session.yaml` (auto-refreshed).

## API Keys (CI/CD)

For CI/CD pipelines, API keys are recommended over email/password:

1. Create an API key via the web dashboard
2. Use the key as a Bearer token

API keys start with `grk_` prefix and can be scoped to specific namespaces.

## Related Commands

- [grekt logout](/en-US/api/logout) — Log out from registry
- [grekt whoami](/en-US/api/whoami) — Show current user
- [grekt publish](/en-US/api/publish) — Publish artifacts (requires auth)

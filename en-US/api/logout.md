# grekt logout

Log out from a grekt registry.

```bash
grekt logout
```

## Behavior

Removes the stored token from `~/.grekt/credentials.yaml`.

```bash
$ grekt logout
✓ Logged out
```

If not logged in:

```bash
$ grekt logout
ℹ Not logged in
```

## Environment Variable

If using `GREKT_TOKEN` environment variable, logout will not clear it:

```bash
$ export GREKT_TOKEN=grk_xxxxxxxxxxxx
$ grekt logout
ℹ Using GREKT_TOKEN environment variable
ℹ Unset the environment variable to log out
```

Unset manually:

```bash
unset GREKT_TOKEN
```

## Related Commands

- [grekt login](/en-US/api/login) — Log in to registry
- [grekt whoami](/en-US/api/whoami) — Show current user

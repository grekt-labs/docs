# grekt whoami

Show current authenticated user.

```bash
grekt whoami
```

## Behavior

Displays the email of the currently authenticated user:

```bash
$ grekt whoami
Logged in as user@email.com
Registry: https://...
```

If not logged in:

```bash
$ grekt whoami
Not logged in
Registry: https://...
```

## Exit Code

Always exits with code 0. This command is informational only.

## Related Commands

- [grekt login](/en-US/api/login) — Log in to registry
- [grekt logout](/en-US/api/logout) — Log out from registry

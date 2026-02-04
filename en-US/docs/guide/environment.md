# Environment Variables

Configure grekt behavior through environment variables.

## Authentication

| Variable | Description |
|----------|-------------|
| `GREKT_TOKEN` | Registry token. Overrides `credentials.yaml`. |
| `GITHUB_TOKEN` | Token for `github:` sources. |
| `GITLAB_TOKEN` | Token for `gitlab:` sources. |

Environment tokens take priority over file-based credentials. See [Authentication](/en-US/docs/guide/sources/authentication) for details.

## Behavior

| Variable | Value | Description |
|----------|-------|-------------|
| `GREKT_NO_UPDATE_CHECK` | `1` | Disable update notifications. |

### Update check

grekt checks for new versions once per day and shows a notice when updates are available:

```
  --------------------------------------------
  Update available: 2.3.0 → 2.4.0

  curl -fsSL https://grekt.com/install.sh | sh
  brew upgrade grekt
  --------------------------------------------
```

To disable this behavior:

```bash
# Single command
GREKT_NO_UPDATE_CHECK=1 grekt install

# Shell session
export GREKT_NO_UPDATE_CHECK=1

# Permanent (add to ~/.bashrc or ~/.zshrc)
export GREKT_NO_UPDATE_CHECK=1
```

The check runs in the background without blocking commands. Version data is cached in `~/.grekt/.update-check`.

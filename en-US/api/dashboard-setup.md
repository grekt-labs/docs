---
description: "Configure the connection to a grekt dashboard instance interactively."
---

# grekt dashboard setup

Configure the dashboard connection interactively.

```bash
grekt dashboard setup
```

## What it does

1. Asks if you want to use the grekt dashboard
2. If yes, asks if the dashboard is already running
3. If running, prompts for the dashboard URL and API token
4. Saves the configuration to `.grekt/config.yaml`

If the dashboard is not running yet, it shows the setup documentation link and continues.

## Configuration

The command writes to `.grekt/config.yaml`:

```yaml
dashboard:
  url: https://your-dashboard-instance.example.com
  token: gdk_your-token-here
```

## Examples

```bash
# Interactive setup
grekt dashboard setup
```

## Notes

- This is the same flow available during `grekt init`
- Requires `.grekt/config.yaml` to exist (run `grekt init` first)
- Tokens start with `gdk_` and are created from the dashboard admin panel

## See also

- [Dashboard overview](/en-US/docs/guide/dashboard/overview)
- [Dashboard setup guide](/en-US/docs/guide/dashboard/setup)
- [grekt dashboard sync](/en-US/api/dashboard-sync)

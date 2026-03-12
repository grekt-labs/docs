---
description: "Track artifacts, scan results, and eval reports across projects with the grekt dashboard."
---

# Dashboard <Badge type="warning" text="Beta" />

The grekt dashboard gives you visibility into your artifact ecosystem: what's installed on which projects, global and per-artifact scan results, eval reports, and available registries.

![grekt dashboard overview](/images/dashboard.gif)

The dashboard is self-hosted. Get it from [GitHub](https://github.com/grekt-labs/dashboard).

## How it works

Run `grekt dashboard sync` in any project containing artifacts.

This single command syncs installed artifacts, scan results, eval reports, and cleans up artifacts that were removed locally.

You can run it manually or as a CI/CD step to keep the dashboard always up to date.

## What gets synced

| Data | Source | When |
|------|--------|------|
| Project metadata | `grekt.yaml` | Every sync |
| Installed artifacts | `grekt.lock` | Every sync |
| Scan results | `.grekt/reports/scan.json` | When a scan report exists |
| Eval results | `.grekt/reports/eval.json` | When an eval report exists |
| Registries | `.grekt/config.yaml` | When registries are configured |

## See also

- [Setup](/en-US/docs/guide/dashboard/setup)
- [Syncing](/en-US/docs/guide/dashboard/syncing)
- [grekt dashboard sync](/en-US/api/dashboard-sync)

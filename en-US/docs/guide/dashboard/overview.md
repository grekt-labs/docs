---
description: "Track artifacts, scan results, and eval reports across projects with the grekt dashboard."
---

# Dashboard <Badge type="warning" text="Beta" />

The grekt dashboard gives you visibility into your artifact ecosystem: what's installed on which projects, global and per-artifact scan results, eval reports, and available registries.

<video autoplay loop muted playsinline controls style="width:100%;border-radius:8px;">
  <source src="/videos/dashboard.mp4" type="video/mp4" />
</video>

The dashboard is self-hosted.

<a href="https://github.com/grekt-labs/dashboard" target="_blank" style="display:inline-block;padding:8px 20px;background:var(--vp-c-brand-1);color:#fff;border-radius:8px;font-weight:600;font-size:0.9rem;text-decoration:none;">Get it on GitHub</a>

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

---
description: "How grekt dashboard sync works: what it uploads, how reports flow, and common questions."
---

# Syncing

## What happens when you sync

Running `grekt dashboard sync` performs these operations in order:

1. Upserts your project record and all installed artifacts with their elements
2. Syncs registry configurations (if any are configured)
3. Uploads pending scan results (if `.grekt/reports/scan.json` exists)
4. Uploads pending eval results (if `.grekt/reports/eval.json` exists)
5. Removes artifacts from the dashboard that no longer exist in your lockfile

## Workflow

Commands like `grekt scan` and `grekt eval` don't send data anywhere. They write their results to `.grekt/reports/` as local JSON files.

```bash
grekt add @acme/code-reviewer
grekt scan                        # writes .grekt/reports/scan.json
grekt eval                        # writes .grekt/reports/eval.json

grekt dashboard sync              # uploads everything, deletes report files
```

Each new scan or eval run overwrites the previous report file. When you sync, the latest report is uploaded and the file is deleted. If you don't sync, the reports stay on disk until the next run overwrites them.

The `.grekt/reports/` directory is inside `.grekt/`, which is already gitignored.

## FAQ

**What if I forget to sync?** Reports stay in `.grekt/reports/` until you run `grekt dashboard sync`. They're overwritten by the next scan or eval, so only the latest results are ever uploaded.

**What if the dashboard is unreachable?** The sync command shows a warning and exits. Your local reports remain intact for the next attempt.

**What happens without dashboard config?** All commands work normally. Scan and eval still write reports locally. `grekt dashboard sync` shows a warning that no dashboard is configured.

## See also

- [Dashboard overview](/en-US/docs/guide/dashboard/overview)
- [Setup](/en-US/docs/guide/dashboard/setup)
- [grekt dashboard sync](/en-US/api/dashboard-sync)

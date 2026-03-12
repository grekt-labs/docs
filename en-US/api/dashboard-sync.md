---
description: "Sync project data, scan results, eval reports, and registry configurations to the grekt dashboard."
---

# grekt dashboard sync <Badge type="warning" text="Beta" />

Sync local project data to the dashboard. This is the only command that communicates with the dashboard. No other command sends data automatically.

```bash
grekt dashboard sync [target]
```

## Arguments

| Argument | Description |
|----------|-------------|
| `target` | Optional. Omit for full sync, or `registries` for registries only. |

## Full sync (no arguments)

```bash
grekt dashboard sync
```

Performs all sync operations in order:

1. **Project + artifacts**. Upserts project record and all installed artifacts with their elements
2. **Registries**. Syncs registry configurations (if any are configured)
3. **Scan report**. Reads and uploads `.grekt/reports/scan.json` (if it exists), then deletes the file
4. **Eval report**. Reads and uploads `.grekt/reports/eval.json` (if it exists), then deletes the file
5. **Reconciliation**. Removes artifacts from the dashboard that are no longer in the lockfile, including their scan and eval results

## Registries only

```bash
grekt dashboard sync registries
```

Syncs only registry configurations from `.grekt/config.yaml` to the dashboard. Does not touch project or artifact data.

## Configuration

Requires dashboard settings in `.grekt/config.yaml`:

```yaml
dashboard:
  url: https://your-dashboard-instance.example.com
  token: gdk_your-token-here
```

If no dashboard is configured, the command exits with a warning.

## Output

```
  ✓ Project and 3 artifacts
  ✓ 2 registries
  ✓ Scan results (3 artifacts)
  ✓ Eval results
  ✓ Reconciled: removed 1 stale artifact

✓ Dashboard sync complete.
```

Lines only appear for operations that had data to process.

## Examples

Full sync after scanning and evaluating:

```bash
grekt scan
grekt eval
grekt dashboard sync
```

Sync registries to the dashboard:

```bash
grekt dashboard sync registries
```

Sync after removing an artifact (triggers reconciliation):

```bash
grekt remove @acme/old-artifact
grekt dashboard sync
```

## See also

- [Dashboard overview](/en-US/docs/guide/dashboard/overview)
- [grekt scan](/en-US/api/scan)
- [grekt eval](/en-US/api/eval)

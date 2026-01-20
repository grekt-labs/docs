# grekt check

Check artifact integrity, detect drift, and show context summary.

## Usage

```bash
grekt check
```

## Description

Verifies the health of installed artifacts by checking file integrity against the lockfile, detecting name overlaps, and showing context size information.

## What it checks

### 1. Artifact integrity

Compares SHA256 checksums of all files against `grekt.lock`:

- **OK** - All files match lockfile checksums
- **DRIFT DETECTED** - Files modified locally since installation
- **MISSING FILES** - Expected files not found on disk
- **NOT IN LOCKFILE** - Artifact not tracked in lockfile

### 2. Name overlaps

Detects when multiple artifacts have files with the same name (e.g., two artifacts with `skills/testing.md`).

Since grekt uses namespacing, overlaps don't cause collisions. The check reports them for transparency.

### 3. Context summary

Shows total size of all artifacts and estimated token count for AI context.

## Example output

```
Checking artifacts...

✓ @grekt/code-reviewer v1.0.0 - OK
⚠ @grekt/testing-helper v2.0.0 - DRIFT DETECTED
  • Modified: skills/analyze.md
✗ @broken/artifact - MISSING FILES
  • Directory not found

Checking for name overlaps...

ℹ 1 filename overlap(s) found (resolved by namespacing)
  • skills/testing.md: 2 artifacts

Context summary:

  Total size: 12.4 KB (~3,100 tokens)

⚠ Total context exceeds 10 KB. Consider:
  • Removing unused artifacts
  • Using smaller/more focused artifacts

✓ All 3 artifacts are healthy
```

## When to use

- After modifying artifact files manually
- Before `grekt sync` to verify state
- When troubleshooting AI behavior
- To monitor context budget

## Related commands

- `grekt list` - Show installed artifacts with sizes
- `grekt sync` - Sync artifacts to AI tools
- `grekt remove` - Uninstall artifacts

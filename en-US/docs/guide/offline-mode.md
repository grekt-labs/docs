---
description: "Use grekt without a registry account by installing artifacts from local paths or GitHub/GitLab repositories."
---

# Offline mode

grekt works without a registry. You can add artifacts from local paths or GitHub/GitLab repositories and sync them to your AI tools directly.

## Workflow

```bash
grekt init
grekt add ./my-artifacts/code-review
grekt add github:org/repo
grekt sync
```

That's it. No account, no registry, no network dependency beyond the initial fetch.

## Available commands

| Command | Status |
|---------|--------|
| `init`  | Available |
| `add`   | Local paths, GitHub, GitLab |
| `sync`  | Available |
| `list`  | Available |
| `remove`| Available |
| `scan`  | Available |
| `install` | Only if original local paths still exist |
| `upgrade` | Not available |
| `outdated` | Not available |
| `publish` | Not available |

## Limitations

- No versioning or update detection for GitHub/GitLab sources
- No deterministic installs across machines. Local paths are machine dependent
- No lockfile resolution for local sources
- No raw HTTP/HTTPS URL support as source type
- `grekt install` requires the original local paths to still exist

## When to use it

Offline mode is a good fit for:

- Solo developers managing local artifacts
- Quick prototyping before setting up a registry
- Air-gapped environments

For team collaboration, versioning, and reproducible installs, use a [registry](/en-US/docs/guide/sources/overview).

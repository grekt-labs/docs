---
description: "Add AI tooling to your open source project without bloating the repo. grekt keeps artifacts external and versioned while contributors get everything with one command."
---

# Open source AI context

Give contributors the AI tools they need without bloating your project. Artifacts live externally, your repo stays clean.

## The problem

You want your open source project to ship with AI context: agents that understand the architecture, skills for common tasks, rules that enforce conventions. But embedding all of that directly in your repo means:

- **More files to maintain** in the project itself, agents, skills, rules scattered across repos or directories
- Every update to AI context is a **commit in your project**, even when the code didn't change
- Contributors who don't use AI tools still see and pull all that context
- Multiple artifacts from different sources means **more noise** in your tree

You want the tooling available, not living inside your repo.

## The solution

### 1. Declare your artifacts

Initialize grekt and add the artifacts your project needs:

```bash
grekt init
grekt add @your-org/contributor-guide --core
grekt add @your-org/architecture-rules --core
grekt add @your-org/testing-skills
```

All of this resolves to two files in your repo: `grekt.yaml` and `grekt.lock`. The actual artifact content lives in `.grekt/`, which is **automatically gitignored**.

### 2. Mix local and external artifacts

You can combine published artifacts with local ones specific to your project:

```bash
grekt add @community/vue-best-practices --core
grekt add ./my-project-rules --core
```

External artifacts update independently. Local artifacts live in your repo but are small and focused. Your project tree stays clean regardless of how many artifacts you use.

### 3. Update your contributing guide

Add grekt to your setup instructions:

```markdown
## Setup

1. Clone the repo
2. Install dependencies: `npm install`
3. Install AI context: `grekt install`
4. Start developing
```

### 4. No registry needed

You don't need a registry to distribute artifacts. Use a GitHub or GitLab repo as your source:

```bash
grekt add github:your-org/ai-artifacts
```

Contributors only need access to the repo. No registry account, no extra infrastructure. You can keep all your project's artifacts in a dedicated repo and reference them from any project.

## Result

Your project tree:

```
your-project/
├── grekt.yaml          # Committed - declares 5 artifacts
├── grekt.lock          # Committed - locked versions
├── .grekt/             # Gitignored - all artifact content lives here
├── src/
└── package.json
```

Five artifacts, zero bloat. Contributors run `grekt install` and get everything. When an artifact updates, you bump the version in `grekt.yaml`, not rewrite files across your project. Your repo stays focused on your code.

## Related

- [Offline mode](/en-US/docs/guide/offline-mode) - Using grekt without a registry
- [Artifacts](/en-US/docs/guide/artifacts) - How artifacts work
- [grekt install](/en-US/api/install) - Install command reference
- [Handling artifacts](/en-US/docs/guide/handling) - How artifacts are processed

---
description: "Publish and share your AI artifacts with grekt. Version, tag, and distribute agents, skills, and rules through the registry."
---

# Publishing and sharing artifacts

You built a great code review agent. Now share it with your team or the community.

## The problem

You've spent time crafting an agent that actually works well. It catches real issues, follows your team's conventions, and saves time on every PR. But:

- It lives in one project, locked to your local setup
- Sharing means copying files and hoping the recipient puts them in the right place
- There's no versioning, so when you improve it, everyone has to manually update
- Others can't discover it unless you tell them about it directly

Good AI context is hard to build. It shouldn't be hard to share.

## The solution

### 1. Create your artifact

Structure your artifact with a `grekt.yaml` manifest:

```yaml
name: "@your-scope/code-review-agent"
version: "1.0.0"
description: "Opinionated code review agent for TypeScript projects"
keywords:
  - code-review
  - typescript
  - agent
```

Components (agents, skills, rules) are detected automatically via `grk-type` frontmatter in your markdown files:

```
my-artifact/
├── grekt.yaml
├── agents/
│   └── code-review.md
├── rules/
│   └── typescript-conventions.md
└── skills/
    └── review-pr.md
```

### 2. Publish to the registry

```bash
grekt publish
```

Your artifact is now available for anyone to install:

```bash
grekt add @your-scope/code-review-agent
```

### 3. Release updates

When you improve the agent, bump the version and publish again:

```bash
grekt version patch    # 1.0.0 -> 1.0.1
grekt publish
```

Users will pick up the patch on their next `grekt upgrade`.

### 4. Help others discover it

Keywords in your manifest make the artifact searchable. **3-5 keywords are required** for publishing. A clear description and well-structured content help users evaluate it before installing.

Users can also browse the registry on [explore.grekt.com](https://explore.grekt.com) to find artifacts by category, scope, or keyword.

## Result

Your artifact in the registry:

```
@your-scope/code-review-agent@1.0.1
├── agents/code-review.md
├── rules/typescript-conventions.md
├── skills/review-pr.md
└── grekt.yaml
```

Anyone can install it, get the exact version they need, and stay up to date as you improve it.

## Related

- [Publishing](/en-US/docs/guide/managing/publishing) - Full publishing guide
- [Versioning](/en-US/docs/guide/managing/versioning) - Version management
- [grekt publish](/en-US/api/publish) - Publish command reference
- [grekt version](/en-US/api/version) - Version command reference

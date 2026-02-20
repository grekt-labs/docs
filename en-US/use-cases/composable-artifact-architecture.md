---
description: "Build layered AI artifacts for different audiences. Use --choose to let consumers and maintainers pick exactly what they need from the same artifact."
---

# Composable artifact architecture

One artifact, different audiences. Use `--choose` to let consumers and maintainers pick the components they need.

## The problem

You maintain a design system. Two groups interact with it:

- **Consumers** need to know how to **use** the components: props, slots, patterns, do's and don'ts
- **Maintainers** need to know how to **build** them: internal architecture, testing strategy, release process, accessibility implementation details

Putting everything in one artifact and forcing everyone to install all of it creates noise. Consumers don't need to know about the internal test harness. Maintainers don't need the "getting started" basics cluttering their context.

Splitting into two separate artifacts is fragile. When the API changes, you have to update both and hope they stay in sync.

This applies beyond design systems: API clients (usage vs SDK internals), infrastructure tooling (operators vs platform engineers), shared libraries (integration vs contribution).

## The solution

### 1. Structure your artifact with layers

Keep everything in a **single artifact**, organized by audience:

```
your-design-system/
├── grekt.yaml
│
├── shared/
│   └── rules/
│       └── naming-conventions.md   # Shared across all audiences
│
├── consumer/
│   ├── agents/
│   │   └── component-usage.md      # How to use components
│   └── rules/
│       └── best-practices.md       # Do's and don'ts
│
└── maintainer/
    ├── agents/
    │   └── component-dev.md        # How to build components
    ├── rules/
    │   └── architecture.md         # Internal patterns
    └── skills/
        └── create-component.md     # Scaffold a new component
```

### 2. Configure the artifact

One manifest, one version, one source of truth:

```yaml
name: "@your-org/ds"
version: "3.2.0"
description: "Design system AI context for consumers and maintainers"
keywords:
  - design-system
  - components
  - vue
```

### 3. Publish once

```bash
grekt publish
```

### 4. Install based on your role

Consumers install with `--choose` and pick only what they need:

```bash
grekt add @your-org/ds --choose
```

```
@your-org/ds@3.2.0

? Select components to install:
  ── Shared ────────────────────
  ◉ rule: Naming Conventions
  ── Consumer ──────────────────
  ◉ agent: Component Usage
  ◉ rule: Best Practices
  ── Maintainer ────────────────
  ◯ agent: Component Dev
  ◯ rule: Architecture
  ◯ skill: Create Component
```

Maintainers install everything:

```bash
grekt add @your-org/ds
```

Selections are **tracked in `grekt.yaml`** and preserved across upgrades. If a new version adds components, the selector re-opens with previous items pre-checked.

## Result

**Consumer** installs with `--choose`, gets `shared/` + `consumer/`:

- Naming conventions shared across all audiences
- How to use Button, Modal, Form components
- Accessibility patterns, prop conventions
- Nothing about internal test harness or release scripts

**Maintainer** installs everything, gets `shared/` + `maintainer/`:

- Naming conventions shared across all audiences
- Component architecture, how to create new components
- Testing strategy, release process

Same artifact, same version, different depth. One publish, zero duplication.

## Related

- [Artifacts](/en-US/docs/guide/artifacts) - How artifacts are structured
- [grekt add](/en-US/api/add) - Add command and `--choose` reference
- [Publishing](/en-US/docs/guide/managing/publishing) - Publishing workflow
- [Handling artifacts](/en-US/docs/guide/handling) - How grekt processes artifacts

# Skills with direct invocation in lazy mode

::: warning Claude only
This feature currently only works with **Claude Code**, which supports user-invocable skills via `SKILL.md` files. Other AI tools discover and use skills directly through the `.grekt/index`.
:::

Skills in **[LAZY mode](/en-US/docs/guide/sync-modes)** live in `.grekt/artifacts/`, outside your AI tool's directories. The `/grekt` slash command acts as a router that discovers and loads skills on demand, keeping your context window clean.

The skill is automatically created at `.claude/skills/grekt/SKILL.md`.

## Using skills with /grekt

There are two ways to invoke skills through the router:

### Direct mode

When you know the skill name:

```
/grekt skill testing
```

The router finds and loads the skill's `SKILL.md` file, then follows its instructions.

### Search mode

When you have a question or task and don't know the exact skill name:

```
/grekt how do I write better tests?
```

The router lists available skill names, picks the best match for your intent, and loads it. If multiple skills match, it asks you to choose.

## How it works

When running `grekt init` or `grekt add-target`, grekt automatically creates the `/grekt` skill if the selected target is Claude. The router is lightweight: it uses `find` to locate skills by folder name and only reads one skill file per invocation.

::: danger Token cost
The token cost per invocation is negligible (~500-800 tokens). However, if you only use 1-3 skills, prefer `--core` mode instead. The router is designed for projects with many skills installed, where keeping them all in context would be expensive.

**These are approximate values based on internal testing.**
:::

## For plugin authors

If another AI tool adds support for skills in the future, you can add the router to its plugin by implementing `setup()`:

```typescript
import { getSkillRouterTemplate } from "@grekt-labs/cli-engine";

createFolderPlugin({
  // ...
  setup: (projectRoot) => {
    const template = getSkillRouterTemplate(); // Format-agnostic body
    const content = addYourFrontmatter(template); // Wrap with tool-specific format
    writeToTargetPath(projectRoot, content);
  },
});
```

`getSkillRouterTemplate()` returns the markdown body only. Each plugin is responsible for adding the appropriate frontmatter and writing to the correct path for its target tool.

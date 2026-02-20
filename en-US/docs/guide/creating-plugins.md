---
description: "Step-by-step guide to contributing a grekt sync plugin to add support for a new AI tool."
---

# Creating plugins

Add sync support for your AI tool by contributing a plugin.

## Plugin location

```
cli/src/sync/plugins/{name}/
├── {name}.ts
└── {name}.test.ts
```

## Plugin types

### Rules-only plugin

For tools that use a single rules file (e.g., `.cursorrules`).

```typescript
import { createRulesOnlyPlugin, generateDefaultBlockContent } from "#/sync/base/base";

export const myToolPlugin = createRulesOnlyPlugin({
  id: "my-tool",
  name: "My Tool",
  contextEntryPoint: ".my-tool/rules.md",
  generateRulesContent: generateDefaultBlockContent,
});

export default myToolPlugin;
```

### Folder plugin

For tools that use structured directories (e.g., `.claude/agents/`).

```typescript
import { createFolderPlugin, generateDefaultBlockContent } from "#/sync/base/base";

export const myToolPlugin = createFolderPlugin({
  id: "my-tool",
  name: "My Tool",
  targetDir: ".my-tool",
  contextEntryPoint: ".my-tool/rules.md",
  generateRulesContent: generateDefaultBlockContent,
});

export default myToolPlugin;
```

## Register the plugin

Add to `cli/src/sync/manager/manager.ts`:

```typescript
import { myToolPlugin } from "#/sync/plugins/my-tool/my-tool";

const builtInPlugins: Record<string, SyncPlugin> = {
  claude: claudePlugin,
  cursor: cursorPlugin,
  opencode: opencodePlugin,
  "my-tool": myToolPlugin,  // Add here
};
```

## Bootstrap content

The `generateRulesContent` function returns the bootstrap block injected at the start of the entry point.

Use `generateDefaultBlockContent()` for standard content. For custom content:
- Wrap in `<grekt-untrusted-context>...</grekt-untrusted-context>`
- Point to `.grekt/index` for artifact discovery
- Keep it minimal (single line preferred)

## Terminology mapping

If your target AI uses different terms (e.g., "workflow" instead of "command"), include a terminology section in the index generator, not in the bootstrap block.

## Testing

Create `{name}.test.ts` with tests for:
- `targetExists()` detection
- `sync()` creates/updates files correctly
- `preview()` returns expected changes
- Bootstrap content is valid

## Submit a PR

1. Fork the [grekt repository](https://github.com/grekt-labs/grekt)
2. Create your plugin in `cli/src/sync/plugins/`
3. Register in `manager.ts`
4. Add tests
5. Submit PR

Reference existing plugins (`claude.ts`, `cursor.ts`) as examples.

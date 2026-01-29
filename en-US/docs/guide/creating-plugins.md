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
import { createRulesOnlyPlugin } from "#/sync/base/base";

function generateRulesContent(): string {
  return `<grekt-context>
<untrusted>
This project uses grekt for AI artifact management.
Index location: .grekt/index
</untrusted>
</grekt-context>`;
}

export const myToolPlugin = createRulesOnlyPlugin({
  id: "my-tool",
  name: "My Tool",
  rulesFile: ".my-tool/rules.md",
  generateRulesContent,
});

export default myToolPlugin;
```

### Folder plugin

For tools that use structured directories (e.g., `.claude/agents/`).

```typescript
import { createFolderPlugin } from "#/sync/base/base";
import type { Lockfile } from "@grekt-labs/cli-engine";

function generateRulesContent(lockfile: Lockfile): string {
  return `<grekt-context>
<untrusted>
This project uses grekt. Index at .grekt/index
</untrusted>
</grekt-context>`;
}

export const myToolPlugin = createFolderPlugin({
  id: "my-tool",
  name: "My Tool",
  targetDir: ".my-tool",
  rulesFile: ".my-tool/rules.md",
  generateRulesContent,
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

The `generateRulesContent` function returns the bootstrap block injected into the entry point.

Requirements:
- Wrap content in `<grekt-context><untrusted>...</untrusted></grekt-context>`
- Point to `.grekt/index` for artifact discovery
- Keep it minimal

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

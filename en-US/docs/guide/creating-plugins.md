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

### agentskills.io plugin

For tools that sync to `.agents/` via the [agentskills.io](https://agentskills.io) standard. These reuse the global plugin's sync logic and only override their identity:

```typescript
import type { SyncPlugin } from "#/sync/sync.types";
import { globalPlugin } from "#/sync/plugins/universal/universal";

export const myToolPlugin: SyncPlugin = {
  ...globalPlugin,
  id: "my-tool",
  name: "My Tool",
};

export default myToolPlugin;
```

This produces the same `.agents/` output as the global fallback, but registers as a distinct target so users can select it by name.

If your tool also supports MCP, export the config separately:

```typescript
export { myToolMcpConfig } from "./my-tool.mcp";
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

## MCP support

To add MCP distribution for your plugin, create a `{name}.mcp.ts` file that exports a `McpPluginConfig`:

```typescript
import { standardMcpTransform } from "#/sync/mcp/mcp.transforms";
import type { McpPluginConfig } from "#/sync/mcp/mcp.types";

export const myToolMcpConfig: McpPluginConfig = {
  configFile: ".my-tool/mcp.json",   // Where the tool reads MCP config
  serverKey: "mcpServers",           // Key for the servers object
  transform: standardMcpTransform,   // Or a custom transform function
};
```

Then register it in `cli/src/sync/mcp/mcp.config.ts`:

```typescript
import { myToolMcpConfig } from "#/sync/plugins/my-tool/my-tool.mcp";

const MCP_CONFIGS: Record<string, McpPluginConfig> = {
  // ...existing configs
  "my-tool": myToolMcpConfig,
};
```

The `standardMcpTransform` handles both stdio (`command`/`args`) and HTTP (`url`/`headers`) MCP formats. If your tool needs a different JSON structure, write a custom transform function instead.

## Submit a PR

1. Fork the [grekt repository](https://github.com/grekt-labs/grekt)
2. Create your plugin in `cli/src/sync/plugins/`
3. Register in `manager.ts`
4. Add tests
5. Submit PR

Reference existing plugins (`claude.ts`, `cursor.ts`) as examples.

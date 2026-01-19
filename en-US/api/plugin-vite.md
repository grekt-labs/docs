# Vite Plugin

The grekt Vite plugin enables both host and isolation applications to work with grekt.

## Installation

```bash
npm install @grekt/plugin-vite
```

## Import

```typescript
import { grektPlugin } from '@grekt/plugin-vite'
```

---

## Host Configuration

Configure your host application (the app that will load isolation units):

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { grektPlugin } from '@grekt/plugin-vite'

export default defineConfig({
  plugins: [
    grektPlugin({ role: 'host' })
  ]
})
```

### What it does

- Serves the grekt Service Worker at `/grekt.js`
- Enables runtime transformation of isolation units
- Integrates with Vite's dev server for HMR

### Host Options

```typescript
interface HostRuntimeConfig {
  role: 'host'
  mode?: 'runtime' // Only runtime mode is currently supported
}
```

---

## Isolation Configuration

Configure your isolation application (the app that will run inside grekt):

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { grektPlugin } from '@grekt/plugin-vite'

export default defineConfig({
  plugins: [
    grektPlugin({
      role: 'isolation',
      namespace: 'my-legacy-app'
    })
  ]
})
```

### What it does

- Configures build output for grekt compatibility
- Adds namespace metadata to the bundle
- Sets up proper asset paths for isolation context

### Isolation Options

```typescript
interface IsolationRuntimeConfig {
  role: 'isolation'
  namespace: string       // Must match the name in createIsolation()
  publicPath?: string     // Base path for assets (default: auto-detected)
  mode?: 'runtime'        // Only runtime mode is currently supported
}
```

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `role` | `'isolation'` | Yes | Marks this as an isolation bundle |
| `namespace` | `string` | Yes | Unique identifier, must match host config |
| `publicPath` | `string` | No | Base URL for assets |
| `mode` | `'runtime'` | No | Isolation mode (only runtime supported) |

---

## Plugin Modes

grekt supports two modes (runtime is currently implemented):

```typescript
import { PLUGIN_MODES } from '@grekt/core'

PLUGIN_MODES.RUNTIME  // 'runtime' - Service Worker transformation
PLUGIN_MODES.BUNDLE   // 'bundle'  - Build-time transformation (planned)
```

### Runtime Mode (Current)

- Uses Service Worker for on-the-fly code transformation
- No build changes needed for isolation bundles
- Dynamic, flexible

### Bundle Mode (Planned)

- Static, CSP-compliant transformation at build time
- Eliminates Service Worker overhead
- Better for production deployments

---

## Plugin Roles

```typescript
import { PLUGIN_ROLES } from '@grekt/core'

PLUGIN_ROLES.HOST       // 'host'      - The orchestrator app
PLUGIN_ROLES.ISOLATION  // 'isolation' - Apps running inside grekt
```

---

## Complete Example

### Host App (Vue 3 + Vite)

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { grektPlugin } from '@grekt/plugin-vite'

export default defineConfig({
  plugins: [
    vue(),
    grektPlugin({ role: 'host' })
  ]
})
```

### Isolation App (Vue 2 + Vite)

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import { grektPlugin } from '@grekt/plugin-vite'

export default defineConfig({
  plugins: [
    createVuePlugin(),
    grektPlugin({
      role: 'isolation',
      namespace: 'legacy-dashboard'
    })
  ],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'main.bundle.js'
      }
    }
  }
})
```

---

## Dev Server Integration

In development, the host plugin integrates with Vite's dev server:

- HMR updates are forwarded to isolation units
- Service Worker is served with proper CORS headers
- Console logs are prefixed with isolation namespace

### Accessing isolation dev server

```typescript
const unit = createIsolation({
  name: 'legacy-app',
  entryPoints: {
    js: { entry: 'http://localhost:4000/main.bundle.js' }
  },
  // ...
})
```

The host's Service Worker will intercept requests to `localhost:4000` and transform the code.

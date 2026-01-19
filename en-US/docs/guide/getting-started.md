# Getting Started

grekt (Controlled Logical Orchestration System) is a frontend execution orchestration runtime that enables multiple applications, stacks, or experiments to run side-by-side in the same browser context under active lifecycle supervision.

## Prerequisites

- Node.js 18+
- A bundler: Vite (recommended) or Webpack

## Installation

::: warning EARLY ACCESS
grekt is currently in early development. Packages are published under the `@grekt` scope.
:::

```bash
# Core package (required)
npm install @grekt/core

# Bundler plugin (choose one)
npm install @grekt/plugin-vite    # For Vite
npm install @grekt/plugin-webpack # For Webpack
```

## Quick Start

grekt requires two components to work:

1. A **Service Worker** that intercepts and transforms isolation unit requests
2. An **Isolation Unit** configuration that defines what to run and where

### 1. Configure your Host App

In your host application, add the grekt plugin:

```typescript
// vite.config.ts (Host App)
import { defineConfig } from 'vite'
import { grektPlugin } from '@grekt/plugin-vite'

export default defineConfig({
  plugins: [
    grektPlugin({ role: 'host' })
  ]
})
```

### 2. Register the Service Worker

At the entry point of your host application:

```typescript
// main.ts (Host App)
import { registerServiceWorker } from '@grekt/core'

// Register once, before mounting any isolation units
await registerServiceWorker()
```

### 3. Create an Isolation Unit

Define and mount an isolation unit:

```typescript
import { createIsolation } from '@grekt/core'

const legacyApp = createIsolation({
  name: 'legacy-dashboard',
  entryPoints: {
    js: { entry: 'http://localhost:4000/main.bundle.js' }
  },
  mountTarget: '#legacy-container',
  appRoot: 'app'  // The ID the bundle expects (e.g., <div id="app">)
})

// Mount
await legacyApp.mount()

// Unmount when done
legacyApp.unmount()
```

### 4. Configure your Isolation Bundle

In the project you want to isolate:

```typescript
// vite.config.ts (Isolation App)
import { defineConfig } from 'vite'
import { grektPlugin } from '@grekt/plugin-vite'

export default defineConfig({
  plugins: [
    grektPlugin({
      role: 'isolation',
      namespace: 'legacy-dashboard'  // Must match the name in createIsolation
    })
  ]
})
```

## What happens under the hood

When you mount an isolation unit:

1. **Fetches the bundle** through the Service Worker
2. **Transforms the code** to scope global access (window, document, etc.)
3. **Creates a Shadow DOM container** for DOM isolation
4. **Executes the bundle** in a proxied environment
5. **Tracks all side effects** (timers, listeners, observers)
6. **Supervises the lifecycle** for clean mount/unmount cycles

When you unmount:

1. **Activates starvation mode** — all isolated APIs become inert
2. **Executes immediate cleanup** — removes injected scripts
3. **Performs deep cleanup** — clears all tracked side effects
4. **Releases the namespace** — ready for fresh mount

## Next Steps

- [Core Concepts](/en-US/docs/guide/concepts) — How isolation works
- [API Reference](/en-US/api/) — Full API documentation

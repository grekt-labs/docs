# createIsolation

Creates and manages an isolation unit that executes an external bundle inside a supervised environment.

## Import

```typescript
import { createIsolation } from '@grekt/core'
```

## Signature

```typescript
function createIsolation(config: IsolationRuntimeConfig): IsolationUnit
```

## Basic Usage

```typescript
const unit = createIsolation({
  name: 'my-app',
  entryPoints: {
    js: { entry: '/bundles/app.js' }
  },
  mountTarget: '#container'
})

await unit.mount()
// ... later
unit.unmount()
```

---

## IsolationRuntimeConfig

Configuration object for creating an isolation unit.

```typescript
interface IsolationRuntimeConfig {
  name: string
  entryPoints: EntryPoints
  mountTarget: TargetElement
  appRoot?: string
  scopedAliases?: string[]
  shadowDOM?: ShadowDOMConfig
  hooks?: Partial<IntegrationHooks>
  devEvents?: IsolationDevEventsListener
  supervision?: SupervisionConfig
}
```

### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `name` | `string` | Yes | — | Unique identifier for the isolation unit |
| `entryPoints` | `EntryPoints` | Yes | — | JS and CSS bundles to load |
| `mountTarget` | `string \| Element` | Yes | — | Where to mount in the host app |
| `appRoot` | `string` | No | `'isolation-app'` | ID the bundle expects (without `#`) |
| `scopedAliases` | `string[]` | No | `[]` | Global variables to expose in scope |
| `shadowDOM` | `ShadowDOMConfig` | No | `undefined` | Shadow DOM configuration |
| `hooks` | `IntegrationHooks` | No | `{}` | Lifecycle callbacks |
| `devEvents` | `IsolationDevEventsListener` | No | — | Dev event listener (HMR) |
| `supervision` | `SupervisionConfig` | No | — | Lifecycle supervision config |

---

## EntryPoints

Defines the bundles to load in the isolation unit.

```typescript
interface EntryPoints {
  js: JSEntryPoints
  css?: CSSEntry[]
}

interface JSEntryPoints {
  entry: string | { url: string; preload?: boolean }
  chunks?: (string | { url: string; preload?: boolean; prefetch?: boolean })[]
}
```

### Example

```typescript
{
  entryPoints: {
    js: {
      entry: '/bundles/main.js',
      chunks: [
        '/bundles/vendor.js',
        { url: '/bundles/lazy.js', prefetch: true }
      ]
    },
    css: ['/styles/app.css']
  }
}
```

---

## IsolationUnit

The object returned by `createIsolation()`.

```typescript
interface IsolationUnit {
  readonly name: string
  readonly entryUrl: string
  readonly isMounted: boolean
  readonly status: IsolationUnitStatus
  readonly isPreserved: boolean
  readonly isFrozen: boolean

  mount(options?: MountOptions): Promise<void>
  unmount(): void
  destroy(): void
}
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Unit identifier |
| `entryUrl` | `string` | Main bundle URL |
| `isMounted` | `boolean` | Whether currently mounted |
| `status` | `IsolationUnitStatus` | Current lifecycle status |
| `isPreserved` | `boolean` | Unmounted but preserved for remount |
| `isFrozen` | `boolean` | Soft-cleaned after idle timeout |

### Status Values

```typescript
type IsolationUnitStatus =
  | 'idle'       // Created, never mounted
  | 'loading'    // Fetching/transforming assets
  | 'mounted'    // Active, running
  | 'preserved'  // Unmounted but preserved
  | 'frozen'     // Soft-cleaned after timeout
  | 'destroyed'  // Fully cleaned up
```

---

## mount()

Mounts the isolation unit in the configured container.

```typescript
await unit.mount(options?: MountOptions)
```

### MountOptions

```typescript
interface MountOptions {
  namespace?: string
  target?: string | Element
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `namespace` | `string` | `name` | Alternative namespace |
| `target` | `string \| Element` | `mountTarget` | Alternative mount container |

### What happens on mount

1. Initializes cleanup engine
2. Creates scoped runtime via Proxy
3. Loads entry bundle through Service Worker
4. Observes internal navigation
5. Resolves when bundle execution completes

---

## unmount()

Unmounts the isolation unit and cleans up side effects.

```typescript
unit.unmount()
```

### What happens on unmount

1. **Starvation Mode**: Sets `__GREKT_STARVED__ = true`, all isolated APIs become inert
2. **Immediate cleanup**: Removes injected scripts
3. **Deep cleanup**: Snapshot-diff removes listeners, timers, observers
4. **Namespace release**: Deletes `window.grekt[namespace]`

::: info Preservation
If supervision is enabled, the unit may be preserved for fast remount instead of fully destroyed.
:::

---

## destroy()

Force destroys the unit, bypassing preservation.

```typescript
unit.destroy()
```

Use when you want to ensure full cleanup regardless of supervision settings.

---

## ShadowDOMConfig

Configure Shadow DOM behavior.

```typescript
type ShadowDOMConfig = boolean | ShadowDOMOptions | undefined

interface ShadowDOMOptions {
  enabled?: boolean
  uiInjectionPoints?: string[]
}
```

### Example

```typescript
{
  shadowDOM: {
    enabled: true,
    uiInjectionPoints: ['modal-root', 'tooltip-root']
  }
}
```

---

## SupervisionConfig

Configure lifecycle supervision behavior.

```typescript
interface SupervisionConfig {
  enabled?: boolean
  limits?: SupervisionLimitsConfig
  behavior?: SupervisionBehaviorConfig
}

interface SupervisionLimitsConfig {
  maxUnits?: number           // Default: 3
  maxPreservedEntries?: number // Default: 2
}

interface SupervisionBehaviorConfig {
  strategy?: 'soft' | 'aggressive'
  preferInstantRemount?: boolean  // Default: true
  idleTimeout?: number            // Default: 3600000 (1 hour)
  idleStrategy?: 'freeze' | 'evict'
}
```

### Strategies

- **`soft`**: Preserve units longer, evict only when limits are reached
- **`aggressive`**: Proactively evict based on memory usage and tab visibility

---

## IntegrationHooks

Callbacks for integration with the host application.

```typescript
interface IntegrationHooks {
  onNavigation?: (url: string, type: 'push' | 'replace' | 'pop') => void
}
```

### Example

```typescript
{
  hooks: {
    onNavigation(url, type) {
      console.log(`Isolation navigated: ${type} ${url}`)
      // Sync with host router if needed
    }
  }
}
```

---

## Complete Example

```typescript
import { createIsolation, registerServiceWorker } from '@grekt/core'

// Register Service Worker first
await registerServiceWorker()

// Create isolation unit
const legacyDashboard = createIsolation({
  name: 'legacy-dashboard',
  entryPoints: {
    js: { entry: 'http://localhost:4000/main.bundle.js' },
    css: ['http://localhost:4000/styles.css']
  },
  mountTarget: '#legacy-container',
  appRoot: 'app',
  scopedAliases: ['jQuery', '$'],
  shadowDOM: true,
  hooks: {
    onNavigation(url, type) {
      console.log('Legacy navigated:', url, type)
    }
  },
  supervision: {
    enabled: true,
    behavior: {
      preferInstantRemount: true,
      idleTimeout: 1800000 // 30 minutes
    }
  }
})

// Mount
await legacyDashboard.mount()

// Check status
console.log(legacyDashboard.status) // 'mounted'

// Unmount (preserves for remount)
legacyDashboard.unmount()

// Remount instantly
await legacyDashboard.mount()

// Force destroy
legacyDashboard.destroy()
```

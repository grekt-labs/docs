# Service Worker API

The grekt Service Worker is a **global singleton** that serves all isolation units in your application. It intercepts fetch requests and transforms isolation unit code on-the-fly.

## Import

```typescript
import { registerServiceWorker, unregisterServiceWorker } from '@grekt/core'
```

---

## registerServiceWorker()

Registers the grekt Service Worker located at `/grekt.js`.

```typescript
function registerServiceWorker(): Promise<ServiceWorkerRegistrationResult>
```

### Returns

```typescript
interface ServiceWorkerRegistrationResult {
  registration: ServiceWorkerRegistration | null
  available: boolean
  reason: string | null
}
```

| Property | Type | Description |
|----------|------|-------------|
| `registration` | `ServiceWorkerRegistration \| null` | The SW registration object |
| `available` | `boolean` | Whether the SW is ready |
| `reason` | `string \| null` | Error message if registration failed |

### Behavior

- **Singleton Pattern**: Multiple calls return the same registration
- **Waits for control**: Resolves only when SW is controlling the page
- **Auto-reload**: May trigger a silent page reload on first registration

### Example

```typescript
import { registerServiceWorker } from '@grekt/core'

const result = await registerServiceWorker()

if (result.available) {
  console.log('grekt Service Worker ready')
  // Now you can create and mount isolation units
} else {
  console.error('SW registration failed:', result.reason)
  // Fallback: some features may not work
}
```

### Failure Reasons

| Reason | Description |
|--------|-------------|
| `'unsupported'` | Browser doesn't support Service Workers |
| `'csp-blocked'` | Content Security Policy blocks SW registration |
| Network error | SW file not found or network failure |

---

## unregisterServiceWorker()

Unregisters the grekt Service Worker.

```typescript
function unregisterServiceWorker(): Promise<void>
```

::: warning
Only call this when your **entire application** is shutting down. Unregistering removes the ability to mount new isolation units.
:::

### Example

```typescript
import { unregisterServiceWorker } from '@grekt/core'

// On app shutdown
await unregisterServiceWorker()
```

---

## How it works

The grekt Service Worker:

1. **Intercepts fetch requests** to isolation unit bundles
2. **Transforms code** to scope global access (window, document, etc.)
3. **Applies runtime wrappers** for cleanup tracking
4. **Caches transformed bundles** for performance

### Request flow

```
1. createIsolation() → mount()
2. Fetch bundle URL
3. Service Worker intercepts
4. Transform code (scope globals, wrap APIs)
5. Return transformed bundle
6. Execute in isolated environment
```

### Service Worker file

The `/grekt.js` file is provided by `@grekt/plugin-vite` or `@grekt/plugin-webpack` when configured with `role: 'host'`.

```typescript
// vite.config.ts
import { grektPlugin } from '@grekt/plugin-vite'

export default {
  plugins: [
    grektPlugin({ role: 'host' }) // Provides /grekt.js
  ]
}
```

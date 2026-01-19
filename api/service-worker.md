# Service Worker API

The ISLO Service Worker is a **global singleton** that serves ALL parcels in your application.

## registerServiceWorker()

Registers the ISLO service worker located at `/islo.js`.

```typescript
function registerServiceWorker(): Promise<ServiceWorkerRegistrationResult>
```

- **Returns**: A promise that resolves when the SW is **active and controlling** the page.
- **Behavior**: Implements a Singleton Pattern. If a registration is already active, it returns the existing one.

## unregisterServiceWorker()

Unregisters the ISLO service worker.

```typescript
function unregisterServiceWorker(): Promise<void>
```

- **⚠️ Warning**: Removes the ability to mount new isolation units.
- **Use case**: Only when your entire application is shutting down.

# Getting Started

ISLO (Isolation Layer Orchestrator) allows you to sandbox any legacy code or modern micro-frontend without iframes, pain, or complex configuration. It provides real isolation in the browser using Shadow DOM and Proxy Membranes.

## Installation

> [!WARNING]
> ISLO is currently in early development. The package is not yet published to npm.

The installation guide will be available once the library is released.

## Usage Overview

ISLO relies on two main components working together:

1. A **Service Worker** that acts as a singleton to serve all your isolated units.
2. The **Isolation Runtime** that creates the sandbox for your bundles.

### 1. Register the Service Worker

You must register the service worker once in your application. This is typically done at the entry point of your host application.

```typescript
import { registerServiceWorker } from '@islo/core';

await registerServiceWorker();
```

### 2. Create an Isolation Unit

Use `createIsolationRuntime` to define a "parcel" (a unit of isolated code). Point it to your bundle URL and give it a name.

```typescript
import { createIsolationRuntime } from '@islo/core';

// Define the unit
const myLegacyApp = createIsolationRuntime(
  'legacy-dashboard', 
  'http://localhost:4000/bundle.js',
  {
    mountTarget: '#container', // Where to mount in host
    appRoot: 'app',            // ID the bundle expects (e.g., <div id="app">)
  }
);

// Mount it
await myLegacyApp.mount({ strategy: 'scoped' });

// ... later ...
myLegacyApp.unmount();
```

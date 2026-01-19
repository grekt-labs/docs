# createIsolationRuntime

Creates and manages an isolation unit that executes an external bundle inside an isolated environment.  
Provides control over mounting, unmounting, cleanup of side effects, and navigation observation.

## Signature
```typescript
createIsolationRuntime(config: IsolationRuntimeConfig): IsolationUnit
```

---

# IsolationRuntimeConfig
```typescript
interface IsolationRuntimeConfig {
- name: string  
- entryPoints: EntryPoints  
- mountTarget: TargetElement  
- appRoot?: string  
- scopedAliases?: string[]  
- shadowDOM?: ShadowDOMConfig  
- hooks?: Partial<IntegrationHooks>  
}
```

## Properties

| Prop          | Type                  | Required | Default        | Description |
|---------------|------------------------|----------|----------------|-------------|
| name          | string                | ✔️       | —              | Unique identifier for the isolation unit. |
| entryPoints   | EntryPoints           | ✔️       | —              | Bundles JS and CSS loaded inside the isolated runtime. |
| mountTarget   | string o Element      | ✔️       | —              | Host element where the isolation unit will be mounted. |
| appRoot       | string                | No       | isolation-app  | ID that the bundle expects to find for mounting. Without "#". |
| scopedAliases | string[]              | No       | []             | Allow passthrough of global variables from host to the isolation unit. |
| shadowDOM     | ShadowDOMConfig       | No       | undefined      | Optional Shadow Root configuration. |
| hooks         | IntegrationHooks      | No       | {}             | Callbacks for integration with the host application. |

---

# EntryPoints
```typescript
interface EntryPoints {
- js: JSEntryPoints  
- css?: string[]  
}
```

## JSEntryPoints
```typescript
interface JSEntryPoints {
- entry: string  
- chunks?: string[]  
}
```

Description:
- entry: main bundle.  
- chunks: additional chunks (future).  

---

# IntegrationHooks
```typescript
interface IntegrationHooks {
- onNavigation?: (url: string, type: push | replace | pop) => void  
}
```
Allows reacting to internal navigation from the bundle (pushState, replaceState, POP/back-forward).

---

# MountOptions
```typescript
interface MountOptions {
- namespace?: string  
- target?: TargetElement  
}
```

| Prop      | Type             | Default      | Description |
|-----------|------------------|--------------|-------------|
| namespace | string           | name         | Alternative namespace for isolation. |
| target    | string o Element | mountTarget  | Mounts in a different container. |

---

# IsolationUnit (return type)
```typescript
interface IsolationUnit {
- name: string  
- entryUrl: string  
- isMounted: boolean  
- mount(options?: MountOptions): Promise<void>  
- unmount(): void  
}
```
---

## mount(options?)

Mounts the bundle in the defined container.  
Actions:

- Initializes the cleanup engine.  
- Creates the scoped runtime through Proxy.  
- Loads the entry bundle.  
- Observes internal navigation.  
- Returns a Promise when complete.

---

## unmount()

Fully removes the isolation unit:

- Activates Starvation Mode (__ISLO_STARVED__ = true): all isolated APIs become inert.
- Executes the immediate cleanup: removes injected scripts and performs the bundle’s teardown.
- Performs deep snapshot-diff cleanup: removes leftover listeners, timers, observers, and other side effects.
- Deletes the internal namespace (window.ISLO[namespace]). 

---

# Example
```typescript
const runtime = createIsolationRuntime({
  name: 'legacy-react',
  entryPoints: {
    js: { entry: '/legacy/react-app.js' }
  },
  mountTarget: '#legacy-container',
  appRoot: 'root',
  scopedAliases: ['fetch', 'localStorage'],
  hooks: {
    onNavigation(url, type) {
      console.log('Legacy navigated:', url, type)
    }
  }
})

await runtime.mount()

runtime.unmount()
```
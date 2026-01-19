# Core Concepts

ISLO takes a unique approach to frontend isolation, moving away from the heavy-handed nature of iframes and the fragility of simple CSS scoping.

## Traditional isolation problems

- **iframes**: They are slow, resource-heavy, and create a hard boundary that makes state sharing and UI composition difficult (scrolling issues, modal positioning, etc.).

- **CSS scoping**: Tools like CSS Modules or BEM help, but they don't protect the global scope (`window`, `local storage`, `globals`) from legacy code pollution.

## How we solve isolation

ISLO combines modern browser APIs to create a lightweight yet robust sandbox:

### Shadow DOM for isolation
ISLO mounts every isolation unit inside a Shadow Root.
- **CSS Encapsulation**: Styles defined inside the global scope of the bundle do not leak out to the host application.
- **DOM Encapsulation**: `document.getElementById` inside the bundle only sees elements within its shadow root, preventing it from accidentally modifying the host DOM.

### Proxy Membranes for JS Isolation
ISLO wraps the execution of the bundle in a membrane (using JS Proxies).
- **Global Scope Protection**: When the bundle writes to `window.foo`, it actually writes to a proxied virtual window state. The real global window remains untouched.
- **API Interception**: Calls to browser APIs like `setTimeout`, `addEventListener`, or `IntersectionObserver` are intercepted. ISLO tracks them and automatically cleans them up when the unit unmounts.

### Cleanup
One of the hardest parts of frontend orchestration is memory leaks. Frameworks often leave behind "zombie" event listeners or timers when components are destroyed externally.

ISLO implements a centralized **Cleanup Engine** that orchestrates the lifecycle of every isolation unit. It operates via a plugin-like system of handlers:

1.  **Global Pollution Tracker**: Snapshots the global `window` state before the unit mounts. When unmounting, it compares the current state to the snapshot and deletes any global variables added by the bundle.
2.  **Listener Cleanup**: Intercepts `addEventListener`. ISLO keeps a registry of all listeners attached by the unit and automatically removes them on unmount.
3.  **Timer Cleanup**: Intercepts `setTimeout`, `setInterval`, and `requestAnimationFrame`. All active timers are cleared when the unit dies.
4.  **Observer Cleanup**: Tracks `MutationObserver`, `ResizeObserver`, and `IntersectionObserver` instances and disconnects them.

<br>

## SIU (Starve Isolation Unit)

When an isolation unit is unmounted or goes into sleep mode for too long, ISLO executes a "kill switch" mechanism that we called **SIU**.

### Problem
Even after an isolation unit is unmounted, asynchronous work may still be pending:
- queued microtasks  
- unresolved promises  
- timers  
- network callbacks  

If those callbacks run after the unit is “dead,” they may try to access the real DOM or mutate global state.  
This can trigger errors, revive UI that should not exist, or introduce subtle side-effects.

### Solution
When an isolation unit is removed, ISLO **invalidates its proxy membrane**.

From that moment on:

- Any callback that fires late receives an **inert virtual `window`**.  
- Reads return neutral values or empty proxies.  
- Writes and API calls become **safe no-ops**.  
- No interaction with the real DOM or global state is possible.

The async code still runs, but inside a sealed, effect-less sandbox.  
Once no reachable references remain, the JavaScript engine naturally clears the zombie code through garbage collection.

# Core Concepts

grekt takes a unique approach to frontend execution orchestration, moving away from the heavy-handed nature of iframes and the fragility of simple CSS scoping.

## Traditional isolation problems

- **iframes**: Slow, resource-heavy, and create hard boundaries that make state sharing and UI composition difficult (scrolling issues, modal positioning, etc.).

- **CSS scoping**: Tools like CSS Modules or BEM help, but they don't protect the global scope (`window`, `localStorage`, globals) from code pollution.

- **Module Federation**: Requires specific bundler setup and doesn't provide true runtime isolation.

## How grekt solves it

grekt combines modern browser APIs to create a lightweight yet robust orchestration layer:

### Shadow DOM Containment

grekt mounts every isolation unit inside a Shadow Root.

- **CSS Encapsulation**: Styles defined in the bundle do not leak to the host application.
- **DOM Encapsulation**: `document.getElementById` inside the bundle only sees elements within its shadow root.

### Proxy Membranes for JS Scoping

grekt wraps bundle execution in a membrane using JS Proxies.

- **Global Scope Protection**: When the bundle writes to `window.foo`, it writes to a proxied virtual window. The real global window remains untouched.
- **API Interception**: Calls to `setTimeout`, `addEventListener`, `IntersectionObserver`, etc. are intercepted and tracked for cleanup.

### Cleanup Engine

Memory leaks are one of the hardest problems in frontend orchestration. Frameworks often leave behind zombie listeners or timers when destroyed externally.

grekt implements a centralized **Cleanup Engine** that tracks every side effect:

| Handler | What it tracks | On unmount |
|---------|----------------|------------|
| Global Pollution | `window.*` additions | Deletes added properties |
| Listener Cleanup | `addEventListener` calls | Removes all listeners |
| Timer Cleanup | `setTimeout`, `setInterval`, `requestAnimationFrame` | Clears all timers |
| Observer Cleanup | `MutationObserver`, `ResizeObserver`, `IntersectionObserver` | Disconnects all |

### Lifecycle Supervision

The **IsolationUnitSupervisor** manages isolation unit lifecycles:

- **Preservation**: Unmounted units can be preserved for fast remount
- **Freeze**: After idle timeout, units are soft-cleaned (Shadow DOM preserved)
- **Eviction**: Under memory pressure, units are fully destroyed

## Starvation Mode

When an isolation unit is unmounted, async work may still be pending:
- Queued microtasks
- Unresolved promises
- Timers
- Network callbacks

If these run after the unit is "dead", they could try to access the real DOM or mutate global state.

### Solution: `__GREKT_STARVED__`

When an isolation unit is removed, grekt **invalidates its proxy membrane**:

- Any late callback receives an **inert virtual window**
- Reads return neutral values or empty proxies
- Writes and API calls become **safe no-ops**
- No interaction with real DOM or global state is possible

The async code still runs, but inside a sealed, effect-less sandbox. The JavaScript engine naturally garbage collects the zombie code once no references remain.

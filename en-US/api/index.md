# API Reference

All public exports from `@grekt/core`.

<div class="api-groups">
  <div class="api-section-title">
      <h2>Core API</h2>
  </div>
  <div class="api-group">
    <h3>Isolation</h3>
    <ul>
      <li><a href="/en-US/api/create-isolation">createIsolation()</a></li>
      <li><a href="/en-US/api/create-isolation#isolationunit">IsolationUnit</a></li>
      <li><a href="/en-US/api/create-isolation#mount">mount()</a></li>
      <li><a href="/en-US/api/create-isolation#unmount">unmount()</a></li>
      <li><a href="/en-US/api/create-isolation#destroy">destroy()</a></li>
    </ul>
  </div>

  <div class="api-group">
    <h3>Service Worker</h3>
    <ul>
      <li><a href="/en-US/api/service-worker#registerserviceworker">registerServiceWorker()</a></li>
      <li><a href="/en-US/api/service-worker#unregisterserviceworker">unregisterServiceWorker()</a></li>
    </ul>
  </div>

  <div class="api-section-title">
      <h2>Configuration</h2>
  </div>
  <div class="api-group">
    <h3>Types</h3>
    <ul>
      <li><a href="/en-US/api/create-isolation#isolationruntimeconfig">IsolationRuntimeConfig</a></li>
      <li><a href="/en-US/api/create-isolation#entrypoints">EntryPoints</a></li>
      <li><a href="/en-US/api/create-isolation#mountoptions">MountOptions</a></li>
      <li><a href="/en-US/api/create-isolation#shadowdomconfig">ShadowDOMConfig</a></li>
      <li><a href="/en-US/api/create-isolation#supervisionconfig">SupervisionConfig</a></li>
    </ul>
  </div>

  <div class="api-group">
    <h3>Constants</h3>
    <ul>
      <li><a href="/en-US/api/constants#plugin_roles">PLUGIN_ROLES</a></li>
      <li><a href="/en-US/api/constants#plugin_modes">PLUGIN_MODES</a></li>
    </ul>
  </div>
</div>

<style>
.api-section-title {
  grid-column: span 2;
}
.api-groups {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 2rem;
}

.api-group {
  background-color: var(--vp-c-bg-soft);
  padding: 24px;
  border-radius: 12px;
}

.api-group h3 {
  margin-top: 0 !important;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.api-group ul {
  list-style: none !important;
  margin: 0 !important;
  padding: 0 !important;
}

.api-group li {
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.api-group li a {
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.2s;
}

.api-group li a:hover {
  color: var(--vp-c-brand-1);
}
</style>

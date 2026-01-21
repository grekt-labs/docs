# CLI Reference

grekt provides a command-line interface for managing AI artifacts.

## Commands

<div class="api-groups">
  <div class="api-group">
    <h3>Artifact Management</h3>
    <ul>
      <li><a href="/en-US/api/init">grekt init</a> — Initialize a project</li>
      <li><a href="/en-US/api/add">grekt add</a> — Add an artifact</li>
      <li><a href="/en-US/api/install">grekt install</a> — Install from lockfile</li>
      <li><a href="/en-US/api/remove">grekt remove</a> — Remove an artifact</li>
      <li><a href="/en-US/api/list">grekt list</a> — List installed artifacts</li>
      <li><a href="/en-US/api/publish">grekt publish</a> — Publish an artifact</li>
    </ul>
  </div>

  <div class="api-group">
    <h3>Sync & Diagnostics</h3>
    <ul>
      <li><a href="/en-US/api/sync">grekt sync</a> — Sync to AI tools</li>
      <li><a href="/en-US/api/check">grekt check</a> — Check artifact integrity</li>
      <li><a href="/en-US/api/config">grekt config</a> — Manage configuration</li>
    </ul>
  </div>
</div>

## Global Options

| Option | Description |
|--------|-------------|
| `-h, --help` | Show help for command |
| `-V, --version` | Show version number |

## Quick Reference

```bash
grekt init                     # Initialize
grekt add @author/artifact     # Add from registry
grekt add github:user/repo     # Add from GitHub
grekt install                  # Install from lockfile
grekt sync --dry-run           # Preview sync
grekt sync                     # Apply
grekt list                     # List artifacts
grekt check                    # Verify integrity
grekt remove artifact          # Remove
grekt publish ./artifact       # Publish
grekt config set autoSync true # Configure
```

<style>
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

# CLI reference

grekt provides a command-line interface for managing AI artifacts.

## Commands

<div class="api-groups">
  <div class="api-group coming-soon">
    <h3>Authentication <span class="badge">Coming Soon</span></h3>
    <ul>
      <li><a href="/en-US/api/login">grekt login</a><span class="desc">Log in to registry</span></li>
      <li><a href="/en-US/api/logout">grekt logout</a><span class="desc">Log out from registry</span></li>
      <li><a href="/en-US/api/whoami">grekt whoami</a><span class="desc">Show current user</span></li>
    </ul>
  </div>

  <div class="api-group">
    <h3>Artifact Management</h3>
    <ul>
      <li><a href="/en-US/api/init">grekt init</a><span class="desc">Initialize a project</span></li>
      <li><a href="/en-US/api/add">grekt add</a><span class="desc">Add an artifact</span></li>
      <li><a href="/en-US/api/install">grekt install</a><span class="desc">Install from lockfile</span></li>
      <li><a href="/en-US/api/remove">grekt remove</a><span class="desc">Remove an artifact</span></li>
      <li><a href="/en-US/api/list">grekt list</a><span class="desc">List installed artifacts</span></li>
    </ul>
  </div>

  <div class="api-group">
    <h3>Registry Operations</h3>
    <ul>
      <li><a href="/en-US/api/publish">grekt publish</a><span class="desc">Publish an artifact</span></li>
      <li><a href="/en-US/api/info">grekt info</a><span class="desc">Show artifact info</span></li>
      <li><a href="/en-US/api/versions">grekt versions</a><span class="desc">List versions</span></li>
      <li><a href="/en-US/api/outdated">grekt outdated</a><span class="desc">Check for updates</span></li>
      <li><a href="/en-US/api/deprecate">grekt deprecate</a><span class="desc coming-soon-text">Deprecate a version (Coming Soon)</span></li>
      <li><a href="/en-US/api/undeprecate">grekt undeprecate</a><span class="desc coming-soon-text">Remove deprecation (Coming Soon)</span></li>
    </ul>
  </div>

  <div class="api-group">
    <h3>Sync & Diagnostics</h3>
    <ul>
      <li><a href="/en-US/api/sync">grekt sync</a><span class="desc">Sync to AI tools</span></li>
      <li><a href="/en-US/api/add-target">grekt add-target</a><span class="desc">Add AI targets to sync with</span></li>
      <li><a href="/en-US/api/check">grekt check</a><span class="desc">Check artifact integrity</span></li>
      <li><a href="/en-US/api/config">grekt config</a><span class="desc">Manage configuration</span></li>
    </ul>
  </div>

  <div class="api-group">
    <h3>Authoring</h3>
    <ul>
      <li><a href="/en-US/api/pack">grekt pack</a><span class="desc">Create artifact tarball</span></li>
      <li><a href="/en-US/api/version">grekt version</a><span class="desc">Auto-version artifacts</span></li>
    </ul>
  </div>
</div>

## Global options

| Option | Description |
|--------|-------------|
| `-h, --help` | Show help for command |
| `-V, --version` | Show version number |

## Quick reference

```bash
# Artifacts
grekt init                       # Initialize
grekt add @author/artifact       # Add from registry
grekt add @author/artifact@1.0.0 # Add specific version
grekt add github:user/repo       # Add from GitHub
grekt add gitlab:user/repo       # Add from GitLab
grekt install                    # Install from lockfile
grekt sync --dry-run             # Preview sync
grekt sync                       # Apply
grekt list                       # List artifacts
grekt check                      # Verify integrity
grekt remove artifact            # Remove

# Registry
grekt publish ./artifact         # Publish
grekt info @author/artifact      # Show artifact info
grekt versions @author/artifact  # List versions
grekt outdated                   # Check for updates

# Targets & Config
grekt add-target                 # Add AI targets
grekt config registry set @scope # Configure registry

# Authoring
grekt pack ./artifact            # Create tarball
grekt version --dry-run          # Preview version bumps
grekt version                    # Apply version bumps
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

.api-group.coming-soon {
  opacity: 0.7;
}

.api-group h3 {
  margin-top: 0 !important;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.api-group h3 .badge {
  font-size: 0.7rem;
  font-weight: 500;
  background-color: var(--vp-c-warning-soft);
  color: var(--vp-c-warning-1);
  padding: 2px 8px;
  border-radius: 4px;
  margin-left: 8px;
  vertical-align: middle;
}

.api-group ul {
  list-style: none !important;
  margin: 0 !important;
  padding: 0 !important;
}

.api-group li {
  margin-bottom: 12px;
  font-size: 0.95rem;
  display: flex;
  flex-direction: column;
}

.api-group li a {
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.2s;
  font-weight: 500;
}

.api-group li a:hover {
  color: var(--vp-c-brand-1);
}

.api-group li .desc {
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  margin-top: 2px;
}

.api-group li .desc.coming-soon-text {
  color: var(--vp-c-text-3);
  font-style: italic;
}
</style>

# CLI reference

grekt provides a command-line interface for managing AI artifacts.

## Commands

<div class="api-groups">
  <div class="api-group">
    <h3>Authentication</h3>
    <ul>
      <li><a href="/en-US/api/login">grekt login</a> Log in to registry</li>
      <li><a href="/en-US/api/logout">grekt logout</a> Log out from registry</li>
      <li><a href="/en-US/api/whoami">grekt whoami</a> Show current user</li>
    </ul>
  </div>

  <div class="api-group">
    <h3>Artifact Management</h3>
    <ul>
      <li><a href="/en-US/api/init">grekt init</a> Initialize a project</li>
      <li><a href="/en-US/api/add">grekt add</a> Add an artifact</li>
      <li><a href="/en-US/api/install">grekt install</a> Install from lockfile</li>
      <li><a href="/en-US/api/remove">grekt remove</a> Remove an artifact</li>
      <li><a href="/en-US/api/list">grekt list</a> List installed artifacts</li>
    </ul>
  </div>

  <div class="api-group">
    <h3>Registry Operations</h3>
    <ul>
      <li><a href="/en-US/api/publish">grekt publish</a> Publish an artifact</li>
      <li><a href="/en-US/api/deprecate">grekt deprecate</a> Deprecate a version</li>
      <li><a href="/en-US/api/undeprecate">grekt undeprecate</a> Remove deprecation</li>
      <li><a href="/en-US/api/info">grekt info</a> Show artifact info</li>
      <li><a href="/en-US/api/versions">grekt versions</a> List versions</li>
      <li><a href="/en-US/api/outdated">grekt outdated</a> Check for updates</li>
    </ul>
  </div>

  <div class="api-group">
    <h3>Sync & Diagnostics</h3>
    <ul>
      <li><a href="/en-US/api/sync">grekt sync</a> Sync to AI tools</li>
      <li><a href="/en-US/api/check">grekt check</a> Check artifact integrity</li>
      <li><a href="/en-US/api/config">grekt config</a> Manage configuration</li>
    </ul>
  </div>

  <div class="api-group">
    <h3>Authoring</h3>
    <ul>
      <li><a href="/en-US/api/pack">grekt pack</a> Create artifact tarball</li>
      <li><a href="/en-US/api/version">grekt version</a> Auto-version artifacts</li>
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
# Authentication
grekt login                      # Log in to registry
grekt logout                     # Log out
grekt whoami                     # Show current user

# Artifacts
grekt init                       # Initialize
grekt add @author/artifact       # Add from registry
grekt add @author/artifact@1.0.0 # Add specific version
grekt add github:user/repo       # Add from GitHub
grekt install                    # Install from lockfile
grekt sync --dry-run             # Preview sync
grekt sync                       # Apply
grekt list                       # List artifacts
grekt check                      # Verify integrity
grekt remove artifact            # Remove

# Registry
grekt publish ./artifact         # Publish
grekt deprecate @a/b@1.0 -m "x"  # Deprecate version
grekt undeprecate @a/b@1.0       # Remove deprecation
grekt info @author/artifact      # Show artifact info
grekt versions @author/artifact  # List versions
grekt outdated                   # Check for updates

# Config
grekt config set autoSync true   # Configure

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

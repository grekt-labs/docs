# grekt undeprecate

Remove deprecation from an artifact version.

```bash
grekt undeprecate <artifact@version>
```

## Examples

```bash
# Remove deprecation
grekt undeprecate @author/agent@1.0.0
```

## Authentication

Authentication depends on the registry:

- **Public registry:** `grekt login` (stores token in `~/.grekt/credentials.yaml`)
- **GitLab / GitHub:** `GITLAB_TOKEN`, `GITHUB_TOKEN`, or token in `.grekt/config.yaml`

## Use cases

- Deprecation was added by mistake
- Issue was fixed in the same version (hotfix)
- Version is now considered safe again

## Related commands

- [grekt deprecate](/en-US/api/deprecate) — Mark a version as deprecated
- [grekt versions](/en-US/api/versions) — List versions with deprecation status

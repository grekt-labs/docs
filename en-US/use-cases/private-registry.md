---
description: "Set up a private grekt registry using GitHub or GitLab. Keep internal AI artifacts secure with your existing infrastructure and SSO."
---

# Private registry for enterprises

Use your existing GitHub or GitLab infrastructure as a private artifact registry. No new services to deploy.

## The problem

Your organization builds internal AI artifacts: proprietary agents, company-specific rules, internal tooling skills. These can't go on a public registry because:

- They contain internal conventions and business logic
- Compliance requires artifacts stay within your infrastructure boundary
- You need SSO and access control from your existing identity provider
- IT won't approve yet another SaaS platform

You need a private registry that works with what you already have.

## The solution

### 1. Configure a custom registry

Point grekt at your GitHub or GitLab instance for a given scope:

```bash
grekt config registry set @your-org
```

This prompts you to configure the registry type (GitHub or GitLab), host, and project. The configuration is stored in `.grekt/config.yaml`.

### 2. Authenticate with your existing credentials

grekt uses your platform's authentication:

```bash
grekt login
```

### 3. Publish internal artifacts

Publish to your private registry the same way you would to public:

```bash
grekt publish
```

The artifact's **scope determines which registry** it goes to. `@your-org/my-artifact` publishes to whichever registry is configured for `@your-org`.

### 4. Scope by team

Use organization scopes to namespace artifacts:

```bash
grekt add @platform-team/infra-agent
grekt add @frontend-team/component-standards
grekt add @security-team/audit-rules
```

Access control follows your existing GitHub/GitLab permissions.

## Result

Your enterprise setup:

```
.grekt/config.yaml:
  registries:
    "@platform-team":
      type: gitlab
      project: platform-team/artifacts
      host: gitlab.internal.company.com
    "@frontend-team":
      type: github
      project: frontend-team
```

Developers install internal artifacts the same way they install public ones. The scope determines which registry resolves the artifact.

## Related

- [Registries overview](/en-US/docs/guide/sources/overview) - How registries work
- [GitHub registry](/en-US/docs/guide/sources/github) - GitHub / GitHub Enterprise setup
- [GitLab registry](/en-US/docs/guide/sources/gitlab) - GitLab / GitLab Self-hosted setup
- [Authentication](/en-US/docs/guide/sources/authentication) - Registry authentication
- [grekt config](/en-US/api/config) - Configuration command reference

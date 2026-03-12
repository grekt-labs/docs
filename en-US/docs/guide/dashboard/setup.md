---
description: "Install the grekt dashboard with Docker and configure your projects to sync."
---

# Setup

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed
- A machine or server reachable by your development team (local, VM, cloud instance)
- Port `8090` (API) and `5173` (UI) available

## Install with Docker

Clone the dashboard repository and start the services:

```bash
git clone https://github.com/grekt-labs/dashboard.git
cd dashboard
docker compose up -d
```

This starts two containers:

| Service | Port | Description |
|---------|------|-------------|
| `pocketbase` | 8090 | API and database |
| `frontend` | 5173 | Dashboard web UI |

Verify both are running:

```bash
docker compose ps
```

Once running, open `http://localhost:5173` in your browser.

### docker-compose.yml

```yaml
services:
  pocketbase:
    image: ghcr.io/muchobien/pocketbase:latest
    volumes:
      - ./pb_data:/pb_data
      - ./pb_migrations:/pb_migrations
      - ./pb_hooks:/pb_hooks
    ports:
      - "8090:8090"

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "5173:5173"
    environment:
      - VITE_POCKETBASE_URL=http://localhost:8090
    depends_on:
      - pocketbase
```

Data is persisted in `./pb_data`. Back up this directory regularly.

::: tip Ports
To change ports, update the `ports` mapping and set `VITE_POCKETBASE_URL` accordingly.
:::

## Initial setup

On the first visit, the dashboard detects that no users exist and shows a setup form. Create your account with an email and password (minimum 8 characters). This becomes the owner account.

Once created, the setup screen is permanently locked. All further users are managed from the dashboard.

::: warning
Save these credentials. They can be reset through the PocketBase admin panel, but it is better not to lose them.
:::

## Create an API token

Your projects need a token to authenticate with the dashboard API. Only the admin account can create tokens.

1. Log in as admin
2. Go to **Settings > API Tokens**
3. Give the token a name, choose an expiration, and click **Create**

The token is shown once. Copy it immediately. It starts with `gdk_` and cannot be retrieved later.

## Configure your project

Add the dashboard URL and token to `.grekt/config.yaml`:

```yaml
dashboard:
  url: http://your-dashboard-host
  token: gdk_your-token-here
```

This file lives inside `.grekt/`, which is already gitignored.

## First sync

Run the sync command to verify everything works:

```bash
grekt dashboard sync
```

This uploads your project metadata, installed artifacts, scan and eval reports, and cleans up anything that was removed locally.

## CI/CD

To keep the dashboard up to date automatically, add a sync step to your pipeline. `grekt scan` and `grekt eval` write their results to `.grekt/reports/` as local files. `grekt dashboard sync` picks them up, uploads everything, and deletes the report files.

### Using the setup action

The grekt setup action generates `.grekt/config.yaml` for you. Pass the dashboard URL and token as secrets:

::: code-group

```yaml [GitHub Actions]
- name: Setup grekt
  uses: grekt-labs/actions/github/setup@v1
  with:
    dashboard-url: ${{ secrets.GREKT_DASHBOARD_URL }}
    dashboard-token: ${{ secrets.GREKT_DASHBOARD_TOKEN }}

- name: Install artifacts
  run: grekt install

- name: Scan # optional
  run: grekt scan

- name: Eval # optional
  run: grekt eval

- name: Sync to dashboard
  run: grekt dashboard sync
```

```yaml [GitLab CI]
include:
  - remote: "https://raw.githubusercontent.com/grekt-labs/actions/main/gitlab/templates/setup.yml"

dashboard-sync:
  extends: .grekt-setup
  variables:
    GREKT_DASHBOARD_URL: ${GREKT_DASHBOARD_URL}
    GREKT_DASHBOARD_TOKEN: ${GREKT_DASHBOARD_TOKEN}
  script:
    - grekt install
    - grekt scan       # optional
    - grekt eval       # optional
    - grekt dashboard sync
```

:::

### Manual configuration

If you prefer not to use the setup action, generate `.grekt/config.yaml` directly in your pipeline:

::: code-group

```yaml [GitHub Actions]
- name: Configure dashboard
  run: |
    mkdir -p .grekt
    cat > .grekt/config.yaml <<EOF
    # ... rest of your grekt config (registries, etc.)
    dashboard:
      url: ${{ secrets.GREKT_DASHBOARD_URL }}
      token: ${{ secrets.GREKT_DASHBOARD_TOKEN }}
    EOF

- name: Install artifacts
  run: grekt install

- name: Scan # optional
  run: grekt scan

- name: Eval # optional
  run: grekt eval

- name: Sync to dashboard
  run: grekt dashboard sync
```

```yaml [GitLab CI]
dashboard-sync:
  stage: deploy
  script:
    - mkdir -p .grekt
    - |
      cat > .grekt/config.yaml <<EOF
      # ... rest of your grekt config (registries, etc.)
      dashboard:
        url: ${GREKT_DASHBOARD_URL}
        token: ${GREKT_DASHBOARD_TOKEN}
      EOF
    - grekt install
    - grekt scan       # optional
    - grekt eval       # optional
    - grekt dashboard sync
```

:::

## See also

- [Dashboard overview](/en-US/docs/guide/dashboard/overview)
- [Syncing](/en-US/docs/guide/dashboard/syncing)
- [grekt dashboard sync](/en-US/api/dashboard-sync)

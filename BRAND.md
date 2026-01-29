# grekt Brand Guidelines

## Name

**grekt** - AI Artifact Manager

## Definition

An AI artifact manager for agents, skills, commands, and more that syncs configurations across AI coding assistants like Claude, Cursor, and others.

## Brand Tokens

All brand tokens are defined in `ori/src/brand.css`. Import this file to use grekt brand styles in any project:

```css
@import url('path/to/ori/src/brand.css');
```

## Color Palette

### Primary (Teal)

| Scale | Hex | CSS Variable |
|-------|-----|--------------|
| 100 | `#ddfbf5` | `--grekt-primary-100` |
| 200 | `#54edcf` | `--grekt-primary-200` |
| 500 | `#10ab8d` | `--grekt-primary-500` |
| 800 | `#0d8a72` | `--grekt-primary-800` |
| 900 | `#044236` | `--grekt-primary-900` |

### Secondary (Blue)

| Scale | Hex | CSS Variable |
|-------|-----|--------------|
| 100 | `#97acda` | `--grekt-secondary-100` |
| 200 | `#395ead` | `--grekt-secondary-200` |
| 500 | `#1e3463` | `--grekt-secondary-500` |
| 800 | `#152b5b` | `--grekt-secondary-800` |
| 900 | `#09152f` | `--grekt-secondary-900` |

### Complementary (Purple)

| Scale | Hex | CSS Variable |
|-------|-----|--------------|
| 100 | `#f3e8ff` | `--grekt-complementary-100` |
| 200 | `#d8b4fe` | `--grekt-complementary-200` |
| 500 | `#a855f7` | `--grekt-complementary-500` |
| 800 | `#7e22ce` | `--grekt-complementary-800` |
| 900 | `#581c87` | `--grekt-complementary-900` |

### Base (Grays)

| Name | Hex | CSS Variable |
|------|-----|--------------|
| White | `#ffffff` | `--grekt-base-white` |
| 100 | `#f0f0f0` | `--grekt-base-100` |
| 300 | `#c2c2c2` | `--grekt-base-300` |
| 500 | `#828282` | `--grekt-base-500` |
| 600 | `#555555` | `--grekt-base-600` |
| 700 | `#2e2e2e` | `--grekt-base-700` |
| 900 | `#000000` | `--grekt-base-900` |

### Status Colors

| Type | Scale | Hex | CSS Variable |
|------|-------|-----|--------------|
| Danger | 100 | `#fed1d6` | `--grekt-danger-100` |
| Danger | 500 | `#ca1628` | `--grekt-danger-500` |
| Danger | 900 | `#670a13` | `--grekt-danger-900` |
| Success | 100 | `#cbfad5` | `--grekt-success-100` |
| Success | 500 | `#3ebb59` | `--grekt-success-500` |
| Success | 900 | `#1b672b` | `--grekt-success-900` |
| Warning | 100 | `#fff3d3` | `--grekt-warning-100` |
| Warning | 500 | `#f4d259` | `--grekt-warning-500` |
| Warning | 900 | `#90771e` | `--grekt-warning-900` |

## Typography

| Usage | Font | CSS Variable |
|-------|------|--------------|
| Titles | Cal Sans | `--font-display` |
| Body | Inter | `--font-body` |
| Code | Source Code Pro | `--font-mono` |

## Semantic Tokens

These tokens change based on light/dark mode:

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `--grekt-bg` | white | secondary-900 |
| `--grekt-bg-secondary` | base-100 | secondary-800 |
| `--grekt-text` | base-700 | base-100 |
| `--grekt-text-muted` | base-500 | base-500 |
| `--grekt-border` | base-300 | secondary-800 |
| `--grekt-primary` | primary-500 | primary-200 |
| `--grekt-primary-hover` | primary-800 | primary-500 |

## Terminology

| Term | Description |
|------|-------------|
| **Artifact** | An installable unit with agents, skills, commands (`@scope/name`) |
| **Artifact-kit** | A collection of artifacts for team sharing |
| **Target** | An AI tool to sync to (Claude, Cursor) |

## Links

- GitHub: https://github.com/grekt-labs
- Documentation: https://grekt.dev

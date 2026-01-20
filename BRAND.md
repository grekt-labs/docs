# grekt Brand Guidelines

## Name

**grekt** - AI Artifact Manager

## Definition

An AI artifact manager for agents, skills, commands, and more that syncs configurations across AI coding assistants like Claude, Cursor, and others.

## Color Palette

### Base Colors

| Name | Hex (500) | Usage |
|------|-----------|-------|
| **Primary** | `#77CABD` | Main brand color, buttons, links |
| **Secondary** | `#3981ED` | Secondary actions, accents |
| **Tertiary** | `#ED9839` | Warnings, attention, CTAs |
| **Highlight** | `#39EDAA` | Success states, confirmations |

### Color Scale

#### Primary (Teal)

| Scale | Hex | Usage |
|-------|-----|-------|
| 100 | `#e5f5f2` | Backgrounds, subtle highlights |
| 200 | `#c0e8e1` | Hover states, light accents |
| 300 | `#9bdbd0` | Secondary buttons, borders |
| 500 | `#77CABD` | Primary buttons, links, icons |
| 700 | `#5a9a8f` | Hover on primary, dark accents |
| 900 | `#3d6a62` | Text on light backgrounds |

#### Secondary (Blue)

| Scale | Hex |
|-------|-----|
| 100 | `#e0ebfc` |
| 200 | `#b3cff8` |
| 300 | `#80b0f3` |
| 500 | `#3981ED` |
| 700 | `#2a61b2` |
| 900 | `#1a3d70` |

#### Tertiary (Orange)

| Scale | Hex |
|-------|-----|
| 100 | `#fde9d8` |
| 200 | `#facba3` |
| 300 | `#f5ab6a` |
| 500 | `#ED9839` |
| 700 | `#b2722a` |
| 900 | `#70481a` |

#### Highlight (Mint)

| Scale | Hex |
|-------|-----|
| 100 | `#d8fcee` |
| 200 | `#a3f8d8` |
| 300 | `#6af3c0` |
| 500 | `#39EDAA` |
| 700 | `#2ab280` |
| 900 | `#1a7050` |

### Dark Theme

| Name | Hex | Usage |
|------|-----|-------|
| Background | `#0d1117` | Hero, dark sections |
| Background End | `#161b22` | Gradient end point |

### CSS Variables

```css
:root {
  /* Primary */
  --grekt-primary-100: #e5f5f2;
  --grekt-primary-200: #c0e8e1;
  --grekt-primary-300: #9bdbd0;
  --grekt-primary-500: #77CABD;
  --grekt-primary-700: #5a9a8f;
  --grekt-primary-900: #3d6a62;

  /* Secondary */
  --grekt-secondary-100: #e0ebfc;
  --grekt-secondary-200: #b3cff8;
  --grekt-secondary-300: #80b0f3;
  --grekt-secondary-500: #3981ED;
  --grekt-secondary-700: #2a61b2;
  --grekt-secondary-900: #1a3d70;

  /* Tertiary */
  --grekt-tertiary-100: #fde9d8;
  --grekt-tertiary-200: #facba3;
  --grekt-tertiary-300: #f5ab6a;
  --grekt-tertiary-500: #ED9839;
  --grekt-tertiary-700: #b2722a;
  --grekt-tertiary-900: #70481a;

  /* Highlight */
  --grekt-highlight-100: #d8fcee;
  --grekt-highlight-200: #a3f8d8;
  --grekt-highlight-300: #6af3c0;
  --grekt-highlight-500: #39EDAA;
  --grekt-highlight-700: #2ab280;
  --grekt-highlight-900: #1a7050;

  /* Dark theme */
  --grekt-bg-dark: #0d1117;
  --grekt-bg-gradient: linear-gradient(180deg, #0d1117 0%, #161b22 100%);
}
```

## Terminology

### Correct Usage

| Term | Description |
|------|-------------|
| **Artifact** | An installable unit with agents, skills, commands (`@scope/name`) |
| **Artifact-kit** | A collection of artifacts for team sharing |
| **Target** | An AI tool to sync to (Claude, Cursor) |

## Use Cases

grekt helps developers manage AI coding assistant configurations:

1. **Share AI Configurations** - Publish and share agents, skills, commands
2. **Multi-tool Support** - Sync to Claude, Cursor, and more
3. **Version Control** - Track artifact versions with lockfiles
4. **Team Collaboration** - Share configurations across projects

## Links

- GitHub: https://github.com/grekt-labs
- Documentation: (this site)

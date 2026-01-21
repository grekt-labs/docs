# grekt Documentation

This is the documentation site for grekt, an AI artifact manager CLI.

## Agent

- **docs-writer** — Technical documentation writer with specific style guidelines

## Skills

- **cli-reference** — Templates for CLI command reference pages
- **guide-pages** — Templates for conceptual guide pages
- **doc-patterns** — Patterns and anti-patterns to follow
- **code-variants** — When to use tabs (npm/pnpm/bun, YAML/JSON)

## Quick Reference

### Style
- Concise & direct (like man pages)
- Command first, then options, examples, notes
- 50-100 lines per page
- No redundancy, no verbosity
- English only

### Structure
```
docs/en-US/
├── docs/guide/    # Concepts
└── api/           # CLI reference
```

### Don't
- Explain external tools (GitHub token creation, etc.)
- Repeat info across pages
- Use marketing language
- Use emojis or exclamations
- Compare to NPM ("like package.json", "like npm install")
- Use closed lists (use "agents, skills, commands..." with ellipsis)

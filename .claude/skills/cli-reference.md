---
grk-type: skill
grk-name: cli-reference
grk-description: Write CLI command reference pages
grk-agent: docs-writer
---

# CLI Reference Pages

For each CLI command, create a reference page in `docs/en-US/api/`.

## Template

```markdown
# grekt <command>

<One-line description, max 10 words>

\`\`\`bash
grekt <command> [args]
\`\`\`

## Options

| Option | Description |
|--------|-------------|
| `-x, --example` | What it does |

## Examples

\`\`\`bash
# Basic usage
grekt <command> arg

# With options
grekt <command> arg --option
\`\`\`

## Notes

- Note 1
- Note 2
```

## Checklist

Before submitting a CLI reference page:

- [ ] Title is `# grekt <command>` (not "The grekt command")
- [ ] First line after title is one-line description
- [ ] Usage block shows actual command syntax
- [ ] Options table has short descriptions (1 line each)
- [ ] Every example has a comment
- [ ] Notes section has max 4 bullets
- [ ] Total length is 50-100 lines
- [ ] No redundancy with other pages

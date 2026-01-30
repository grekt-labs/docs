---
grk-type: skills
grk-name: guide-pages
grk-description: Write conceptual guide pages
grk-agents: docs-writer
---

# Guide pages

Guide pages explain concepts, not commands. Located in `docs/en-US/docs/guide/`.

## Structure

Guide pages are organized by complexity:

### Quick start (getting-started.md)
- Installation
- 4-step workflow: init → add → sync → list
- Links to deeper docs
- Max 80 lines

### Core concepts (artifacts.md, targets.md)
- What the concept is
- Structure/components
- Examples
- Max 100 lines each

### Configuration (authentication.md)
- How to configure
- Options (env vars, files)
- Examples for each provider
- Max 100 lines

## Template

```markdown
# <Concept>

<One paragraph explaining what this is>

## <Section 1>

<Content>

## <Section 2>

<Content>

## Notes

- Note if needed
```

## Checklist

- [ ] One-paragraph intro (2-3 sentences max)
- [ ] Clear section hierarchy
- [ ] Code examples have comments
- [ ] No command reference content (that goes in /api/)
- [ ] Links to related guides inline
- [ ] 50-100 lines total

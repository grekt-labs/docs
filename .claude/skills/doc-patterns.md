---
grk-type: skills
grk-name: doc-patterns
grk-description: Documentation patterns and anti-patterns
grk-agents: docs-writer
---

# Documentation Patterns

## Good Patterns

### Direct imperatives
```markdown
✅ Run `grekt init` to initialize.
✅ Set `GITHUB_TOKEN` for private repos.
```

### One-line descriptions
```markdown
✅ # grekt add

Add an artifact from registry or Git.
```

### Commented examples
```markdown
✅ ```bash
# Add from GitHub with specific tag
grekt add github:user/repo#v1.0.0
```
```

### Inline links when natural
```markdown
✅ For private repos, see [Authentication](./authentication).
```

## Anti-Patterns

### Verbose intros
```markdown
❌ "This command allows you to add artifacts from various sources including..."
✅ "Add an artifact from registry or Git."
```

### Explaining external tools
```markdown
❌ "To create a GitHub token, go to Settings → Developer settings → Personal access tokens, click Generate new token..."
✅ "Set `GITHUB_TOKEN`. Create one at github.com/settings/tokens."
```

### Redundant sections
```markdown
❌ Repeating the same "What happens" section in every command doc
✅ Explain once in the guide, link from commands
```

### Marketing language
```markdown
❌ "grekt provides a powerful and seamless way to..."
✅ "grekt manages AI configurations."
```

### Unnecessary prefixes
```markdown
❌ "Note: You need to run sync after."
✅ "Run `grekt sync` after."
```

### Passive voice
```markdown
❌ "The artifact will be downloaded..."
✅ "Downloads the artifact..."
```

## Length Guidelines

| Page Type | Target | Max |
|-----------|--------|-----|
| CLI reference | 50 lines | 80 lines |
| Guide page | 80 lines | 120 lines |
| Quick start | 60 lines | 80 lines |

If a page exceeds max, split it.

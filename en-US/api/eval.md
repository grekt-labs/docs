---
description: "Run eval tests against artifact elements to validate quality of skills, agents, and commands."
---

# grekt eval

Run eval tests against artifact elements (skills, agents, commands...).

```bash
grekt eval [options]
```

## Options

| Option | Description |
|--------|-------------|
| `--artifact <name>` | Run evals for a specific artifact only |
| `--skill <name>` | Run evals for a specific skill only |
| `--agent <name>` | Run evals for a specific agent only |
| `--command <name>` | Run evals for a specific command only |
| `--details` | Show failure details |
| `--report` | Open eval dashboard in browser |
| `--format <format>` | Output format: `text` (default), `json` |

## Prerequisites

grekt eval requires an external eval engine. Install [promptfoo](https://promptfoo.dev):

```bash
npm install -g promptfoo
```

Configure a provider in `.grekt/config.yaml`:

```yaml
eval:
  providers:
    - openai:gpt-4.1-mini
```

API keys are set via environment variables (e.g. `OPENAI_API_KEY`).

## Examples

Run all evals:

```bash
grekt eval
```

Run evals for a specific artifact:

```bash
grekt eval --artifact @acme/support
```

Run evals for a specific skill:

```bash
grekt eval --skill tone-checker
```

Show failure details:

```bash
grekt eval --details
```

JSON output for CI:

```bash
grekt eval --format json
```

Open the promptfoo dashboard:

```bash
grekt eval --report
```

## Output

```
@acme/support
  skills/tone-checker ........... 3/3 passed  A
  agents/support-agent .......... 2/3 passed  B

Overall: B (88/100)
1 issue found
Run `grekt eval --details` for more info
```

## Grading

| Grade | Score |
|-------|-------|
| A | 95-100 |
| B | 80-94 |
| C | 65-79 |
| D | 50-64 |
| F | 0-49 |

## Exit codes

| Code | Meaning |
|------|---------|
| 0 | All tests passed |
| 1 | One or more tests failed |

## See also

- [Eval guide](/en-US/docs/guide/eval) -Writing eval files, provider setup, CI integration

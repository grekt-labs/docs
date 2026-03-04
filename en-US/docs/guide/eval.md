---
description: "Validate artifact quality with eval tests. Publishers write tests, consumers verify installed artifacts work with their setup."
---

# Testing

Eval tests validate that your skills, agents, and commands produce quality outputs. Run them against any LLM provider to check behavior before publishing or after installing.

## Who is it for

### Publishers

Write `.eval.yaml` files alongside your elements. These are the test suite for the artifact - validate quality before publishing, catch regressions between versions, enforce quality gates in CI.

### Consumers

You don't write tests, but you can run `grekt eval` on installed artifacts to verify everything works with your provider and environment.

:::info
You can use `npx promptfoo@latest` to avoid a permanent install. If promptfoo is not detected, `grekt eval` will offer to run it via npx automatically.
:::

## How it works

1. Create a `.eval.yaml` file next to any element `.md` file
2. Define test cases with inputs and assertions
3. Run `grekt eval` - grekt discovers tests, sends prompts to the provider, checks assertions

grekt reads the system prompt from the `.md` file automatically. You only define inputs and expectations.

## File structure

```
.grekt/artifacts/@acme/support/
├── skills/
│   ├── tone-checker.md            # the skill
│   └── tone-checker.eval.yaml     # tests for this skill
├── agents/
│   ├── support-agent.md
│   └── support-agent.eval.yaml
```

The `.eval.yaml` file must share the same base name as its `.md` sibling.

## Writing eval files

```yaml
tests:
  - description: "handles refund request"
    vars:
      input: "I want a refund, this is not what I expected"
    assert:
      - type: contains-any         # output includes at least one of these
        value: ["refund", "process", "help"]
      - type: not-icontains        # output must NOT include this (case-insensitive)
        value: "that's not possible"
      - type: llm-rubric           # LLM judges output against this criteria
        value: "acknowledges frustration, explains refund process clearly"
```

Each test case has:

| Field | Required | Description |
|-------|----------|-------------|
| `description` | No | Human-readable test label |
| `vars` | Yes | Input variables passed to the prompt |
| `assert` | Yes | One or more assertions to check the output |

### Assertions

Assertions are passed directly to the eval engine. Common types:

| Type | Description |
|------|-------------|
| `contains` | Output contains the value |
| `contains-any` | Output contains any of the values |
| `not-contains` | Output does not contain the value |
| `icontains` | Case-insensitive contains |
| `not-icontains` | Case-insensitive not-contains |
| `llm-rubric` | LLM judges output against a criteria |
| `similar` | Cosine similarity above threshold |
| `cost` | Response cost below threshold |
| `latency` | Response time below threshold |

Full assertion reference: [promptfoo assertions](https://promptfoo.dev/docs/configuration/expected-outputs)

:::warning
`llm-rubric` should not be used for deterministic outputs. Since another LLM evaluates the result, it can produce inconsistent results across runs and degrade over time as models change. See [this research log](https://github.com/witanlabs/research-log) for a real-world example of LLM-as-judge masking regressions.
:::

### Provider override

Each eval file can override the default provider:

```yaml
provider: openai:gpt-4.1-mini

tests:
  - vars:
      input: "test"
    assert:
      - type: contains
        value: "ok"
```

## Provider configuration

Set the default provider in `.grekt/config.yaml` (gitignored):

```yaml
eval:
  providers:
    - openai:gpt-4.1-mini
```

API keys are set via environment variables. The provider string follows [promptfoo's provider format](https://promptfoo.dev/docs/providers).

Common providers:

| Provider | Format |
|----------|--------|
| OpenAI | `openai:gpt-4.1-mini` |
| Anthropic | `anthropic:messages:claude-sonnet-4-20250514` |
| Ollama (local) | `ollama:chat:llama3.3` |

## Evaluable elements

Only these element types support evals:

- Skills
- Agents
- Commands

Other types (rules, hooks, MCPs...) have their own testing strategies. An `.eval.yaml` next to a non-supported element produces a warning.

## See also

- [grekt eval](/en-US/api/eval) -Command reference

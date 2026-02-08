# grekt init

Initialize grekt in a project.

```bash
grekt init
```

## Options

| Option | Description |
|--------|-------------|
| `-y, --yes` | Skip prompts, use defaults |

## What it creates

```
project/
├── .grekt/artifacts/   # Downloaded artifacts
├── grekt.yaml          # Config
└── grekt.lock          # Lockfile
```

## Examples

```bash
grekt init          # Interactive
grekt init --yes    # Defaults
```

## Notes

- Won't overwrite existing files
- Change config later with `grekt config`
- If a `.gitignore` exists, `.grekt` will be added automatically. If no `.gitignore` is found, a warning will suggest adding it manually

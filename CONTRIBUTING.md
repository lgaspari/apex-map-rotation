# Contributing

Thank you for contributing to Apex Legends - Map Rotation. Setup and development workflow are documented in [README.md](README.md).

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/) with a lowercase type prefix and subject.

### Format

```
type: short imperative summary
```

Add an optional body when the change needs extra context (blank line between subject and body).

### Types used in this repo

| Type | When |
|------|------|
| `feat` | New user-facing behavior |
| `fix` | Bug fix |
| `chore` | Tooling, deps, ESLint, config |
| `ci` | GitHub Actions, Lighthouse CI, pipelines |
| `docs` | README and documentation only |
| `refactor` | Code change without behavior change |
| `build` | Build/bundling (e.g. Vite, prefetch) |
| `test` | Tests only |

### Examples

```
chore: add eslint-plugin-jsx-a11y and fix violations
ci: add advisory Lighthouse CI for perf, a11y, and PWA metrics
docs: update README for pnpm workflow and CI/CD
fix: correct time remaining rendering value
```

### Avoid

- Missing type prefix (`Add eslint-plugin…` → `chore: add eslint-plugin…`)
- Capitalized subject after the colon (`ci: Add …` → `ci: add …`)
- Past tense (`added`, `fixed`) — use imperative mood (`add`, `fix`)

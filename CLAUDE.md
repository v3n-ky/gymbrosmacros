@AGENTS.md

# Before committing

Always run the full test suite before committing. Both unit tests and e2e tests must pass:

```
npm test           # vitest unit tests (must be 0 failures)
npm run test:e2e   # Playwright e2e tests (must be 0 failures, skips are ok)
```

Do not commit if either suite has failures. Fix the failures first.

# .husky/pre-commit
#!/bin/sh
pnpm install --frozen-lockfile || exit 1

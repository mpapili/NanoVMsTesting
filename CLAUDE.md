# NanoVMs Project

## Project Overview
- Runtime: `ops` CLI (NanoVMs unikernel tool)
- Test apps live in `test-apps/`
- Utility scripts live in `utils/`
- Node.js demo: `hi.js` on port 8083
- Go demo: `test-apps/go-hello/` on port 8080
- Never modify README.md without asking first
- Always verify with `ops image list` after a build

## Host OS Policy

**Base OS: Fedora 42/43. Only Docker is installed. Keep it that way.**

- NEVER install language runtimes, compilers, interpreters, or build tools on the host (no `dnf install golang`, no `pip install`, no `npm install -g`, etc.)
- ALL language-specific build steps MUST use Docker
- Use official language images (e.g. `golang:1.21-alpine`, `node:20`, `python:3.12-slim`) as throwaway build containers
- Build artifacts (static binaries, bundles) are copied out of the container to the host
- The container is discarded after the build — no named containers, no volumes left behind

### Standard Docker build pattern
```bash
docker run --rm \
  -v "$(pwd):/app:Z" \
  -w /app \
  <image> \
  <build command>
```

> **Fedora SELinux note:** Always use `:Z` (not `:z`) on volume mounts. `:Z` relabels the directory as private to the container, which is required on Fedora with SELinux enforcing.

### Go static binary example
```bash
docker run --rm \
  -v "$(pwd):/app:Z" \
  -w /app \
  golang:1.21-alpine \
  sh -c "CGO_ENABLED=0 GOOS=linux go build -o go-hello ."
```

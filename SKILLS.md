# Claude Code Skills for NanoVMs

Skills are prompt templates stored in `~/.claude/skills/`. Invoke with a slash command (e.g., `/ops-deploy`). The `$ARGUMENTS` placeholder receives everything typed after the command name.

```bash
mkdir -p ~/.claude/skills
# write a skill file, then invoke it:
/my-skill some-argument
```

---

## Skills for Documentation

### `/ops-new-go-app` — Scaffold a new Go test app

```markdown
Create a new Go test app named $ARGUMENTS in test-apps/$ARGUMENTS/:
1. mkdir -p test-apps/$ARGUMENTS
2. Write main.go with a /hello HTTP handler on port 8080
3. Write go.mod with module name $ARGUMENTS and go 1.21
4. Tell the user to run /ops-deploy $ARGUMENTS when ready
```

---

## Skills for Operations

### `/ops-deploy` — Build and run a unikernel app

Installed at `~/.claude/skills/ops-deploy.md`.

```markdown
Deploy a NanoVMs test app end-to-end. The app name is provided in $ARGUMENTS.

1. Build via Docker:
   docker run --rm \
     -v "/home/mike/Coding/NanoVMs/test-apps/$ARGUMENTS:/app:Z" \
     -w /app golang:1.21-alpine \
     sh -c "CGO_ENABLED=0 GOOS=linux go build -o $ARGUMENTS ."

2. Verify binary is static:
   file test-apps/$ARGUMENTS/$ARGUMENTS

3. Run the unikernel:
   ops run test-apps/$ARGUMENTS/$ARGUMENTS -p 8080 &

4. Test the endpoint:
   curl -s localhost:8080/hello

5. Report success or show ops instance logs on failure.
```

Usage: `/ops-deploy go-hello`

### `/ops-clean` — Remove local packages and images

```markdown
Clean all local NanoVMs ops state:
1. rm -rf ~/.ops/packages/*
2. rm -rf ~/.ops/local_packages/*
3. Confirm with: ops image list
```

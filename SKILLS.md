# Claude Code Skills for NanoVMs

This file demonstrates how **Claude Code skills** integrate with this project to speed up common `ops` workflows.

## What are Claude Code Skills?

Skills are reusable prompt templates stored in `~/.claude/skills/`. You invoke them with a slash command (e.g., `/ops-deploy`). Claude Code expands the skill into a full prompt with your project context already loaded.

Think of them as project-aware macros that combine:
- Your CLAUDE.md project context
- Parameterized instructions
- Repeatable multi-step workflows

---

## Live Skill: `/ops-deploy`

**This skill is real and installed** at `~/.claude/skills/ops-deploy.md`.

It handles the full lifecycle for any Go test app in `test-apps/`:
1. Builds a static binary via Docker (`golang:1.21-alpine`, `CGO_ENABLED=0`, `:Z` SELinux flag)
2. Boots the unikernel with `ops run`
3. Curls `/hello` to verify it's alive
4. Shows instance logs on failure

**Try it:**
```
/ops-deploy go-hello
```

**Skill definition** (`~/.claude/skills/ops-deploy.md`):
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

---

## Why Skills + CLAUDE.md = Powerful Combo

| Without Skills | With Skills |
|---|---|
| Re-explain context every session | CLAUDE.md carries persistent project context |
| Type out long `ops` commands manually | One-word slash commands trigger full workflows |
| Forget exact flags and sequences | Skills encode the correct procedure once |
| Copy-paste from README | Claude reads README + runs skill in one step |

The key insight: **CLAUDE.md handles the "what is this project" layer, skills handle the "how do I do X in this project" layer.** Together they make Claude Code feel like a team member who already knows the codebase.

---

## Setting Up Skills

```bash
# 1. Create the directory (already done on this machine)
mkdir -p ~/.claude/skills

# 2. Write a skill file — plain Markdown, natural language instructions
nano ~/.claude/skills/my-skill.md

# 3. Invoke it
/my-skill some-argument
```

Skills live in `~/.claude/skills/` (global, not per-project). The `$ARGUMENTS` placeholder receives everything typed after the slash command name.

---

## Other Skill Ideas for This Project

### `/ops-clean` — Nuke local packages and images

```markdown
Clean all local NanoVMs ops state:
1. rm -rf ~/.ops/packages/*
2. rm -rf ~/.ops/local_packages/*
3. Confirm with: ops image list
```

### `/ops-new-go-app` — Scaffold a new Go test app

```markdown
Create a new Go test app named $ARGUMENTS in test-apps/$ARGUMENTS/:
1. mkdir -p test-apps/$ARGUMENTS
2. Write main.go with a /hello HTTP handler on port 8080
3. Write go.mod with module name $ARGUMENTS and go 1.21
4. Tell the user to run /ops-deploy $ARGUMENTS when ready
```

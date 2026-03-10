# Running a Go Web Server on NanoVMs

This example walks through building and running a simple Go HTTP server as a NanoVMs unikernel using `ops`.

## The App

`test-apps/go-hello/main.go` — a minimal HTTP server with a `/hello` endpoint:

```go
package main

import (
    "fmt"
    "log"
    "net/http"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintln(w, "Hello from the Unikernel!")
}

func main() {
    http.HandleFunc("/hello", helloHandler)
    log.Println("Server listening on :8080")
    http.ListenAndServe("0.0.0.0:8080", nil)
}
```

## Step 1: Build the Go Binary

Go unikernels are statically compiled — `ops` needs the binary, not source.

Per the project policy in `CLAUDE.md`, we never install Go (or any language toolchain) on the host. Build via Docker instead:

```bash
cd test-apps/go-hello
docker run --rm \
  -v "$(pwd):/app:Z" \
  -w /app \
  golang:1.21-alpine \
  sh -c "CGO_ENABLED=0 GOOS=linux go build -o go-hello ."
```

- `CGO_ENABLED=0` — fully static binary, no libc dependency (required for unikernels)
- `:Z` — Fedora SELinux requires this on bind mounts
- The binary is written back to your host directory by Docker

## Step 2: Run It Directly with ops (quick test)

```bash
ops run go-hello -p 8080
```

Test it:
```bash
curl localhost:8080/hello
# Hello from the Unikernel!
```

## Step 3: Create a Persistent Image

```bash
ops image create go-hello -i go-hello-app
ops image list
```

## Step 4: Launch an Instance

```bash
ops instance create go-hello-app -p 8080
```

Test it:
```bash
curl localhost:8080/hello
# Hello from the Unikernel!
```

## Step 5: Inspect and Clean Up

```bash
# List running instances
ops instance list

# View logs (use the NAME column from instance list)
ops instance logs <instance-name>

# Kill the instance (use the host PID from instance list)
kill -9 <pid>
```

## Why Static Binaries Matter

NanoVMs unikernels boot directly into your application — there is no OS userspace, no libc, no dynamic linker. A statically compiled Go binary is self-contained and maps perfectly to this model.

Go's standard library includes its own HTTP stack, so `net/http` works out of the box inside a unikernel with zero extra packages.

## Comparison: Node.js vs Go on NanoVMs

| | Node.js (`hi.js`) | Go (`go-hello`) |
|---|---|---|
| Package source | `ops pkg from-docker node:20` | No package needed |
| Binary type | Dynamic (needs node runtime pkg) | Static (single binary) |
| Image creation | `ops image create --package node_20` | `ops image create go-hello` |
| Startup | Slightly heavier | Near-instant |
| Port | 8083 | 8080 |

Go's static binary model makes it one of the most natural fits for unikernel deployment.

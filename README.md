# NanoVMs Experiment Documentation

<details open>
<summary><strong>📖 Quick Overview</strong></summary>

This document summarizes an experiment with NanoVMs' `ops` tool, demonstrating how to:
- Create a reusable package from a Docker image (`node:20`)
- Fuse that package with an application (`hi.js`) to create a bootable unikernel image
- Launch an instance of the image and test it
- Manage resources and explore the immutable filesystem

</details>

## 🔧 Turning a Docker Image into an Ops Package

To avoid installing binaries and build tools on the host OS, we use the official Node.js Docker image.

### Testing: Run `node` from within the `node:20` ops package
```bash
ops pkg from-docker node:20 --file node
```
Ops pulls `node:20` from DockerHub, identifies the Node binary and its dependencies, and creates a local package named `node-20` that runs instantly.

**Note:** This does not create a "base image." Unikernels are immutable; the application and filesystem are baked into a single entity at creation.

---

## 🏗️ Building and Storing a `hi.js` Example

### 1. Extract the Package from Docker
```bash
# Extract the package
ops pkg from-docker node:20 --file /usr/local/bin/node

# Verify the package exists locally
ops pkg list --local
```
Now we have a package named `node:20` containing only the Node binary and its runtime dependencies.

### 2. Fuse the Local Package with `hi.js`
```bash
# Create the unikernel image
ops image create -l --package node_20 -a hi.js -i my-node-app

# Verify the image
ops image list
```

---

## 🚀 Creating an Instance of the `hi.js` Application

Our script `hi.js` is fused with the Node.js package into the image `my-node-app`. We can now run it as an instance.

```bash
ops instance create my-node-app -p 8083
```

### Test the Instance
```bash
curl localhost:8083
```
Output:
```
Hello from the Unikernel!
```

---

## 📋 Managing Resources with a Running Instance

<details>
<summary><strong>Instance Operations</strong></summary>

```bash
# List all instances
ops instance list

# View logs for a specific instance (use the NAME from the list)
ops instance logs <instance-name>

# Stop the instance using its host PID (not an ops command)
kill -9 <pid>
```

</details>

---

## 🧹 Cleaning NanoVMs Ops Packages

### Remove Downloaded Packages
```bash
rm -rf ~/.ops/packages/*
```

### Remove Locally-built Packages (e.g., from Docker binaries)
```bash
rm -rf ~/.ops/local_packages/*
```

---

## 📚 Understanding `pkg`, `image`, and `instance`

<details>
<summary><strong>Concept Summary</strong></summary>

- **`pkg`**: A reusable collection of raw dependencies (e.g., a language runtime and shared libraries).
- **`image`**: The final, immutable, bootable virtual machine disk that permanently fuses those dependencies with your application code.
- **`instance`**: A running instantiation of an image.

</details>

---

## 🔍 Navigating an Immutable Disk Image’s Filesystem

Unikernels use the **TFS (Tiny File System)**. To explore the filesystem without booting, use `ops`’ built-in TFS tooling.

### Explore the Root Filesystem
```bash
ops image tree my-node-app
```
This prints a minimal filesystem tree of the image.

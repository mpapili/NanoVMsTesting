# NanoVms Testing

## Turning a Docker Image into an Ops Package

I don't want to muddy my host-OS with binaries and build tools and such.

Let's just use the official NodeJs Image!

### Testing it out - run 'node' from within node:20 ops-package
```bash
ops pkg from-docker node:20 --file node
```

Ops pulled node:20 from DockerHub, found the node binary and its dependencies, and created a local `ops` package named node-20 which ran instantly.

This DOES NOT create a 'base image' of some kind. Unikernels are immutable. You don't boot the image and THEN pass it stuff to run, the 'stuff to run' is BAKED IN. The app and FS are a single entity.

### Building and storing a 'hi.js' example using node-20

Extract the package from Docker:
```bash
# extract
ops pkg from-docker node:20 --file /usr/local/bin/node
# verify
ops pkg list --local
```
-now we have a package named node:20 which JUST contains the node binary and what's
needed to run it we can **fuse** the local package with 'hi.js'

```bash
# create the IMAGE
ops image create -l --package node_20 -a hi.js -i my-node-app
# verify 
ops image list
```

## Creating an "instance" of our 'hi.js' application using our IMAGE

Our script 'hi.js' was fused with our package containing the binary/requirements from `node.js` and was named 'my-node-app'. Now we should be able to run it.

```bash
ops instance create my-node-app -p 8083
```

test it...

```bash
curl localhost:8083
### Hello from the Unikernel!
```

woah very cool!

## Some ops resource actions with a running instance

```bash
# find your instance
ops instance list
# show logs with your instance ID (this is "NAME")
ops instance logs <instance-name>
# kill your instance WITH THE PID WHICH IS ACTUALLY YOUR HOST PID 
kill -9 <pid> # !!!!!
```

## Clean Slating NanoVMs Ops Packages

Just nuke the packages dir

Downloaded:
```bash
rm -rf ~/.ops/packages/*
```

Locally-built (example: Docker binaries):
```bash
rm -rf ~/.ops/local_packages/*
```
## pkg vs images vs instances

A pkg is a reusable collection of raw dependencies (like a language runtime and its shared libraries), while an img is the final, immutable, bootable virtual machine disk that permanently fuses those dependencies together with your actual application code.

An `instance` on the other than is a 

## Navigate an immutable disk image's filesystem

Unikernels use a custom optimized filesystem called TFS (Tiny File System) so you can't
just mount them, so `ops` has some built-in TFS tooling to peek inside our filesystem
without ever having to boot it.

### Exploring root fs

```bash
ops image tree my-node-app
```
--> you should see something VERY small that prints out a filesystem tree!



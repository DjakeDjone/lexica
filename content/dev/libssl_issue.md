# Bug Fix Guide: RocksDB Compilation Error on Ubuntu Server

## Issue

When running `cargo r --release` on Ubuntu server, compilation fails with:

```bash
error: failed to run custom build command for `librocksdb-sys v0.17.3+10.4.2`
thread 'main' panicked at lib.rs:616:27:
Unable to find libclang: "couldn't find any valid shared libraries matching: ['libclang.so', 'libclang-*.so', 'libclang.so.*', 'libclang-*.so.*']"
```


## Root Cause

The `rocksdb` crate depends on `librocksdb-sys`, which uses `bindgen` to generate Rust bindings from C++ code. This process requires `libclang` to be installed on the system, but it's missing from the server.

## Solution

### Step 1: Install Required Dependencies

On Ubuntu/Debian systems, install the necessary build tools:

```bash
sudo apt update
sudo apt install libclang-dev
```

### Step 2: Install additional deps if needed

```bash
sudo apt install clang llvm-dev build-essential
```

now it should work!
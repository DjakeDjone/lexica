# Linux Cheatsheet (Ubuntu/Debian)

### Current Path

```bash
pwd
```

### Print File

```bash
cat filename
```

with options:

- `-n` : number all output lines
- `-b` : number non-blank output lines
- `-s` : squeeze multiple adjacent blank lines

### Print First 10 Lines of File

```bash
head filename
```

with options:

- `-n N` : print first N lines
- `-c N` : print first N bytes
- `-q` : do not print headers
- `-v` : always print headers
- `-f` : print all lines and keep file open for new lines (like `tail -f`)

### Free Storage

```bash
df -h
```
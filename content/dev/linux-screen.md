# Linux Screen

The `screen` command is helpful to keep terminal sessions running in the background, even after logging out.

## Usage

To join an existing screen session or create a new one, use:

```bash
screen -R session_name
```

## Delete a Screen Session
To delete a screen session, first list all active sessions with:

```bash
screen -ls
```

Then, to terminate a specific session, use:

```bash
screen -X -S session_name quit
```

- `-X`: sends a command to the specified screen session
- `-S`: specifies the session name to target
- `quit`: command to terminate the session

or alternative method is to reattach to the session and exit from within:

```bash
screen -r session_name
exit
```
This will also close the session properly.

## Detach from a Screen Session
To detach from a screen session without terminating it, press:

```
Ctrl + A, then D
```

This will leave the session running in the background, allowing you to reattach later.


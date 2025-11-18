# Distro Hopping

## Saving Home Files and GIT Repositories

Um besser OS zu wechseln habe ich ein Script geschriben, welches alle Files im Home ordner zipt und alle GIT repos in einem Textfile speichert, damit man diese später wieder klonen kann.

### Download Script

<!-- [script](/scripts/distro-hopping.sh) -->
::download-link
---
link: /scripts/distro-hopping.sh
---
Distro Hopping Script herunterladen
::

> ## Note
> The script will ignore certain directories like `Downloads`, `Videos`, `Pictures`, `Music`, and `Documents` to avoid unnecessary large files. Migrate these files manually if needed.

## Setting Up File Structure

::download-link
---
link: /scripts/init-file-structure.sh
---
Init File Structure Script herunterladen
::

### Usage

Create a file with your desired file structure:

```
- school
- dev
   - frontend
   - backend
   - fullstack
   - mobile
   - scripts
- lexica
- tmp
```

> How many spaces one hiarchy represent is up to you, the script counts the change in whitespace to determine nesting levels.

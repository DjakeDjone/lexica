# Cheats

## Find&Replace image paths

nuxt wants the images in the 'public' folder, so we need to change the paths in the markdown files

Find: `!\[(.*?)\]\((?=[^/])`
Replace: `$0/images/`
(only if the path does not start with a /)

#!/bin/bash

# Script to add clipboard image to /public/images

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Target directory for images
TARGET_DIR="$SCRIPT_DIR/public/images"

# Ask user for filename
read -p "Enter filename (without extension): " filename

# Validate filename
if [ -z "$filename" ]; then
    echo "Error: Filename cannot be empty"
    exit 1
fi

# Ensure target directory exists
if [ ! -d "$TARGET_DIR" ]; then
    echo "Error: Target directory $TARGET_DIR does not exist"
    exit 1
fi

# Try to save image from clipboard
# First try wl-paste (Wayland), then xclip (X11)
if command -v wl-paste &> /dev/null; then
    wl-paste > "$TARGET_DIR/$filename.png" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "Image saved to $TARGET_DIR/$filename.png"
        # Copy markdown syntax to clipboard
        markdown_text="![alt text](/images/$filename.png)"
        echo -n "$markdown_text" | wl-copy
        echo "Markdown copied to clipboard: $markdown_text"
    else
        echo "Error: Failed to paste image from clipboard (Wayland)"
        exit 1
    fi
elif command -v xclip &> /dev/null; then
    xclip -selection clipboard -t image/png -o > "$TARGET_DIR/$filename.png" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "Image saved to $TARGET_DIR/$filename.png"
        # Copy markdown syntax to clipboard
        markdown_text="![alt text](/images/$filename.png)"
        echo -n "$markdown_text" | xclip -selection clipboard
        echo "Markdown copied to clipboard: $markdown_text"
    else
        echo "Error: Failed to paste image from clipboard (X11)"
        exit 1
    fi
else
    echo "Error: No clipboard manager found. Please install 'wl-paste' (Wayland) or 'xclip' (X11)"
    exit 1
fi

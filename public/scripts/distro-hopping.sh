#!/bin/bash

# ==============================================================================
# DISTRO HOPPING BACKUP SCRIPT (v4)
# ==============================================================================
# 1. Recursively finds git repos (saves as: /abs/path https://remote.url).
# 2. Zips visible folders + .ssh.
# 3. Excludes contents of git repos, Downloads, and specified junk.
# 4. Supports modes: terminal, zip-files, installed-apps, or all (default)
# ==============================================================================

# --- PARSE MODE ---
MODE="all"
if [ $# -gt 0 ]; then
    MODE="$1"
fi

case "$MODE" in
    terminal|zip-files|installed-apps|all)
        ;;
    *)
        echo "Usage: $0 [MODE]"
        echo "Modes:"
        echo "  terminal        - Export shell histories only"
        echo "  zip-files       - Zip home folder and find git repos"
        echo "  installed-apps  - Export list of installed packages"
        echo "  all            - Run all modes (default)"
        exit 1
        ;;
esac

# --- CONFIGURATION ---
SOURCE_DIR="$HOME"
BACKUP_DEST="/tmp/distro_hop_backup"

TIMESTAMP=$(date +"%Y%m%d_%H%M")
REPO_LIST_FILE="${BACKUP_DEST}/git_repos_list_${TIMESTAMP}.txt"
ZIP_FILE="${BACKUP_DEST}/home_backup_${TIMESTAMP}.zip"
EXCLUDE_TEMP_FILE="${BACKUP_DEST}/.temp_zip_excludes"

mkdir -p "$BACKUP_DEST"

# --- HELPER FUNCTIONS ---

export_terminal_history() {
    echo "[*] Exporting shell histories..."
    SHELL_HISTORY_DIR="${BACKUP_DEST}/shell_histories_${TIMESTAMP}"
    mkdir -p "$SHELL_HISTORY_DIR"
    # Bash history
    if [ -f "$HOME/.bash_history" ]; then
        cp "$HOME/.bash_history" "$SHELL_HISTORY_DIR/bash_history"
        echo "    - Bash history saved"
    fi
    # Fish history
    if [ -f "$HOME/.local/share/fish/fish_history" ]; then
        cp "$HOME/.local/share/fish/fish_history" "$SHELL_HISTORY_DIR/fish_history"
        echo "    - Fish history saved"
    fi
    # Zsh history
    if [ -f "$HOME/.zsh_history" ]; then
        cp "$HOME/.zsh_history" "$SHELL_HISTORY_DIR/zsh_history"
        echo "    - Zsh history saved"
    fi
    echo "Shell histories saved to: $SHELL_HISTORY_DIR"
}

export_installed_apps() {
    echo "[*] Exporting list of installed packages..."
    PACKAGE_LIST_FILE="${BACKUP_DEST}/installed_packages_${TIMESTAMP}.txt"
    {
        echo "=== APT PACKAGES ==="
        if command -v apt &> /dev/null; then
            dpkg --get-selections
        else
            echo "APT not available."
        fi
        echo ""
        echo "=== SNAP PACKAGES ==="
        if command -v snap &> /dev/null; then
            snap list
        else
            echo "Snap not available."
        fi
        echo ""
        echo "=== FLATPAK PACKAGES ==="
        if command -v flatpak &> /dev/null; then
            flatpak list
        else
            echo "Flatpak not available."
        fi
    } > "$PACKAGE_LIST_FILE"
    if [ $? -eq 0 ]; then
        echo "Package list saved to: $PACKAGE_LIST_FILE"
    else
        echo "Failed to save package list."
    fi
}

zip_files() {
    echo "[*] Starting file compression and git repo scan..."
    
    if ! command -v zip &> /dev/null; then
        echo "Error: 'zip' is not installed."
        exit 1
    fi

    cd "$SOURCE_DIR" || exit

    : > "$REPO_LIST_FILE"
    : > "$EXCLUDE_TEMP_FILE"

    # --- GENERATING EXCLUDES (USER DEFINED) ---
    echo "Downloads/*" >> "$EXCLUDE_TEMP_FILE"
    echo "Pictures/*" >> "$EXCLUDE_TEMP_FILE"
    echo "Videos/*" >> "$EXCLUDE_TEMP_FILE"
    echo "*/node_modules/*" >> "$EXCLUDE_TEMP_FILE"
    echo "*/venv/*" >> "$EXCLUDE_TEMP_FILE"
    echo "*/.venv/*" >> "$EXCLUDE_TEMP_FILE"
    echo "VirtualBox VMs/*" >> "$EXCLUDE_TEMP_FILE"
    echo "vmware/*" >> "$EXCLUDE_TEMP_FILE"
    echo "snap/*" >> "$EXCLUDE_TEMP_FILE"
    echo "miniconda3/*" >> "$EXCLUDE_TEMP_FILE"
    echo "*.db" >> "$EXCLUDE_TEMP_FILE"
    echo "*.iso" >> "$EXCLUDE_TEMP_FILE"
    echo "*.tar.gz" >> "$EXCLUDE_TEMP_FILE"
    echo "*.zip" >> "$EXCLUDE_TEMP_FILE"
    echo "pt/*" >> "$EXCLUDE_TEMP_FILE"
    echo "go/*" >> "$EXCLUDE_TEMP_FILE"
    echo "Applications/*" >> "$EXCLUDE_TEMP_FILE"
    echo "Android/*" >> "$EXCLUDE_TEMP_FILE"

    # --- FINDING GIT REPOS ---
    echo "[*] Scanning for git repositories recursively..."

    find . -type d -name ".git" -prune | while read -r gitdir; do
        repo_root=$(dirname "$gitdir")
        clean_path="${repo_root#./}"
        abs_path="$(pwd)/$clean_path"
        
        git_url=$(git -C "$repo_root" config --get remote.origin.url)
        if [ -z "$git_url" ]; then git_url="NO_REMOTE_ORIGIN"; fi

        # Log repo
        echo "$abs_path $git_url" >> "$REPO_LIST_FILE"

        # Add to exclude patterns
        echo "$clean_path/*" >> "$EXCLUDE_TEMP_FILE"
        echo "$clean_path/.*" >> "$EXCLUDE_TEMP_FILE"
    done

    # --- ZIPPING ---
    echo "[*] Compressing files..."

    FILES_TO_ZIP="*"
    if [ -d ".ssh" ]; then
        FILES_TO_ZIP="$FILES_TO_ZIP .ssh"
    fi
    if [ -f ".zshrc" ]; then
        FILES_TO_ZIP="$FILES_TO_ZIP .zshrc"
    fi
    if [ -f ".zsh_history" ]; then
        FILES_TO_ZIP="$FILES_TO_ZIP .zsh_history"
    fi
    if [ -d ".config/fish" ]; then
        FILES_TO_ZIP="$FILES_TO_ZIP .config/fish"
    fi
    if [ -f ".zprofile" ]; then
        FILES_TO_ZIP="$FILES_TO_ZIP .zprofile"
    fi
    if [ -d ".oh-my-zsh" ]; then
        FILES_TO_ZIP="$FILES_TO_ZIP .oh-my-zsh"
    fi

    # shellcheck disable=SC2086
    zip -r -y "$ZIP_FILE" $FILES_TO_ZIP -x@$EXCLUDE_TEMP_FILE > /dev/null

    rm "$EXCLUDE_TEMP_FILE"

    # Copy browser data
    echo "[*] Copying browser data..."
    BROWSER_BACKUP_DIR="${BACKUP_DEST}/browser_data_${TIMESTAMP}"
    mkdir -p "$BROWSER_BACKUP_DIR"
    if [ -d "$HOME/.mozilla/firefox" ]; then
        cp -r "$HOME/.mozilla/firefox" "$BROWSER_BACKUP_DIR/"
    fi
    if [ -d "$HOME/.config/zen" ]; then
        cp -r "$HOME/.config/zen" "$BROWSER_BACKUP_DIR/"
    fi

    echo "Git repos list: $REPO_LIST_FILE"
    echo "Zip file: $ZIP_FILE"
}

# --- MAIN EXECUTION ---
echo "--------------------------------------------------"
echo "DISTRO HOPPING BACKUP - MODE: $MODE"
echo "Source: $SOURCE_DIR"
echo "Output: $BACKUP_DEST"
echo "--------------------------------------------------"

case "$MODE" in
    terminal)
        export_terminal_history
        ;;
    zip-files)
        zip_files
        ;;
    installed-apps)
        export_installed_apps
        ;;
    all)
        zip_files
        export_installed_apps
        export_terminal_history
        ;;
esac

echo "--------------------------------------------------"
echo "Backup Complete!"
echo "--------------------------------------------------"
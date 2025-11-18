#!/bin/bash

# ==============================================================================
# DISTRO HOPPING BACKUP SCRIPT (v3)
# ==============================================================================
# 1. Recursively finds git repos (saves as: /abs/path https://remote.url).
# 2. Zips visible folders + .ssh.
# 3. Excludes contents of git repos, Downloads, and specified junk.
# ==============================================================================

# --- CONFIGURATION ---
SOURCE_DIR="$HOME"
BACKUP_DEST="/tmp/distro_hop_backup"

TIMESTAMP=$(date +"%Y%m%d_%H%M")
REPO_LIST_FILE="${BACKUP_DEST}/git_repos_list_${TIMESTAMP}.txt"
ZIP_FILE="${BACKUP_DEST}/home_backup_${TIMESTAMP}.zip"
EXCLUDE_TEMP_FILE="${BACKUP_DEST}/.temp_zip_excludes"

mkdir -p "$BACKUP_DEST"

# --- 1. PREPARATION ---
echo "--------------------------------------------------"
echo "Starting Backup..."
echo "Source: $SOURCE_DIR"
echo "Output: $ZIP_FILE"
echo "--------------------------------------------------"

if ! command -v zip &> /dev/null; then
    echo "Error: 'zip' is not installed."
    exit 1
fi

cd "$SOURCE_DIR" || exit

: > "$REPO_LIST_FILE"
: > "$EXCLUDE_TEMP_FILE"

# --- 2. GENERATING EXCLUDES (USER DEFINED) ---

# Exclude the Downloads folder contents (Keep the folder, empty the files)
echo "Downloads/*" >> "$EXCLUDE_TEMP_FILE"
# also exclude 'Pictures' and 'Videos' if desired
echo "Pictures/*" >> "$EXCLUDE_TEMP_FILE"
echo "Videos/*" >> "$EXCLUDE_TEMP_FILE"

# --- OPTIONAL: UNCOMMENT TO EXCLUDE MORE JUNK ---
# Exclude Node.js modules (recursive) - Reinstall with 'npm install'
echo "*/node_modules/*" >> "$EXCLUDE_TEMP_FILE"

# Exclude Python virtual environments (recursive) - They break between distros anyway
echo "*/venv/*" >> "$EXCLUDE_TEMP_FILE"
echo "*/.venv/*" >> "$EXCLUDE_TEMP_FILE"

# Exclude Snap folder (Visible folder in Home, but system specific)
echo "snap/*" >> "$EXCLUDE_TEMP_FILE"


# --- 3. FINDING GIT REPOS ---
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

# --- 4. ZIPPING ---
echo "[*] Compressing files..."

# Include all visible files (*) and explicitly .ssh
FILES_TO_ZIP="*"
if [ -d ".ssh" ]; then
    FILES_TO_ZIP="$FILES_TO_ZIP .ssh"
fi

# Zip command
# shellcheck disable=SC2086
zip -r -y "$ZIP_FILE" $FILES_TO_ZIP -x@"$EXCLUDE_TEMP_FILE" > /dev/null

# --- 5. CLEANUP ---
rm "$EXCLUDE_TEMP_FILE"

echo "--------------------------------------------------"
echo "Backup Complete!"
echo "1. Git List: $REPO_LIST_FILE"
echo "2. Zip File: $ZIP_FILE"
echo "--------------------------------------------------"
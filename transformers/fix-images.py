#!/usr/bin/env python3
import os
import shutil
import re

# --- Configuration ---
# WORKSPACE_ROOT should be the absolute path to your project's root directory.
# Adjust if the script is not located at the root of your workspace or if your structure differs.
WORKSPACE_ROOT = "/home/benjamin-f/Documents/school/lexica" 

PAGES_DIR = os.path.join(WORKSPACE_ROOT, "content")
PUBLIC_IMAGES_DIR = os.path.join(WORKSPACE_ROOT, "public", "images")
# Add other directories containing Markdown files if necessary
MARKDOWN_DIRS = [
    os.path.join(WORKSPACE_ROOT, "content"),
    # WORKSPACE_ROOT # To scan markdown files in the root, like README.md
]
IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".bmp", ".tiff"}
# --- End Configuration ---

moved_images_map = {}  # Stores {original_workspace_rel_path: new_web_path}

def is_image_file(filename):
    """Checks if a filename has a common image extension."""
    _, ext = os.path.splitext(filename)
    return ext.lower() in IMAGE_EXTENSIONS

def process_pages_folder():
    """Scans PAGES_DIR, moves images to PUBLIC_IMAGES_DIR, and records mappings."""
    if not os.path.isdir(PAGES_DIR):
        print(f"Error: Pages directory not found at {PAGES_DIR}")
        return

    os.makedirs(PUBLIC_IMAGES_DIR, exist_ok=True)
    print(f"Scanning {PAGES_DIR} for images...")

    for root, _, files in os.walk(PAGES_DIR):
        for filename in files:
            if is_image_file(filename):
                original_full_path = os.path.join(root, filename)
                
                # Relative path from WORKSPACE_ROOT, e.g., "pages/some_subdir/image.png"
                # This is what we'll search for in Markdown files.
                original_rel_path_from_workspace = os.path.relpath(original_full_path, WORKSPACE_ROOT)

                # Path relative to PAGES_DIR, e.g., "some_subdir/image.png"
                # This is used to generate the new filename.
                path_within_pages = os.path.relpath(original_full_path, PAGES_DIR)
                
                # Create new filename: replace path separators with underscores
                # e.g., "some_subdir/image.png" -> "some_subdir_image.png"
                new_image_basefilename = "_".join(path_within_pages.split(os.path.sep))
                
                new_target_full_path = os.path.join(PUBLIC_IMAGES_DIR, new_image_basefilename)
                
                # Handle potential filename collisions in the target directory
                counter = 0
                final_new_image_filename = new_image_basefilename
                final_new_target_full_path = new_target_full_path
                base, ext = os.path.splitext(new_image_basefilename)
                
                while os.path.exists(final_new_target_full_path):
                    counter += 1
                    final_new_image_filename = f"{base}_{counter}{ext}"
                    final_new_target_full_path = os.path.join(PUBLIC_IMAGES_DIR, final_new_image_filename)
                
                if original_full_path == final_new_target_full_path:
                    print(f"Skipping {original_full_path} as it would move to itself (already in public/images?).")
                    continue

                print(f"Found image: {original_full_path}")
                if counter > 0:
                    print(f"  Target filename existed, will use: {final_new_image_filename}")
                print(f"  Moving to: {final_new_target_full_path}")

                try:
                    shutil.move(original_full_path, final_new_target_full_path)
                    # The new web path will be relative to the public folder, e.g., "/images/new_name.png"
                    new_web_path = f"/images/{final_new_image_filename}"
                    moved_images_map[original_rel_path_from_workspace] = new_web_path
                    print(f"  Moved. Old ref: {original_rel_path_from_workspace}, New web ref: {new_web_path}")
                except Exception as e:
                    print(f"  Error moving {original_full_path} to {final_new_target_full_path}: {e}")

def update_markdown_files():
    """Updates image references in Markdown files based on moved_images_map."""
    print(f"\nUpdating Markdown files...")
    if not moved_images_map:
        print("No images were moved, so no Markdown files to update.")
        return

    for md_dir_path in MARKDOWN_DIRS:
        if not os.path.isdir(md_dir_path):
            print(f"Warning: Markdown directory not found at {md_dir_path}, skipping.")
            continue
        
        print(f"Scanning Markdown files in {md_dir_path}...")
        for root, _, files in os.walk(md_dir_path):
            for filename in files:
                if filename.endswith(".md"):
                    md_file_path = os.path.join(root, filename)
                    print(f"Processing {md_file_path}...")
                    try:
                        with open(md_file_path, 'r', encoding='utf-8') as f:
                            file_content_initial = f.read()
                        
                        current_processing_content = file_content_initial
                        
                        for old_workspace_path_from_root, new_web_path in moved_images_map.items():
                            old_absolute_path = os.path.join(WORKSPACE_ROOT, old_workspace_path_from_root)
                            md_file_directory = os.path.dirname(md_file_path)
                            
                            # Normalize paths to use forward slashes for matching in Markdown/HTML
                            path_relative_to_md = os.path.normpath(os.path.relpath(old_absolute_path, md_file_directory)).replace(os.sep, '/')
                            normalized_old_workspace_path = old_workspace_path_from_root.replace(os.sep, '/')

                            possible_current_paths_to_find = set()
                            if path_relative_to_md != ".": # Avoid using "." as a path
                                possible_current_paths_to_find.add(path_relative_to_md)
                            possible_current_paths_to_find.add(normalized_old_workspace_path)
                            possible_current_paths_to_find.add("/" + normalized_old_workspace_path)
                            
                            # Remove the target path itself if it accidentally got generated
                            if new_web_path in possible_current_paths_to_find:
                                possible_current_paths_to_find.remove(new_web_path)

                            for path_variant_in_md in possible_current_paths_to_find:
                                if not path_variant_in_md: # Skip empty strings
                                    continue

                                escaped_path_variant = re.escape(path_variant_in_md)
                                
                                # Markdown: ![alt](path) or ![alt](path "title")
                                # Negative lookahead to ensure the path is not already the new_web_path
                                # and does not already start with /images/ (our target structure)
                                markdown_pattern = rf'(!\[[^\]]*\]\()((?!{re.escape(new_web_path)}|/images/){escaped_path_variant})(\s*(?:\".*?\"|\'.*?\')?\s*)(\))'
                                current_processing_content = re.sub(markdown_pattern, rf'\1{new_web_path}\3\4', current_processing_content, flags=re.IGNORECASE)

                                # HTML: <img src="path">
                                # Negative lookahead for src attribute
                                html_pattern = rf'(<img\s+[^>]*?src=")((?!{re.escape(new_web_path)}|/images/){escaped_path_variant})(")'
                                current_processing_content = re.sub(html_pattern, rf'\1{new_web_path}\3', current_processing_content, flags=re.IGNORECASE)

                        if current_processing_content != file_content_initial:
                            with open(md_file_path, 'w', encoding='utf-8') as f:
                                f.write(current_processing_content)
                            print(f"  Updated {md_file_path}")
                        else:
                            print(f"  No changes needed for {md_file_path}")
                            
                    except Exception as e:
                        print(f"  Error processing {md_file_path}: {e}")

if __name__ == "__main__":
    print("Starting image migration script.")
    print(f"Workspace root configured as: {WORKSPACE_ROOT}")
    print(f"Pages directory: {PAGES_DIR}")
    print(f"Public images directory: {PUBLIC_IMAGES_DIR}")
    print(f"Markdown directories to scan: {MARKDOWN_DIRS}")
    print("\nIMPORTANT: Ensure you have backed up your 'pages' and 'content' directories (and any other Markdown locations) before proceeding.\n")
    
    # Basic check for WORKSPACE_ROOT and key directories
    if not os.path.exists(WORKSPACE_ROOT):
        print(f"CRITICAL ERROR: WORKSPACE_ROOT '{WORKSPACE_ROOT}' does not exist. Please configure it correctly in the script.")
    elif not os.path.exists(PAGES_DIR) and not os.path.exists(PUBLIC_IMAGES_DIR):
         print(f"Warning: Key directories PAGES_DIR ('{PAGES_DIR}') or PUBLIC_IMAGES_DIR ('{PUBLIC_IMAGES_DIR}') not found. This might be okay if they are created by the script or if pages dir is empty.")
    
    # Safety check: if script is not in WORKSPACE_ROOT, print a reminder
    script_dir = os.path.dirname(os.path.abspath(__file__))
    if script_dir != WORKSPACE_ROOT:
         print(f"Reminder: This script is located at '{script_dir}', but WORKSPACE_ROOT is set to '{WORKSPACE_ROOT}'.")
         print("Ensure WORKSPACE_ROOT is correctly configured for your project structure if you run this script from a different location than the project root.")

    process_pages_folder()
    update_markdown_files()
    
    print("\nScript finished.")
    if moved_images_map:
        print("Summary of moved images and their new web paths:")
        for old, new in moved_images_map.items():
            print(f"  - From: {old}  =>  To: {new}")
    else:
        print("No images were found in the pages directory to move, or no Markdown files required updates based on moved images.")

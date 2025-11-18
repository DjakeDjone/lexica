#!/bin/bash

FILE_STRUCTURE_PATH="$1"
BASE_PATH="./test"

if [ -z "$FILE_STRUCTURE_PATH" ]; then
    echo "Usage: $0 <file_structure_output_path>"
    exit 1
fi

NESTING_LEVEL=0
WHITESPACE_COUNT=0
CURRENT_PATH=""
LAST_FOLDERNAME=""
while IFS= read -r line || [ -n "$line" ]; do
    # Skip empty lines
    [ -z "$line" ] && continue
    # print line
    # check how much leading whitespace
    leading_whitespace="${line%%[^[:space:]]*}"
    whitespace_count=${#leading_whitespace}
    # remove '-' from beginning
    line="${line#*- }"

    if [ $whitespace_count -gt $WHITESPACE_COUNT ]; then
        NESTING_LEVEL=$((NESTING_LEVEL + 1))
        CURRENT_PATH="$CURRENT_PATH/$(basename "$LAST_FOLDERNAME" | xargs)"
    elif [ $whitespace_count -lt $WHITESPACE_COUNT ]; then
        NESTING_LEVEL=$((NESTING_LEVEL - 1))
        # remove last part of CURRENT_PATH
        CURRENT_PATH="${CURRENT_PATH%/*}"
    fi
    WHITESPACE_COUNT=$whitespace_count

    echo "Creating: $BASE_PATH/$CURRENT_PATH/$(basename "$line" | xargs)"
    mkdir -p "$BASE_PATH/$CURRENT_PATH/$(basename "$line" | xargs)"
    LAST_FOLDERNAME="$(basename "$line" | xargs)"

done < "$FILE_STRUCTURE_PATH"
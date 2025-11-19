#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
# this script automatically sends a word from the german_words.txt file as a notification

# allow argument -i for interval in seconds

INTERVAL=${2:-86400}  # 24 hours in seconds
FILE=${1:-german_words.txt}
if [ ! -f "$FILE" ]; then
    echo "File not found!"
    exit 1
fi

while true; do
    LINE=$(head -n 1 "$FILE" || true)
    if [ -z "$LINE" ]; then
        echo "No more words in '$FILE' — exiting."
        exit 0
    fi

    # remove first line from the file
    tmpfile=$(mktemp)
    trap 'rm -f "$tmpfile"' EXIT
    tail -n +2 "$FILE" > "$tmpfile" && mv "$tmpfile" "$FILE"

    WORD="${LINE%%:*}"
    if [ "$WORD" = "$LINE" ]; then
        MEANING=""
        EXAMPLE=""
    else
        rest="${LINE#*:}"
        if [[ "$rest" == *"::"* ]]; then
            MEANING="${rest%%::*}"
            EXAMPLE="${rest#*::}"
        else
            MEANING="$rest"
            EXAMPLE=""
        fi
    fi

    # notification
    curl -sS --fail \
        -H "Title: Word $WORD" \
        -H "Priority: 1" \
        -H "Content-Type: text/plain; charset=utf-8" \
        --data-binary "$MEANING\nExample: $EXAMPLE" \
        https://ntfy.sh/daily_german_word || echo "Failed to send notification."

    # word to past_words.txt
    echo "$(date +'%Y-%m-%d'): $LINE" >> past_words.txt

    # wait for the next interval
    sleep "$INTERVAL"
done
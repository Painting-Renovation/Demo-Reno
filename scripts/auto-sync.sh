#!/bin/bash
# Auto-sync script: commits all changes and pushes to GitHub
# Run this manually or via cron to keep the repo in sync

cd /home/z/my-project

# Add all changes (excluding .gitignore'd files)
git add -A

# Check if there are any changes to commit
if git diff --cached --quiet; then
    echo "[$(date)] No changes to commit. Repo is up to date."
    exit 0
fi

# Commit with timestamp
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
git commit -m "auto-sync: ${TIMESTAMP}" --allow-empty-message

# Push to origin
git push origin main 2>&1

if [ $? -eq 0 ]; then
    echo "[$(date)] Successfully pushed to GitHub."
else
    echo "[$(date)] ERROR: Push failed. Check token permissions."
    exit 1
fi

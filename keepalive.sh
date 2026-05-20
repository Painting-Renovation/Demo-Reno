#!/bin/bash
# Dev server script with auto-restart
# Uses production build for stability (Turbopack dev server crashes in sandbox)
cd /home/z/my-project

while true; do
  echo "=== Building... ===" >> dev.log
  rm -rf .next
  if bun run build >> dev.log 2>&1; then
    echo "=== Build OK, starting server ===" >> dev.log
    node .next/standalone/server.js >> dev.log 2>&1
    echo "=== Server died at $(date), restarting ===" >> dev.log
  else
    echo "=== Build FAILED at $(date), retrying ===" >> dev.log
  fi
  sleep 2
done

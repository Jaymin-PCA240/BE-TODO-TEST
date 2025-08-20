#!/bin/bash
set -e

echo "=== Stopping PM2 apps if running ==="
if command -v pm2 >/dev/null 2>&1; then
  if pm2 list | grep -q "node-app"; then
    pm2 stop node-app || true
    pm2 delete node-app || true
  fi
fi

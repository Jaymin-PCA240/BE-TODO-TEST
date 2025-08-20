#!/bin/bash
set -e

APP_DIR="/home/ec2-user/app"

echo "=== Starting Node.js server with PM2 ==="
cd $APP_DIR

# Ensure PM2 is installed
if ! command -v pm2 >/dev/null 2>&1; then
  npm install -g pm2
fi

# Start app fresh
pm2 start dist/index.js --name node-app
pm2 save

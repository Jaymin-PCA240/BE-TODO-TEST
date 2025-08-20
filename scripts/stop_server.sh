#!/bin/bash
set -xe

export PATH=$PATH:/usr/bin:/home/ec2-user/.npm-global/bin

# Stop app if running
pm2 describe todo > /dev/null 2>&1 && pm2 delete todo || true

# Restart proxy (so ALB health check still passes if app stops)
if ! pm2 describe proxy > /dev/null 2>&1; then
  pm2 start /var/www/todo/proxy_server.js --name proxy
fi

pm2 save

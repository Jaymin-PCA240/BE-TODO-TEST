#!/bin/bash
set -xe
export PATH=$PATH:/usr/bin:/home/ec2-user/.npm-global/bin

cd /var/www/todo

npx prisma migrate deploy --schema=prisma/schema.prisma

# Stop proxy if running
pm2 describe proxy > /dev/null 2>&1 && pm2 delete proxy || true

# Stop old app
pm2 describe todo > /dev/null 2>&1 && pm2 delete todo || true

# Load env vars
export $(grep -v '^#' .env | xargs)

# Start real app
pm2 start dist/index.js --name todo --watch

# Save PM2
pm2 save

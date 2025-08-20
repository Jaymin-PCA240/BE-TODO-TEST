#!/bin/bash
set -e

APP_DIR="/home/ec2-user/app"

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "=== Installing production dependencies ==="
cd $APP_DIR
npm ci --only=production

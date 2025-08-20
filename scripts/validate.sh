#!/bin/bash
set -e

curl -f http://localhost:80/health || exit 1

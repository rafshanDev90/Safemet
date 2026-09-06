#!/usr/bin/env bash
# ============================================================================
# SAFEMETE - cPanel production build & deploy bundle
#
# Builds all three apps and assembles a single uploadable folder at ./deploy
#
#   ./build-deploy.sh
#
# The output structure (deploy/) is what you upload to your cPanel host
# (see DEPLOYMENT.md for the full walkthrough).
# ============================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY="$ROOT/deploy"

echo "==> 1/4 Building public website (client)"
(cd "$ROOT/client" && npm install --no-audit --no-fund && npm run build)

echo "==> 2/4 Building admin panel (Safemete_Admin)"
(cd "$ROOT/Safemete_Admin" && npm install --no-audit --no-fund && npm run build)

echo "==> 3/4 Building API server"
(cd "$ROOT/server" && npm install --no-audit --no-fund && npm run build)

echo "==> 4/4 Assembling deploy bundle at $DEPLOY"
rm -rf "$DEPLOY"
mkdir -p "$DEPLOY"/{dist,data,uploads,client,admin}

# Server runtime (compiled TypeScript)
cp "$ROOT/server/package.json"     "$DEPLOY/package.json"
cp "$ROOT/server/package-lock.json" "$DEPLOY/package-lock.json" 2>/dev/null || true
cp -r "$ROOT/server/dist/."        "$DEPLOY/dist/"

# Data + uploads (start with what exists in the repo)
cp -r "$ROOT/server/data/."        "$DEPLOY/data/" 2>/dev/null || true
cp -r "$ROOT/server/uploads/."     "$DEPLOY/uploads/" 2>/dev/null || true
mkdir -p "$DEPLOY/uploads/products"

# Built frontends
cp -r "$ROOT/client/dist/."        "$DEPLOY/client/"
cp -r "$ROOT/Safemete_Admin/dist/." "$DEPLOY/admin/"

# Environment template
cp "$ROOT/server/.env.example"     "$DEPLOY/.env.example"

echo ""
echo "done. Upload the contents of  $DEPLOY  to your cPanel host."
echo "The absolute paths on the server will be configured via .env (see DEPLOYMENT.md)."
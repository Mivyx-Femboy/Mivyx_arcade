#!/usr/bin/env bash
# usage: bash scripts/stage-web.sh <out-dir> <platform> <version>
# Builds the little "web" folder that every app wraps: the live loader + a built-in offline copy of the hub.
set -e
OUT="$1"; PLATFORM="$2"; VER="$3"; REPO="${GITHUB_REPOSITORY:-Mivyx-Femboy/Mivyx_arcade}"
mkdir -p "$OUT"
cp mivyx-live.html "$OUT/index.html"
cp index.html "$OUT/hub-fallback.html"
cp icon-192.png icon-512.png manifest.webmanifest "$OUT/"
sed -i.bak "s|Mivyx-Femboy/Mivyx_arcade|$REPO|g; s|__SHELL_PLATFORM__|$PLATFORM|g; s|__SHELL_VERSION__|$VER|g" "$OUT/index.html"
rm -f "$OUT/index.html.bak"

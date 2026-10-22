#!/usr/bin/env bash
# Mivyx update:   bash update.sh "Exported Hub.html" "what changed" [release]
#  - copies your newest PUBLIC export over index.html
#  - commits + pushes  (GitHub Pages republishes in ~1 minute, every app picks it up on next launch)
#  - add the word  release  as 3rd argument to ALSO build new APK / EXE / Linux / iOS files
set -e
[ -n "$1" ] && cp "$1" index.html
if grep -Eq '<body[^>]*data-instance-type="admin"' index.html; then
  echo "STOP: index.html is the ADMIN file. In the hub use 'Export Single File (Public)' and try again."; exit 1
fi
VER=$(sed -n "s/.*HUB_VERSION='\([^']*\)'.*/\1/p" index.html | head -1)
git add -A
git commit -m "${2:-update $(date +%F)}" || echo "nothing new to commit"
git push
if [ "$3" = "release" ]; then
  [ -n "$VER" ] || { echo "Could not read HUB_VERSION from index.html"; exit 1; }
  git tag -f "v$VER" && git push -f origin "v$VER"
  echo "Release v$VER started - APK / EXE / Linux / iOS appear under Releases in ~10-15 minutes."
  echo "(Tip: raise HUB_VERSION in the hub file before each release so installed apps update themselves.)"
fi
echo "Done - live in about a minute."

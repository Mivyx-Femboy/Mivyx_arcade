#!/usr/bin/env python3
"""Checks base-songs.json: valid JSON, every entry has a url, and every music/ file really exists."""
import json, os, sys
try:
    data = json.load(open("base-songs.json", encoding="utf-8"))
except Exception as e:
    print("X base-songs.json is not valid JSON:", e); sys.exit(1)
if not isinstance(data, list):
    print("X base-songs.json must start with [ and end with ]"); sys.exit(1)
bad = 0
for i, s in enumerate(data, 1):
    if isinstance(s, list) and len(s) > 1:
        name, url = s[0], s[1]
    elif isinstance(s, dict):
        name, url = s.get("name", "?"), s.get("url", "")
    else:
        name, url = "?", ""
    if not url:
        print(f"X song {i} ({name}): missing url"); bad += 1
    elif not url.startswith(("http://", "https://")) and not os.path.isfile(url):
        print(f"X song {i} ({name}): file not found -> {url} (is it uploaded to the music/ folder? same spelling and capitals?)"); bad += 1
    else:
        print(f"OK song {i}: {name}")
print(f"{len(data)} song(s), {bad} problem(s)")
sys.exit(1 if bad else 0)

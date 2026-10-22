# First-time setup (about 10 minutes)

## 1. Put the files on GitHub
1. In the hub, click **📤 Export Single File (Public)**. Never upload the admin file.
2. On github.com click **New repository** (set it to **Public**).
3. **Add file → Upload files**, then drag in everything from this package, with your export **renamed to `index.html`**.
   Make sure the hidden folder `.github` and the file `.nojekyll` are included. If your browser hides them, upload them from the GitHub mobile site or use the command line.
4. **Settings → Pages → Deploy from a branch → `main` / root → Save.** Your site is `https://Mivyx-Femboy.github.io/Mivyx_arcade/` in about a minute.

## 2. Your repository name
Everything is already pointed at `Mivyx-Femboy/Mivyx_arcade`: the README links, `mivyx-live.html`, and the app builds. If you ever rename the repository, find and replace the old name in `README.md` and `mivyx-live.html` (✏️ edit, find and replace, commit).

## 3. Make the first release (builds the APK, EXE, Linux and iOS files)
Pick one:
- **Command line:** `bash update.sh "" "first release" release`
- **Browser:** repo → **Releases → Draft a new release →** type the tag `v2.0.0` (use your `HUB_VERSION`) **→ Create new tag → Publish release.**
- **Manual:** **Actions → Build apps → Run workflow.**

Watch it under **Actions**. After about 10 to 15 minutes the files appear on the **Releases** page and the download buttons in the README start working.

If the release step says it can't create a release: **Settings → Actions → General → Workflow permissions → Read and write → Save**, then run it again.

## 4. Android signing (optional, recommended)
Without a saved key, every build is signed with a new throw-away key. The APK still installs, but Android refuses to install a newer APK over an older one. You would have to uninstall first. (The hub inside the app updates on its own either way.)

To fix that once:
1. On a computer with Java: `keytool -genkeypair -v -keystore mivyx.keystore -alias mivyx -keyalg RSA -keysize 2048 -validity 10000`
2. Convert it to text: `base64 -w0 mivyx.keystore` (on a Mac: `base64 -i mivyx.keystore`).
3. Repo → **Settings → Secrets and variables → Actions → New repository secret**, add:
   - `ANDROID_KEYSTORE_BASE64` (the text from step 2)
   - `ANDROID_KEYSTORE_PASSWORD` (the password you chose)
   - `ANDROID_KEY_ALIAS` (`mivyx`)
4. Keep `mivyx.keystore` somewhere safe. Never upload it to the repo. (`.gitignore` already skips `*.keystore`.)

## 5. iPhone and iPad
- **Recommended:** Safari → your live site → Share → **Add to Home Screen**. No Apple developer account needed, and it updates itself.
- **Real app file:** the workflow also tries to build `Mivyx-Hub-unsigned.ipa`. It is best effort and can fail without stopping the other builds. It needs sideloading with AltStore or Sideloadly. A proper App Store or TestFlight build needs a paid Apple Developer account and signing keys.

## 6. Everyday use
| I want to… | Do this |
| --- | --- |
| Add or change games | Export Public → `bash update.sh "export.html" "message"` |
| Add songs | Edit `base-songs.json` and upload mp3s to `music/` (see the README) |
| Publish new app files | Raise `HUB_VERSION`, then add `release` to the update command |

## Troubleshooting
| Problem | Fix |
| --- | --- |
| Build is red and says "ADMIN hub" | `index.html` is the admin file. Export **Public** and upload that |
| Download button gives a 404 | The first release isn't finished yet, or the name in the links isn't your repo (step 2) |
| Android says "App not installed" | Uninstall the old Mivyx app, then install again (or do step 4) |
| Windows blocks the installer | More info → Run anyway |
| `mivyx-live.html` shows "Connect your GitHub repository" | Type `your-name/your-repo` once. It remembers |
| Site shows 404 | Settings → Pages must be on `main` / root. Wait a minute after saving |

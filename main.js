/* Mivyx Hub desktop shell.
   - serves the little "web" folder (live loader + offline copy) on a fixed local address, so the hub sees a normal http:// page
     (saves, YouTube music, service worker and GitHub updates all behave like the website)
   - the loader pulls the newest hub from GitHub on every start; electron-updater swaps the app itself when a new release exists */
const { app, BrowserWindow, shell, Menu } = require('electron');
const http = require('http'), fs = require('fs'), path = require('path');

const WEB = path.join(__dirname, 'web');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png',
  '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.css': 'text/css', '.mp3': 'audio/mpeg' };

function serve(port) {
  return new Promise((ok, no) => {
    const s = http.createServer((q, r) => {
      let p = decodeURIComponent(q.url.split('?')[0]);
      if (p === '/') p = '/index.html';
      const f = path.normalize(path.join(WEB, p));
      if (!f.startsWith(WEB + path.sep)) { r.writeHead(403); return r.end(); }
      fs.readFile(f, (e, d) => {
        if (e) { r.writeHead(404); return r.end('not found'); }
        r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
        r.end(d);
      });
    });
    s.once('error', no);
    s.listen(port, '127.0.0.1', () => ok(s));
  });
}
async function listen() { // fixed port = your saves stay in the same place every launch
  for (let p = 48127; p < 48137; p++) { try { await serve(p); return p; } catch (e) {} }
  throw new Error('No free local port');
}

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
if (!app.requestSingleInstanceLock()) app.quit();

let win;
app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
app.whenReady().then(async () => {
  const port = await listen();
  Menu.setApplicationMenu(null);
  win = new BrowserWindow({ width: 1280, height: 800, backgroundColor: '#0a0b16', autoHideMenuBar: true,
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true } });
  win.webContents.setWindowOpenHandler(({ url }) => { if (/^https?:/.test(url)) shell.openExternal(url); return { action: 'deny' }; });
  win.webContents.on('before-input-event', (e, i) => {
    if (i.type === 'keyDown' && i.key === 'F11') { win.setFullScreen(!win.isFullScreen()); e.preventDefault(); }
  });
  win.loadURL(`http://127.0.0.1:${port}/`);
  if (app.isPackaged) {
    try { require('electron-updater').autoUpdater.checkForUpdatesAndNotify().catch(() => {}); } catch (e) {}
  }
});
app.on('window-all-closed', () => app.quit());

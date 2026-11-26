// Erzeugt logo_weihnachten.png und logo_ostern.png aus cloudvibe_logo_slogan.png (Vorlage logo_saison.html)
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { pathToFileURL } from 'node:url';

const [logoPfad, zielOrdner] = process.argv.slice(2);
const hier = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1'));
const html = fs.readFileSync(path.join(hier, 'logo_saison.html'), 'utf8').replace("'LOGO'", "'data:image/png;base64," + fs.readFileSync(logoPfad).toString('base64') + "'");
const tmp = path.join(hier, 'logo_saison_lauf.html'); fs.writeFileSync(tmp, html);
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find((p) => fs.existsSync(p));
const profil = fs.mkdtempSync(path.join(os.tmpdir(), 'cv-logo-'));
const port = 9336;
const pr = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profil}`, '--no-first-run', 'about:blank'], { stdio: 'ignore' });
const warte = (ms) => new Promise((r) => setTimeout(r, ms));
let ws;
for (let i = 0; i < 50; i++) { try { const l = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); const t = l.find((x) => x.type === 'page'); if (t) { ws = new WebSocket(t.webSocketDebuggerUrl); break; } } catch (e) {} await warte(200); }
await new Promise((r) => (ws.onopen = r));
let id = 0; const offen = new Map();
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && offen.has(m.id)) { offen.get(m.id)(m); offen.delete(m.id); } };
const cdp = (method, params = {}) => new Promise((r) => { const i = ++id; offen.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await cdp('Page.enable');
await cdp('Page.navigate', { url: pathToFileURL(tmp).href });
await warte(800);
for (const art of (process.argv[4] || 'weihnachten,ostern').split(',')) {
  const r = await cdp('Runtime.evaluate', { expression: `bauen('${art}')`, awaitPromise: true, returnByValue: true });
  if (r.result.exceptionDetails) { console.log('FEHLER', art, JSON.stringify(r.result.exceptionDetails).slice(0, 400)); continue; }
  const v = r.result.result.value;
  fs.writeFileSync(path.join(zielOrdner, `logo_${art}.png`), Buffer.from(v.url.split(',')[1], 'base64'));
  console.log(art, v.W + ' x ' + v.H, 'oben +' + v.P);
}
ws.close(); pr.kill();

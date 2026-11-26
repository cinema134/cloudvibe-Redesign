// Saison-Logos aus der Vektordatei: node logo_vektor.mjs <cloudvibe_logo.svg> <zielordner>
// schreibt cloudvibe_logo_weihnachten.svg / _ostern.svg (Vektor) und je .png in 1496 px und _web.png in 748 px
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { pathToFileURL } from 'node:url';

const [svgPfad, ziel] = process.argv.slice(2);
const hier = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1'));
const quelle = fs.readFileSync(svgPfad, 'utf8');
const tmp = path.join(hier, 'logo_vektor_lauf.html');
fs.writeFileSync(tmp, fs.readFileSync(path.join(hier, 'logo_saison.html'), 'utf8').replace("'LOGO'", "''"));
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find((p) => fs.existsSync(p));
const profil = fs.mkdtempSync(path.join(os.tmpdir(), 'cv-vektor-'));
const port = 9337;
const pr = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profil}`, '--no-first-run', 'about:blank'], { stdio: 'ignore' });
const warte = (ms) => new Promise((r) => setTimeout(r, ms));
let ws;
for (let i = 0; i < 50; i++) { try { const l = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); const t = l.find((x) => x.type === 'page'); if (t) { ws = new WebSocket(t.webSocketDebuggerUrl); break; } } catch (e) {} await warte(200); }
await new Promise((r) => (ws.onopen = r));
let id = 0; const offen = new Map();
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && offen.has(m.id)) { offen.get(m.id)(m); offen.delete(m.id); } };
const cdp = (method, params = {}) => new Promise((r) => { const i = ++id; offen.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const js = async (expr) => { const r = await cdp('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 500)); return r.result.result.value; };
await cdp('Page.enable');
await cdp('Page.navigate', { url: pathToFileURL(tmp).href });
await warte(800);
for (const art of (process.argv[4] || 'weihnachten,ostern').split(',')) {
  const svg = await js(`vektor(${JSON.stringify(art)}, ${JSON.stringify(quelle)})`);
  fs.writeFileSync(path.join(ziel, `cloudvibe_logo_${art}.svg`), svg, 'utf8');
  for (const [name, b] of [[`cloudvibe_logo_${art}.png`, 1496], [`logo_${art}_web.png`, 748]]) {
    const v = await js(`png(${JSON.stringify(svg)}, ${b})`);
    fs.writeFileSync(path.join(ziel, name), Buffer.from(v.url.split(',')[1], 'base64'));
    console.log(name, v.W + ' x ' + v.H);
  }
}
ws.close(); pr.kill();

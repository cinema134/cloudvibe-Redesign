// Erzeugt die Sitemap mit Seiteninhalten aus dem aktuellen Stand (Leon 24.11.2026: Sitemap auf aktuellen Stand, statt von Hand pflegen).
// Quellen: karte.json (Seitenbaum), seiten.json (Titel, Pfad, SEO), die gebauten Mockups in Mockup/ (H1, Abschnitte, Module, Buttons, FAQ).
// Ergebnis: cloudvibe_Sitemap_vNN.html im Projektordner. Neue Version nur, wenn sich der Inhalt geändert hat; die alte wandert nach Archiv/.
// Wird von bauen.mjs vor der Karte aufgerufen, geht aber auch allein: node sitemap.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const Q = path.dirname(fileURLToPath(import.meta.url));
// Übergabe-Fassung (bauen.mjs --uebergabe): { ziel, link(id), ohneAbstimmung }; dann ohne Versionen, Links auf die sauberen Dateien
const OPT = globalThis.SITEMAP_OPT || null;
const MOCK = path.join(Q, '..');
const HAUPT = path.join(Q, '..', '..');
const cfg = JSON.parse(fs.readFileSync(path.join(Q, 'seiten.json'), 'utf8'));
const k = JSON.parse(fs.readFileSync(path.join(Q, 'karte.json'), 'utf8').replace(/^﻿/, ''));
const vv = (n) => 'v' + String(n).padStart(2, '0');
const datei = (id) => { const s = cfg.seiten[id]; return s ? `cloudvibe_${s.datei}_${vv(s.version)}.html` : null; };
const begr = (s) => String(s).replaceAll('{{BEGRIFF}}', cfg.begriff).replaceAll('{{HC}}', cfg.begriff);
const text = (h) => h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&shy;/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').replace(/\s+([.,:;!?])/g, '$1').trim();
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Oberste <section>-Blöcke in <main> (verschachtelte Abschnitte, z. B. Lexikon-Buchstaben, bleiben drin)
function abschnitte(main) {
  const out = [];
  const re = /<section\b[^>]*>|<\/section>/g;
  let tiefe = 0, start = -1, m;
  while ((m = re.exec(main))) {
    if (m[0] !== '</section>') { if (tiefe++ === 0) start = m.index; }
    else if (--tiefe === 0) out.push(main.slice(start, re.lastIndex));
  }
  return out;
}
const attr = (tag, a) => (tag.match(new RegExp(`\\s${a}="([^"]*)"`)) || [])[1];
const erstes = (h, re) => { const m = h.match(re); return m ? text(m[1]) : ''; };

function lies(id) {
  const f = datei(id);
  if (!f || !fs.existsSync(path.join(MOCK, f))) return null;
  const html = fs.readFileSync(path.join(MOCK, f), 'utf8');
  const main = (html.match(/<main>([\s\S]*)<\/main>/) || [])[1] || '';
  const h1 = (main.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || '';
  const teile = abschnitte(main).map((s, i) => {
    const tag = s.match(/^<section\b[^>]*>/)[0], kl = attr(tag, 'class') || '';
    const extra = / data-extra/.test(tag), aus = /\bmod-aus\b/.test(kl);
    const eb = erstes(s, /<div class="eb[^"]*">([\s\S]*?)<\/div>/), h2 = erstes(s, /<h2[^>]*>([\s\S]*?)<\/h2>/);
    const hero = i === 0 && /\b(uhero|hero)\b/.test(kl);
    const name = hero ? 'Hero' : attr(tag, 'data-name') || eb || h2 || attr(tag, 'id') || 'Abschnitt';
    let was = hero ? erstes(s, /<p class="lead[^"]*">([\s\S]*?)<\/p>/) : h2 && h2 !== name ? h2 : erstes(s, /<p class="(?:lead|leise)[^"]*">([\s\S]*?)<\/p>/);
    if (was.length > 170) was = was.slice(0, 167).replace(/\s\S*$/, '') + ' …';
    const knoepfe = hero ? [...s.matchAll(/<a class="btn([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].map((b) => [text(b[2]), /\bzw\b/.test(b[1])]).filter((b) => b[0]) : [];
    return { name: begr(name), was: begr(was), aus, extra, knoepfe };
  });
  const s = cfg.seiten[id];
  return {
    t: begr(s.titel), link: OPT ? OPT.link(id) : 'Mockup/' + f, link2: OPT && OPT.link2 ? OPT.link2(id) : null, version: OPT ? null : vv(s.version), pfad: s.pfad || '', noindex: !!s.noindex,
    beschreibung: begr(s.beschreibung || ''), h1: begr(h1.replace(/<(?!\/?b>)[^>]+>/g, '').replace(/\s+/g, ' ').trim()),
    teile: teile.filter((x) => !x.extra), zusatz: teile.filter((x) => x.extra).map((x) => x.name),
    knoepfe: (teile[0] || {}).knoepfe || [], faq: (main.match(/<details name="faq"/g) || []).length,
    offen: k.offen.filter((o) => o[2] === id).map((o) => `${o[0]}: ${o[1]}`),
  };
}

// Seitenbaum wie auf der Karte, dazu die Funktion Fernwartung (keine Seite, Download) und die Abstimmungsseiten
const P = {};
const kn = (id, t, extra = {}) => { const d = lies(id); P[id] = d ? { ...d, t: begr(t || d.t), ...extra } : { t: begr(t), fehlt: true, ...extra }; };
kn(k.start.id, k.start.t, { crumb: 'cloudvibe.de' });
for (const g of k.hauptmenue) {
  kn(g.id, g.t, { crumb: 'Hauptmenü' });
  for (const c of g.kids) kn(c.id, c.t, { crumb: begr(g.t) });
}
for (const n of k.footer) kn(n.id, n.t, { crumb: 'Footer und Funktionen' });
P.fernwartung = { t: 'Fernwartung', crumb: 'Footer und Funktionen', funktion: true,
  beschreibung: 'Keine eigene Seite (Leon 24.11.2026): „Fernwartung starten“ lädt direkt die QuickSupport-Datei herunter. Danach erscheint der Hinweis, die Datei zu öffnen und uns am Telefon die angezeigte ID zu nennen.',
  wo: ['Kopfleiste: Support ▾ → Fernwartung starten (erster Punkt)', 'Support-Seite: Weg „Fernwartung starten“', 'Login: „Ohne Anmeldung“', 'Footer D: Für Kunden'],
  offen: cfg.fernwartung && cfg.fernwartung !== '#' ? [] : ['Download-Link zu QuickSupport (Zulieferung)'] };
const ABST = OPT && OPT.ohneAbstimmung ? [] : Object.entries(cfg.seiten).filter(([, s]) => s.noindex && !s.pfad).map(([id]) => id);
for (const id of ABST) kn(id, null, { crumb: 'Nur zur Abstimmung' });

const fussIds = [...k.footer.map((n) => n.id), 'fernwartung'];
const gruppen = [
  ['Hauptmenü', k.hauptmenue.map((g) => ({ id: g.id, kids: g.kids.map((c) => c.id) }))],
  ['Footer und Funktionen', [{ id: fussIds[0], kids: fussIds.slice(1), fn: true }]],
  ...(ABST.length ? [['Nur zur Abstimmung (noindex)', [{ id: ABST[0], kids: ABST.slice(1), fn: true }]]] : []),
];
const seitenZahl = Object.values(P).filter((p) => !p.fehlt && !p.funktion && p.crumb !== 'Nur zur Abstimmung').length;

const css = fs.readFileSync(path.join(Q, 'assets', 'schriften.css'), 'utf8') + fs.readFileSync(path.join(Q, 'sitemap.css'), 'utf8') + `
.node .v{font:400 12px 'Mozilla Text';color:var(--blue);margin-left:6px}
.sec li.aus{opacity:.55}.sec li.aus em{font-style:normal;font:700 11px 'Mozilla Text';letter-spacing:.06em;text-transform:uppercase;color:#7A8497;margin-left:6px}
.meta{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:13.5px;color:var(--muted);margin:-6px 0 4px}
.meta code{font:700 13px 'Mozilla Text';color:var(--text)}
.mk{display:inline-block;margin-top:22px;font:700 14px 'Mozilla Text';color:var(--blue);text-decoration:none}
.mk:hover{text-decoration:underline}
.chips{display:flex;flex-wrap:wrap;gap:6px}.chips span{font-size:13px;padding:4px 10px;border-radius:100px;border:1px dashed var(--line);color:var(--muted)}
.lead b{color:var(--text)}`;
const logo = fs.readFileSync(path.join(Q, 'assets', 'logo.txt'), 'utf8');
// Menüleiste wie auf der Website: Managed Services steht dort als „Leistungen ▾“
const MENUE = k.hauptmenue.map((g) => [g.id === 'managed' ? 'Leistungen' : begr(g.t), g.id]);

const html = (version) => `<!DOCTYPE html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>cloudvibe Website: Sitemap und Seiteninhalte (${vv(version)})</title>
<meta name="robots" content="noindex,nofollow">
<style>${css}</style></head>
<body><div class="wrap">
<div class="pill" id="pill"><div class="logo"><img src="${logo}" alt="cloudvibe, Your IT. Our business."></div><div class="nav" id="nav"></div><button class="cta" id="ctaSup">Support</button></div>
<h1>Sitemap und <b>Seiteninhalte</b></h1>
<p class="lead">Stand ${esc(k.stand)}, erzeugt aus den aktuellen Mockups: <b>${seitenZahl} Seiten</b>. Links der Seitenbaum, rechts je Seite Adresse, Überschrift, Aufbau von oben nach unten (blasse Abschnitte sind als Modul ausgeschaltet), Buttons im Hero und offene Punkte. Die Menüpunkte oben sind anklickbar.</p>
<div class="main">
 <div class="map" id="map"><svg class="cn" id="cn"></svg><div id="tree"></div></div>
 <aside class="panel" id="panel"></aside>
</div>
<p class="foot">Texte der Website im Du. Keine Preise, Rabatte oder Prozentzahlen. Zahlen, Fristen und Zitate erscheinen erst, wenn sie belegt oder freigegeben sind.</p>
</div>
<script>
const P=${JSON.stringify(P).replace(/</g, '\\u003c')};
const G=${JSON.stringify(gruppen)};
const MENUE=${JSON.stringify(MENUE)};
const START=${JSON.stringify(k.start.id)};
const $=s=>document.querySelector(s);
let cur=START;
const knoten=(id,kl)=>'<button class="node '+kl+'" data-id="'+id+'">'+P[id].t+(P[id].version?'<span class="v">'+P[id].version+'</span>':'')+'</button>';
function build(){
 let h='<div class="cols"><div class="c0"><button class="node root" data-id="'+START+'">Startseite<small>cloudvibe.de</small></button></div><div style="grid-column:2/4">';
 G.forEach(([titel,zeilen])=>{h+='<div class="grp">'+titel+'</div>';zeilen.forEach(g=>{if(!g.id)return;h+='<div class="row"><div>'+knoten(g.id,'l1'+(g.fn?' fn':''))+'</div><div class="kids">'+g.kids.map(c=>knoten(c,'k'+(g.fn?' fn':''))).join('')+'</div></div>'})});
 $('#tree').innerHTML=h+'</div></div>';
 $('#nav').innerHTML=MENUE.map(([t,id])=>'<button data-id="'+id+'">'+t+'</button>').join('');
}
function eltern(id){for(const [,z] of G)for(const g of z){if(g.kids.includes(id))return g.id}return null}
function lines(){
 const svg=$('#cn'),m=$('#map').getBoundingClientRect();
 if(getComputedStyle(svg).display==='none')return;
 svg.setAttribute('viewBox','0 0 '+m.width+' '+m.height);
 const pos=id=>{const e=document.querySelector('.node[data-id="'+id+'"]');if(!e)return null;const r=e.getBoundingClientRect();return{l:r.left-m.left,r:r.right-m.left,y:r.top+r.height/2-m.top}};
 let d='';
 const link=(a,b)=>{const A=pos(a),B=pos(b);if(!A||!B)return;const x1=A.r,x2=B.l,mx=(x1+x2)/2;d+='<path class="'+(cur===b?'act':'')+'" d="M'+x1+' '+A.y+' C'+mx+' '+A.y+' '+mx+' '+B.y+' '+x2+' '+B.y+'"/>'};
 G.forEach(([,z])=>z.forEach(g=>{if(!g.id)return;link(START,g.id);g.kids.forEach(c=>link(g.id,c))}));
 svg.innerHTML=d;
}
function show(id){
 if(!P[id])id=START;cur=id;const p=P[id];
 document.querySelectorAll('.node').forEach(n=>n.classList.toggle('on',n.dataset.id===id));
 document.querySelectorAll('#nav button').forEach(n=>n.classList.toggle('on',n.dataset.id===id||n.dataset.id===eltern(id)));
 $('#ctaSup').classList.toggle('on',id==='support');
 let h='<div class="crumb">'+(p.crumb||'')+'</div><h2>'+p.t+'</h2>';
 if(p.fehlt){$('#panel').innerHTML=h+'<p>Noch nicht als Mockup gebaut.</p>';lines();return}
 if(p.funktion){h+='<div class="lbl">Was passiert</div><p>'+p.beschreibung+'</p><div class="lbl">Wo es steht</div><ol class="sec">'+p.wo.map(w=>'<li><div>'+w+'</div></li>').join('')+'</ol>';}
 else{
  h+='<div class="meta">'+(p.pfad?'<span>Adresse <code>'+p.pfad+'</code></span>':'')+(p.version?'<span>Mockup '+p.version+'</span>':'')+(p.noindex?'<span>noindex</span>':'')+(p.faq?'<span>'+p.faq+' FAQ</span>':'')+'</div>';
  if(p.h1)h+='<div class="lbl">Überschrift (H1)</div><p class="quote">'+p.h1+'</p>';
  if(p.beschreibung)h+='<div class="lbl">Worum es geht (Beschreibung für Suchmaschinen)</div><p>'+p.beschreibung+'</p>';
  h+='<div class="lbl">Aufbau von oben nach unten</div><ol class="sec">'+p.teile.map(s=>'<li class="'+(s.aus?'aus':'')+'"><div>'+s.name+(s.aus?'<em>aus</em>':'')+(s.was?'<span>'+s.was+'</span>':'')+'</div></li>').join('')+'</ol>';
  if(p.zusatz.length)h+='<div class="lbl">Zusatzmodule (anfangs aus, schaltbar)</div><div class="chips">'+p.zusatz.map(z=>'<span>'+z+'</span>').join('')+'</div>';
  if(p.knoepfe.length)h+='<div class="lbl">Buttons im Hero</div><div>'+p.knoepfe.map(([t,g])=>'<span class="btn'+(g?' g':'')+'">'+t+'</span>').join('')+'</div>';
 }
 if(p.offen&&p.offen.length)h+='<div class="lbl">Noch zu klären</div><ul class="open">'+p.offen.map(o=>'<li>'+o+'</li>').join('')+'</ul>';
 if(p.link)h+='<a class="mk" href="'+p.link+'">'+(p.version?'Mockup öffnen →':'Seite öffnen →')+'</a>'+(p.link2?'<a class="mk" style="margin-left:22px" href="'+p.link2+'">Mit Optionen →</a>':'');
 $('#panel').innerHTML=h;lines();
}
build();
document.addEventListener('click',e=>{
 const n=e.target.closest('.node,#nav button');if(n){show(n.dataset.id);return}
 if(e.target.closest('#ctaSup'))show('support');
});
addEventListener('resize',lines);
document.fonts.ready.then(()=>show(new URLSearchParams(location.search).get('p')||START));
show(new URLSearchParams(location.search).get('p')||START);
</script></body></html>`;

if (OPT) { fs.writeFileSync(OPT.ziel, html(0).replace(/ \(v00\)<\/title>/, '</title>')); console.log('Sitemap (Übergabe):', OPT.ziel); }
// Version: nur hochzählen, wenn sich der Inhalt geändert hat
const nr = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir) : []).map((f) => f.match(/^cloudvibe_Sitemap_v(\d+)\.html$/)).filter(Boolean).sort((a, b) => a[1] - b[1]);
const vorh = nr(HAUPT).pop();
// ohne aktuelle Datei weiterzählen ab der höchsten Version im Archiv
const alt = vorh ? +vorh[1] : +((nr(path.join(HAUPT, 'Archiv')).pop() || [])[1] || 0);
const altText = vorh ? fs.readFileSync(path.join(HAUPT, vorh[0]), 'utf8') : '';
if (OPT) {}
else if (vorh && altText === html(alt)) console.log('Sitemap unverändert:', vorh[0]);
else {
  const neu = alt + 1, name = `cloudvibe_Sitemap_${vv(neu)}.html`;
  fs.writeFileSync(path.join(HAUPT, name), html(neu));
  if (vorh) { fs.mkdirSync(path.join(HAUPT, 'Archiv'), { recursive: true }); fs.renameSync(path.join(HAUPT, vorh[0]), path.join(HAUPT, 'Archiv', vorh[0])); }
  console.log('Sitemap gebaut:', name, `(${seitenZahl} Seiten)`);
}

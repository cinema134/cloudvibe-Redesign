// Baut aus den Quellen eigenständige Mockup-Seiten (alles inline).
// Aufruf:  node bauen.mjs            -> alle Seiten aus seiten.json
//          node bauen.mjs startseite -> nur diese Seite
//
// Versionsregel: Die Version steht in seiten.json. Liegt im Ordner Mockup/ eine
// ältere Version derselben Seite, wird sie nach Archiv/Mockup/ verschoben.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const Q = path.dirname(fileURLToPath(import.meta.url));
const ZIEL = path.join(Q, '..');
const ARCHIV = path.join(Q, '..', '..', 'Archiv', 'Mockup');
const lies = (...p) => fs.readFileSync(path.join(Q, ...p), 'utf8');
const gibt = (...p) => fs.existsSync(path.join(Q, ...p));

const cfg = JSON.parse(lies('seiten.json'));
const nur = process.argv.slice(2).find((a) => !a.startsWith('--'));

const PFEIL = '<svg class="pf" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const CHEV = '<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5"/></svg>';
const TEL = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>';

// Übergabe fürs Coding (Leon 24.11.2026): node bauen.mjs --uebergabe
// schreibt jede Seite ohne Mockup-Steuerung mit sprechendem Namen nach Uebergabe_Coding/seiten/ (Pfad /a/b -> a-b.html, / -> index.html),
// dazu sitemap.html und die Quellen. Abstimmungsseiten ohne Pfad (Welten, Wellen) bleiben draußen, Konzepte nur mit Optionen. Mockup/ bleibt unberührt.
const UEB = process.argv.includes('--uebergabe');
const UZ = path.join(Q, '..', '..', 'Uebergabe_Coding');
// Konzepte zur Abstimmung nur in seiten_mit_optionen (Leon 25.11.2026: ersetzt die Wellen-Varianten auf GitHub)
const uebName = (id) => { const s = cfg.seiten[id]; if (id === 'konzepte') return 'konzepte.html'; if (id === 'wellen') return 'wellen-varianten.html'; /* ohne Link auf der Startseite, nur Ziel aus Konzept 25 */ return s && s.pfad ? (s.pfad === '/' ? 'index' : s.pfad.slice(1).replaceAll('/', '-')) + '.html' : null; };

// Dateiname der aktuellen Version einer Seite (für Links zwischen den Mockups)
const dateiVon = (id) => {
  const s = cfg.seiten[id];
  if (UEB) return uebName(id) || '#';
  return s ? `cloudvibe_${s.datei}_v${String(s.version).padStart(2, '0')}.html` : '#';
};

// Footer-Mail je Bereich: allgemein kontakt@, Gesundheitswesen wecare@, Kanzleien/Unternehmen weenable@
const FUSSMAIL = {
  allgemein: ['kontakt@cloudvibe.de', 'Anfragen'],
  gesundheit: ['wecare@cloudvibe.de', '{{HC}}'],
  kanzlei: ['weenable@cloudvibe.de', 'Kanzleien'],
  unternehmen: ['weenable@cloudvibe.de', 'Unternehmen'],
  karriere: ['hire@cloudvibe.de', 'Karriere'],
};
const fussMail = (seite) => {
  const [m, l] = FUSSMAIL[seite.bereich || 'allgemein'];
  return `<li class="mail"><a href="mailto:${m}">${m}</a><small>${l}</small></li>`;
};

function ersetze(s, seite, id) {
  return s
    .replaceAll('{{FUSSMAIL}}', fussMail(seite))
    // Fernwartung: direkter Download der QuickSupport-.exe (Leon 24.11.2026, keine eigene Seite); Link in seiten.json "fernwartung"
    .replaceAll('{{FW}}', () => `href="${cfg.fernwartung || '#'}"${cfg.fernwartung && cfg.fernwartung !== '#' ? ' download' : ''} data-fw="${cfg.support.replace(/^\+49\s*/, '0')}"`)
    .replace(/\{\{LINK:([a-z_]+)\}\}/g, (_, x) => dateiVon(x))
    .replace(/\{\{ON:([a-z_]+)\}\}/g, (_, x) => (x === (seite.aktiv || id) ? ' class="on"' : ''))
    .replaceAll('{{QUELLE}}', seite.titel)
    // {{BILD:team/name.webp}} -> eingebettetes Bild aus assets/
    .replace(/\{\{BILD:([\w\/.-]+)\}\}/g, (_, f) => {
      const typ = { webp: 'image/webp', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png' }[f.split('.').pop().toLowerCase()];
      return `data:${typ};base64,` + fs.readFileSync(path.join(Q, 'assets', f)).toString('base64');
    })
    // {{PARTNERLOGO:telekonnekt}} -> Originallogo aus assets/partner/telekonnekt.(svg|png|webp|jpg), sonst sichtbarer Platzhalter
    .replace(/\{\{PARTNERLOGO:([a-z]+)\}\}/g, (_, n) => {
      // Bevorzugt: <name>_maske.png (einfarbige/weiße Datei) -> per CSS-Maske exakt in der Markenfarbe eingefärbt
      const mf = path.join(Q, 'assets', 'partner', `${n}_maske.png`);
      if (fs.existsSync(mf)) {
        const pb = fs.readFileSync(mf), w = pb.readUInt32BE(16), h = pb.readUInt32BE(20);
        const u = `url(data:image/png;base64,${pb.toString('base64')})`;
        return `<span class="logo-maske logo-${n}" role="img" aria-label="${n === 'telekonnekt' ? 'Telekonnekt' : n}" style="aspect-ratio:${w}/${h};-webkit-mask-image:${u};mask-image:${u}"></span>`;
      }
      const typen = { svg: 'image/svg+xml', png: 'image/png', webp: 'image/webp', jpg: 'image/jpeg' };
      for (const [e, t] of Object.entries(typen)) {
        const f = path.join(Q, 'assets', 'partner', `${n}.${e}`);
        if (fs.existsSync(f)) return `<img src="data:${t};base64,${fs.readFileSync(f).toString('base64')}" alt="${n === 'telekonnekt' ? 'Telekonnekt' : n}">`;
      }
      return `[[Platzhalter: Logo ${n === 'telekonnekt' ? 'Telekonnekt' : n}]]`; // Datei: _quellen/assets/partner/<name>.svg|png|webp|jpg
    })
    .replaceAll('{{HC}}', `<span class="hc">${cfg.begriff}</span>`)
    .replaceAll('{{BEGRIFF}}', cfg.begriff)
    .replaceAll('{{PFEIL}}', PFEIL)
    .replaceAll('{{CHEV}}', CHEV)
    .replaceAll('{{TEL}}', TEL)
    // Sichtbare Nummern national ohne +49 (Leon 24.11.2026), nur im Footer international; Links (tel:) immer international
    .replaceAll('{{SALES_INT}}', cfg.sales)
    .replaceAll('{{SUPPORT_INT}}', cfg.support)
    .replaceAll('{{SALES_TEL}}', cfg.sales.replace(/[^\d+]/g, ''))
    .replaceAll('{{SUPPORT_TEL}}', cfg.support.replace(/[^\d+]/g, ''))
    .replaceAll('{{SALES}}', cfg.sales.replace(/^\+49\s*/, '0'))
    .replaceAll('{{SUPPORT}}', cfg.support.replace(/^\+49\s*/, '0'))
    .replaceAll('{{LOGO}}', lies('assets', 'logo.txt'))
    .replaceAll('{{VERSION}}', 'v' + String(seite.version).padStart(2, '0'))
    // [[Platzhalter: ...]] wird sichtbar markiert
    .replace(/\[\[(Platzhalter:[^\]]+)\]\]/g, '<span class="ph">[$1]</span>');
}

// ---------- Kundenstimmen: eine Quelle (basis/stimmen.json), ausgespielt je Branche ----------
// <!--@stimmen:gesundheit|kanzlei|unternehmen[:alt]-->  Abschnitt mit bis zu 3 Stimmen der Branche (Hauptseiten)
// <!--@stimmen:arztpraxis|apotheke|pflege[:alt]-->      Abschnitt mit 1 Stimme des Unterbereichs (Unterseiten)
// <!--@stimmen:start-->  Streifen mit je 1 Stimme pro Branche; erscheint nur, wenn alle drei Branchen eine Stimme haben
// Gibt es keine passende Stimme, entfällt der Abschnitt ohne Platzhalter. Keine Review-/Sterne-Daten (Google lässt eigene Stimmen nicht zu).
const STIMMEN = JSON.parse(lies('basis', 'stimmen.json')).stimmen;
const ZITAT_IC = '<svg class="st-q" viewBox="0 0 32 24" aria-hidden="true"><path d="M0 24V13.6C0 5.9 4.3 1.2 12 0l1.3 3.4C8.6 4.6 6.6 7.3 6.4 11H12v13H0zm19 0V13.6C19 5.9 23.3 1.2 31 0l1 3.4c-4.7 1.2-6.7 3.9-6.9 7.6H31v13H19z"/></svg>';
const BRANCHE = { gesundheit: '{{HC}}', kanzlei: 'Kanzleien', unternehmen: 'Unternehmen' };
function stimme(s, mitBranche) {
  const wer = [s.rolle, s.betrieb, s.ort].filter(Boolean).join(', ');
  return `<figure class="st">${mitBranche ? `<span class="st-br">${BRANCHE[s.branche]}</span>` : ''}${ZITAT_IC}<blockquote>„${s.zitat}“</blockquote><figcaption><b>${s.name}</b><span>${wer}</span>${s.beispiel ? '<em class="st-bsp" title="Erfundene Beispielstimme, wird durch eine freigegebene Kundenstimme ersetzt">Beispiel</em>' : ''}</figcaption></figure>\n`;
}
// <!--@stimmen:alle-->  Referenzseite: alle Stimmen, je Branche ein Abschnitt mit eigener Überschrift (Abschnitte abwechselnd hell/Fläche)
const ALLE_KOPF = { gesundheit: ['{{HC}}', 'Aus Praxen, Apotheken <b>und Pflege</b>.'], kanzlei: ['Kanzleien', 'Aus Steuerberatung <b>und Anwaltskanzleien</b>.'], unternehmen: ['Unternehmen', 'Aus dem <b>Mittelstand</b>.'] };
function stimmenAlle() {
  return Object.entries(ALLE_KOPF).map(([b, [eb, h2]], i) => {
    const liste = STIMMEN.filter((s) => s.branche === b);
    if (!liste.length) return '';
    return `<section class="ab stimmen${i % 2 ? ' alt' : ''}" id="stimmen-${b}">
 <div class="wrap st-in">
  <div class="st-kopf">
   <div class="eb">${eb}</div>
   <h2>${h2}</h2>
  </div>
  <div class="st-liste">
${liste.map((s) => stimme(s, false)).join('')}  </div>
 </div>
</section>`;
  }).join('\n');
}
function stimmenHtml(was, klasse) {
  if (was === 'alle') return stimmenAlle();
  const cls = klasse ? ' ' + klasse : '';
  if (was === 'start') {
    const je = ['gesundheit', 'kanzlei', 'unternehmen'].map((b) => STIMMEN.find((s) => s.branche === b));
    if (je.some((s) => !s)) return '';
    return `<!-- ================= Kundenstimmen (Streifen, je Branche eine) ================= -->
<section class="ab stimmen-start${cls}" id="stimmen">
 <div class="wrap">
  <div class="kopfzeile">
   <div><div class="eb">Kundenstimmen</div><h2>Was Praxen, Kanzleien und Unternehmen <b>sagen</b>.</h2></div>
   <div class="rechts"><a class="link" href="{{LINK:referenzen}}">Alle Referenzen{{PFEIL}}</a></div>
  </div>
  <div class="st-streifen">
${je.map((s) => stimme(s, true)).join('')}  </div>
 </div>
</section>`;
  }
  const liste = BRANCHE[was] ? STIMMEN.filter((s) => s.branche === was).slice(0, 3) : STIMMEN.filter((s) => s.unterbereich === was).slice(0, 1);
  if (!liste.length) return '';
  return `<!-- ================= Kundenstimmen ================= -->
<section class="ab stimmen${cls}" id="stimmen">
 <div class="wrap st-in">
  <div class="st-kopf">
   <div class="eb">Kundenstimmen</div>
   <h2>Was unsere Kunden <b>sagen</b>.</h2>
   <a class="link" href="{{LINK:referenzen}}">Alle Referenzen{{PFEIL}}</a>
  </div>
  <div class="st-liste">
${liste.map((s) => stimme(s, false)).join('')}  </div>
 </div>
</section>`;
}

// ---------- Lexikon-Seite: <!--@lexikon--> schreibt alle Begriffe aus basis/lexikon.js fest ins HTML (A–Z, mit DefinedTermSet für Suchmaschinen) ----------
function lexikonHtml() {
  const LEX = new Function(lies('basis', 'lexikon.js') + '\nreturn LEX;')();
  const ohne = (s) => s.replace(/<[^>]+>/g, '');
  const liste = Object.entries(LEX).map(([k, e]) => ({ k, ...e })).sort((a, b) => a.t.localeCompare(b.t, 'de'));
  const buchst = (e) => { const c = e.t[0].toUpperCase(); return /[A-ZÄÖÜ]/.test(c) ? c.replace('Ä', 'A').replace('Ö', 'O').replace('Ü', 'U') : '#'; };
  const gruppen = {};
  for (const e of liste) (gruppen[buchst(e)] ||= []).push(e);
  const REIHE = ['Gesundheitswesen', 'Technik', 'Software', 'Recht'];
  const bereiche = [...new Set(liste.map((e) => e.b))].sort((a, b) => (REIHE.indexOf(a) + 99 * (REIHE.indexOf(a) < 0)) - (REIHE.indexOf(b) + 99 * (REIHE.indexOf(b) < 0)));
  const alle = [...(gruppen['#'] ? ['#'] : []), ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];
  const ld = { '@context': 'https://schema.org', '@type': 'DefinedTermSet', name: 'cloudvibe IT-Lexikon', inLanguage: 'de-DE',
    hasDefinedTerm: liste.map((e) => ({ '@type': 'DefinedTerm', '@id': '#lx-' + e.k, name: ohne(e.t), description: ohne(e.d), inDefinedTermSet: 'cloudvibe IT-Lexikon' })) };
  return `<div class="lx-werkzeug">
  <label class="lx-suche"><span class="sr">Begriff suchen</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><input type="search" id="lxSuche" placeholder="Begriff suchen" autocomplete="off"></label>
  <div class="nf" role="group" aria-label="Nach Bereich filtern"><button type="button" data-lxb="alle" class="on">Alle</button>${bereiche.map((b) => `<button type="button" data-lxb="${b}">${b === 'Gesundheitswesen' ? '{{HC}}' : b}</button>`).join('')}</div>
  <nav class="lx-abc" aria-label="Alphabet">${alle.map((c) => (gruppen[c] ? `<a href="#lx-${c === '#' ? '0' : c}">${c}</a>` : `<span>${c}</span>`)).join('')}</nav>
 </div>
 <div class="lx-gruppen">
${Object.keys(gruppen).sort((a, b) => a.localeCompare(b, 'de')).map((c) => ` <section class="lx-gruppe" id="lx-${c === '#' ? '0' : c}" aria-label="Buchstabe ${c}">
  <div class="lx-bst" aria-hidden="true">${c}</div>
  <dl>
${gruppen[c].map((e) => `   <div class="lx-eintrag" id="lx-${e.k}" data-lxb="${e.b}"><dt>${e.t}<span class="lx-ber">${e.b === 'Gesundheitswesen' ? '{{HC}}' : e.b}</span></dt><dd>${e.d}</dd></div>`).join('\n')}
  </dl>
 </section>`).join('\n')}
 </div>
 <p class="lx-leer leise" hidden>Kein Begriff gefunden. Schreib uns, wenn dir eine Erklärung fehlt.</p>
 <script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`;
}

// ---------- SEO und GEO: Meta-Angaben und strukturierte Daten (schema.org, JSON-LD) ----------
// Werte für Odoo 1:1 übernehmbar. Adresse/Zeiten aus Projektstand (Servicezeiten noch bestätigen).
const textAus = (h) => h.replace(/<span class="ph">[\s\S]*?<\/span>/g, '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&shy;/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').replace(/\s+([.,:;!?])/g, '$1').replace(/:\s*$/, '.').trim();
function seoKopf(id, seite, html) {
  const D = cfg.domain || 'https://cloudvibe.de';
  const url = D + (seite.pfad || '/');
  const titel = seite.seoTitel || `cloudvibe · ${seite.titel}`;
  const tel = (s) => s.replace(/[^\d+]/g, '');
  const firma = {
    '@type': 'ProfessionalService', '@id': D + '/#firma', name: 'cloudvibe GmbH', legalName: 'cloudvibe GmbH', alternateName: 'cloudvibe',
    slogan: 'Your IT. Our business.', url: D + '/', email: 'kontakt@cloudvibe.de', telephone: tel(cfg.sales), vatID: 'DE358683658',
    address: { '@type': 'PostalAddress', streetAddress: 'Von-Monschaw-Str. 12a', postalCode: '47574', addressLocality: 'Goch', addressRegion: 'Nordrhein-Westfalen', addressCountry: 'DE' },
    areaServed: [{ '@type': 'AdministrativeArea', name: 'Niederrhein' }, { '@type': 'Country', name: 'Deutschland' }],
    openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '17:00' }],
    contactPoint: [
      { '@type': 'ContactPoint', contactType: 'sales', telephone: tel(cfg.sales), email: 'kontakt@cloudvibe.de', availableLanguage: 'de' },
      { '@type': 'ContactPoint', contactType: 'technical support', telephone: tel(cfg.support), email: 'support@cloudvibe.de', availableLanguage: 'de' },
    ],
    knowsAbout: ['IT-Betreuung', 'Managed Services', 'Telematikinfrastruktur', 'TI-Anbindung', 'Datensicherung', 'IT-Sicherheit', 'Fernwartung', 'DATEV', 'SelectLine'],
  };
  const graph = [firma,
    { '@type': 'WebSite', '@id': D + '/#website', url: D + '/', name: 'cloudvibe', inLanguage: 'de-DE', publisher: { '@id': D + '/#firma' } },
    { '@type': 'WebPage', '@id': url + '#seite', url, name: titel, description: seite.beschreibung || '', inLanguage: 'de-DE', isPartOf: { '@id': D + '/#website' }, about: { '@id': D + '/#firma' } }];
  if (seite.pfad && seite.pfad !== '/') {
    const kette = [['Startseite', D + '/']];
    if (seite.eltern) { const e = cfg.seiten[seite.eltern]; kette.push([e.titel === 'Gesundheitswesen' ? cfg.begriff : e.titel, D + e.pfad]); }
    kette.push([seite.titel === 'Gesundheitswesen' ? cfg.begriff : seite.titel, url]);
    graph.push({ '@type': 'BreadcrumbList', itemListElement: kette.map(([n, u], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: u })) });
  }
  if (seite.leistung) graph.push({ '@type': 'Service', name: seite.leistung, serviceType: seite.leistung, description: seite.beschreibung, provider: { '@id': D + '/#firma' }, areaServed: firma.areaServed, url });
  // FAQ automatisch aus der Seite: <details><summary> (FAQ-Baustein) und .fr h3+p (Kanzleien)
  const faq = [];
  for (const m of html.matchAll(/<details[^>]*><summary>([\s\S]*?)<\/summary><div class="faq-a">([\s\S]*?)<\/div><\/details>/g)) faq.push([m[1], m[2]]);
  for (const m of html.matchAll(/<div class="fr">\s*<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g)) faq.push([m[1], m[2]]);
  if (faq.length) graph.push({ '@type': 'FAQPage', '@id': url + '#faq', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: textAus(q), acceptedAnswer: { '@type': 'Answer', text: textAus(a) } })) });
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  return [
    `<title>${esc(titel)}</title>`,
    `<meta name="description" content="${esc(seite.beschreibung || '')}">`,
    seite.noindex ? '<meta name="robots" content="noindex,nofollow">' : '<meta name="robots" content="index,follow,max-image-preview:large">',
    `<link rel="canonical" href="${url}">`,
    '<meta property="og:type" content="website"><meta property="og:locale" content="de_DE"><meta property="og:site_name" content="cloudvibe">',
    `<meta property="og:title" content="${esc(titel)}"><meta property="og:description" content="${esc(seite.beschreibung || '')}"><meta property="og:url" content="${url}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="cv-mockup" content="${seite.titel} v${String(seite.version).padStart(2, '0')}">`,
    `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>`,
  ].join('\n');
}

// ---------- Zusatzmodule (Leon 24.11.2026): je Seite nur passende, anfangs aus, im Panel "Module" einschaltbar ----------
// Bereich ("Welt") der Seite bestimmt, welche Module sinnvoll sind (z. B. kein Gesundheitsmodul bei Kanzleien).
const WELT = { gesundheitswesen: 'gesundheit', arztpraxen: 'arztpraxis', apotheken: 'apotheke', pflege: 'pflege', ti: 'gesundheit', praxischeck: 'gesundheit',
  kanzleien: 'kanzlei', unternehmen: 'unternehmen', selectline: 'unternehmen', datev: 'kanzlei' };
const GESUNDHEIT = ['gesundheit', 'arztpraxis', 'apotheke', 'pflege'];
const OHNE_MODULE = ['startseite', 'konzepte', 'welten', 'wellen', 'ticket', 'termin', 'recht', 'lexikon', 'login']; // Werkzeug-, Formular- und Rechtsseiten
function mitZusatz(id, seite, html) {
  if (OHNE_MODULE.includes(id) || seite.noindex) return html;
  const welt = WELT[id] || 'allgemein', gesund = GESUNDHEIT.includes(welt);
  const hat = (s) => html.includes(s);
  const BL = Object.fromEntries(lies('basis', 'zusatzmodule.html').split(/<!--#modul:(\w+)-->\n?/).slice(1).reduce((a, x, i, arr) => (i % 2 ? a : a.concat([[x, arr[i + 1]]])), []));
  const nimm = [];
  if (!['news', 'newsbeitrag'].includes(id)) nimm.push('news');
  if (!['newsletter', 'news', 'newsbeitrag'].includes(id)) nimm.push('newsletter');
  if (id !== 'karriere') nimm.push('karriere');
  if (gesund && id !== 'praxischeck') nimm.push('praxischeck');
  if (gesund && id !== 'ti' && id !== 'gesundheitswesen') nimm.push('ti');
  if (welt === 'unternehmen' && id !== 'selectline' && !hat('@softwarekarten')) nimm.push('software');
  if (welt === 'kanzlei' && id !== 'datev' && !hat('@softwarekarten')) nimm.push('datev');
  if (!hat('@stimmen') && welt !== 'allgemein') nimm.push('stimmen');
  if (!hat('@kontakt')) nimm.push('kontakt');
  if (!hat('@abschluss')) nimm.push('abschluss');
  let z = nimm.map((n) => BL[n] || '').join('');
  z = z.replace('<!--@kontakt-->', lies('basis', 'kontakt.html').replace('<section class="ab kontakt" id="kontakt">', '<section class="ab kontakt mod-aus" id="kontakt" data-modul="x-kontakt" data-extra data-name="Kontaktformular">'))
    .replace('<!--@stimmen:WELT:mod-aus-->', () => stimmenHtml(welt === 'allgemein' ? 'start' : welt, 'mod-aus').replace(/<section class="([^"]*)" id="stimmen">/, '<section class="$1" id="stimmen" data-modul="x-stimmen" data-extra data-name="Kundenstimmen">'));
  const ende = html.lastIndexOf('</main>');
  return ende < 0 ? html : html.slice(0, ende) + '<!-- ================= Zusatzmodule (anfangs aus) ================= -->\n' + z + html.slice(ende);
}

let nlbNr = 0;
function baue(id, seite) {
  if (UEB && !uebName(id)) return;
  const vv = 'v' + String(seite.version).padStart(2, '0');
  const datei = `cloudvibe_${seite.datei}_${vv}.html`;
  const teil = (n) => (gibt('seiten', n) ? lies('seiten', n) : '');
  const q = seite.quelle || id; // mehrere Probeseiten können eine Quelle teilen
  // "stil" in seiten.json: CSS von Vorlagenseiten mitnehmen, mehrere mit Komma (z. B. "arztpraxen" oder "arztpraxen,unternehmen")
  const vorlagen = (seite.stil || '').split(',').map((s) => s.trim()).filter(Boolean).map((s) => teil(s + '.css')).join('');
  const css = lies('assets', 'schriften.css') + lies('basis', 'basis.css') + vorlagen + teil(q + '.css');
  const body =
    lies('basis', 'kopf.html') +
    mitZusatz(id, seite, teil(q + '.html'))
      .replace('<!--@kontakt-->', lies('basis', 'kontakt.html'))
      .replace('<!--@kontakt:aus-->', lies('basis', 'kontakt.html').replace('<section class="ab kontakt"', '<section class="ab kontakt mod-aus"')) // Kontakt als Modul, anfangs aus (Startseite minimal, Leon 24.11.2026)
      .replace('<!--@abschluss-->', lies('basis', 'abschluss.html')) // kurzer Abschluss statt Formular
      .replace(/<!--@managed(:alt)?-->/g, (_, alt) => lies('basis', 'managed_kurz.html').replace('<section class="ab msk"', '<section class="ab' + (alt ? ' alt' : '') + ' msk"')) // Managed Services kurz (Leon 26.11.2026)
      .replace('<!--@abschluss:aus-->', () => lies('basis', 'abschluss.html').replace('<section class="ab abs-ab"', '<section class="ab abs-ab mod-aus"')) // als Modul aus (Leon 26.11.2026, Team)
      .replace('<!--@lexikon-->', () => lexikonHtml())
      // Newsletter-Anmeldung: <!--@newsletter--> (Karte mit Themenwahl) oder <!--@newsletter:zeile--> (schmale Zeile); {{NLB}} macht IDs eindeutig
      .replace(/<!--@newsletter(?::(zeile))?-->/g, (_, z) => lies('basis', z ? 'newsletter_zeile.html' : 'newsletter.html').replaceAll('{{NLB}}', String(++nlbNr)))
      // :aus = als Modul aus („Kundenstimmen (entfernt)“), :alt-aus = dazu auf Fläche (Prüfdokument 24.11.2026)
      .replace(/<!--@stimmen:(\w+)(?::([\w-]+))?-->/g, (_, was, kl) => {
        if (!kl || !/(^|-)aus$/.test(kl)) return stimmenHtml(was, kl);
        const k = kl === 'aus' ? 'mod-aus' : kl.replace(/-aus$/, '') + ' mod-aus';
        return stimmenHtml(was, k).replace(/(<section class="[^"]*" id="stimmen")>/, '$1 data-name="Kundenstimmen (entfernt)">');
      })
      // Unterkarten Software: alle oder nur eine (z. B. <!--@softwarekarten:datev-->)
      .replace(/<!--@softwarekarten(?::(\w+))?-->/g, (_, nur) => {
        // DATEV-Karte führt zur passenden FAQ: Unternehmen (alle Karten) ?fuer=unternehmen, Kanzleien (nur DATEV) Standard Kanzleien
        const sk = lies('basis', 'softwarekarten.html');
        if (!nur) return sk.replace('{{LINK:datev}}"', '{{LINK:datev}}?fuer=unternehmen"');
        const karten = sk.match(/ <a class="uk[\s\S]*?<\/a>\n/g).filter((k) => k.includes('{{LINK:' + nur + '}}'));
        return '<div class="ukarten ukarten-1">\n' + karten.join('') + '</div>\n';
      }) +
    lies('basis', 'fuss.html') +
    (seite.regler ? lies('basis', 'steuerung_start.html') : lies('basis', 'steuerung.html'));
  const js = lies('basis', 'lexikon.js') + '\n' + lies('basis', 'basis.js') + '\n' + teil(q + '.js');
  let html = `<!DOCTYPE html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<!--@seo-->
<style>${css}</style></head>
<body class="lgB ${seite.body || ''}${seite.hero === 'kompakt' ? ' heroK' : seite.hero === 'werkzeug' ? ' heroW' : ''}" data-welt="${WELT[id] || 'allgemein'}">
${body}
<script>const BEGRIFF_START=${JSON.stringify(cfg.begriff)};const CV_SEITE_ID=${JSON.stringify(id)};const CV_SEITEN=${JSON.stringify(Object.entries(cfg.seiten).filter(([k, s]) => s.pfad && k !== 'startseite').map(([k, s]) => ({ id: k, t: s.titel, e: s.eltern || '', f: dateiVon(k) })))};</script>
<script>${js}</script>
</body></html>`;
  html = ersetze(html, seite, id);
  html = html.replace('<!--@seo-->', () => seoKopf(id, seite, html));
  const rest = html.match(/\{\{[A-Z_]+(:[a-z_]+)?\}\}/g);
  if (rest) throw new Error(datei + ': unersetzte Marken ' + [...new Set(rest)].join(', '));
  if (UEB) {
    // Zwei Fassungen (Leon 24.11.2026: Optionen mit übergeben, final wird später entschieden):
    // seiten/ ohne Mockup-Steuerung (Standardwerte), seiten_mit_optionen/ mit Einstellungs-Panel und allen Umschaltern
    // Für alle festgelegte Einstellungen (Panel „Für alle festlegen“) liegen in ../einstellungen.js und gelten in beiden Fassungen
    const mit = html.replace(/<meta name="cv-mockup"[^>]*>\n?/, '').replace('</head>', '<script src="../einstellungen.js"></script>\n</head>');
    const ohne = mit.replace(/<!-- =+ Mockup-Steuerung[\s\S]*?(?=<script>const BEGRIFF_START)/, '');
    if (ohne === mit) throw new Error(uebName(id) + ': Mockup-Steuerung nicht gefunden');
    for (const [ord, h] of [['seiten', ohne], ['seiten_mit_optionen', mit]]) {
      if ((id === 'konzepte' || id === 'wellen') && ord === 'seiten') continue;
      fs.mkdirSync(path.join(UZ, ord), { recursive: true });
      fs.writeFileSync(path.join(UZ, ord, uebName(id)), h);
    }
    console.log('Übergabe:', uebName(id));
    return;
  }

  // Schutz: Eine vorhandene Datei derselben Version wird nie überschrieben, wenn sie anders ist
  // (Leon kann Mockups direkt bearbeiten und speichern). Dann erst Änderungen übernehmen, Version erhöhen.
  const zielDatei = path.join(ZIEL, datei);
  if (fs.existsSync(zielDatei) && !process.argv.includes('--erzwingen')) {
    if (fs.readFileSync(zielDatei, 'utf8') === html) { console.log('unverändert:', datei); return; }
    console.log(`ÜBERSPRUNGEN: ${datei} existiert und weicht ab. Version in seiten.json erhöhen (oder --erzwingen).`);
    return;
  }
  fs.writeFileSync(zielDatei, html);
  // Ältere Versionen derselben Seite ins Archiv
  fs.mkdirSync(ARCHIV, { recursive: true });
  const muster = new RegExp(`^cloudvibe_${seite.datei}_v(\\d+)\\.html$`);
  for (const f of fs.readdirSync(ZIEL)) {
    const m = f.match(muster);
    if (m && +m[1] < seite.version) {
      fs.renameSync(path.join(ZIEL, f), path.join(ARCHIV, f));
      console.log('  archiviert:', f);
    }
  }
  console.log('gebaut:', datei, Math.round(html.length / 1024) + ' KB');
}

for (const [id, seite] of Object.entries(cfg.seiten)) {
  if (!nur || nur === id) baue(id, seite);
}

if (UEB) {
  // Sitemap mit Links auf die Übergabe-Dateien, ohne Abstimmungsseiten
  globalThis.SITEMAP_OPT = { ziel: path.join(UZ, 'sitemap.html'), link: (id) => (uebName(id) ? 'seiten/' + uebName(id) : null), link2: (id) => (uebName(id) ? 'seiten_mit_optionen/' + uebName(id) : null), ohneAbstimmung: true };
  await import('./sitemap.mjs');
  // einstellungen.js nur anlegen, wenn es sie noch nicht gibt (sonst würde der für alle festgelegte Stand überschrieben)
  const EJ = path.join(UZ, 'einstellungen.js');
  if (!fs.existsSync(EJ)) fs.writeFileSync(EJ, '/* cloudvibe: Einstellungen für alle Besucher. Wird über das Panel mit „Für alle festlegen“ erzeugt und hier ersetzt. Leer = Standard. */\nwindow.CV_EINST = { optionen: {}, module: {}, texte: {} };\n');
  fs.writeFileSync(path.join(UZ, '.nojekyll'), '');
  fs.writeFileSync(path.join(UZ, 'index.html'), `<!DOCTYPE html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">
<title>cloudvibe Redesign</title>
<style>body{margin:0;font:16px/1.55 system-ui,sans-serif;color:#14171C;background:linear-gradient(180deg,#fff,#E6EDF8) fixed;min-height:100vh}main{max-width:760px;margin:0 auto;padding:64px 24px}h1{font-weight:300;font-size:40px;margin:0 0 8px}h1 b{color:#2D6CDF}p{color:#4F5663}a.k{display:block;padding:20px 24px;margin:12px 0;border:1px solid #E3E8F0;border-radius:20px;background:#fff;text-decoration:none;color:#14171C}a.k:hover{border-color:#2D6CDF}a.k b{display:block;font-size:18px}a.k span{color:#4F5663;font-size:15px}</style></head>
<body><main>
<h1>cloudvibe <b>Redesign</b></h1>
<p>Neue Website von cloudvibe, Stand der Abstimmung. Optionen lassen sich in der Fassung „mit Optionen“ unten rechts unter „Einstellungen“ umschalten und werden im Browser gespeichert.</p>
<a class="k" href="seiten_mit_optionen/index.html"><b>Website mit Optionen</b><span>Mit Einstellungs-Panel: Welle, Footer, Module und mehr umschalten, Texte bearbeiten, alles wird im Browser gespeichert</span></a>
<a class="k" href="seiten/index.html"><b>Website</b><span>So, wie Besucher sie sehen (mit dem für alle festgelegten Stand)</span></a>
<a class="k" href="sitemap.html"><b>Sitemap und Seiteninhalte</b><span>Alle Seiten mit Aufbau, Buttons und offenen Punkten</span></a>
<a class="k" href="seiten_mit_optionen/konzepte.html"><b>Konzepte zur Abstimmung</b><span>Offene Entscheidungen mit Varianten zum Ausprobieren, Vor- und Nachteilen und einer Empfehlung</span></a>
</main></body></html>
`);
  // Quellen für die KI: Bausteine, Seitenteile, Assets, Konfiguration und Bauskript
  const QZ = path.join(UZ, 'quellen');
  fs.rmSync(QZ, { recursive: true, force: true });
  for (const x of ['basis', 'seiten', 'assets', 'seiten.json', 'karte.json', 'bauen.mjs', 'sitemap.mjs', 'sitemap.css']) fs.cpSync(path.join(Q, x), path.join(QZ, x), { recursive: true });
  console.log('Übergabe fertig:', UZ);
} else {
  // Sitemap aus dem aktuellen Stand erzeugen (Leon 24.11.2026), dann Mockup-Karte und Teilen-Ordner immer mit aktualisieren
  await import('./sitemap.mjs');
  await import('./karte.mjs');
}

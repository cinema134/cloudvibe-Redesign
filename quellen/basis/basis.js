/* ================= cloudvibe Mockup-Basis (Script) ================= */
const CV = (function () {
  // Unveränderter Stand der Seite, bevor ein Script etwas ändert (Grundlage fürs Speichern)
  const ROH = document.documentElement.outerHTML;
  const $ = (i) => document.getElementById(i);
  const B = document.body;
  const Q = new URLSearchParams(location.search);
  const hoerer = { dark: [] };

  /* ---- Optionen merken (Leon 24.11.2026: auf GitHub einstellen, seitenübergreifend speichern) ----
     Reihenfolge: Adresse (?fuss=…) > in diesem Browser gemerkt (localStorage, gilt auf allen Seiten)
     > für alle festgelegt (einstellungen.js im Hauptordner → window.CV_EINST) > Standard der Seite. */
  const LOKAL = location.protocol === 'file:';
  const OKEY = 'cloudvibe-optionen';
  const EINST = window.CV_EINST || {};
  const TEAM = EINST.optionen || {};
  let MEIN = {};
  try { MEIN = JSON.parse(localStorage.getItem(OKEY)) || {}; } catch (e) {}
  let bereit = false; // erst nach dem Start merken, nicht die Startwerte
  // Entschiedene Optionen (Leon 26.11.2026: „Alles was entschieden ist, kann als Option aus den Einstellungen entfernt werden“):
  // fester Wert, gemerkte Werte und Adress-Parameter wirken nicht mehr. Begriff: Konzept 26 A, Menüleiste: 9 C, Aufbau: 13 A,
  // Einstiege: 14 A, Buttons: 15 B, Abläufe: 17 A, Fußzeile: 18 A, Cookie: 5 A, Höhe: Leon 24.11., Haupt-Button: 12 B/Leiste neu, Terminauswahl: 9 A
  // Leon 26.11.2026 nachträglich: Welle „Original ruhig“ (Konzept 25 B), Kundenstimmen Liste (Konzept 18 C)
  const FEST = { hz: 'glas', leiste: 'block', welle: 'origRuhig', kst: 'liste', ks: 'neu', heroauf: 'kachel', einstieg: 'raster', herobtn: 'alt', ablauf: 'pfeil', fuss: 'k', ccart: 'leiste', heroh: 'einheitlich', hauptbtn: 'termin', termin: 'spalten' };
  const wert = (k, url, std) => (k in FEST ? FEST[k] : url != null && url !== '' ? url : MEIN[k] != null ? MEIN[k] : TEAM[k] != null ? TEAM[k] : std);
  const merke = (k, v) => { if (!bereit) return; MEIN[k] = v; try { localStorage.setItem(OKEY, JSON.stringify(MEIN)); } catch (e) {} };

  /* ---- Begriff "Gesundheitswesen" global austauschbar ---- */
  function setBegriff(t) {
    document.querySelectorAll('.hc').forEach((e) => (e.textContent = t));
    const s = $('begriff');
    if (s) s.value = t;
    merke('begriff', t);
  }
  if ($('begriff')) $('begriff').onchange = (e) => setBegriff(e.target.value);

  /* ---- Dunkel nur per Schalter, nie per Systemeinstellung ---- */
  function setDark(on) {
    B.classList.toggle('dark', on);
    if ($('dk')) $('dk').classList.toggle('on', on);
    document.querySelectorAll('[data-modus]').forEach((x) => { const an = (x.dataset.modus === 'dunkel') === on; x.classList.toggle('on', an); x.setAttribute('aria-pressed', String(an)); });
    hoerer.dark.forEach((f) => f(on));
    merke('dunkel', on);
  }
  if ($('dk')) $('dk').onclick = () => setDark(!B.classList.contains('dark'));
  // Gescrollte Leiste: Mitte | Block (Leon 26.11.2026, Vergleich), ?leiste=mitte|block
  function setLeiste(v) {
    v = v === 'block' ? 'block' : 'mitte';
    B.classList.toggle('lsM', v === 'mitte'); B.classList.toggle('lsB', v === 'block');
    document.querySelectorAll('[data-leiste]').forEach((x) => x.classList.toggle('on', x.dataset.leiste === v));
    merke('leiste', v);
  }
  document.querySelectorAll('[data-leiste]').forEach((x) => (x.onclick = () => setLeiste(x.dataset.leiste)));
  setLeiste(wert('leiste', Q.get('leiste'), 'mitte'));
  // Branchen-Zeichen im Hero (Leon 26.11.2026: „Designtiefe gefällt mir noch nicht, mehrere Konzepte“), ?hz=linie|echo|verlauf|glas|anschnitt|medaillon|aus
  // Aufbau zur Laufzeit: Form in <g id>, Echo als <use>, Verlauf als <defs>; Flächen (Klasse f) bekommen je nach Konzept Füllung
  const HZ = ['linie', 'echo', 'verlauf', 'glas', 'anschnitt', 'medaillon', 'aus'];
  document.querySelectorAll('.uhero>.hz').forEach((svg, i) => {
    if (svg.querySelector('.hz-form')) return;
    const ns = 'http://www.w3.org/2000/svg', g = document.createElementNS(ns, 'g'), id = 'hzForm' + i;
    g.setAttribute('class', 'hz-form'); g.id = id;
    while (svg.firstChild) g.appendChild(svg.firstChild);
    svg.innerHTML = '<defs><linearGradient id="hzVerlauf' + i + '" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="currentColor" stop-opacity=".55"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></linearGradient></defs>';
    const u = document.createElementNS(ns, 'use'); u.setAttribute('href', '#' + id); u.setAttribute('class', 'hz-echo');
    svg.appendChild(u); svg.appendChild(g);
    svg.style.setProperty('--hzv', 'url(#hzVerlauf' + i + ')');
  });
  function setHz(v) {
    if (v === 'an') v = 'linie';
    if (!HZ.includes(v)) v = 'linie';
    HZ.forEach((k) => B.classList.toggle('hz-' + k, k === v));
    B.classList.toggle('hzAus', v === 'aus');
    if ($('hzStil')) $('hzStil').value = v;
    merke('hz', v);
  }
  if ($('hzStil')) $('hzStil').onchange = (e) => setHz(e.target.value);
  setHz(wert('hz', Q.get('hz'), 'linie'));
  // Schalter Hell | Dunkel in der Fußzeile (Leon 26.11.2026); gemerkt wie im Panel, gilt auf allen Seiten
  document.querySelectorAll('[data-modus]').forEach((x) => (x.onclick = () => setDark(x.dataset.modus === 'dunkel')));

  /* ---- Header: beim Scrollen wandert das Logo in die Leiste ---- */
  /* Kopfleiste darf sich nie überlagern (Leon 24.11.2026: "Über uns" lief in "Support"):
     Nach jeder Größen- oder Zustandsänderung messen; wird es eng, zuerst "Termin" kurz, dann Support nur als Symbol. */
  function kopfPasst() {
    const nav = document.querySelector('.kopf nav.nav-neu'), r = document.querySelector('.kopf .kopf-r');
    B.classList.remove('kopf-eng', 'kopf-enger');
    if (!nav || !r || !nav.offsetWidth) return;
    const zuEng = () => { const l = nav.lastElementChild.getBoundingClientRect().right; return l + 16 > r.getBoundingClientRect().left; }; // nur Lage messen (scrollWidth zählt die Dropdowns mit)
    if (zuEng()) B.classList.add('kopf-eng');
    if (zuEng()) B.classList.add('kopf-enger');
  }
  let warStuck = null;
  const stuck = () => {
    const s = scrollY > 90;
    B.classList.toggle('stuck', s);
    // nach dem Wechsel gescrollt/oben noch einmal messen, wenn Logo und Leiste fertig umgebaut sind (Leon 26.11.2026: Anzeigefehler am Support-Knopf beim Hochscrollen)
    if (s !== warStuck) { warStuck = s; kopfPasst(); requestAnimationFrame(() => requestAnimationFrame(kopfPasst)); setTimeout(kopfPasst, 450); }
  };
  addEventListener('scroll', stuck, { passive: true });
  addEventListener('resize', kopfPasst);
  if (document.fonts) document.fonts.ready.then(kopfPasst);
  addEventListener('load', kopfPasst);
  stuck();

  /* ---- Anrufen: am Desktop Nummer zeigen, am Handy direkt anrufen ---- */
  document.querySelectorAll('.call').forEach((c) =>
    c.addEventListener('click', (e) => {
      if (matchMedia('(hover:hover)').matches) {
        e.preventDefault();
        c.classList.toggle('open');
      }
    })
  );

  /* ---- Mockup: tote Links und Formulare abfangen ---- */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href="#"]');
    if (a) e.preventDefault();
  });
  document.querySelectorAll('form').forEach((f) =>
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const m = f.querySelector('.hinweis');
      if (m) m.hidden = false;
    })
  );

  /* ---- Steuerung: Leiste unten rechts, Einstellungs-Panel auf/zu ---- */
  const stg = $('stg');
  if (stg) {
    const t = $('barT');
    const setAuf = (a) => { stg.classList.toggle('auf', a); t.setAttribute('aria-expanded', a ? 'true' : 'false'); };
    t.onclick = () => setAuf(!stg.classList.contains('auf'));
    if ($('stgZu')) $('stgZu').onclick = () => setAuf(false);
    addEventListener('keydown', (e) => { if (e.key === 'Escape') setAuf(false); });
    // Startet zu, damit die Seite frei ist; ?regler=auf öffnet das Panel direkt
    setAuf(Q.get('regler') === 'auf');

    /* Sprung zur Stelle, die ein Schalter verändert (Leon, 23.11.2026), mit kurzer Hervorhebung.
       Ist das Ziel gerade ausgeblendet, geht es zur Stelle davor. */
    const sichtbar = (el) => el && el.getClientRects().length > 0;
    function zeigen(sel, nurWennWeg) {
      let el = document.querySelector(sel);
      if (!el) return;
      let ziel = el;
      while (ziel && !sichtbar(ziel)) ziel = ziel.previousElementSibling || ziel.parentElement;
      if (!ziel || ziel === B) return;
      const r = ziel.getBoundingClientRect();
      const imBild = r.top < innerHeight * 0.8 && r.bottom > innerHeight * 0.15;
      if (nurWennWeg && imBild) return;
      if (!imBild) ziel.scrollIntoView({ behavior: 'smooth', block: r.height > innerHeight * 0.8 ? 'start' : 'center' });
      if (sichtbar(el)) { el.classList.remove('cv-blitz'); void el.offsetWidth; el.classList.add('cv-blitz'); setTimeout(() => el.classList.remove('cv-blitz'), 1700); }
    }
    stg.addEventListener('click', (e) => {
      const b = e.target.closest('button,select'), z = e.target.closest('[data-ziel]');
      if (b && z && b.tagName === 'BUTTON') setTimeout(() => zeigen(z.dataset.ziel), 30);
    });
    stg.addEventListener('change', (e) => { const z = e.target.closest('[data-ziel]'); if (z) setTimeout(() => zeigen(z.dataset.ziel), 30); });
    let regelZeit = 0;
    stg.addEventListener('input', (e) => {
      const z = e.target.closest('[data-ziel]');
      if (z && Date.now() - regelZeit > 600) { regelZeit = Date.now(); zeigen(z.dataset.ziel, true); }
    });
  }

  /* ---- Welle (feine Linien, Grün nach Blau) ---- */
  const ST = [[46, 179, 41], [30, 150, 170], [45, 108, 223]];
  function col(u, a) {
    u = Math.max(0, Math.min(1, u));
    const f = u * 2, i = Math.min(1, Math.floor(f)), r = f - i, A = ST[i], C = ST[i + 1];
    return `rgba(${(A[0] + (C[0] - A[0]) * r) | 0},${(A[1] + (C[1] - A[1]) * r) | 0},${(A[2] + (C[2] - A[2]) * r) | 0},${a})`;
  }
  // p: {N, hs (Fächerbreite = Linienabstand), lw, bp, opm, am (Ausschlag der Welle, Standard 1)}
  // p.ref = 'vh': Abstände und Ausschlag wie im Startseiten-Hero (Bezug Fensterhöhe statt eigene Höhe)
  // p.unten = true: Welle sitzt am unteren Rand, ohne abgeschnitten zu werden
  // Nur Startseite (fehlen sie, bleibt die Welle wie bisher, z. B. cvH/cvK):
  // p.mi Mindestabstand (Anteil des mittleren Linienabstands), p.bw Bewegung (1 = wie bisher),
  // p.wl Wellenlänge (1 = Standard, größer = längere, ruhigere Wellen), p.ng Neigung (-1..1, + = steigt nach rechts),
  // p.fb Farbe (0 Grün→Blau, 1 Blau, 2 Blau→Grün, 3 Blau→Petrol), p.ra Ränder weich ausblenden (0..1),
  // p.lv kräftigere Mitte (0..1), p.zb zweites, leiseres Band (0..1)
  // Drehung entfernt (Leon 24.11.2026: "wirkt nicht")
  const FARBEN = [ST, [[45, 108, 223], [60, 120, 230], [45, 108, 223]], [[45, 108, 223], [30, 150, 170], [46, 179, 41]], [[45, 108, 223], [40, 130, 200], [32, 150, 150]]];
  const PUF = {};
  const puf = (k, n) => (PUF[k] && PUF[k].length === n ? PUF[k] : (PUF[k] = new Float64Array(n)));
  function zeichne(ctx, W, H, p, t, zweit) {
    const am = p.am == null ? 1 : p.am;
    const Rh = p.ref === 'vh' ? Math.max(640, innerHeight) : H;
    if (!zweit) ctx.clearRect(0, 0, W, H);
    const dark = B.classList.contains('dark');
    const xs = -0.03 * W, len = 1.06 * W, steps = Math.max(120, Math.round(W / 7));
    const a = Math.min(1, (dark ? 0.8 : 0.66) * p.opm);
    const pal = FARBEN[p.fb || 0] || ST, ra = p.ra || 0;
    const farbe = (u, al) => {
      u = Math.max(0, Math.min(1, u));
      const f = u * 2, i = Math.min(1, Math.floor(f)), r = f - i, A = pal[i], C = pal[i + 1];
      const rand = ra ? Math.min(1, Math.min(u, 1 - u) / (0.28 * ra + 0.001)) : 1; // weiche Ränder
      return `rgba(${(A[0] + (C[0] - A[0]) * r) | 0},${(A[1] + (C[1] - A[1]) * r) | 0},${(A[2] + (C[2] - A[2]) * r) | 0},${al * rand})`;
    };
    const verlauf = (k) => {
      const g = ctx.createLinearGradient(xs, 0, xs + len, 0);
      for (let s = 0; s <= 24; s++) { const u = s / 24; g.addColorStop(u, farbe(u, a * k * (1 - 0.1 * (1 - Math.abs(2 * u - 1))))); }
      return g;
    };
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    const base = p.unten ? H - (0.085 * am + 0.012 + (p.hoch || 0)) * Rh - 2 * p.lw - 4 : H * p.bp; // p.hoch: Welle höher setzen (Anteil der Höhe)
    const wo = p.wo == null ? 1 : p.wo;
    const bw = p.bw == null ? 1 : p.bw, ex = Math.max(0, bw - 1); // ex: zusätzliche Bewegung über "wie bisher" hinaus
    const mi = p.mi || 0, k = 1 / (p.wl || 1), ng = p.ng || 0, lv = p.lv || 0;
    const n1 = steps + 1, C = puf('c', n1), Wf = puf('w', n1);
    const wmin = mi * 0.32 * Rh * p.hs, kk = 0.35 * wmin; // Mindestbreite des Fächers (weich, ohne Knick)
    const atm = 1 + 0.3 * ex * Math.sin(t * 0.27); // Atmen der Wellenhöhe
    for (let s = 0; s < n1; s++) {
      const u = s / steps;
      C[s] = base - (u - 0.5) * ng * 0.45 * Rh + ((Math.sin(u * Math.PI * 1.6 * k + t * 0.5) * Rh * 0.06 + Math.sin(u * Math.PI * 3.1 * k - t * 0.35) * Rh * 0.02) * atm +
        (ex ? ex * Math.sin(u * Math.PI * 2.4 * k - t * 0.8 + 0.7) * Rh * 0.022 : 0)) * am;
      const lobe = Math.pow(0.5 + 0.5 * Math.sin(u * Math.PI * 1.9 * k + t * 0.45 + 1.6 + (ex ? ex * 0.9 * Math.sin(t * 0.31 + u * 1.7) : 0)), 1.5);
      let w = Rh * p.hs * (0.17 + 0.3 * lobe * wo) * (0.8 + 0.2 * Math.sin(Math.PI * u)); // wo: Wölbung des Fächers
      if (ex) w *= 1 + 0.15 * ex * Math.sin(t * 0.4 + u * 3);
      if (wmin > 0) w = (w + wmin + Math.sqrt((w - wmin) * (w - wmin) + kk * kk)) / 2; // weiches Maximum
      Wf[s] = w;
    }
    const wa = Rh * 0.012 * (Math.min(1, bw) + 0.5 * ex); // Eigenbewegung der einzelnen Linien
    const g1 = lv ? null : verlauf(1);
    for (let i = 0; i < p.N; i++) {
      const o = p.N > 1 ? i / (p.N - 1) : 0.5, m = 1 - Math.abs(2 * o - 1); // m: 1 in der Mitte des Fächers
      ctx.lineWidth = p.lw * (lv ? 1 + 1.6 * lv * m * m : 1);
      ctx.strokeStyle = g1 || verlauf(1 - 0.55 * lv * (1 - m));
      ctx.beginPath();
      for (let s = 0; s < n1; s++) {
        const u = s / steps, x = xs + u * len;
        const y = C[s] - (o * Wf[s] - Math.sin(u * Math.PI * 2 * k + t * 0.6 + o * 1.4) * wa * o);
        s ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.stroke();
    }
    // Zweites, leiseres Band: versetzt, schmaler, mit eigener Phase
    if (p.zb && !zweit) zeichne(ctx, W, H, { ...p, zb: 0, opm: p.opm * (0.1 + 0.45 * p.zb), hs: p.hs * 0.6, bp: p.bp + 0.14, N: Math.max(8, Math.round(p.N * 0.6)), ng: -ng * 0.5, lv: 0 }, t * 0.85 + 9, true);
  }  function flaeche(cv) {
    const ctx = cv.getContext('2d');
    const o = { ctx, W: 0, H: 0 };
    o.rs = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      o.W = cv.clientWidth;
      o.H = cv.clientHeight;
      cv.width = o.W * dpr;
      cv.height = o.H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    o.rs();
    return o;
  }
  // Stehende Welle (Unterseiten-Hero, Kontaktblock). Zeichnet die gewählte Wellenart (Leon 24.11.2026: „an allen Stellen, wo wir Wellen verwenden“):
  // Linien wie bisher, bei Bänder-Varianten die Bänder in der unteren Zone (zone = Anteil der Höhe), bei „mit Linien“ beides.
  const STILL = [];
  const welleJetzt = () => wert('welle', Q.get('welle'), 'origRuhig'); // Standard Bänder „Original ruhig“ (Konzept 25 B, Leon 26.11.2026); ?welle=aktuell = feine Linien
  function stillWelle(cv, p, t = 2.2, zone = 0.42) {
    const f = flaeche(cv);
    const go = () => {
      f.rs(); // Größe jedes Mal neu messen: Hero-Stil und Hero-Höhe können die Fläche ein- und umschalten
      const pp = typeof p === 'function' ? p() : p, zz = typeof zone === 'function' ? zone() : zone; // Werte können vom Hero-Modus abhängen
      const w = BAENDER[welleJetzt()];
      if (!w) return zeichne(f.ctx, f.W, f.H, pp, t);
      f.ctx.clearRect(0, 0, f.W, f.H);
      const hz = Math.min(f.H, Math.max(innerWidth < 700 ? 90 : 150, f.H * zz));
      f.ctx.save(); f.ctx.translate(0, f.H - hz);
      baender(f.ctx, f.W, hz, { ...w.band, a: w.band.a * (pp.opm < 1 ? 0.7 : 0.9), schein: false }, t);
      f.ctx.restore();
      if (w.band.linien) zeichne(f.ctx, f.W, f.H, { ...pp, opm: pp.opm * 0.6 }, t, true);
    };
    addEventListener('resize', go);
    hoerer.dark.push(go);
    STILL.push(go);
    go();
  }
  const wellenNeu = () => STILL.forEach((g) => g());

  /* ---- Bearbeiten und Speichern: Texte direkt ändern, Strg+S überschreibt dieselbe Datei ---- */
  const SEL = '.kopf nav a,.kopf .cta,main h1,main h2,main h3,main h4,main p,main .eb,main .krumen,main .ek-txt>span,main .ek-sub a,main .nk-meta>span,main dt,main dd,main li,main .link,main .btn,main .feld>label,main .check>span,main .refs-k,main .refs-t,main .ort>span,main figcaption,main summary,main blockquote,main .st-br,.fuss p,.fuss h4,.fuss li a,.fuss li small,.f-unten>span,.f-unten nav a';
  function editierbar(root) {
    const alle = [...root.querySelectorAll(SEL)], set = new Set(alle);
    return alle.filter((e) => { for (let p = e.parentElement; p; p = p.parentElement) if (set.has(p)) return false; return true; });
  }

  /* ---- Textänderungen im Browser speichern (online, Leon 24.11.2026: „lokaler Speicher, wo die Änderungen gespeichert werden“) ----
     Jedes bearbeitbare Element bekommt beim Laden eine Nummer (data-txi) und seinen Originaltext gemerkt.
     Gespeichert werden nur wirklich bearbeitete Elemente: {Nummer: [Originaltext kurz, neues HTML]}.
     Beim Laden nur angewendet, wenn der Originaltext an der Stelle noch passt (Schutz bei späterem Umbau der Seite).
     Reihenfolge: in diesem Browser bearbeitet > für alle festgelegt (einstellungen.js → texte) > Original. Lokal (Datei) speichert weiter in die Datei. */
  const SEITE = decodeURIComponent(location.pathname.split('/').pop() || 'index.html').replace(/_v\d+\.html$/, '');
  const TXKEY = 'cloudvibe-texte-' + SEITE;
  const kurz = (e) => e.textContent.replace(/\s+/g, ' ').trim().slice(0, 80);
  const sauber = (e) => {
    const c = e.cloneNode(true);
    c.querySelectorAll('.hc').forEach((h) => (h.textContent = BEGRIFF_START));
    c.removeAttribute('contenteditable');
    c.querySelectorAll('[contenteditable]').forEach((x) => x.removeAttribute('contenteditable'));
    c.querySelectorAll('.lx').forEach((x) => { x.removeAttribute('tabindex'); x.removeAttribute('role'); x.classList.remove('an'); });
    return c.innerHTML;
  };
  const TXEL = editierbar(document), TXORIG = TXEL.map(kurz), TXHTML = TXEL.map(sauber);
  TXEL.forEach((e, i) => (e.dataset.txi = i));
  let meineTexte = {};
  if (!LOKAL) try { meineTexte = JSON.parse(localStorage.getItem(TXKEY)) || {}; } catch (e) {}
  const texteAnwenden = (map) => Object.entries(map || {}).forEach(([i, [orig, html]]) => { if (TXEL[+i] && TXORIG[+i] === orig) TXEL[+i].innerHTML = html; });
  texteAnwenden(EINST.texte && EINST.texte[SEITE]);
  texteAnwenden(meineTexte);
  const GEAEND = new Set();
  function texteMerken() {
    if (LOKAL || !GEAEND.size) return false;
    GEAEND.forEach((i) => {
      const e = TXEL[i], h = sauber(e);
      if (h === TXHTML[i] && !(EINST.texte && EINST.texte[SEITE] && EINST.texte[SEITE][i])) delete meineTexte[i];
      else meineTexte[i] = [TXORIG[i], h];
    });
    GEAEND.clear();
    try { Object.keys(meineTexte).length ? localStorage.setItem(TXKEY, JSON.stringify(meineTexte)) : localStorage.removeItem(TXKEY); } catch (e) {}
    setDirty(false);
    return true;
  }
  let txUhr = 0;
  document.addEventListener('input', (e) => {
    const el = e.target.closest && e.target.closest('[data-txi]');
    if (!el || !el.isContentEditable) return;
    GEAEND.add(+el.dataset.txi);
    clearTimeout(txUhr); txUhr = setTimeout(texteMerken, 800);
  });
  addEventListener('pagehide', texteMerken);

  let edit = false, dirty = false;
  const vorSpeichern = [];
  const toast = (t, ms = 2600) => {
    let el = $('cvToast');
    if (!el) { el = document.createElement('div'); el.id = 'cvToast'; el.className = 'cv-toast'; B.appendChild(el); }
    el.textContent = t; el.classList.add('an');
    clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('an'), ms);
  };
  function setDirty(d) {
    dirty = d;
    if ($('sav')) { $('sav').classList.toggle('dirty', d); $('sav').title = d ? 'Ungespeicherte Änderungen: speichern (Strg+S)' : 'Überschreibt diese Datei (Strg+S)'; }
  }
  function setEdit(on) {
    edit = on;
    B.classList.toggle('edit', on);
    editierbar(document).forEach((e) => (on ? e.setAttribute('contenteditable', 'true') : e.removeAttribute('contenteditable')));
    if ($('edt')) { $('edt').classList.toggle('on', on); const s = $('edt').querySelector('span'); if (s) s.textContent = on ? 'Fertig' : 'Bearbeiten'; }
    if (on && stg) { stg.classList.remove('auf'); $('barT').setAttribute('aria-expanded', 'false'); }
    if (!on && texteMerken()) toast('Texte gespeichert (in diesem Browser).', 2600);
  }
  if ($('edt')) $('edt').onclick = () => setEdit(!edit);
  if ($('edtFertig')) $('edtFertig').onclick = () => setEdit(false);
  if ($('sav')) $('sav').onclick = () => speichern();
  document.addEventListener('click', (e) => {
    if (edit && !e.target.closest('.stg') && e.target.closest('a,button')) e.preventDefault();
  }, true);
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); speichern(); return; }
    if (edit && e.key === 'Enter' && !e.shiftKey && e.target.closest('[contenteditable]')) { e.preventDefault(); e.target.blur(); }
  });
  document.addEventListener('paste', (e) => {
    if (!edit || !e.target.closest('[contenteditable]')) return;
    e.preventDefault();
    document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
  });
  document.addEventListener('input', (e) => { if (edit && e.target.closest('[contenteditable]')) setDirty(true); });
  addEventListener('beforeunload', (e) => { if (!LOKAL) { texteMerken(); return; } if (dirty) { e.preventDefault(); e.returnValue = ''; } });

  // Neue Datei = Originalstand + geänderte Texte (Regler, Schalter und Scrollzustand werden nicht mitgespeichert)
  function htmlNeu() {
    const d = new DOMParser().parseFromString(ROH, 'text/html');
    const alt = editierbar(d), neu = editierbar(document);
    if (alt.length !== neu.length) throw new Error('Seitenaufbau passt nicht zum Original');
    neu.forEach((e, i) => {
      const c = e.cloneNode(true);
      c.querySelectorAll('.hc').forEach((h) => (h.textContent = BEGRIFF_START));
      c.querySelectorAll('[contenteditable]').forEach((x) => x.removeAttribute('contenteditable'));
      c.querySelectorAll('.lx').forEach((x) => { x.removeAttribute('tabindex'); x.removeAttribute('role'); x.classList.remove('an'); });
      alt[i].innerHTML = c.innerHTML;
    });
    vorSpeichern.forEach((f) => f(d)); // Seiten können eigene Daten mitspeichern (z. B. Stellenanzeigen)
    return '<!DOCTYPE html>\n' + d.documentElement.outerHTML;
  }
  // Dateigriff merken (IndexedDB), damit nur beim ersten Speichern gefragt wird
  const idb = (fn) => new Promise((ok, f) => {
    const r = indexedDB.open('cloudvibe-mockup', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('h');
    r.onsuccess = () => { const tx = r.result.transaction('h', 'readwrite'); const q = fn(tx.objectStore('h')); tx.oncomplete = () => ok(q && q.result); tx.onerror = () => f(tx.error); };
    r.onerror = () => f(r.error);
  });
  const dateiName = decodeURIComponent(location.pathname.split('/').pop() || 'mockup.html');
  async function speichern() {
    // Auf GitHub (online): Auswahl ist schon im Browser gemerkt; nur geänderte Texte gehen als Datei raus
    if (!LOKAL) { texteMerken(); toast('Gespeichert in diesem Browser: Texte dieser Seite und alle Einstellungen, auch nach dem Neuladen. Für alle: Einstellungen → „Für alle festlegen“.', 6000); return; }
    let txt;
    try { txt = htmlNeu(); } catch (x) { toast('Speichern nicht möglich: ' + x.message, 5000); return; }
    if (window.showSaveFilePicker) {
      try {
        let h = null;
        try { h = await idb((s) => s.get(dateiName)); } catch (x) {}
        if (h) {
          let p = await h.queryPermission({ mode: 'readwrite' });
          if (p !== 'granted') p = await h.requestPermission({ mode: 'readwrite' });
          if (p !== 'granted') h = null;
        }
        if (!h) {
          h = await showSaveFilePicker({ suggestedName: dateiName, types: [{ description: 'HTML-Seite', accept: { 'text/html': ['.html'] } }] });
          try { await idb((s) => s.put(h, dateiName)); } catch (x) {}
        }
        const w = await h.createWritable();
        await w.write(txt);
        await w.close();
        setDirty(false);
        toast(h.name === dateiName ? 'Gespeichert: ' + h.name : 'Gespeichert als ' + h.name + ' (nicht dieselbe Datei)', 3600);
      } catch (x) {
        if (x.name !== 'AbortError') toast('Speichern fehlgeschlagen: ' + x.message, 5000);
      }
    } else {
      // Andere Browser: Datei wird heruntergeladen und muss die alte ersetzen
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([txt], { type: 'text/html' }));
      a.download = dateiName;
      a.click();
      setDirty(false);
      toast('Heruntergeladen. Bitte die alte Datei damit ersetzen (direktes Überschreiben geht nur in Chrome und Edge).', 6000);
    }
  }

  /* ---- Lexikon: markierte Begriffe zeigen beim Antippen (und am Desktop beim Überfahren) eine kurze Erklärung ---- */
  let pop = null, popZu = null;
  function lxZu() {
    if (!pop) return;
    pop.classList.remove('an');
    document.querySelectorAll('.lx.an').forEach((x) => x.classList.remove('an'));
  }
  function lxAuf(el) {
    const e = typeof LEX !== 'undefined' && LEX[el.dataset.lx];
    if (!e || edit) return;
    if (!pop) {
      pop = document.createElement('div');
      pop.className = 'lx-pop';
      pop.setAttribute('role', 'tooltip');
      pop.addEventListener('mouseenter', () => clearTimeout(popZu));
      pop.addEventListener('mouseleave', () => (popZu = setTimeout(lxZu, 250)));
      B.appendChild(pop);
    }
    clearTimeout(popZu);
    document.querySelectorAll('.lx.an').forEach((x) => x.classList.remove('an'));
    el.classList.add('an');
    pop.innerHTML = '<div class="lx-k">Lexikon · ' + e.b + '</div><b>' + e.t + '</b><p>' + e.d + '</p><a href="{{LINK:lexikon}}#lx-' + el.dataset.lx + '">Im Lexikon ansehen →</a>';
    const r = el.getBoundingClientRect(), w = Math.min(340, innerWidth - 32);
    let x = r.left + scrollX + r.width / 2 - w / 2;
    x = Math.max(16 + scrollX, Math.min(x, scrollX + innerWidth - w - 16));
    pop.style.left = x + 'px';
    pop.style.top = r.bottom + scrollY + 10 + 'px';
    pop.classList.add('an');
  }
  document.querySelectorAll('.lx').forEach((el) => {
    el.tabIndex = 0;
    el.setAttribute('role', 'button');
    el.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); el.classList.contains('an') ? lxZu() : lxAuf(el); });
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); lxAuf(el); } if (e.key === 'Escape') lxZu(); });
    if (matchMedia('(hover:hover)').matches) {
      el.addEventListener('mouseenter', () => lxAuf(el));
      el.addEventListener('mouseleave', () => (popZu = setTimeout(lxZu, 250)));
    }
  });
  document.addEventListener('click', (e) => { if (pop && !e.target.closest('.lx-pop')) lxZu(); });
  addEventListener('scroll', () => { if (matchMedia('(hover:hover)').matches) lxZu(); }, { passive: true });

  /* ---- Startzustand aus der Adresse (zum Vergleichen: ?dunkel=1&begriff=Healthcare) ---- */
  setBegriff(BEGRIFF_START); // Konzept 26 A entschieden: „Gesundheitswesen“, kein Umschalter mehr
  if (Q.get('dunkel') === '1' || (Q.get('dunkel') == null && wert('dunkel', null, false) === true)) setDark(true);
  if (Q.get('bearbeiten') === '1') setEdit(true);

  /* ---- Eyebrow-Farbe (Leon 20.11.2026): G Grau (Standard), B Bereichsfarbe, S Schwarz; ?ebf=B ---- */
  function setEbf(v) {
    B.classList.remove('ebfB', 'ebfG', 'ebfS');
    B.classList.add('ebf' + v);
    document.querySelectorAll('[data-ebf]').forEach((x) => x.classList.toggle('on', x.dataset.ebf === v));
  }
  document.querySelectorAll('[data-ebf]').forEach((x) => (x.onclick = () => setEbf(x.dataset.ebf)));
  setEbf(['B', 'G', 'S'].includes(Q.get('ebf')) ? Q.get('ebf') : 'G'); // Standard Grau (Leon, 20.11.2026)

  /* ---- Aufzählungszeichen zur Probe (Leon, 23.11.2026): P Punkt, H Häkchen, S Strich, L ohne Zeichen (nur Trennlinien); ?az= ----
     Gilt für die Listen in den Einstiegskarten (Gesundheitswesen) und die Fragen (Kanzleien). Zeile nur sichtbar, wo es solche Listen gibt. */
  function setAz(v) {
    B.classList.remove('azP', 'azH', 'azS', 'azL');
    B.classList.add('az' + v);
    document.querySelectorAll('[data-az]').forEach((x) => x.classList.toggle('on', x.dataset.az === v));
    merke('az', v);
  }
  if ($('stgAz')) {
    if (!document.querySelector('.bk ul, .fragen')) $('stgAz').remove();
    else {
      const kz = B.classList.contains('kzseite');
      if (kz) document.querySelector('[data-az="H"]')?.remove(); // Häkchen vor Fragen passt nicht
      document.querySelectorAll('[data-az]').forEach((x) => (x.onclick = () => setAz(x.dataset.az)));
      const az = wert('az', ['P', 'H', 'S', 'L'].includes(Q.get('az')) ? Q.get('az') : null, null);
      setAz(['P', 'H', 'S', 'L'].includes(az) && !(kz && az === 'H') ? az : kz ? 'P' : 'L');
    }
  }

  /* ---- Kopfleiste (Leon 23.11.2026): neu (Standard) oder bisher (?ks=alt); Dropdowns per Klick für Touch ---- */
  function setKs(v) {
    B.classList.toggle('ksAlt', v === 'alt');
    document.querySelectorAll('[data-ks]').forEach((x) => x.classList.toggle('on', x.dataset.ks === v));
    merke('ks', v);
  }
  document.querySelectorAll('[data-ks]').forEach((x) => (x.onclick = () => setKs(x.dataset.ks)));
  setKs(wert('ks', Q.get('ks') === 'alt' ? 'alt' : null, 'neu') === 'alt' ? 'alt' : 'neu');
  /* Hero-Buttons (Leon 23.11.2026): Reduziert (Standard) oder Bisher; ?herobtn=bisher */
  function setHbt(v) {
    B.classList.toggle('hbR', v === 'neu');
    document.querySelectorAll('[data-hbt]').forEach((x) => x.classList.toggle('on', x.dataset.hbt === v));
    merke('herobtn', v);
  }
  document.querySelectorAll('[data-hbt]').forEach((x) => (x.onclick = () => setHbt(x.dataset.hbt)));
  /* Haupt-Button oben: Termin (Standard seit Konzept 12 B, Leon 25.11.2026) oder Ticket (Prüfdokument 24.11.2026); ?kbtn=ticket|termin.
     Gemerkt unter „hauptbtn“, weil der alte Schlüssel „kbtn“ in jedem Browser automatisch „ticket“ gespeichert hat */
  function setKbtn(v) {
    v = v === 'ticket' ? 'ticket' : 'termin';
    B.classList.toggle('kTicket', v === 'ticket');
    document.querySelectorAll('[data-kbtn]').forEach((x) => x.classList.toggle('on', x.dataset.kbtn === v));
    merke('hauptbtn', v);
    if (typeof kopfPasst === 'function') kopfPasst();
  }
  document.querySelectorAll('[data-kbtn]').forEach((x) => (x.onclick = () => setKbtn(x.dataset.kbtn)));
  setKbtn(wert('hauptbtn', Q.get('kbtn'), 'termin'));
  /* Hero-Aufbau (Leon 25.11.2026): Kachel (Standard, Milchglas-Kachel + rechte Einstiegskachel) oder Bisher; ?heroauf=bisher. Nur wo die Seite .hk hat */
  function setHeroAuf(v) {
    if (v !== 'bisher') v = 'kachel';
    B.classList.toggle('hkAn', v === 'kachel');
    document.querySelectorAll('[data-heroauf]').forEach((x) => x.classList.toggle('on', x.dataset.heroauf === v));
    merke('heroauf', v);
  }
  if (!document.querySelector('.uhero-in.hk')) document.querySelectorAll('[data-heroauf]').forEach((x) => x.closest('.stg-z').remove());
  document.querySelectorAll('[data-heroauf]').forEach((x) => (x.onclick = () => setHeroAuf(x.dataset.heroauf)));
  setHeroAuf(wert('heroauf', Q.get('heroauf'), 'kachel'));
  /* Einstiege rechts im Hero (Leon 25.11.2026): Raster 2x2 (Standard) oder Liste; ?einstieg=liste */
  function setEinstieg(v) {
    if (v !== 'liste') v = 'raster';
    B.classList.toggle('hkListe', v === 'liste');
    document.querySelectorAll('[data-einstieg]').forEach((x) => x.classList.toggle('on', x.dataset.einstieg === v));
    merke('einstieg', v);
  }
  if (!document.querySelector('.hk-rechts')) document.querySelectorAll('[data-einstieg]').forEach((x) => x.closest('.stg-z').remove());
  document.querySelectorAll('[data-einstieg]').forEach((x) => (x.onclick = () => setEinstieg(x.dataset.einstieg)));
  setEinstieg(wert('einstieg', Q.get('einstieg'), 'raster'));
  /* Schutz für die rechte Hero-Kachel (Leon 25.11.2026): Einträge, deren Ziel-Abschnitt ausgeblendet ist, verschwinden;
     sind alle weg oder ist die Kachel im Panel aus (Diese Seite → Einstieg rechts), steht die Text-Kachel allein */
  function hkPruefen() {
    const r = document.querySelector('.hk-rechts');
    if (!r) return;
    r.querySelectorAll('a.hk-z[href^="#"]').forEach((a) => {
      const z = document.querySelector(a.getAttribute('href'));
      const sec = z && (z.closest('main>section') || z);
      a.hidden = !!(sec && (sec.classList.contains('mod-aus') || sec.hidden));
    });
    const leer = !r.querySelector('.hk-z:not([hidden]),.hk-inhalt');
    B.classList.toggle('hkOhneRechts', leer || B.classList.contains('hkRechtsAus'));
  }
  const hkSeite = (location.pathname.split('/').pop() || '').replace(/_v\d+\.html$/, '');
  function setHkRechts(an) {
    B.classList.toggle('hkRechtsAus', !an);
    document.querySelectorAll('[data-hkr]').forEach((x) => x.classList.toggle('on', (x.dataset.hkr === 'an') === an));
    merke('hkr-' + hkSeite, an ? 'an' : 'aus');
    hkPruefen();
  }
  /* Abläufe (So starten wir, So läuft …): Pfeilband (Standard, Prüfdokument 24.11.2026) oder Zeitleiste (bisher); ?ablauf=zeitleiste */
  function setAblauf(v) {
    if (v !== 'zeitleiste') v = 'pfeil';
    B.classList.toggle('abZl', v === 'zeitleiste');
    document.querySelectorAll('[data-ablauf]').forEach((x) => x.classList.toggle('on', x.dataset.ablauf === v));
    merke('ablauf', v);
  }
  if (!document.querySelector('.st-reihe')) document.querySelectorAll('[data-ablauf]').forEach((x) => x.closest('.stg-z').remove());
  document.querySelectorAll('[data-ablauf]').forEach((x) => (x.onclick = () => setAblauf(x.dataset.ablauf)));
  setAblauf(wert('ablauf', Q.get('ablauf'), 'pfeil'));
  // Standard jetzt „Termin vereinbaren“ (blau) + „Anrufen“ (grün) (Konzept 15 B, Leon 26.11.2026); ?herobtn=reduziert = ein Button mit eigenem Zweck
  { const q = Q.get('herobtn'); setHbt(wert('herobtn', q === 'bisher' ? 'alt' : q === 'reduziert' ? 'neu' : null, 'alt') === 'neu' ? 'neu' : 'alt'); }
  /* Kopfleiste rechts (Leon 23.11.2026, Variante A): nur "Support ▾" (Fernwartung als erster Punkt) und "Termin vereinbaren"; kein eigener Fernwartung-Button mehr */
  document.querySelectorAll('.kopf .dd').forEach((d) => {
    const t = d.querySelector(':scope>a,:scope>button');
    t.addEventListener('click', (e) => {
      if (matchMedia('(hover:hover)').matches && t.tagName === 'A') return; // Maus: Link folgt, Menü öffnet beim Überfahren
      e.preventDefault();
      const auf = !d.classList.contains('auf');
      document.querySelectorAll('.kopf .dd.auf').forEach((x) => x.classList.remove('auf'));
      d.classList.toggle('auf', auf);
    });
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.kopf .dd')) document.querySelectorAll('.kopf .dd.auf').forEach((x) => x.classList.remove('auf')); });

  /* ---- Mobile Navigation (Leon 23.11.2026): unter 1040 px Menü-Button rechts, Menü klappt als Milchglas-Feld unter der Leiste auf.
     Inhalt wird aus der Kopfleiste (nav.nav-neu und Support-Menü) erzeugt, damit Links nur an einer Stelle gepflegt werden. ---- */
  (function () {
    const nv = document.querySelector('.kopf nav.nav-neu'), kr = document.querySelector('.kopf .kopf-r.nav-neu'), kopf = $('kopf');
    if (!nv || !kr || !kopf) return;
    const CH = '<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5"/></svg>';
    const liste = (m) => '<div class="mn-l">' + [...m.querySelectorAll(':scope>a')].map((a) => a.outerHTML).join('') + '</div>';
    let h = '';
    for (const el of nv.children) {
      if (el.classList.contains('dd')) {
        const a = el.querySelector(':scope>a');
        h += `<details name="mnav"${a.classList.contains('on') ? ' class="on"' : ''}><summary>${a.innerHTML.replace(/<svg[\s\S]*<\/svg>/, '')}${CH}</summary>${liste(el.querySelector('.dd-m'))}</details>`;
      } else if (el.tagName === 'A') h += `<a class="mn-z${el.classList.contains('on') ? ' on' : ''}" href="${el.getAttribute('href')}">${el.innerHTML}</a>`;
    }
    const sup = kr.querySelector('.dd-sup');
    if (sup) h += `<details name="mnav" class="mn-sup"><summary>Support${CH}</summary>${liste(sup)}</details>`;
    // Bei Haupt-Button Ticket steht Termin mobil als eigene Zeile im Menü (oben in der Leiste ist dafür kein Platz)
    const kt = kr.querySelector('.kt-termin');
    if (kt) h += `<a class="mn-z mn-termin" href="${kt.getAttribute('href')}">Termin vereinbaren</a>`;
    // Kein Termin-Button im Menü: "Termin" steht mobil schon in der Leiste (Leon 23.11.2026, keine Dopplung)
    // div statt nav: sonst greifen die Regeln ".kopf nav" der großen Leiste (Fehler v48: Menü als Zeile ab 1041 px sichtbar)
    const p = document.createElement('div');
    p.className = 'mnav'; p.id = 'mnav'; p.setAttribute('role', 'navigation'); p.setAttribute('aria-label', 'Menü'); p.innerHTML = h;
    kopf.appendChild(p);
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'mbtn'; btn.setAttribute('aria-controls', 'mnav'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-label', 'Menü öffnen');
    btn.innerHTML = '<span></span><span></span><span></span>';
    kr.appendChild(btn);
    const setze = (auf) => {
      B.classList.toggle('mnav-auf', auf);
      btn.setAttribute('aria-expanded', String(auf));
      btn.setAttribute('aria-label', auf ? 'Menü schließen' : 'Menü öffnen');
    };
    btn.addEventListener('click', (e) => { e.stopPropagation(); setze(!B.classList.contains('mnav-auf')); });
    p.addEventListener('click', (e) => { if (e.target.closest('a')) setze(false); });
    document.addEventListener('click', (e) => { if (B.classList.contains('mnav-auf') && !e.target.closest('#mnav, .mbtn')) setze(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setze(false); });
    matchMedia('(min-width:1041px)').addEventListener('change', (m) => { if (m.matches) setze(false); });
    // Zum Prüfen: ?menue=auf öffnet das Menü, ?menue=1…5 zusätzlich die jeweilige aufklappbare Gruppe (1 = {{BEGRIFF}}-Bereich, 5 = Support)
    const mq = Q.get('menue');
    if (mq) { setze(true); const d = p.querySelectorAll('details')[+mq - 1]; if (d) d.open = true; }
  })();
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.querySelectorAll('.kopf .dd.auf').forEach((x) => x.classList.remove('auf')); });

  /* ---- Kontaktformular: "Wann erreichen wir dich" nur, wenn eine Telefonnummer eingetragen ist ---- */
  document.querySelectorAll('.kontakt-form').forEach((f) => {
    const tel = f.querySelector('#f-tel'), zeit = f.querySelector('.f-zeit');
    if (tel && zeit) tel.addEventListener('input', () => (zeit.hidden = !tel.value.trim()));
  });

  /* ---- Unterseiten-Hero und stehende Wellen: siehe „Heros“ weiter unten (nach den Bändern, die sie zeichnen) ---- */

  /* ---- Newsletter-Baustein (Karte und Zeile): Anmeldung simulieren, nichts wird verschickt ---- */
  document.querySelectorAll('[data-nlb]').forEach((f) => {
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const i = f.querySelector('input[type=email]'), ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.value.trim());
      f.classList.toggle('fehlt', !ok);
      if (!ok) { i.focus(); return; }
      const ber = [...f.querySelectorAll('.nlb-themen input:checked')].map((x) => x.nextElementSibling.textContent);
      f.querySelector('.nlb-ok-t').textContent = ' Wir haben dir eine E-Mail an ' + i.value.trim() + ' geschickt. Klick auf den Link darin, dann bist du angemeldet.' +
        (ber.length ? ' Bereiche: ' + ber.join(', ') + '.' : '') + ' (Mockup, nichts verschickt.)';
      f.classList.add('gesendet');
      f.querySelector('.nlb-ok').hidden = false;
    });
  });

  /* ---- Cookie-Karte unten links (Abstimmung 24.11.2026): einmal je Sitzung, Footer-Link öffnet sie wieder; ?cookie=aus ---- */
  (function () {
    const cc = $('cc');
    if (!cc) return;
    const KEY = 'cloudvibe-cookie-wahl';
    let wahl = { statistik: false, medien: false };
    try { wahl = JSON.parse(sessionStorage.getItem(KEY)) || wahl; } catch (e) {}
    const auf = (einst) => {
      cc.querySelector('.cc-start').hidden = !!einst;
      cc.querySelector('.cc-einst').hidden = !einst;
      cc.querySelectorAll('[data-cc-k]').forEach((s) => (s.checked = !!wahl[s.dataset.ccK]));
      cc.hidden = false;
    };
    const zu = () => {
      cc.hidden = true;
      try { sessionStorage.setItem(KEY, JSON.stringify(wahl)); } catch (e) {}
    };
    cc.addEventListener('click', (e) => {
      const w = e.target.closest('[data-cc]')?.dataset.cc;
      if (!w) return;
      if (w === 'einst') return auf(true);
      if (w === 'alle') wahl = { statistik: true, medien: true };
      if (w === 'noetig') wahl = { statistik: false, medien: false };
      if (w === 'auswahl') cc.querySelectorAll('[data-cc-k]').forEach((s) => (wahl[s.dataset.ccK] = s.checked));
      zu();
    });
    document.querySelectorAll('[data-cc-auf]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); auf(true); }));
    let gesehen = false;
    try { gesehen = !!sessionStorage.getItem(KEY); } catch (e) {}
    if (!gesehen && Q.get('cookie') !== 'aus' && !$('ck') /* Konzeptseite hat eigene Vorführung */) setTimeout(() => auf(false), 600);
  })();

  /* ---- Kundenstimmen als Bühne (Leon 24.11.2026: alternativer Aufbau); ?kst=liste zeigt die bisherige Liste ---- */
  (function () {
    const ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', '0'); svg.setAttribute('height', '0'); svg.style.position = 'absolute';
    svg.innerHTML = '<defs><linearGradient id="stVerlauf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2EB329"/><stop offset="1" stop-color="#2D6CDF"/></linearGradient></defs>';
    B.appendChild(svg);
    document.querySelectorAll('.stimmen .st-liste').forEach((l) => {
      const st = [...l.querySelectorAll(':scope > .st')];
      if (!st.length) return;
      let akt = 0;
      const nav = document.createElement('div');
      nav.className = 'st-nav';
      if (st.length > 1) {
        nav.innerHTML = '<button type="button" aria-label="Vorige Stimme">‹</button><span class="st-punkte">' + st.map((_, i) => '<i data-i="' + i + '"></i>').join('') + '</span><button type="button" aria-label="Nächste Stimme">›</button>';
        l.after(nav);
      }
      const zeig = (i) => {
        akt = (i + st.length) % st.length;
        st.forEach((s, k) => s.classList.toggle('an', k === akt));
        nav.querySelectorAll('i').forEach((p, k) => p.classList.toggle('an', k === akt));
      };
      const [vor, nach] = nav.querySelectorAll('button');
      if (vor) { vor.onclick = () => zeig(akt - 1); nach.onclick = () => zeig(akt + 1); }
      nav.querySelectorAll('i').forEach((p) => (p.onclick = () => zeig(+p.dataset.i)));
      zeig(0);
    });
    // Prüfdokument 24.11.2026 („Bühne nimmt zu viel Raum ein“): Kompakt (Standard) = Überschrift links, eine Stimme rechts, flacher Abschnitt; Bühne und Liste zum Vergleich
    const setKst = (v) => {
      if (!['kompakt', 'buehne', 'liste'].includes(v)) v = 'kompakt';
      B.classList.toggle('kstListe', v === 'liste');
      B.classList.toggle('kstKompakt', v === 'kompakt');
      document.querySelectorAll('[data-kst]').forEach((x) => x.classList.toggle('on', x.dataset.kst === v));
      merke('kst', v);
    };
    document.querySelectorAll('[data-kst]').forEach((x) => (x.onclick = () => setKst(x.dataset.kst)));
    setKst(wert('kst', Q.get('kst'), 'kompakt'));
  })();

  /* ---- Module je Seite (Leon 24.11.2026): Abschnitte ein-/ausblenden und anordnen, Zusatzmodule je Bereich ----
     Stand: ?mod=id1,id2 (sichtbar in dieser Reihenfolge) > im Browser gemerkt > in der Datei gespeichert (#module-stand) > Standard.
     Nur optisch umordnen (CSS order), damit "Speichern" die Texte weiter richtig zuordnet. */
  (function () {
    const main = document.querySelector('main');
    if (!main || B.classList.contains('ohneModule')) return;
    const secs = [...main.children].filter((e) => e.tagName === 'SECTION' && !e.matches('.uhero,.hero,#top'));
    if (secs.length < 2) return;
    const seite = (location.pathname.split('/').pop() || '').replace(/_v\d+\.html$/, '');
    const KEY = 'cloudvibe-module-' + seite;
    const name = (el) => (el.dataset.name || (el.querySelector('.eb') || el.querySelector('h2') || {}).textContent || el.id || 'Abschnitt').replace(/\s+/g, ' ').trim().slice(0, 48);
    const M = secs.map((el, i) => ({ el, id: el.dataset.modul || el.id || 'm' + i, n: name(el), z: el.hasAttribute('data-extra'), std: !el.classList.contains('mod-aus'), alt: el.classList.contains('alt') }));
    const STD = { o: M.map((m) => m.id), an: M.filter((m) => m.std).map((m) => m.id) };
    let st = null;
    const q = Q.get('mod');
    if (q) { const ids = q.split(','); st = { o: ids.concat(STD.o.filter((x) => !ids.includes(x))), an: ids }; }
    if (!st) try { st = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
    if (!st && EINST.module && EINST.module[seite]) st = JSON.parse(JSON.stringify(EINST.module[seite])); // für alle festgelegt (einstellungen.js)
    if (!st) { const d = $('module-stand'); if (d) try { st = JSON.parse(d.textContent); } catch (e) {} }
    if (!st) st = JSON.parse(JSON.stringify(STD));
    st.o = st.o.filter((x) => STD.o.includes(x)).concat(STD.o.filter((x) => !st.o.includes(x)));
    const istStd = () => JSON.stringify(st.o) === JSON.stringify(STD.o) && JSON.stringify([...st.an].sort()) === JSON.stringify([...STD.an].sort());
    const BG = { '': ['Auto', 'Hintergrund automatisch (wechselt hell/Fläche)'], h: ['Hell', 'Hintergrund hell'], f: ['Fläche', 'Hintergrund Fläche'] };
    // Abschnitte mit eigenem Hintergrund behalten ihn; die übrigen wechseln hell/Fläche, sobald vom Standard abgewichen wird
    const EIGEN = '.kontakt,.einstiege,.tk,.abs-ab,.stimmen-start';
    function anwenden() {
      B.classList.add('modsys');
      const vor = st.o.map((id) => M.find((m) => m.id === id));
      vor.forEach((m, i) => { m.el.style.order = i + 1; m.el.classList.toggle('mod-aus', !st.an.includes(m.id)); });
      let k = 0;
      vor.forEach((m) => {
        if (m.el.classList.contains('mod-aus') || m.el.matches(EIGEN)) return;
        m.el.classList.toggle('alt', istStd() ? m.alt : k % 2 === 1); k++;
      });
      // Hintergrund je Modul selbst wählen (Leon 25.11.2026): Auto (wie bisher) | Hell | Fläche; übersteuert den automatischen Wechsel
      const bg = st.bg || {};
      M.forEach((m) => {
        const w = bg[m.id];
        m.el.classList.toggle('modbg-h', w === 'h');
        m.el.classList.toggle('modbg-f', w === 'f');
        if (w === 'h') m.el.classList.remove('alt');
        if (w === 'f') m.el.classList.add('alt');
        // Welle im Modul (Leon 25.11.2026): feine Linien als ruhiger Grund unten im Abschnitt, je Modul ein/aus
        const mitWelle = !!(st.welle || {})[m.id];
        m.el.classList.toggle('modwelle', mitWelle);
        if (mitWelle && !m.el.querySelector(':scope>canvas.mw')) {
          const c = document.createElement('canvas');
          c.className = 'welle mw'; c.setAttribute('aria-hidden', 'true');
          m.el.prepend(c);
          stillWelle(c, { N: 22, hs: 0.9, lw: 1.1, bp: 0.78, opm: 0.38 }, 3.4, 0.5);
        }
      });
      setTimeout(() => { stickyEinmal(false); wellenNeu(); hkPruefen(); }, 0);
    }
    // Gemerkt wird immer (auch wenn es dem Standard entspricht), damit ein Zurück auf Standard eine Team-Vorgabe übersteuert
    function merken() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} if (LOKAL) setDirty(true); }
    // Beim Speichern den Aufbau in die Datei schreiben
    vorSpeichern.push((d) => {
      let s = d.getElementById('module-stand');
      if (!s) { s = d.createElement('script'); s.type = 'application/json'; s.id = 'module-stand'; d.querySelector('main').appendChild(s); }
      s.textContent = JSON.stringify(st);
    });
    const inhalt = document.querySelector('#stgPanel .stg-inhalt');
    let ol;
    function liste() {
      if (!ol) return;
      ol.innerHTML = '';
      st.o.forEach((id, i) => {
        const m = M.find((x) => x.id === id), an = st.an.includes(id);
        const li = document.createElement('li');
        li.className = 'mz' + (m.z ? ' zusatz' : '') + (an ? '' : ' aus');
        // Zeile (Leon 25.11.2026, Panel neu): oben Name + Ein/Aus, darunter Reihenfolge, Hintergrund und Welle
        const w = (st.bg || {})[id] || '', mw = !!(st.welle || {})[id];
        li.innerHTML = '<div class="mz-kopf"><span class="mz-n"></span><button type="button" class="tg' + (an ? ' on' : '') + '" aria-label="Anzeigen"></button></div>' +
          '<div class="mz-wahl"><span class="mz-pf"><button type="button" aria-label="nach oben"' + (i ? '' : ' disabled') + '>↑</button><button type="button" aria-label="nach unten"' + (i === st.o.length - 1 ? ' disabled' : '') + '>↓</button></span>' +
          '<span class="seg mz-bg" role="group" aria-label="Hintergrund">' + Object.entries(BG).map(([k, [t, ti]]) => '<button type="button" data-v="' + k + '" title="' + ti + '"' + (k === w ? ' class="on"' : '') + '>' + t + '</button>').join('') + '</span>' +
          '<button type="button" class="mz-welle' + (mw ? ' on' : '') + '" title="Welle im Hintergrund dieses Moduls" aria-pressed="' + mw + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 15c3.5 0 3.5-6 7-6s3.5 6 7 6 3.5-6 6-6"/></svg>Welle</button></div>';
        li.querySelector('.mz-n').textContent = m.n;
        const zeig = () => { if (st.an.includes(id)) m.el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
        const neu = () => { anwenden(); merken(); liste(); zeig(); };
        const [hoch, runter] = li.querySelectorAll('.mz-pf button');
        hoch.onclick = () => { st.o.splice(i - 1, 0, st.o.splice(i, 1)[0]); neu(); };
        runter.onclick = () => { st.o.splice(i + 1, 0, st.o.splice(i, 1)[0]); neu(); };
        li.querySelector('.mz-kopf .tg').onclick = () => { an ? (st.an = st.an.filter((x) => x !== id)) : st.an.push(id); neu(); };
        li.querySelectorAll('.mz-bg button').forEach((x) => (x.onclick = () => { st.bg = { ...(st.bg || {}) }; if (x.dataset.v) st.bg[id] = x.dataset.v; else delete st.bg[id]; neu(); }));
        li.querySelector('.mz-welle').onclick = () => { st.welle = { ...(st.welle || {}) }; if (mw) delete st.welle[id]; else st.welle[id] = 1; neu(); };
        ol.appendChild(li);
      });
    }
    if (inhalt && !document.querySelector('.stg-module')) {
      const gr = document.createElement('section');
      gr.className = 'stg-gr stg-module';
      gr.innerHTML = '<h5>Abschnitte dieser Seite</h5><p class="stg-info">Je Abschnitt: anzeigen, mit ↑ ↓ verschieben, Hintergrund wählen (Auto wechselt selbst hell und Fläche) und eine Welle dazuschalten. „Zusatz“ sind passende Abschnitte, die hier noch nicht stehen.</p><ol class="mod-liste"></ol><div class="mod-knoepfe"><button type="button" data-mk="kopie">Aufbau kopieren</button><button type="button" data-mk="std">Zurücksetzen</button></div>';
      inhalt.insertBefore(gr, inhalt.children[1] || null);
      ol = gr.querySelector('.mod-liste');
      // Zurücksetzen: auf den für alle festgelegten Aufbau (einstellungen.js), sonst auf den Standard der Seite
      gr.querySelector('[data-mk="std"]').onclick = () => { st = JSON.parse(JSON.stringify((EINST.module && EINST.module[seite]) || STD)); anwenden(); try { localStorage.removeItem(KEY); } catch (e) {} liste(); };
      gr.querySelector('[data-mk="kopie"]').onclick = async (e) => {
        const bgt = Object.entries(st.bg || {}).filter(([x]) => st.an.includes(x)).map(([x, v]) => x + '=' + (v === 'h' ? 'hell' : 'fläche'));
        const wt = Object.keys(st.welle || {}).filter((x) => st.an.includes(x));
        const txt = seite + ': ' + st.o.filter((x) => st.an.includes(x)).join(', ') + (bgt.length ? ' · Hintergrund: ' + bgt.join(', ') : '') + (wt.length ? ' · Welle: ' + wt.join(', ') : '');
        try { await navigator.clipboard.writeText(txt); e.target.textContent = 'Kopiert'; } catch (x) { prompt('Aufbau:', txt); }
        setTimeout(() => (e.target.textContent = 'Aufbau kopieren'), 1500);
      };
    }
    anwenden(); liste();
  })();

  /* ---- Footer: Schlank (Standard) oder Bisher; ?fuss=bisher ---- */
  // Footer-Konzepte A Schlank, B Minimal, C Kontakt-Band, D Drei Spalten (Leon 24.11.2026); ?fuss=b|c|d, ?fuss=bisher = alter Footer
  const soz = document.querySelector('.fv-a .sozial-r');
  if (soz) document.querySelectorAll('[data-sozial]').forEach((x) => (x.innerHTML = soz.innerHTML));
  function setFuss(v) {
    if (!['k', 'a'].includes(v)) v = 'k'; // K Kompakt ist Standard (Leon 24.11.2026); nur noch K und A (Prüfdokument 24.11.2026)
    B.classList.remove('fussK', 'fussA', 'fussB', 'fussC', 'fussD', 'fussAlt');
    B.classList.add(v === 'bisher' ? 'fussAlt' : 'fuss' + v.toUpperCase());
    document.querySelectorAll('[data-fuss]').forEach((x) => x.classList.toggle('on', x.dataset.fuss === v || (v === 'bisher' && x.dataset.fuss === 'a')));
    merke('fuss', v);
  }
  document.querySelectorAll('[data-fuss]').forEach((x) => (x.onclick = () => setFuss(x.dataset.fuss)));
  setFuss(String(wert('fuss', Q.get('fuss'), 'k')).toLowerCase());
  /* Cookie-Abfrage: Leiste unten (Leon 25.11.2026, Konzept 5 Variante A, Standard) oder bisherige Karte unten links; ?cc=karte */
  function setCcArt(v) {
    if (v !== 'karte') v = 'leiste';
    B.classList.toggle('ccL', v === 'leiste');
    document.querySelectorAll('[data-cc-art]').forEach((x) => x.classList.toggle('on', x.dataset.ccArt === v));
    merke('ccart', v);
  }
  document.querySelectorAll('[data-cc-art]').forEach((x) => (x.onclick = () => setCcArt(x.dataset.ccArt)));
  setCcArt(wert('ccart', Q.get('cc'), 'leiste'));

  /* ---- Mitlaufende Überschrift (sticky) nur einmal je Seite (Leon 24.11.2026: Doppelung vermeiden) ---- */
  function stickyEinmal(alle) {
    // Prüfdokument 24.11.2026: nur mitlaufen, wenn der Abschnitt deutlich länger ist als der Bildschirm (sonst lohnt der Effekt nicht)
    const lang = (e) => { const s = e.closest('section'); return s && s.offsetHeight > innerHeight * 1.5; };
    let erster = true;
    document.querySelectorAll('.ld-kopf,.faq-kopf,.alltag-kopf').forEach((e) => {
      const ja = alle || (erster && lang(e));
      if (ja) erster = false;
      e.style.position = ja ? '' : 'static';
    });
  }
  stickyEinmal(false);
  document.addEventListener('toggle', () => stickyEinmal(false), true); // aufgeklappt kann ein Abschnitt lang genug werden

  /* ---- Fernwartung = direkter Download der RustDesk-.exe, keine eigene Seite (Leon 24.11.2026) ----
     Link aus seiten.json ("fernwartung"); solange er fehlt (#), startet im Mockup kein Download. Danach kurzer Hinweis, was als Nächstes kommt. */
  document.querySelectorAll('[data-fw]').forEach((a) => a.addEventListener('click', (e) => {
    if (a.getAttribute('href') === '#') e.preventDefault();
    toast('RustDesk wird heruntergeladen. Datei öffnen und uns am Telefon die angezeigte ID und das Passwort nennen: ' + (a.dataset.fw || ''), 7000);
  }));

  /* ---- Bänder-Welle (Idee aus dem Team, Leon 24.11.2026): durchscheinende Bänder Grün → Blau, steigen nach rechts ----
     Eine Zeichnung für Startseite (Umschalter „Welle“) und Wellen-Varianten.
     Überarbeitet nach Leon („zu viele weiße Streifen, teils zu linear, mehr am Original halten“):
     - form 's': wie im Entwurf links flach, in der Mitte steiler S-Bogen, rechts aufgefächert, obere Bänder biegen am Rand wieder ab (bogen)
     - weiße Lichtkante nur an wenigen Bändern (kanten), nur oben, blendet zu den Enden weich aus; keine Unterkanten mehr
     - dreh: wie stark sich ein Band verdreht (unter 0,5 ohne Kreuzung, darüber kreuzen sich die Kanten)
     Ältere Varianten (form 'gerade') bleiben zum Vergleich, mit derselben weichen Kante. */
  const BAENDER = {
    original: { t: 'Original', b: 'Nah am Entwurf: breite Bänder im S-Bogen, rechts aufgefächert, zwei weiche Lichtkanten.', sp: 40, band: { form: 's', n: 6, a: 0.30, gl: 0.85, kanten: 2, amp: 0.022, steig: 0.58, breite: 0.15, bogen: 0.1, dreh: 0.4 } },
    origRuhig: { t: 'Original ruhig', b: 'Vier Bänder, langsamer, eine Lichtkante, mehr Weißraum.', sp: 25, band: { form: 's', n: 4, a: 0.27, gl: 0.6, kanten: 1, amp: 0.016, steig: 0.52, breite: 0.17, bogen: 0.07, dreh: 0.3 } },
    origKraeftig: { t: 'Original kräftig', b: 'Mehr Farbe, rechts eine dichte blaue Fläche wie im Entwurf.', sp: 40, band: { form: 's', n: 7, a: 0.36, gl: 0.7, kanten: 2, amp: 0.022, steig: 0.62, breite: 0.18, bogen: 0.12, dreh: 0.4 } },
    origOhne: { t: 'Original ohne Kanten', b: 'Nur die farbigen Bänder, ganz ohne weiße Linien.', sp: 35, band: { form: 's', n: 6, a: 0.31, gl: 0, kanten: 0, amp: 0.02, steig: 0.58, breite: 0.15, bogen: 0.1, dreh: 0.35 } },
    seide: { t: 'Seidenbänder', b: 'Erste Fassung: schmalere Bänder, steigt gleichmäßig an, verdreht sich stärker.', sp: 60, band: { n: 5, a: 0.30, gl: 0.6, kanten: 2, amp: 0.045, steig: 0.40 } },
    ruhig: { t: 'Bänder ruhig', b: 'Erste Fassung: drei breite Bänder, langsam.', sp: 35, band: { n: 3, a: 0.26, gl: 0.55, kanten: 1, amp: 0.035, steig: 0.32 } },
    zart: { t: 'Bänder zart', b: 'Erste Fassung: sehr durchscheinend, kaum Farbe.', sp: 50, band: { n: 5, a: 0.14, gl: 0.7, kanten: 2, amp: 0.04, steig: 0.38 } },
    linien: { t: 'Bänder mit Linien', b: 'Erste Fassung: Bänder als Grund, darüber die feinen Linien der heutigen Welle.', sp: 60, op: 60, band: { n: 4, a: 0.20, gl: 0.45, kanten: 1, amp: 0.04, steig: 0.38, linien: 1 } },
  };
  const sm = (a, b, x) => { x = Math.min(1, Math.max(0, (x - a) / (b - a))); return x * x * (3 - 2 * x); };
  const zufall = (i) => { const x = Math.sin(i * 12.9898 + 4.1) * 43758.5453; return x - Math.floor(x); };
  function baender(ctx, W, H, o, t) {
    ctx.clearRect(0, 0, W, H);
    const dark = B.classList.contains('dark'), s = o.form === 's';
    // leiser blauer Schein rechts, wie im Entwurf
    // Schein nur auf voller Fläche (Startseiten-Hero, Varianten); in Wellenkanten (schein: false) würde er als Rechteck mit harter Kante sichtbar (Leon 24.11.2026)
    if (o.schein !== false) {
      const g = ctx.createRadialGradient(W * 0.95, H * 0.45, 0, W * 0.95, H * 0.45, W * 0.6);
      g.addColorStop(0, `rgba(45,108,223,${dark ? 0.2 : 0.13})`); g.addColorStop(1, 'rgba(45,108,223,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
    const N = Math.max(120, Math.round(W / 10));
    const n = o.n, dreh = o.dreh ?? 0.65, kanten = o.kanten ?? n;
    // Reihenfolge: hinten das weiche Grundband, dann von unten (grün, flach) nach oben (blau, steigt am meisten)
    const liste = [{ k: 0.5, ph: 0.6, sp: 0.5, breit: s ? 2.2 : 2.6, a: o.a * 0.45, grund: true },
      ...Array.from({ length: n }, (_, i) => ({ i, k: n > 1 ? i / (n - 1) : 0.5, ph: i * 1.7 + zufall(i) * 2, sp: 0.55 + 0.25 * Math.sin(i * 2.3), breit: s ? 0.75 + 0.5 * zufall(i + 7) : 1 }))];
    // Lichtkante an den obersten Bändern (im Entwurf liegen sie auf den blauen, steilen Bändern)
    const mitKante = new Set(liste.filter((b) => !b.grund).slice(-kanten).map((b) => b.i).filter((i) => kanten > 0));
    for (const bd of liste) {
      const { k, ph, sp } = bd;
      const oben = [], unten = [];
      for (let j = 0; j <= N; j++) {
        const u = -0.04 + (1.08 * j) / N, x = u * W;
        let c, d;
        if (s) {
          // links flach mit leichter Senke, ab der Mitte breiter S-Anstieg; untere Bänder steigen wenig, obere bis ins obere Viertel
          const sh = (k - 0.5) * 0.12, st = o.steig * (0.3 + 0.75 * k);
          c = H * (0.80 - (k - 0.5) * 0.05 + 0.035 * Math.sin(Math.PI * Math.min(1, Math.max(0, u) / 0.55)) - st * sm(0.3 + sh, 0.98 + sh, u) + o.bogen * k * sm(0.85, 1.12, u))
            + H * o.amp * (Math.sin(u * Math.PI * 1.6 + ph + t * sp) + 0.5 * Math.sin(u * Math.PI * 2.7 - t * 0.35 + ph));
          d = H * (0.05 + o.breite * sm(0, 1, u)) * bd.breit;
        } else {
          const off = (k - 0.5) * H * 0.08;
          c = H * (0.80 - o.steig * sm(0.15, 0.9, u) + 0.05 * Math.sin(u * Math.PI * 1.2)) + off * (0.5 + 0.9 * u)
            + H * o.amp * (0.6 * Math.sin(u * Math.PI * 2 * (0.85 + 0.25 * k) + ph + t * sp) + 0.4 * Math.sin(u * Math.PI * 3.3 - t * 0.4 + ph * 0.5));
          d = H * (0.055 + 0.11 * u + 0.02 * k) * bd.breit;
        }
        const dr = bd.grund ? 1 : 1 - dreh + dreh * Math.sin(u * Math.PI * 1.4 + ph + t * 0.3 * sp); // < 0: Kanten kreuzen sich, das Band verdreht sich
        oben.push([x, c - (d / 2) * dr]); unten.push([x, c + (d / 2) * dr]);
      }
      const a = (bd.a ?? o.a * (0.6 + 0.6 * k)) * (dark ? 1.15 : 1);
      const f = ctx.createLinearGradient(0, 0, W, 0);
      // untere Bänder bleiben länger grün, obere werden früher blau (wie im Entwurf)
      const mitte = Math.min(0.7, Math.max(0.25, 0.55 - 0.25 * k));
      f.addColorStop(0, `rgba(110,214,140,${a})`); f.addColorStop(mitte, `rgba(110,200,238,${a})`); f.addColorStop(1, `rgba(45,108,223,${Math.min(1, a * 1.4)})`);
      ctx.beginPath();
      oben.forEach(([x, y], j) => (j ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      for (let j = unten.length - 1; j >= 0; j--) ctx.lineTo(unten[j][0], unten[j][1]);
      ctx.closePath(); ctx.fillStyle = f; ctx.fill();
      // Lichtkante: nur oben, weich ein- und ausgeblendet, mit leichtem Schimmer daneben
      if (!bd.grund && mitKante.has(bd.i) && o.gl > 0) {
        const al0 = o.gl * (dark ? 0.5 : 1), ST = 6;
        for (let j = 0; j < oben.length - 1; j += ST) {
          const u = -0.04 + (1.08 * (j + ST / 2)) / N;
          const e = sm(0.12 + 0.1 * zufall(bd.i + 3), 0.45, u) * (1 - sm(0.82, 1.02, u)) * (0.75 + 0.25 * Math.sin(u * 9 + ph));
          if (e < 0.02) continue;
          ctx.beginPath();
          for (let m = j; m <= Math.min(j + ST, oben.length - 1); m++) (m === j ? ctx.moveTo : ctx.lineTo).call(ctx, oben[m][0], oben[m][1]);
          ctx.strokeStyle = `rgba(255,255,255,${al0 * e * 0.14})`; ctx.lineWidth = 7; ctx.stroke();
          ctx.strokeStyle = `rgba(255,255,255,${al0 * e})`; ctx.lineWidth = 1.3; ctx.stroke();
        }
      }
    }
  }

  /* ---- Heros (Leon 24.11.2026): einheitliche Höhe, eigener Touch je Bereich, Stil und Wellenart im Panel umschaltbar ----
     Hero-Höhe: einheitlich (Standard, body.hhE) | bisher. Hero-Stil: bereich (Standard: Gesundheitsseiten mit Wellenkante, sonst ruhig mit Bereichs-Hintergrund)
     | welle (Wellenkante auf allen Unterseiten, Farbe je Bereich) | ruhig | schimmer | punkte. Wellenart gilt überall (Startseite, Wellenkanten, Kontaktblock). */
  const WELT = B.dataset.welt || 'allgemein';
  const PAL = { kanzlei: 3, unternehmen: 1 }; // Wellenkante je Bereich: Gesundheit Grün→Blau, Kanzleien Blau→Petrol, Unternehmen Blau, sonst Grün→Blau
  // Kante wie bisher: 16 Linien im Abstand der Startseite (hs 15/29), 1,35 px, am unteren Rand
  // Im einheitlichen Modus flacher und schmaler, damit die Kante in der unteren Zone bleibt und keinen Text berührt (Leon 24.11.2026)
  // Leon 24.11.2026 „zu stark komprimiert, wirkt kaum“: volle Fächerbreite wie bisher, dafür steigt die Kante nach rechts an (ng),
  // links bleibt sie flach am unteren Rand unter dem Text, rechts im freien Bereich hat sie ihre Höhe. Schmal (mobil) flacher.
  const kanteP = () => B.classList.contains('hhE')
    ? (innerWidth < 700
      ? { N: 14, hs: 0.22, am: 0.3, lw: 1.3, opm: 1, ref: 'vh', unten: true, hoch: -0.01, fb: PAL[WELT] || 0 }
      : { N: 16, hs: 15 / 29, am: 0.85, ng: 0.5, lw: 1.35, opm: 1, ref: 'vh', unten: true, hoch: -0.045, fb: PAL[WELT] || 0 })
    : { N: 16, hs: 15 / 29, am: 1, lw: 1.35, opm: 1, ref: 'vh', unten: true, hoch: 0.03, fb: PAL[WELT] || 0 };
  const kanteZone = () => (B.classList.contains('hhE') ? (innerWidth < 700 ? 0.17 : 0.45) : 0.42);
  let kantenDa = false;
  function kanten() {
    if (kantenDa) return;
    kantenDa = true;
    document.querySelectorAll('.uhero').forEach((h) => {
      if (h.querySelector('canvas.welle') || B.classList.contains('heroW')) return; // Werkzeugseiten: keine Kante
      const c = document.createElement('canvas');
      c.className = 'welle'; c.setAttribute('aria-hidden', 'true');
      h.prepend(c);
      stillWelle(c, kanteP, 1.4, kanteZone);
    });
  }
  const STILE = ['bereich', 'welle', 'ruhig', 'schimmer', 'punkte'];
  function setHeroStil(v) {
    if (!STILE.includes(v)) v = 'bereich';
    B.classList.remove('hvA', 'hvB', 'hvC', 'hvW');
    if (v === 'bereich') B.classList.add('hvA');
    if (v === 'welle') { B.classList.add('hvA', 'hvW'); kanten(); }
    if (v === 'schimmer') B.classList.add('hvB');
    if (v === 'punkte') B.classList.add('hvC');
    if ($('heroStil')) $('heroStil').value = v;
    merke('herostil', v);
    wellenNeu();
  }
  function setHeroH(v) {
    B.classList.toggle('hhE', v !== 'bisher');
    document.querySelectorAll('[data-heroh]').forEach((x) => x.classList.toggle('on', x.dataset.heroh === (v === 'bisher' ? 'bisher' : 'einheitlich')));
    merke('heroh', v === 'bisher' ? 'bisher' : 'einheitlich');
    wellenNeu();
  }
  function setWelleArt(v) {
    merke('welle', v);
    if ($('welleArt')) $('welleArt').value = v;
    wellenNeu();
  }
  // Erst Stil und Höhe setzen (macht die Wellenfläche sichtbar), dann zeichnen
  if (document.querySelector('.uhero')) {
    const alt = { A: 'bereich', B: 'schimmer', C: 'punkte' }[Q.get('hero')]; // frühere Adresse ?hero=A|B|C
    // Standard jetzt Wellenkante je Bereich (Prüfdokument 24.11.2026: ruhige Heros wirken trostlos); „Ruhig je Bereich“ bleibt umschaltbar
    setHeroStil(wert('herostil', Q.get('herostil') || alt, 'welle'));
    setHeroH(wert('heroh', Q.get('heroh'), 'einheitlich'));
  }
  if ($('cvH')) stillWelle($('cvH'), kanteP, 1.4, kanteZone);
  if ($('cvK')) stillWelle($('cvK'), { N: 26, hs: 0.9, lw: 1.1, bp: 0.78, opm: 0.55 }, 3.4, 0.6); // Welle hinter dem Kontaktblock
  if ($('heroStil')) $('heroStil').onchange = (e) => setHeroStil(e.target.value);
  document.querySelectorAll('[data-heroh]').forEach((x) => (x.onclick = () => setHeroH(x.dataset.heroh)));
  if ($('welleArt')) {
    $('welleArt').innerHTML = '<option value="aktuell">Aktuell (Linien)</option>' + Object.entries(BAENDER).map(([k, x]) => `<option value="${k}">${x.t}</option>`).join('');
    $('welleArt').value = welleJetzt();
    $('welleArt').onchange = (e) => setWelleArt(e.target.value);
  }

  /* ---- Panel-Bereich „Speichern“: im Browser gemerkt (alle Seiten) und „Für alle festlegen“ (einstellungen.js) ---- */
  const gemerkt = (pre) => {
    const o = {};
    try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith(pre)) o[k.slice(pre.length)] = JSON.parse(localStorage.getItem(k)); } } catch (e) {}
    return o;
  };
  const alleModule = () => gemerkt('cloudvibe-module-');
  function fuerAlle() {
    texteMerken();
    // Texte: je Seite die für alle festgelegten, darüber die in diesem Browser bearbeiteten
    const texte = JSON.parse(JSON.stringify(EINST.texte || {}));
    Object.entries(gemerkt('cloudvibe-texte-')).forEach(([s, m]) => (texte[s] = { ...(texte[s] || {}), ...m }));
    const daten = { stand: new Date().toLocaleString('de-DE'), optionen: { ...TEAM, ...MEIN }, module: { ...(EINST.module || {}), ...alleModule() }, texte };
    const txt = '/* cloudvibe: Einstellungen für alle Besucher, erzeugt im Panel mit „Für alle festlegen“.\n   Diese Datei im Hauptordner des Repositorys ersetzen (GitHub: Add file → Upload files). Gilt nach 1 bis 10 Minuten für alle Seiten. */\nwindow.CV_EINST = ' + JSON.stringify(daten, null, 2) + ';\n';
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([txt], { type: 'text/javascript' }));
    a.download = 'einstellungen.js';
    a.click();
    toast('einstellungen.js heruntergeladen. In GitHub im Hauptordner hochladen (ersetzt die alte), dann gilt die Auswahl für alle.', 8000);
  }
  function meineWeg() {
    if (!confirm('Deine Auswahl und deine Textänderungen in diesem Browser löschen? Es gilt dann wieder, was für alle festgelegt ist.')) return;
    GEAEND.clear();
    try {
      localStorage.removeItem(OKEY);
      Object.keys(alleModule()).forEach((k) => localStorage.removeItem('cloudvibe-module-' + k));
      Object.keys(gemerkt('cloudvibe-texte-')).forEach((k) => localStorage.removeItem('cloudvibe-texte-' + k));
    } catch (e) {}
    location.href = location.pathname; // ohne Adress-Optionen neu laden
  }
  /* „Meine Auswahl senden“ (Leon 25.11.2026): alles, was diese Person in diesem Browser eingestellt hat (Konzept-Entscheidungen,
     Design-Schalter, Seiten aus, Hero aus, Module je Seite, bearbeitete Texte), als Datei herunterladen und eine E-Mail mit Kurzfassung öffnen.
     Nur die eigene Auswahl (nicht das für alle Festgelegte); Claude übernimmt die Datei bzw. den Code in die Live-Konzepte. */
  function meineSenden(zeilen) {
    texteMerken();
    const datum = new Date().toISOString().slice(0, 10);
    const daten = { art: 'cloudvibe-auswahl-einer-person', stand: new Date().toLocaleString('de-DE'), optionen: { ...MEIN }, module: alleModule(), texte: gemerkt('cloudvibe-texte-') };
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(daten, null, 2)], { type: 'application/json' }));
    a.download = 'cloudvibe-meine-auswahl-' + datum + '.json';
    a.click();
    const ko = Object.keys(MEIN).filter((k) => k.startsWith('ko-') && MEIN[k]);
    const kurz = zeilen && zeilen.length ? zeilen : ko.map((k) => k.slice(3) + ': ' + MEIN[k]);
    const nMod = Object.keys(daten.module).length, nTxt = Object.keys(daten.texte).length;
    const text = 'Meine Auswahl für die neue cloudvibe-Website.\n\nBitte die eben heruntergeladene Datei „' + a.download + '“ anhängen, sie enthält alles: '
      + 'Entscheidungen zu den Konzepten, Design-Schalter, ausgeblendete Seiten, Module je Seite (' + nMod + ' Seiten) und bearbeitete Texte (' + nTxt + ' Seiten).\n\n'
      + (kurz.length ? 'Entscheidungen zu den Konzepten (' + kurz.length + '):\n' + kurz.join('\n') + '\n\n' : 'Zu den Konzepten habe ich noch nichts entschieden.\n\n')
      + 'Code für die Übernahme der Konzept-Entscheidungen:\nCV-ENTSCHEIDUNGEN ' + JSON.stringify(Object.fromEntries(ko.map((k) => [k.slice(3), MEIN[k]]))) + '\n';
    setTimeout(() => { location.href = 'mailto:?subject=' + encodeURIComponent('cloudvibe Website: meine Auswahl') + '&body=' + encodeURIComponent(text); }, 400);
    toast('Datei heruntergeladen und E-Mail geöffnet: Datei anhängen, Empfänger eintragen, absenden.', 8000);
  }
  const inhSp = document.querySelector('#stgPanel .stg-inhalt');
  if (inhSp) {
    const gr = document.createElement('section');
    gr.className = 'stg-gr stg-sichern';
    const team = EINST.stand ? 'Für alle festgelegt am ' + EINST.stand + '.' : 'Für alle ist noch nichts festgelegt, es gilt der Standard.';
    gr.innerHTML = '<h5>Speichern</h5><p class="stg-info">' + (LOKAL ? 'Einstellungen werden in diesem Browser gemerkt und gelten auf allen Seiten; Texte schreibt „Speichern“ in die Datei. ' : 'Einstellungen und Textänderungen (Bearbeiten) werden automatisch im Speicher dieses Browsers gemerkt und gelten auf allen Seiten, auch nach dem Neuladen. ') + team + ' Mit „Für alle festlegen“ lädst du die Datei <b>einstellungen.js</b> mit allem herunter. Im Hauptordner auf GitHub hochgeladen, sehen alle Besucher diesen Stand.</p><div class="mod-knoepfe"><button type="button" data-sp="senden" title="Datei mit deiner ganzen Auswahl und eine fertige E-Mail, zum Beispiel an Leon">Meine Auswahl senden</button><button type="button" data-sp="alle">Für alle festlegen</button><button type="button" data-sp="weg">Meine Auswahl zurücksetzen</button></div>';
    inhSp.appendChild(gr);
    gr.querySelector('[data-sp="alle"]').onclick = fuerAlle;
    gr.querySelector('[data-sp="senden"]').onclick = () => meineSenden();
    gr.querySelector('[data-sp="weg"]').onclick = meineWeg;
  }

  /* ---- Einstellungsfenster in drei Reitern (Leon 25.11.2026: neu konzipieren, Benennung neu ordnen) ----
     „Diese Seite“: Abschnitte (Module) und Varianten nur dieser Seite · „Design“: was auf allen Seiten gilt · „Sichern“: Speichern für alle.
     Seitenskripte, die später Zeilen ergänzen, nutzen CV.panelZeile(z) (landet unter „Diese Seite“). */
  const REITER = [['seite', 'Diese Seite'], ['design', 'Design'], ['sichern', 'Sichern']];
  const reiterVon = (g) => g.dataset.tab || (g.matches('.stg-module,.stg-seite,.stg-stellen') ? 'seite' : g.matches('.stg-sichern') ? 'sichern' : 'design');
  let zeigeReiter = () => {};
  if (inhSp) {
    const leiste = document.createElement('div');
    leiste.className = 'stg-reiter'; leiste.setAttribute('role', 'tablist');
    leiste.innerHTML = REITER.map(([k, t]) => `<button type="button" role="tab" data-reiter="${k}">${t}</button>`).join('');
    inhSp.before(leiste);
    zeigeReiter = (k) => {
      const hat = (r) => [...inhSp.querySelectorAll(':scope>section')].some((g) => reiterVon(g) === r && g.querySelector('.stg-z,li,.mod-knoepfe,.stg-welle,label'));
      if (!hat(k)) k = 'design';
      leiste.querySelectorAll('button').forEach((b) => { b.classList.toggle('on', b.dataset.reiter === k); b.setAttribute('aria-selected', b.dataset.reiter === k); b.hidden = !hat(b.dataset.reiter); });
      inhSp.querySelectorAll(':scope>section').forEach((g) => (g.hidden = reiterVon(g) !== k));
      try { localStorage.setItem('cloudvibe-reiter', k); } catch (e) {}
    };
    leiste.onclick = (e) => { const b = e.target.closest('[data-reiter]'); if (b) zeigeReiter(b.dataset.reiter); };
    let start = 'seite';
    try { start = localStorage.getItem('cloudvibe-reiter') || 'seite'; } catch (e) {}
    setTimeout(() => zeigeReiter(start), 0); // nach den Seitenskripten, die noch Zeilen ergänzen
  }
  // Zeile für „Diese Seite“ (z. B. Termin: Terminauswahl); legt die Gruppe bei Bedarf an
  function panelZeile(z) {
    if (!inhSp) return;
    let g = inhSp.querySelector('.stg-seite');
    if (!g) { g = document.createElement('section'); g.className = 'stg-gr stg-seite'; g.innerHTML = '<h5>Varianten dieser Seite</h5>'; inhSp.prepend(g); }
    g.appendChild(z);
    zeigeReiter(document.querySelector('.stg-reiter .on')?.dataset.reiter || 'seite');
  }
  if (document.querySelector('.hk-rechts')) {
    if (inhSp) {
      const z = document.createElement('div');
      z.className = 'stg-z'; z.dataset.ziel = '#top';
      z.innerHTML = '<span>Einstieg rechts im Hero</span><div class="seg"><button type="button" data-hkr="an" class="on">Zeigen</button><button type="button" data-hkr="aus">Aus</button></div>';
      panelZeile(z);
      z.querySelectorAll('[data-hkr]').forEach((x) => (x.onclick = () => setHkRechts(x.dataset.hkr === 'an')));
    }
    setHkRechts(wert('hkr-' + hkSeite, null, 'an') === 'an');
  }
  /* Hero je Seite abschaltbar (Leon 25.11.2026): Diese Seite → „Hero (erster Bildschirm)“ Zeigen | Aus, je Seite gemerkt (hero-<datei>), ?hero=aus.
     Aus = nur Abstand unter der Kopfleiste, die H1 bleibt für Suchmaschinen und Screenreader erhalten. Werkzeugseiten haben ohnehin keinen Hero. */
  const heroEl = document.querySelector('main>.uhero,main>.hero');
  if (heroEl && !B.classList.contains('heroW')) {
    // Seitenkopf bei „Hero aus“ (Leon 26.11.2026: „oben mehr Luft, muss auf der Seite immer sauber vermittelt werden“):
    // Pfad und Seitentitel aus dem Hero übernommen, damit klar ist, wo man ist. Die echte H1 bleibt im Hero (nur für Suchmaschinen sichtbar).
    if (!heroEl.querySelector(':scope>.seitenkopf')) {
      const h1 = heroEl.querySelector('h1'), kr = heroEl.querySelector('.krumen');
      if (h1) {
        const sk = document.createElement('div');
        sk.className = 'seitenkopf'; sk.setAttribute('aria-hidden', 'true');
        sk.innerHTML = '<div class="wrap">' + (kr ? '<div class="krumen">' + kr.innerHTML + '</div>' : '') + '<div class="sk-t">' + h1.innerHTML + '</div></div>';
        sk.querySelectorAll('a').forEach((a) => a.setAttribute('tabindex', '-1'));
        heroEl.appendChild(sk);
        // nicht mitspeichern, wird beim Laden neu aus Pfad und H1 erzeugt
        if (typeof vorSpeichern !== 'undefined') vorSpeichern.push((d) => d.querySelectorAll('.seitenkopf').forEach((x) => x.remove()));
      }
    }
    function setHero(an, merken) {
      B.classList.toggle('heroAus', !an);
      document.querySelectorAll('[data-heroan]').forEach((x) => x.classList.toggle('on', (x.dataset.heroan === 'an') === an));
      if (merken) merke('hero-' + hkSeite, an ? 'an' : 'aus');
      setTimeout(() => { if (typeof wellenNeu === 'function') wellenNeu(); }, 0);
    }
    if (inhSp) {
      const z = document.createElement('div');
      z.className = 'stg-z'; z.dataset.ziel = '#top';
      z.innerHTML = '<span>Hero (erster Bildschirm)</span><div class="seg"><button type="button" data-heroan="an" class="on">Zeigen</button><button type="button" data-heroan="aus">Aus</button></div>';
      panelZeile(z);
      z.querySelectorAll('[data-heroan]').forEach((x) => (x.onclick = () => setHero(x.dataset.heroan === 'an', true)));
    }
    // Standard je Seite: data-hero-std="aus" am Hero (Leon 26.11.2026: Team, Karriere, News ohne Hero); ?hero=an zeigt ihn
    setHero(wert('hero-' + hkSeite, Q.get('hero'), heroEl.dataset.heroStd === 'aus' ? 'aus' : 'an') !== 'aus', false);
  }
  /* Logo auf allen Seiten (Leon 25.11.2026: „muss auf allen Seiten angezogen werden“): Größe (--lgh), Abstand (--lga),
     Größe in der Leiste (--lgk) und „Logo frei links“ werden gemerkt (lgs, lga, lgk, logoFrei) und hier überall angewendet.
     Regler im Panel (Design → Logo); auf der Startseite steuert startseite.js Größe/Abstand/frei mit Zahlenfeldern, hier nur lgk. */
  {
    const R = document.documentElement;
    const VAR = { lgs: '--lgh', lga: '--lga', lgk: '--lgk' };
    const anwenden = (k, v) => { if (v == null || v === '') R.style.removeProperty(VAR[k]); else R.style.setProperty(VAR[k], v + 'px'); };
    Object.keys(VAR).forEach((k) => anwenden(k, wert(k, null, null)));
    if (wert('logoFrei', null, true) === false) B.classList.remove('lgB');
    const start = !!$('cpy'); // Startseiten-Panel: dort übernimmt startseite.js Größe, Abstand und „frei“
    Object.keys(VAR).forEach((k) => {
      const r = $(k);
      if (!r || (start && k !== 'lgk')) return;
      const cur = parseFloat(getComputedStyle(R).getPropertyValue(VAR[k]));
      if (isFinite(cur)) r.value = cur;
      let n = r.parentNode.querySelector('.v');
      if (!n) { n = document.createElement('span'); n.className = 'v'; r.parentNode.insertBefore(n, r); }
      const zeig = () => (n.textContent = Math.round(r.value) + ' px');
      zeig();
      r.addEventListener('input', () => { anwenden(k, +r.value); merke(k, +r.value); zeig(); });
    });
    if (!start && $('lgb')) {
      $('lgb').classList.toggle('on', B.classList.contains('lgB'));
      $('lgb').onclick = (e) => { const an = B.classList.toggle('lgB'); e.currentTarget.classList.toggle('on', an); merke('logoFrei', an); };
    }
  }
  /* Seiten ausblenden (Leon 25.11.2026): Design → „Seiten“. Ausgeblendete Seiten verschwinden aus Menü, mobilem Menü, Footer und
     aus Links und Buttons im Inhalt (das umgebende li bzw. der Link selbst). Gilt auf allen Seiten (Option seitenAus = Liste der IDs),
     „Für alle festlegen“ übernimmt sie. Die Startseite ist immer an. Öffnet man eine ausgeblendete Seite, erscheint ein Hinweis. */
  const SEITEN_ROH = typeof CV_SEITEN !== 'undefined' ? CV_SEITEN : [];
  // Reihenfolge im Panel: Hauptseite, darunter ihre Unterseiten
  const SEITEN = SEITEN_ROH.filter((s) => !s.e || !SEITEN_ROH.some((p) => p.id === s.e)).flatMap((p) => [p, ...SEITEN_ROH.filter((c) => c.e === p.id)]);
  const seiteDatei = (h) => (h || '').split(/[?#]/)[0].split('/').pop();
  function setSeitenAus(liste, merken) {
    liste = (Array.isArray(liste) ? liste : []).filter((x) => SEITEN.some((s) => s.id === x));
    const aus = new Set(SEITEN.filter((s) => liste.includes(s.id) || liste.includes(s.e)).map((s) => seiteDatei(s.f)));
    document.querySelectorAll('.sAus').forEach((e) => e.classList.remove('sAus'));
    document.querySelectorAll('a[href]').forEach((a) => {
      if (a.closest('.stg') || !aus.has(seiteDatei(a.getAttribute('href')))) return;
      // im Menü/Footer das ganze li (bei Dropdowns samt Unterpunkten), sonst nur der Link oder Button
      const li = a.closest('li');
      (li && li.querySelector('a[href]') === a ? li : a).classList.add('sAus');
    });
    // Abschnitte, die nur auf ausgeblendete Seiten verweisen (z. B. Karriere oder News auf der Startseite), verschwinden mit
    document.querySelectorAll('main>section:not(.uhero,.hero)').forEach((sec) => {
      if (!sec.querySelector('.sAus')) return;
      const rest = [...sec.querySelectorAll('a[href]')].some((a) => !a.closest('.sAus'));
      if (!rest) sec.classList.add('sAus');
    });
    document.querySelectorAll('[data-seite-an]').forEach((b) => { const an = !liste.includes(b.dataset.seiteAn); b.classList.toggle('on', an); b.setAttribute('aria-pressed', an); });
    // Unterseiten einer ausgeblendeten Hauptseite sind mit aus (Schalter grau)
    document.querySelectorAll('[data-seite-an]').forEach((b) => { const s = SEITEN.find((x) => x.id === b.dataset.seiteAn); b.closest('.stg-z').classList.toggle('stg-mit-aus', !!(s && s.e && liste.includes(s.e))); });
    const hier = typeof CV_SEITE_ID !== 'undefined' && SEITEN.find((s) => s.id === CV_SEITE_ID);
    const hw = $('seiteAusHinweis');
    const istAus = !!(hier && (liste.includes(hier.id) || liste.includes(hier.e)));
    if (istAus && stg && !hw) { const d = document.createElement('div'); d.id = 'seiteAusHinweis'; d.className = 'seite-aus'; d.innerHTML = '<b>Diese Seite ist ausgeblendet.</b><span>Sie erscheint in keinem Menü und keinem Link. Wieder einblenden unter Einstellungen → Design → Seiten.</span>'; B.appendChild(d); }
    if (!istAus && hw) hw.remove();
    if (merken) merke('seitenAus', liste);
    if (typeof hkPruefen === 'function') hkPruefen();
  }
  if (SEITEN.length) {
    if (inhSp) {
      const g = document.createElement('section');
      g.className = 'stg-gr stg-seiten'; g.dataset.tab = 'design';
      g.innerHTML = '<h5>Seiten</h5><div class="stg-tipp">Was noch nicht gebraucht wird, ausschalten: Die Seite verschwindet aus Menü, Footer und allen Links.</div>' +
        SEITEN.map((s) => `<div class="stg-z${s.e ? ' stg-unter' : ''}"><span>${s.t}</span><button type="button" class="tg on" data-seite-an="${s.id}" aria-pressed="true" aria-label="${s.t} anzeigen"></button></div>`).join('');
      inhSp.appendChild(g);
      g.querySelectorAll('[data-seite-an]').forEach((b) => (b.onclick = () => {
        const cur = [].concat(wert('seitenAus', null, []) || []);
        const id = b.dataset.seiteAn, i = cur.indexOf(id);
        if (i >= 0) cur.splice(i, 1); else cur.push(id);
        setSeitenAus(cur, true);
      }));
    }
    const qs = Q.get('seitenaus');
    setSeitenAus(qs != null ? qs.split(',').filter(Boolean) : wert('seitenAus', null, []), false);
  }

  /* ---- Saison (Leon 26.11.2026): Weihnachten und Ostern dezent ----
     Automatik nach Datum: Weihnachten vom 1. Advent bis 6. Januar, Ostern von 7 Tagen vor Ostersonntag bis Ostermontag.
     Logo: eigene Dateien (assets/saison, Daten im <template id="cv-saison-logos"> aus kopf.html), deckungsgleich und unten bündig
     über dem Original, damit der Schriftzug in jeder Größe an seiner Stelle bleibt; ragt die Deko über den Bildschirmrand, rückt das Logo nach unten.
     Weihnachten zusätzlich leichter Schnee im Startseiten-Hero (nicht mobil, nicht bei reduzierter Bewegung).
     Design → „Saison“ Automatisch | Aus | Weihnachten | Ostern, Option saison, ?saison=weihnachten|ostern|aus|auto. */
  {
    const T = $('cv-saison-logos');
    const LOGO = { weihnachten: { f: 881 / 694 }, ostern: { f: 919 / 694 } }; // Weihnachten: schräge Mütze mit Geweih (Leon 26.11.2026) // Höhe der Saisondatei / Höhe des Originals (oben Platz für Mütze bzw. Ohren)
    const tag = 864e5;
    const ostersonntag = (j) => { // Gauß/Meeus, gregorianisch
      const a = j % 19, b = Math.floor(j / 100), c = j % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
      const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
      const mon = Math.floor((h + l - 7 * m + 114) / 31), t = ((h + l - 7 * m + 114) % 31) + 1;
      return new Date(j, mon - 1, t);
    };
    const ersterAdvent = (j) => { const w = new Date(j, 11, 25), d = w.getDay(); return new Date(j, 11, 25 - (d === 0 ? 7 : d) - 21); };
    const automatisch = (jetzt = new Date()) => {
      const t = new Date(jetzt.getFullYear(), jetzt.getMonth(), jetzt.getDate()), j = t.getFullYear();
      if (t >= ersterAdvent(j) || t <= new Date(j, 0, 6)) return 'weihnachten';
      const o = ostersonntag(j);
      if (t >= new Date(o - 7 * tag) && t <= new Date(+o + tag)) return 'ostern';
      return 'aus';
    };
    const schnee = (an) => {
      const hero = document.querySelector('main>.hero');
      const alt = document.querySelector('.sz-schnee');
      if (!an || !hero || innerWidth <= 700 || matchMedia('(prefers-reduced-motion: reduce)').matches) { if (alt) alt.remove(); return; }
      if (alt) return;
      const s = document.createElement('div'); s.className = 'sz-schnee'; s.setAttribute('aria-hidden', 'true');
      let h = '';
      for (let i = 0; i < 26; i++) { const z = 2 + ((i * 37) % 4); h += `<i style="left:${(i * 53) % 100}%;width:${z}px;height:${z}px;animation-duration:${16 + ((i * 7) % 12)}s;animation-delay:-${(i * 3.7) % 26}s;opacity:${0.55 + ((i * 7) % 4) / 10}"></i>`; }
      s.innerHTML = h; hero.appendChild(s);
    };
    /* Deko (Leon 26.11.2026, Skizze assets/saison/skizze_saison_2.js):
       Lichterkette/Ostergirlande unter dem Menü wieder entfernt (Leon 26.11.2026: „im Design zu viel“), Entwurf bleibt in der Skizze;
       Karten mit data-sz-w="k2|k3" (Weihnachtskugeln oben) bzw. data-sz-o="a|b" (Nest mit Eiern unten), Lage per --sz-r/--sz-nr am Element;
       Startseite „Folge uns“: Kugel am YouTube-Button bzw. Hase, der dahinter hervorlugt. Alles aria-hidden, nichts davon wird gespeichert. */
    const kugel = (x, faden, r, farbe, kappe, verz) => `<g class="sz-pendel" style="animation-delay:-${verz}s"><path d="M${x} 0V${faden}" stroke="#B8BFCB" stroke-width="1"/><rect x="${x - 3}" y="${faden - 1}" width="6" height="4" rx="1" fill="${kappe}"/><circle cx="${x}" cy="${faden + 3 + r}" r="${r}" fill="${farbe}"/><ellipse cx="${x - r * 0.35}" cy="${faden + 3 + r * 0.6}" rx="${r * 0.25}" ry="${r * 0.38}" fill="#fff" opacity=".45"/></g>`;
    const KUGELN = {
      k2: `<svg width="60" height="54" viewBox="0 0 60 54">${kugel(18, 18, 10, '#2E7D5B', '#C9A94B', 0.6)}${kugel(44, 6, 8, '#C0392B', '#C9A94B', 1.8)}</svg>`,
      k3: `<svg width="84" height="58" viewBox="0 0 84 58">${kugel(16, 12, 9, '#C0392B', '#C9A94B', 0)}${kugel(42, 22, 11, '#D4A63A', '#B8923A', 1.3)}${kugel(68, 6, 8, '#2E7D5B', '#C9A94B', 2.1)}</svg>`
    };
    const ei = (x, y, w, h, farbe, muster, dreh) => `<g transform="rotate(${dreh} ${x} ${y})"><path d="M${x} ${y - h / 2} C${x - w * 0.62} ${y - h / 2} ${x - w / 2} ${y + h * 0.2} ${x - w / 2} ${y + h * 0.18} C${x - w / 2} ${y + h * 0.42} ${x - w * 0.28} ${y + h / 2} ${x} ${y + h / 2} C${x + w * 0.28} ${y + h / 2} ${x + w / 2} ${y + h * 0.42} ${x + w / 2} ${y + h * 0.18} C${x + w / 2} ${y + h * 0.2} ${x + w * 0.62} ${y - h / 2} ${x} ${y - h / 2} Z" fill="${farbe}"/>${muster}</g>`;
    const eierA = `${ei(30, 27, 22, 29, '#F6D776', '<path d="M20 27q5-3.5 10 0t10 0" stroke="#E39A3B" stroke-width="2" fill="none"/>', -16)}${ei(66, 28, 22, 29, '#C9B6E8', '<circle cx="61" cy="24" r="2" fill="#fff"/><circle cx="69" cy="30" r="2" fill="#fff"/><circle cx="63" cy="34" r="1.7" fill="#fff"/>', 14)}${ei(48, 23, 24, 32, '#9ED9B8', '<path d="M37 21h22M37 27h22" stroke="#fff" stroke-width="2.2"/>', 0)}`;
    const NESTER = { a: eierA, b: eierA.replace(/F6D776/g, 'F4B8C8').replace(/9ED9B8/g, 'F6D776') };
    const nest = (eier) => `<svg width="80" height="48" viewBox="0 0 96 58"><path d="M10 34 Q48 22 86 34" fill="none" stroke="#B88A4A" stroke-width="3" stroke-linecap="round"/><path d="M14 32 Q48 24 82 32" fill="none" stroke="#DDBB78" stroke-width="2" stroke-linecap="round"/>${eier}<path d="M6 34 Q8 54 48 55 Q88 54 90 34 Q48 44 6 34 Z" fill="#C99A55"/><path d="M10 38 Q48 49 86 38 M12 44 Q48 53 84 44 M18 50 Q48 56 78 50" fill="none" stroke="#A97B3C" stroke-width="1.4" stroke-linecap="round"/><path d="M14 36 Q30 42 46 40 M50 41 Q68 42 82 36 M22 46 Q38 50 54 48 M58 48 Q70 48 78 45" fill="none" stroke="#E6C88A" stroke-width="1.2" stroke-linecap="round"/><path d="M6 34 Q2 31 0 33 M90 34 Q94 30 96 32 M30 54 Q26 57 22 56 M66 54 Q72 57 76 55" fill="none" stroke="#B88A4A" stroke-width="1.3" stroke-linecap="round"/></svg>`;
    // Ostern im Footer (Leon 26.11.2026): großes Nest unter den Telefonnummern, knapp über der Linie;
    // ist dort kein Platz (schmale Fenster, Spalten umgebrochen), kleines Nest rechts neben den Symbolen
    const fussNest = () => {
      document.querySelectorAll('.sz-fnest, .sz-fn').forEach((x) => x.remove());
      if (aktiv !== 'ostern') return;
      const F = [...document.querySelectorAll('.fuss')].find((f) => f.offsetHeight);
      if (!F) return;
      const linie = F.querySelector('.fk-unten');
      const W = 130, H = 78, HOCH = 12; // Leon 26.11.2026: unter der Spalte Telefon mittig zentriert; 27.11.: etwas kleiner und minimal höher
      // erst unter Telefon, sonst unter der nächsten Spalte, unter der bis zur Linie Platz ist
      for (const sp of linie ? F.querySelectorAll('.fk-sp') : []) {
        const fr = F.getBoundingClientRect(), tr = sp.getBoundingClientRect(), lt = linie.getBoundingClientRect().top;
        const l = tr.left + Math.max(0, (tr.width - W) / 2);
        const box = { l, r: l + W, t: lt - HOCH - H, b: lt - HOCH };
        const frei = box.t >= tr.bottom + 8 && ![...F.querySelectorAll('.fk-in > *')].some((e) => { if (e === sp) return false; const q = e.getBoundingClientRect(); return q.left < box.r && q.right > box.l && q.top < box.b && q.bottom > box.t; });
        if (frei) {
          const z = document.createElement('span');
          z.className = 'sz-fnest'; z.setAttribute('aria-hidden', 'true');
          z.style.cssText = `left:${(box.l - fr.left).toFixed(1)}px;top:${(box.t - fr.top).toFixed(1)}px`;
          z.innerHTML = nest(NESTER.a).replace('width="80" height="48"', `width="${W}" height="${H}"`);
          F.appendChild(z);
          return;
        }
      }
      const a = F.querySelectorAll('.sozial-r a'), letzte = a[a.length - 1];
      if (!letzte) return;
      const z = document.createElement('span');
      const links = letzte.getBoundingClientRect().right + 64 > F.getBoundingClientRect().right - 8; // rechts kein Platz: links vor die Symbole
      z.className = 'sz-fuss sz-fn' + (links ? ' sz-fn-l' : ''); z.setAttribute('aria-hidden', 'true');
      z.innerHTML = nest(NESTER.a).replace('width="80" height="48"', 'width="56" height="34"');
      (links ? a[0] : letzte).appendChild(z);
    };
    // Auf der Kartenkante liegend (Leon 27.11.2026: „Ostereier oder Kugeln können auch mal oberhalb einer Karte aufliegen“):
    // Weihnachten Tannenzweig mit zwei Kugeln, Ostern zwei liegende Eier im Gras; automatisch auf der Hero-Kachel jeder Unterseite und auf dem Kontaktblock
    const zweig = (() => {
      let n = '';
      for (let x = 10; x <= 108; x += 6) {
        const y = 33 - (x - 10) * 0.05, l = 9 - Math.abs(x - 60) / 14;
        n += `<path d="M${x} ${y.toFixed(1)}l${(l * 0.7).toFixed(1)} -${(l * 0.75).toFixed(1)}M${x} ${y.toFixed(1)}l${(l * 0.75).toFixed(1)} ${(l * 0.45).toFixed(1)}" stroke="${x % 12 ? '#2E5B3E' : '#4F8A5E'}" stroke-width="1.6" stroke-linecap="round"/>`;
      }
      return `<svg width="124" height="44" viewBox="0 0 124 44"><path d="M6 34 Q60 30 116 28" stroke="#5B4632" stroke-width="2" fill="none" stroke-linecap="round"/>${n}<g><rect x="63" y="15" width="6" height="4" rx="1" fill="#C9A94B"/><circle cx="66" cy="29" r="10" fill="#C0392B"/><ellipse cx="62.5" cy="25.5" rx="2.6" ry="3.8" fill="#fff" opacity=".45"/></g><g><rect x="84" y="22" width="5" height="3.4" rx="1" fill="#B8923A"/><circle cx="86.5" cy="32.5" r="7.5" fill="#D4A63A"/><ellipse cx="84" cy="30" rx="2" ry="2.9" fill="#fff" opacity=".45"/></g><circle cx="102" cy="35" r="2.2" fill="#C0392B"/><circle cx="106" cy="33" r="2.2" fill="#C0392B"/><circle cx="104" cy="37" r="2.2" fill="#C0392B"/></svg>`;
    })();
    const eierLiegend = `<svg width="104" height="40" viewBox="0 0 104 40"><ellipse cx="52" cy="39.5" rx="24" ry="1.6" fill="#000" opacity=".07"/>${[18, 26, 34, 70, 78, 86, 94].map((x, i) => `<path d="M${x} 40 q${i % 2 ? 2 : -2} -7 ${i % 2 ? 1 : -3} -${10 + (i % 3) * 3}" stroke="${i % 2 ? '#7BC47F' : '#5DAF6A'}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`).join('')}${ei(42, 31, 17, 27, '#F4B8C8', '<circle cx="38" cy="28" r="1.5" fill="#fff"/><circle cx="44" cy="33" r="1.5" fill="#fff"/><circle cx="46" cy="26" r="1.2" fill="#fff"/><circle cx="39" cy="36" r="1.2" fill="#fff"/>', 74)}${ei(63, 32, 16, 25, '#A9D4F5', '<path d="M55.5 30q3.75-2.4 7.5 0t7.5 0M55.5 35q3.75-2.4 7.5 0t7.5 0" stroke="#fff" stroke-width="1.5" fill="none"/>', -70)}${[22, 30, 82, 90].map((x, i) => `<path d="M${x} 40 q${i % 2 ? -1 : 2} -6 ${i % 2 ? -3 : 1} -9" stroke="#86CF8A" stroke-width="1.4" fill="none" stroke-linecap="round"/>`).join('')}</svg>`;
    const LIEGEN = { weihnachten: zweig, ostern: eierLiegend };
    const deko = (s) => {
      document.querySelectorAll('.sz-deko, .sz-folge, .sz-fuss, .sz-fnest').forEach((x) => x.remove());
      if (s === 'aus') return;
      document.querySelectorAll('main .uhero .hk-karte, main .kontakt-in, [data-sz-l]').forEach((k) => {
        const z = document.createElement('span');
        z.className = 'sz-deko sz-liegt'; z.setAttribute('aria-hidden', 'true'); z.innerHTML = LIEGEN[s];
        k.appendChild(z);
      });
      const attr = s === 'weihnachten' ? 'szW' : 'szO';
      document.querySelectorAll(s === 'weihnachten' ? '[data-sz-w]' : '[data-sz-o]').forEach((k) => {
        const v = k.dataset[attr], html = s === 'weihnachten' ? KUGELN[v] : NESTER[v] && nest(NESTER[v]);
        if (!html) return;
        const z = document.createElement('span');
        z.className = 'sz-deko ' + (s === 'weihnachten' ? 'sz-oben' : 'sz-unten'); z.setAttribute('aria-hidden', 'true'); z.innerHTML = html;
        k.appendChild(z);
      });
      // Fußzeile „Folge uns“ (Leon 26.11.2026: „darf auch etwas mehr“): Weihnachten drei Kugeln unter LinkedIn, Instagram, YouTube; Ostern Nest rechts neben den Symbolen
      document.querySelectorAll('.fuss .sozial-r').forEach((reihe) => {
        const a = [...reihe.querySelectorAll('a')];
        if (!a.length) return;
        const span = (cls, html) => { const z = document.createElement('span'); z.className = 'sz-fuss ' + cls; z.setAttribute('aria-hidden', 'true'); z.innerHTML = html; return z; };
        if (s === 'weihnachten') {
          [[0, 6, 6.5, '#C0392B', 0.2], [2, 14, 7.5, '#D4A63A', 1.4], [3, 9, 6, '#2E7D5B', 2.3]].forEach(([i, faden, r, farbe, verz]) => {
            if (a[i]) a[i].appendChild(span('sz-fk', `<svg width="20" height="${faden + 4 + 2 * r}" viewBox="0 0 20 ${faden + 4 + 2 * r}">${kugel(10, faden, r, farbe, farbe === '#D4A63A' ? '#B8923A' : '#C9A94B', verz)}</svg>`));
          });
        }
      });
      if (s === 'ostern') fussNest();
      const sh = document.querySelector('.sozial-hero'), yt = sh && sh.querySelector('a[aria-label="YouTube"]');
      if (!yt) return;
      const z = document.createElement('span');
      z.className = 'sz-folge ' + (s === 'weihnachten' ? 'sz-kugel' : 'sz-hase'); z.setAttribute('aria-hidden', 'true');
      // Kugel hängt unter dem Button (Leon 26.11.2026: nicht seitlich); Platz dafür schafft die höher gesetzte Spalte (startseite.css .sozial-hero)
      z.style.top = (yt.offsetTop + (s === 'weihnachten' ? yt.offsetHeight : -22)) + 'px';
      z.innerHTML = s === 'weihnachten'
        ? `<svg width="24" height="42" viewBox="0 0 24 42">${kugel(12, 16, 9, '#C0392B', '#D4A63A', 0.4)}</svg>`
        : `<svg width="40" height="56" viewBox="0 0 40 56"><g class="sz-ohr"><path d="M15 27 C9 18 8 4 12 1 C17 3 19 16 19 26 Z" fill="#B98A5E"/><path d="M15.5 24 C12 17 11.5 7 13 4.5 C15.6 7 17 16 17.2 23 Z" fill="#F4B8C8"/></g><path d="M22 26 C21 16 24 4 29 3 C32 7 29 19 26 27 Z" fill="#A87B52"/><path d="M23.2 23 C23 16 25 8 28 6.5 C29.3 10 27.5 17 25.4 23 Z" fill="#F4B8C8"/><ellipse cx="20" cy="36" rx="13" ry="11.5" fill="#B98A5E"/><circle cx="14.5" cy="34" r="1.7" fill="#2A211A"/><circle cx="14" cy="33.4" r=".5" fill="#fff"/><ellipse cx="10" cy="39" rx="2.2" ry="1.6" fill="#F4A3B6"/><path d="M10 41 L3 40 M10 42 L3.5 43.5" stroke="#E8DCCD" stroke-width=".6" stroke-linecap="round"/><ellipse cx="17" cy="42" rx="4.5" ry="3" fill="#E8DCCD"/></svg>`;
      sh.appendChild(z);
    };
    let aktiv = 'aus';
    const logosSetzen = (s) => {
      document.querySelectorAll('.sz-logo').forEach((x) => x.remove());
      document.querySelectorAll('.lgOut, .kopf .logo').forEach((a) => a.style.removeProperty('--sz-dy'));
      if (s === 'aus' || !T || !T.dataset[s]) return;
      document.querySelectorAll('.lgOut img.lg, .kopf .logo img.lg').forEach((img) => {
        const z = document.createElement('img');
        z.className = 'sz-logo'; z.src = T.dataset[s]; z.alt = ''; z.setAttribute('aria-hidden', 'true');
        z.style.setProperty('--sz-f', LOGO[s].f);
        img.after(z);
      });
      ruecken();
    };
    // ragt die Deko über den oberen Rand, das Logo so weit nach unten setzen, dass sie ganz sichtbar ist
    const ruecken = () => {
      document.querySelectorAll('.lgOut, .kopf .logo').forEach((a) => {
        a.style.removeProperty('--sz-dy');
        const z = a.querySelector('.sz-logo'); if (!z || !z.offsetHeight) return;
        if (scrollY > 0 && a.classList.contains('lgOut')) return; // freies Logo nur oben auf der Seite sichtbar
        const oben = z.getBoundingClientRect().top;
        if (oben < 2) a.style.setProperty('--sz-dy', Math.ceil(2 - oben) + 'px');
      });
    };
    function setSaison(v, merken) {
      const s = v === 'auto' ? automatisch() : v;
      aktiv = ['weihnachten', 'ostern'].includes(s) ? s : 'aus';
      B.classList.remove('saison-weihnachten', 'saison-ostern');
      if (aktiv !== 'aus') B.classList.add('saison-' + aktiv);
      logosSetzen(aktiv);
      schnee(aktiv === 'weihnachten');
      deko(aktiv);
      document.querySelectorAll('[data-saison]').forEach((b) => b.classList.toggle('on', b.dataset.saison === v));
      if (merken) merke('saison', v);
    }
    if (inhSp) {
      const g = document.createElement('section');
      g.className = 'stg-gr'; g.dataset.tab = 'design'; g.dataset.ziel = '#kopf';
      g.innerHTML = '<h5>Saison</h5><div class="stg-tipp">Automatisch: Weihnachten vom 1. Advent bis 6. Januar, Ostern eine Woche vor Ostersonntag bis Ostermontag.</div>' +
        '<div class="stg-z"><span>Saison</span><div class="seg"><button type="button" data-saison="auto">Automatisch</button><button type="button" data-saison="aus">Aus</button><button type="button" data-saison="weihnachten">Weihnachten</button><button type="button" data-saison="ostern">Ostern</button></div></div>';
      inhSp.appendChild(g);
      g.querySelectorAll('[data-saison]').forEach((b) => (b.onclick = () => setSaison(b.dataset.saison, true)));
    }
    setSaison(wert('saison', Q.get('saison'), 'auto'), false);
    let nestT = 0;
    addEventListener('resize', () => { if (aktiv !== 'aus') { ruecken(); schnee(aktiv === 'weihnachten'); clearTimeout(nestT); nestT = setTimeout(fussNest, 150); } });
    addEventListener('load', () => { if (aktiv !== 'aus') { ruecken(); fussNest(); } });
    if (document.fonts) document.fonts.ready.then(fussNest);
  }
  bereit = true;

  return { $, Q, panelZeile, meineSenden, htmlNeu, stickyEinmal, setEdit, setBegriff, setDark, zeichne, flaeche, stillWelle, wellenNeu, baender, BAENDER, wert, merke, LOKAL, onDark: (f) => hoerer.dark.push(f),
    beimSpeichern: (f) => vorSpeichern.push(f), geaendert: () => setDirty(true) };
})();

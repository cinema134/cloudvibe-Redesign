/* ================= Wellen-Varianten: viele Einstellungen nebeneinander, groß ansehen, Werte kopieren =================
   Werte in Regler-Einheiten wie "Werte kopieren" auf der Startseite (ln, sp, lw, la, hh, wo, bp, op, mi, bw, wl, ng, fb, ra, lv, zb). Drehung entfernt (24.11.2026).
   Gezeichnet wird mit derselben Funktion wie im Hero (CV.zeichne), auf einer gedachten Fläche von 1440 × 800 px. */
(function () {
  const raster = document.getElementById('wvRaster');
  if (!raster) return;
  // Stand Startseite (Drehung entfernt, Leon 24.11.2026)
  const STD = { ln: 30, sp: 70, lw: 13.5, la: 100, hh: 100, wo: 100, bp: 70, op: 100, mi: 55, bw: 140, wl: 100, ng: 0, fb: 0, ra: 0, lv: 0, zb: 0 };
  const V = [
    ['Aktuell', 'Stand Startseite', 'So läuft die Welle heute: 30 Linien, Grün nach Blau.', {}],
    // Linien
    ['Linien', 'Wenige Linien', '14 Linien, luftig.', { ln: 14 }],
    ['Linien', 'Mehr Linien', '50 Linien, dichter.', { ln: 50 }],
    ['Linien', 'Sehr fein', '90 sehr feine Linien, fast eine Fläche.', { ln: 90, lw: 8 }],
    ['Linien', 'Kräftiger', 'Dickere Linien, etwas deckender.', { lw: 22, op: 120 }],
    ['Linien', 'Zarter', 'Dünnere Linien, blasser.', { lw: 9, op: 65 }],
    ['Linien', 'Kräftige Mitte', 'Mittlere Linien dicker, außen zart. Wirkt räumlicher.', { lv: 80 }],
    // Form
    ['Form', 'Schmaler Fächer', 'Linien näher zusammen.', { la: 55 }],
    ['Form', 'Breiter Fächer', 'Linien weiter auseinander.', { la: 160 }],
    ['Form', 'Flache Welle', 'Wenig Ausschlag auf und ab.', { hh: 45 }],
    ['Form', 'Hohe Welle', 'Deutlicher Ausschlag.', { hh: 170 }],
    ['Form', 'Stark gewölbt', 'Der Fächer geht an den dicken Stellen weit auf.', { wo: 200 }],
    ['Form', 'Gleichmäßig', 'Kaum Wölbung, fast gleich breit.', { wo: 30 }],
    // Verlauf: Wellenlänge und Neigung
    ['Verlauf', 'Lange Wellen', 'Weite, ruhige Bögen über die ganze Breite.', { wl: 220 }],
    ['Verlauf', 'Kurze Wellen', 'Mehr Bögen auf der Breite, lebendiger.', { wl: 60 }],
    ['Verlauf', 'Steigt nach rechts', 'Die Welle läuft schräg nach oben, Richtung Kacheln und Menü.', { ng: 45 }],
    ['Verlauf', 'Fällt nach rechts', 'Die Welle läuft schräg nach unten.', { ng: -45 }],
    ['Verlauf', 'Lang und steigend', 'Ein weiter Bogen, der nach rechts aufsteigt.', { wl: 240, ng: 40, hh: 120 }],
    // Farbe
    ['Farbe', 'Nur Blau', 'Einfarbig im cloudvibe-Blau, sehr ruhig.', { fb: 1 }],
    ['Farbe', 'Blau nach Grün', 'Verlauf umgedreht: links Blau, rechts Grün.', { fb: 2 }],
    ['Farbe', 'Blau nach Petrol', 'Kühler Verlauf ohne Grün.', { fb: 3 }],
    // Ränder
    ['Ränder', 'Weiche Ränder', 'Die Linien laufen links und rechts sanft aus.', { ra: 70 }],
    ['Ränder', 'Nur in der Mitte', 'Stark ausgeblendete Ränder, die Welle schwebt.', { ra: 100, wl: 160 }],
    // Zweites Band
    ['Zweites Band', 'Mit zweitem Band', 'Ein leises, schmaleres Band darunter gibt Tiefe.', { zb: 60 }],
    ['Zweites Band', 'Zwei Bänder, gegenläufig', 'Zweites Band mit Neigung, die Bänder laufen auseinander.', { zb: 70, ng: 30 }],
    // Bewegung
    ['Bewegung', 'Ruhig', 'Langsam und mit wenig Eigenbewegung.', { sp: 35, bw: 60 }],
    ['Bewegung', 'Lebhaft', 'Schneller, mit mehr Eigenbewegung.', { sp: 112, bw: 240 }],
    ['Bewegung', 'Fast still', 'Bewegt sich kaum.', { sp: 10, bw: 40 }],
    // Kombinationen
    ['Kombination', 'Seide', 'Viele feine Linien, lange Wellen, weiche Ränder.', { ln: 80, lw: 8, wl: 200, ra: 70, hh: 80 }],
    ['Kombination', 'Ruhig und blau', 'Nur Blau, lange Wellen, langsam.', { fb: 1, wl: 200, sp: 42, bw: 80 }],
    ['Kombination', 'Räumlich', 'Kräftige Mitte, zweites Band, weiche Ränder.', { lv: 70, zb: 55, ra: 50 }],
    ['Kombination', 'Aufbruch', 'Steigt nach rechts, breiter Fächer, kräftige Mitte.', { ng: 45, la: 140, lv: 60 }],
    ['Kombination', 'Leise', 'Wenige zarte Linien, flach, weiche Ränder.', { ln: 18, lw: 9, op: 70, hh: 55, ra: 60 }],
    ['Kombination', 'Lebendig fein', 'Kurze Wellen, viele feine Linien, etwas mehr Bewegung.', { wl: 70, ln: 60, lw: 9, bw: 200 }],
    // Bänder: Idee aus dem Team (Leon 24.11.2026). Werte und Zeichnung gemeinsam mit der Startseite in basis.js (CV.BAENDER, CV.baender).
    ...Object.values(CV.BAENDER).map((x) => ['Bänder', x.t, x.b, { sp: x.sp, ...(x.op ? { op: x.op } : {}) }, x.band]),
  ].map(([gr, t, b, w, band], i) => ({ i, gr, t, b, w: { ...STD, ...w }, band }));

  // Eine Stelle für alle Zeichnungen: Bänder (gemeinsame Zeichnung, optional mit Linien darüber) oder Linien-Welle
  const male = (ctx, W, H, v, t) => {
    if (!v.band) return CV.zeichne(ctx, W, H, P(v.w), t);
    CV.baender(ctx, W, H, v.band, t);
    if (v.band.linien) CV.zeichne(ctx, W, H, P(v.w), t, true);
  };
  const BANDNAMEN = { n: 'Bänder', kanten: 'Lichtkanten', a: 'Deckkraft', gl: 'Glanz', amp: 'Schwung', steig: 'Anstieg' };
  const bandText = (v) => (v.band.form === 's' ? 'S-Bogen: ' : 'Erste Fassung: ') + Object.entries(BANDNAMEN).filter(([k]) => v.band[k] != null).map(([k, n]) => n + ' ' + (k === 'n' || k === 'kanten' ? v.band[k] : Math.round(v.band[k] * 100) + ' %')).join(' · ') + (v.band.linien ? ' · mit Linien' : '');

  const P = (w) => ({ N: w.ln, lw: w.lw / 10, hs: w.la / 100, am: w.hh / 100, wo: w.wo / 100, bp: w.bp / 100, opm: w.op / 100,
    mi: w.mi / 100, bw: w.bw / 100, wl: w.wl / 100, ng: w.ng / 100, fb: w.fb, ra: w.ra / 100, lv: w.lv / 100, zb: w.zb / 100 });  const abw = (w) => Object.keys(STD).filter((k) => w[k] !== STD[k]);
  const NAMEN = { ln: 'Linien', sp: 'Tempo', lw: 'Linienstärke', la: 'Linienabstand', hh: 'Wellenhöhe', wo: 'Wölbung', bp: 'Lage', op: 'Deckkraft',
    mi: 'Mindestabstand', bw: 'Bewegung', wl: 'Wellenlänge', ng: 'Neigung', fb: 'Farbe', ra: 'Ränder weich', lv: 'Kräftige Mitte', zb: 'Zweites Band' };
  const FARBNAME = ['Grün→Blau', 'Blau', 'Blau→Grün', 'Blau→Petrol'];
  const zeigeWert = (k, v) => (k === 'fb' ? FARBNAME[v] : k === 'ln' ? String(v) : k === 'lw' ? (v / 10).toLocaleString('de-DE') + ' px' : v + ' %');

  /* ---- Kacheln ---- */
  const gruppen = [...new Set(V.map((v) => v.gr))];
  raster.innerHTML = V.map((v) => `<button type="button" class="wv-k" data-i="${v.i}" data-gr="${v.gr}">
 <span class="wv-bild"><canvas aria-hidden="true"></canvas></span>
 <span class="wv-txt"><span class="wv-gr">${v.gr}</span><b>${v.i ? String(v.i).padStart(2, '0') + ' · ' : ''}${v.t}</b><span>${v.b}</span>
 <span class="wv-abw">${v.band ? bandText(v) : abw(v.w).map((k) => NAMEN[k] + ' ' + zeigeWert(k, v.w[k])).join(' · ') || 'Standardwerte'}</span></span>
 <span class="wv-merk" title="Gemerkt">★</span>
</button>`).join('');
  const filter = document.querySelector('.wv-filter');
  filter.innerHTML = ['Alle', ...gruppen, 'Gemerkt'].map((g, i) => `<button type="button" data-f="${g}"${i ? '' : ' class="on"'}>${g}</button>`).join('');
  let gemerkt = new Set();
  try { gemerkt = new Set(JSON.parse(localStorage.getItem('cloudvibe-wellen-gemerkt')) || []); } catch (e) {}
  const merkenZeigen = () => raster.querySelectorAll('.wv-k').forEach((k) => k.classList.toggle('gemerkt', gemerkt.has(+k.dataset.i)));
  merkenZeigen();
  filter.onclick = (e) => {
    const f = e.target.closest('[data-f]')?.dataset.f;
    if (!f) return;
    filter.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.f === f));
    raster.querySelectorAll('.wv-k').forEach((k) => (k.hidden = !(f === 'Alle' || k.dataset.gr === f || (f === 'Gemerkt' && gemerkt.has(+k.dataset.i)))));
  };

  /* ---- Zeichnen: nur sichtbare Kacheln laufen, auf gedachter Fläche 1440 × 800 ---- */
  const LW = 1440, LH = 800;
  const kacheln = [...raster.querySelectorAll('.wv-k')].map((el) => ({ el, v: V[+el.dataset.i], cv: el.querySelector('canvas'), an: false, t: 2 }));
  function groesse(k) {
    const cw = k.cv.clientWidth, ch = k.cv.clientHeight, dpr = Math.min(devicePixelRatio || 1, 2);
    k.cv.width = cw * dpr; k.cv.height = ch * dpr;
    k.ctx = k.cv.getContext('2d');
    k.ctx.setTransform((cw * dpr) / LW, 0, 0, (ch * dpr) / LH, 0, 0);
    k.p = P(k.v.w);
  }
  kacheln.forEach(groesse);
  addEventListener('resize', () => kacheln.forEach(groesse));
  const io = new IntersectionObserver((es) => es.forEach((e) => { const k = kacheln.find((x) => x.el === e.target); if (k) k.an = e.isIntersecting; }), { rootMargin: '100px' });
  kacheln.forEach((k) => io.observe(k.el));
  const still = matchMedia('(prefers-reduced-motion:reduce)').matches;
  let last = performance.now(), bild = 0;
  function frame(now) {
    const dt = Math.min(0.1, (now - last) / 1000); last = now; bild++;
    if (!gross.hidden) zeichneGross(dt);
    else kacheln.forEach((k) => {
      if (!k.an || k.el.hidden) return;
      if (!still) k.t += dt * (k.v.w.sp / 100) * 0.5;
      if (bild % 2 === 0 || still) male(k.ctx, LW, LH, k.v, k.t);
    });
    requestAnimationFrame(frame);
  }
  kacheln.forEach((k) => male(k.ctx, LW, LH, k.v, k.t));
  requestAnimationFrame(frame);
  CV.onDark(() => kacheln.forEach((k) => male(k.ctx, LW, LH, k.v, k.t)));

  /* ---- Groß ansehen ---- */
  const gross = document.getElementById('wvGross'), gcv = document.getElementById('wvCv');
  let akt = 0, gf, gt = 2;
  const $ = (i) => document.getElementById(i);
  function zeichneGross(dt) {
    const v = V[akt];
    if (!still) gt += dt * (v.w.sp / 100) * 0.5;
    male(gf.ctx, gf.W, gf.H, v, gt);
  }
  function oeffne(i) {
    akt = (i + V.length) % V.length;
    const v = V[akt];
    gross.hidden = false;
    document.body.classList.add('wv-offen');
    gf = CV.flaeche(gcv);
    $('wvGr').textContent = v.gr;
    $('wvT').textContent = (v.i ? String(v.i).padStart(2, '0') + ' · ' : '') + v.t;
    $('wvB').textContent = v.b;
    $('wvW').textContent = v.band ? bandText(v) : abw(v.w).map((k) => NAMEN[k] + ' ' + zeigeWert(k, v.w[k])).join(' · ') || 'Standardwerte der Startseite';
    $('wvMerk').textContent = gemerkt.has(akt) ? 'Gemerkt ★' : 'Merken';
  }
  const schliessen = () => { gross.hidden = true; document.body.classList.remove('wv-offen'); };
  raster.onclick = (e) => { const k = e.target.closest('.wv-k'); if (k) oeffne(+k.dataset.i); };
  $('wvZu').onclick = schliessen;
  $('wvVor').onclick = () => oeffne(akt - 1);
  $('wvNach').onclick = () => oeffne(akt + 1);
  addEventListener('keydown', (e) => {
    if (gross.hidden) return;
    if (e.key === 'Escape') schliessen();
    if (e.key === 'ArrowLeft') oeffne(akt - 1);
    if (e.key === 'ArrowRight') oeffne(akt + 1);
  });
  addEventListener('resize', () => { if (!gross.hidden) gf = CV.flaeche(gcv); });
  $('wvKopie').onclick = async (e) => {
    const v = V[akt], txt = 'Welle ' + String(v.i).padStart(2, '0') + ' ' + v.t + ': ' + JSON.stringify(v.band ? { ...v.band, sp: v.w.sp } : v.w);
    try { await navigator.clipboard.writeText(txt); e.target.textContent = 'Kopiert'; } catch (x) { prompt('Werte kopieren:', txt); }
    setTimeout(() => (e.target.textContent = 'Werte kopieren'), 1600);
  };
  $('wvMerk').onclick = () => {
    gemerkt.has(akt) ? gemerkt.delete(akt) : gemerkt.add(akt);
    try { localStorage.setItem('cloudvibe-wellen-gemerkt', JSON.stringify([...gemerkt])); } catch (e) {}
    $('wvMerk').textContent = gemerkt.has(akt) ? 'Gemerkt ★' : 'Merken';
    merkenZeigen();
  };
  // ?v=5 öffnet direkt eine Variante (zum Prüfen)
  const q = +(CV.Q.get('v') || -1);
  if (q >= 0 && V[q]) oeffne(q);
})();

/* ================= Startseite: Hero-Welle, Regler, Varianten ================= */
(function () {
  const { $, Q } = CV;
  const B = document.body, R = document.documentElement;

  /* ---- An/Aus-Schalter der Startseite (Kacheln, Unterzeile und Abschnitt 2 sind entschieden) ----
     [Datenattribut, Klasse bei "aus", Standard, Adress-Parameter] */
  const SCHALTER = [
    ['sh', 'shAus', 'an', 'sh'],   // "Folge uns"-Leiste im Hero: fest an (Leon, Abstimmung 24.11.2026)
  ];
  /* ---- Kachelform zur Probe: S Standard, W Wolke, L Wolke leicht (?kf=W|L) ----
     Kontur aus einem Stück: unten gerundete Ecken, oben drei aneinanderliegende Wölbungen (links klein,
     Mitte groß, rechts mittel), passend zur jeweiligen Kachelgröße neu berechnet. */
  const NS = 'http://www.w3.org/2000/svg';
  let kf = 'S';
  function wolkenPfad(W, H, top, f) {
    const r = 26, y0 = top, n = (v) => +v.toFixed(1);
    // Wölbungen [von, bis, Höhe] in Anteilen der Breite, von rechts nach links
    const b = [[0.86, 0.60, 24 * f], [0.60, 0.28, 34 * f], [0.28, 0.10, 19 * f]];
    let d = `M${r},${H} L${n(W - r)},${H} A${r},${r} 0 0 0 ${W},${n(H - r)} L${W},${n(y0 + r)} A${r},${r} 0 0 0 ${n(W - r)},${y0}`;
    b.forEach(([a, z, h]) => {
      const x2 = W * a, x1 = W * z, c = (x2 - x1) / 2, R = (c * c + h * h) / (2 * h);
      d += ` L${n(x2)},${y0} A${n(R)},${n(R)} 0 0 0 ${n(x1)},${y0}`;
    });
    return d + ` L${r},${y0} A${r},${r} 0 0 0 0,${n(y0 + r)} L0,${n(H - r)} A${r},${r} 0 0 0 ${r},${H} Z`;
  }
  const kacheln = [...document.querySelectorAll('.einstieg .ek')];
  kacheln.forEach((k) => {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('class', 'ek-wolke'); s.setAttribute('aria-hidden', 'true');
    s.appendChild(document.createElementNS(NS, 'path'));
    k.prepend(s);
  });
  function wolken() {
    if (kf === 'S') return;
    const f = kf === 'L' ? 0.55 : 1, top = kf === 'L' ? 20 : 36;
    kacheln.forEach((k) => {
      const W = k.offsetWidth, H = k.offsetHeight, d = wolkenPfad(W, H, top, f), s = k.firstChild;
      s.setAttribute('viewBox', `0 0 ${W} ${H}`);
      s.firstChild.setAttribute('d', d);
      k.style.setProperty('--wolke', `path("${d}")`);
    });
  }
  new ResizeObserver(wolken).observe(document.querySelector('.einstieg'));
  function setKf(v) {
    kf = v;
    B.classList.remove('kfW', 'kfL');
    if (v !== 'S') B.classList.add('kf' + v);
    document.querySelectorAll('[data-kf]').forEach((x) => x.classList.toggle('on', x.dataset.kf === v));
    requestAnimationFrame(wolken);
  }
  document.querySelectorAll('[data-kf]').forEach((x) => (x.onclick = () => setKf(x.dataset.kf)));
  setKf(['W', 'L'].includes(Q.get('kf')) ? Q.get('kf') : 'S');
  const setzer = { kf: () => setKf('S') };
  SCHALTER.forEach(([a, kl, std, q]) => {
    const set = (v) => {
      B.classList.toggle(kl, v === 'aus');
      document.querySelectorAll(`[data-${a}]`).forEach((x) => x.classList.toggle('on', x.dataset[a] === v));
    };
    document.querySelectorAll(`[data-${a}]`).forEach((x) => (x.onclick = () => set(x.dataset[a])));
    set(['an', 'aus'].includes(Q.get(q)) ? Q.get(q) : std);
    setzer[a] = () => set(std);
  });

  /* ---- Bewegte Welle im Hero ----
     Keine Wellen-Regler mehr (Leon 24.11.2026): In den Einstellungen wird nur noch durchgeschaltet zwischen
     „Aktuell“ (feine Linien, Werte unten fest) und den Bänder-Varianten aus dem Team (CV.BAENDER in basis.js). ?welle=aktuell|seide|ruhig|zart|linien */
  // Aktuelle Linien-Welle, Stand Leon 20.–24.11.2026: 30 Linien, Tempo 70 %, Linienstärke 1,35 px, Lage 70 %, Mindestabstand 55 %, Bewegung 140 %
  const LINIEN = { N: 30, hs: 1, am: 1, wo: 1, lw: 1.35, bp: 0.7, opm: 1, mi: 0.55, bw: 1.4, wl: 1, ng: 0, fb: 0, ra: 0, lv: 0, zb: 0 };
  const WELLEN = { aktuell: { sp: 70 }, ...CV.BAENDER };
  const REIHE = Object.keys(WELLEN);
  let welle = 'aktuell', p = LINIEN, speed = 0.7, tt = 0, last = performance.now();
  const still = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const f = CV.flaeche($('cv'));
  const draw = () => {
    const w = WELLEN[welle];
    if (!w.band) return CV.zeichne(f.ctx, f.W, f.H, p, tt);
    CV.baender(f.ctx, f.W, f.H, w.band, tt);
    if (w.band.linien) CV.zeichne(f.ctx, f.W, f.H, p, tt, true);
  };
  function setWelle(id, start) {
    if (!WELLEN[id]) id = 'aktuell';
    welle = id;
    const w = WELLEN[id];
    speed = w.sp / 100;
    p = { ...LINIEN, opm: (w.op || 100) / 100 };
    document.querySelectorAll('[data-welle]').forEach((x) => x.classList.toggle('on', x.dataset.welle === id));
    draw();
    if (!start) { CV.merke('welle', id); CV.wellenNeu(); } // stehende Wellen (Kontaktblock) mitziehen
  }
  const wl = document.querySelector('.stg-welle');
  if (wl) wl.insertAdjacentHTML('beforeend', Object.entries(CV.BAENDER).map(([id, x]) => `<button type="button" data-welle="${id}"><b>${x.t}</b><small>${x.b}</small></button>`).join(''));
  document.querySelectorAll('[data-welle]').forEach((x) => (x.onclick = () => setWelle(x.dataset.welle)));
  document.querySelectorAll('[data-wschritt]').forEach((x) => (x.onclick = () => setWelle(REIHE[(REIHE.indexOf(welle) + +x.dataset.wschritt + REIHE.length) % REIHE.length])));
  addEventListener('resize', () => { f.rs(); draw(); });
  CV.onDark(draw);
  function frame(now) {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    if (!still) tt += dt * speed * 0.5;
    draw();
    if (!still) requestAnimationFrame(frame);
  }
  setWelle(CV.wert('welle', Q.get('welle'), 'aktuell'), true); // Adresse > im Browser gemerkt > für alle festgelegt > Standard
  requestAnimationFrame(frame);

  /* ---- Gemerkte Körnung und Logo anwenden (gilt auch ohne Panel, wenn für alle festgelegt) ---- */
  if (CV.wert('koernung', null, true) === false) $('top').classList.add('nograin');
  if (CV.wert('logoFrei', null, true) === false) B.classList.remove('lgB');
  ['lgs', 'lga'].forEach((k) => { const v = CV.wert(k, null, null); if (v != null) R.style.setProperty(k === 'lgs' ? '--lgh' : '--lga', v + 'px'); });

  /* ---- Logo-Regler (bleiben) ---- */
  if (!$('lgs')) return; // ohne Einstellungs-Panel (Übergabe-Fassung) gibt es keine Regler
  if ($('top').classList.contains('nograin')) $('gr').classList.remove('on');
  if (!B.classList.contains('lgB')) $('lgb').classList.remove('on');
  const map = {
    lgs: (v) => R.style.setProperty('--lgh', v + 'px'),
    lga: (v) => R.style.setProperty('--lga', v + 'px'),
  };
  let reglerBereit = false; // Startwerte nicht merken, erst Änderungen
  // Zahlenfelder: tippen, Pfeiltasten (Shift = 10er, Alt = 0,1er), Werte über das Reglerende hinaus
  // [id, Einheit, Faktor Regler->Anzeige, Nachkommastellen, Grenzen der Eingabe]
  const W = [['lgs', 'px', 1, 1, 10, 500], ['lga', 'px', 1, 1, 0, 1000]];
  const LIM = {};
  const fz = (v, d) => String(+(+v).toFixed(d));
  W.forEach(([id, u, k, d, lo, hi]) => {
    const r = $(id);
    LIM[id] = [r.min, r.max];
    r.step = 'any';
    const n = document.createElement('input');
    n.type = 'text'; n.inputMode = 'decimal'; n.className = 'v';
    n.setAttribute('aria-label', r.parentNode.firstChild.textContent.trim());
    r.parentNode.insertBefore(n, r);
    if (u) { const s = document.createElement('span'); s.className = 'u'; s.textContent = u; r.parentNode.insertBefore(s, r); }
    const apply = (val, live) => {
      let x = parseFloat(String(val).replace(',', '.'));
      if (!isFinite(x)) { if (!live) n.value = fz(r.value * k, d); return; }
      x = Math.min(hi, Math.max(lo, x));
      const rv = x / k;
      if (rv > +r.max) r.max = rv;
      if (rv < +r.min) r.min = rv;
      r.value = rv;
      r.dispatchEvent(new Event('input'));
      if (!live) n.value = fz(r.value * k, d);
    };
    n.addEventListener('input', () => apply(n.value, true));
    n.addEventListener('change', () => apply(n.value, false));
    n.addEventListener('blur', () => (n.value = fz(r.value * k, d)));
    n.addEventListener('focus', () => n.select());
    n.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { apply(n.value, false); n.select(); return; }
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
      e.preventDefault();
      const st = e.shiftKey ? 10 : e.altKey ? 0.1 : 1;
      const cur = parseFloat(String(n.value).replace(',', '.'));
      const c = isFinite(cur) ? cur : r.value * k;
      apply(+(c + (e.key === 'ArrowUp' ? st : -st)).toFixed(3), false);
    });
    const upd = () => { map[id](r.value); if (document.activeElement !== n) n.value = fz(r.value * k, d); if (reglerBereit) CV.merke(id, +r.value); };
    r.addEventListener('input', upd);
    r._upd = upd;
    r._feld = () => (n.value = fz(r.value * k, d));
    n.value = fz(r.value * k, d);
  });
  // Logo-Regler zeigen die aktuelle Größe der jeweiligen Breite an, solange nicht verstellt
  function syncLogo() {
    ['lgs', 'lga'].forEach((id) => {
      $(id).value = parseFloat(getComputedStyle(R).getPropertyValue(id === 'lgs' ? '--lgh' : '--lga'));
      $(id)._feld();
    });
  }
  syncLogo();

  reglerBereit = true;
  $('lgb').onclick = (e) => { const an = B.classList.toggle('lgB'); e.currentTarget.classList.toggle('on', an); CV.merke('logoFrei', an); };
  $('gr').onclick = (e) => { const an = !$('top').classList.toggle('nograin'); e.currentTarget.classList.toggle('on', an); CV.merke('koernung', an); };

  $('rst').onclick = () => {
    Object.keys(LIM).forEach((id) => { $(id).min = LIM[id][0]; $(id).max = LIM[id][1]; });
    R.style.removeProperty('--lgh');
    R.style.removeProperty('--lga');
    syncLogo();
    B.classList.add('lgB'); $('lgb').classList.add('on');
    $('top').classList.remove('nograin'); $('gr').classList.add('on');
    CV.setDark(false);
    Object.values(setzer).forEach((fn) => fn());
    CV.setBegriff(BEGRIFF_START);
    setWelle('aktuell');
    ['koernung', 'logoFrei', 'lgs', 'lga'].forEach((k) => CV.merke(k, null)); // gemerkte Werte verwerfen
    tt = 0;
  };

  $('cpy').onclick = async (e) => {
    const o = { welle };
    ['lgs', 'lga'].forEach((k) => (o[k] = +$(k).value));
    o.logoFrei = B.classList.contains('lgB');
    o.koernung = $('gr').classList.contains('on');
    o.dunkel = B.classList.contains('dark');
    o.begriff = $('begriff').value;
    const t = JSON.stringify(o);
    try { await navigator.clipboard.writeText(t); }
    catch (x) { const a = document.createElement('textarea'); a.value = t; document.body.appendChild(a); a.select(); document.execCommand('copy'); a.remove(); }
    const b = e.currentTarget, old = b.textContent;
    b.textContent = 'Kopiert';
    setTimeout(() => (b.textContent = old), 1400);
  };
})();

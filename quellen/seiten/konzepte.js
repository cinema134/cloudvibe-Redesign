/* Konzepte: Varianten-Umschalter, geführtes Ticket, Formulare, Cookie-Vorführung, Breitbild-Ansicht.
   Alles bleibt im Speicher, nichts wird verschickt oder dauerhaft gemerkt.
   Hinweis: Es entstehen keine neuen p/li/h-Elemente in main, damit "Bearbeiten und Speichern" stimmig bleibt. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const Q = new URLSearchParams(location.search);
  const mailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

  /* ---- Logo aus der Kopfleiste übernehmen (spart das mehrfache Einbetten) ---- */
  const logo = $('.kopf .lg');
  if (logo) $$('img[data-logo]').forEach((i) => (i.src = logo.src));

  /* ---- Varianten-Umschalter je Abschnitt; Startwert per Adresse, z. B. ?ticket=B&ki=C ---- */
  $$('[data-wahl]').forEach((g) => {
    const name = g.dataset.wahl;
    const setze = (v) => {
      $$('button', g).forEach((b) => { b.classList.toggle('on', b.dataset.v === v); b.setAttribute('aria-pressed', b.dataset.v === v); });
      $$(`[data-teil="${name}"]`).forEach((t) => (t.hidden = t.dataset.v !== v));
    };
    $$('button', g).forEach((b) => b.addEventListener('click', () => setze(b.dataset.v)));
    const q = (Q.get(name) || '').toUpperCase();
    setze($$('button', g).some((b) => b.dataset.v === q) ? q : 'A');
  });

  /* ---- Pflichtfelder prüfen ---- */
  function pruefe(feld, ok) { const f = feld.closest('.feld') || feld; f.classList.toggle('fehlt', !ok); return ok; }
  function feldOk(i) {
    if (i.type === 'email') return pruefe(i, mailOk(i.value));
    return pruefe(i, i.value.trim() !== '');
  }
  // Fehlermarkierung verschwindet, sobald etwas eingetragen wird
  document.addEventListener('input', (e) => { const f = e.target.closest('.fehlt'); if (f && f.matches('.feld')) f.classList.remove('fehlt'); });
  document.addEventListener('change', (e) => {
    const g = e.target.closest('.tk-gruppe.fehlt,.nl-themen.fehlt'); if (g) g.classList.remove('fehlt');
    if (e.target.matches('[data-ds]') && e.target.checked) { const m = e.target.closest('.voll'); if (m) m.querySelector('.ko-fm').classList.remove('an'); }
  });

  /* ================= 1 Ticket ================= */
  const tk = $('#tk'), form = $('.tk-form');
  // Variante A: Auswahl-Dialog im Fenster
  const dlg = $('.ko-dlg');
  const dlgAuf = (a) => { dlg.hidden = !a; if (a) $('.ko-weg', dlg).focus(); };
  $$('[data-dlg-auf]').forEach((b) => b.addEventListener('click', () => dlgAuf(true)));
  $$('[data-dlg-zu]').forEach((b) => b.addEventListener('click', () => dlgAuf(false)));
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlgAuf(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !dlg.hidden) dlgAuf(false); });
  $$('[data-zum-ticket]').forEach((b) => b.addEventListener('click', () => {
    dlgAuf(false);
    zeigeSchritt(1);
    tk.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => $('#tk-firma').focus({ preventScroll: true }), 600);
  }));

  // Geführtes Ticket in drei Schritten
  let schritt = 1;
  function zeigeSchritt(n) {
    schritt = n;
    $$('.tk-s', form).forEach((f) => (f.hidden = +f.dataset.s !== n));
    $('.tk-danke', form).hidden = true;
    $$('.tk-schritte li').forEach((l) => { const s = +l.dataset.s; l.classList.toggle('on', s === n); l.classList.toggle('fertig', s < n); });
    if (n === 3) zusammenfassen();
  }
  function schrittOk(n) {
    const fs = $(`.tk-s[data-s="${n}"]`, form);
    let ok = true;
    $$('input[required],textarea[required]', fs).forEach((i) => { if (!feldOk(i)) ok = false; });
    $$('.tk-gruppe', fs).forEach((g) => { const gut = !!$('input:checked', g); g.classList.toggle('fehlt', !gut); if (!gut) ok = false; });
    if (!ok) { const f = $('.fehlt input,.fehlt textarea,.fehlt', fs); if (f && f.focus) f.focus({ preventScroll: false }); }
    return ok;
  }
  $$('[data-weiter]', form).forEach((b) => b.addEventListener('click', () => {
    const n = +b.dataset.weiter;
    if (n > schritt && !schrittOk(schritt)) return;
    zeigeSchritt(n);
    if (tk.getBoundingClientRect().top < 0) tk.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
  // Ganzer Betrieb steht: Hinweis zum Anrufen
  $$('input[name="tk-dr"]').forEach((r) => r.addEventListener('change', () => { $('.tk-alarm').hidden = r.value !== 'Ganzer Betrieb steht' || !r.checked; }));
  // Dateiname anzeigen
  $('#tk-bild').addEventListener('change', (e) => {
    const f = e.target.files[0];
    $('.tk-datei-t').textContent = f ? 'Angehängt: ' + f.name : 'Screenshot anhängen (optional)';
  });
  function zusammenfassen() {
    const z = $('.tk-zus');
    const wert = (s) => { const el = $(s); return el ? el.value.trim() : ''; };
    const zeilen = [
      ['Firma oder Praxis', wert('#tk-firma')], ['Name', wert('#tk-name')], ['Rückrufnummer', wert('#tk-tel')], ['E-Mail', wert('#tk-mail')],
      ['Bereich', ($('input[name="tk-kat"]:checked') || {}).value || ''], ['Dringlichkeit', ($('input[name="tk-dr"]:checked') || {}).value || ''],
      ['Gerät oder ID', wert('#tk-geraet')], ['Seit wann', wert('#tk-seit')], ['Beschreibung', wert('#tk-text')],
      ['Screenshot', $('#tk-bild').files[0] ? $('#tk-bild').files[0].name : ''],
    ];
    z.textContent = '';
    zeilen.forEach(([k, v]) => {
      const d = document.createElement('div');
      const a = document.createElement('span'); a.className = 'k'; a.textContent = k;
      const b = document.createElement('span'); b.className = 'v' + (v ? '' : ' leer'); b.textContent = v || 'keine Angabe';
      d.append(a, b); z.appendChild(d);
    });
  }
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ds = $('#tk-ds');
    $('.tk-ds-fm').classList.toggle('an', !ds.checked);
    if (!ds.checked) return;
    $$('.tk-s', form).forEach((f) => (f.hidden = true));
    $$('.tk-schritte li').forEach((l) => { l.classList.remove('on'); l.classList.add('fertig'); });
    $('.tk-danke', form).hidden = false;
  });
  $('[data-neu]', form).addEventListener('click', () => { form.reset(); $('.tk-alarm').hidden = true; $('.tk-datei-t').textContent = 'Screenshot anhängen (optional)'; $('.tk-ds-fm').classList.remove('an'); zeigeSchritt(1); });
  $('#tk-ds').addEventListener('change', (e) => { if (e.target.checked) $('.tk-ds-fm').classList.remove('an'); });

  /* ================= 2 Info-PDF ================= */
  $$('[data-pdf]').forEach((b) => b.addEventListener('click', () => {
    const h = b.closest('.ko-modul').querySelector('.ko-hw');
    if (h) h.hidden = false;
  }));

  /* ================= 3 Newsletter ================= */
  $$('.nl-form').forEach((f) => f.addEventListener('submit', (e) => {
    e.preventDefault();
    const i = $('input[type=email]', f), feld = $('.nl-feld', f), ok = $('.ko-ok', f);
    const themen = $('.nl-themen', f);
    let gut = mailOk(i.value);
    feld.classList.toggle('fehlt', !gut);
    if (themen) { const t = $$('input:checked', themen).length > 0; themen.classList.toggle('fehlt', !t); gut = gut && t; }
    if (!gut) {
      ok.hidden = false; ok.style.background = 'var(--bg2)'; ok.style.color = 'var(--muted)';
      ok.textContent = !mailOk(i.value) ? 'Bitte gib eine gültige E-Mail-Adresse ein.' : 'Bitte wähle mindestens ein Thema.';
      return;
    }
    ok.style.background = ''; ok.style.color = '';
    const welche = themen ? ' Themen: ' + $$('input:checked', themen).map((x) => x.value === 'Gesundheitswesen' ? (document.querySelector('.hc') || {}).textContent || x.value : x.value).join(', ') + '.' : '';
    ok.textContent = 'Fast geschafft: Wir haben eine Bestätigungs-E-Mail an ' + i.value.trim() + ' geschickt. Erst nach dem Klick auf den Link bist du angemeldet.' + welche + ' (Mockup, nichts verschickt.)';
    ok.hidden = false;
  }));
  $$('.nl-feld input').forEach((i) => i.addEventListener('input', () => i.closest('.nl-feld').classList.remove('fehlt')));

  /* ================= 4 Kontaktformular ================= */
  // Felder einblenden: A ab der ersten Ziffer im Telefonfeld, B per Rückruf-Schalter
  $$('[data-zeigt]').forEach((q) => {
    const ziel = document.getElementById(q.dataset.zeigt);
    const upd = () => { ziel.hidden = q.type === 'checkbox' ? !q.checked : q.value.trim() === ''; };
    q.addEventListener(q.type === 'checkbox' ? 'change' : 'input', upd);
    upd();
  });
  $$('.kf-form').forEach((f) => f.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    $$('input[required],textarea[required]', f).forEach((i) => { if (!feldOk(i)) ok = false; });
    $$('[data-pflicht-wenn]', f).forEach((i) => {
      const an = document.getElementById(i.dataset.pflichtWenn).checked;
      if (an && !feldOk(i)) ok = false; else if (!an) pruefe(i, true);
    });
    const ds = $('[data-ds]', f), dsm = ds.closest('.voll').querySelector('.ko-fm');
    dsm.classList.toggle('an', !ds.checked); if (!ds.checked) ok = false;
    const m = $('.ko-ok', f);
    if (!ok) { m.hidden = true; const x = $('.fehlt input,.fehlt textarea', f); if (x) x.focus(); return; }
    const n = f.dataset.kf === 'A' ? 6 : 4 + ($('#kbR').checked ? 1 : 0);
    m.textContent = 'Danke. Mockup: Die Anfrage wird nicht verschickt. Ausgefüllt wurden ' + n + ' Pflichtangaben.';
    m.hidden = false;
  }));

  /* ================= 5 Cookie-Vorführung (nur im Speicher) ================= */
  const ck = $('#ck'), ckStatus = $('.ck-status');
  let ckWahl = { Statistik: false, 'Externe Medien': false }, ckZuvor = null;
  function ckAuf(art) {
    ckZuvor = document.activeElement;
    ck.className = 'ck ' + art;
    ck.dataset.art = art;
    $('.ck-start', ck).hidden = false;
    $('.ck-einst', ck).hidden = true;
    $$('[data-ck-k]', ck).forEach((s) => (s.checked = ckWahl[s.dataset.ckK]));
    ck.hidden = false;
    $('.ck-box', ck).setAttribute('aria-modal', art === 'B' ? 'true' : 'false');
    setTimeout(() => $('.ck-btn', ck).focus({ preventScroll: true }), 50);
  }
  function ckZu(text) {
    ck.hidden = true;
    if (text) ckStatus.innerHTML = '<b>Variante ' + ck.dataset.art + ':</b> ' + text;
    if (ckZuvor) ckZuvor.focus({ preventScroll: true });
  }
  const ckListe = () => { const an = Object.keys(ckWahl).filter((k) => ckWahl[k]); return an.length ? 'Notwendig, ' + an.join(', ') : 'nur Notwendig'; };
  $$('[data-ck-zeige]').forEach((b) => b.addEventListener('click', () => ckAuf(b.dataset.ckZeige)));
  ck.addEventListener('click', (e) => {
    const b = e.target.closest('[data-ck]');
    if (!b) return;
    const w = b.dataset.ck;
    if (w === 'einst') { $('.ck-start', ck).hidden = true; $('.ck-einst', ck).hidden = false; $('.ck-einst .ko-sw:not([disabled])', ck).focus(); return; }
    if (w === 'alle') Object.keys(ckWahl).forEach((k) => (ckWahl[k] = true));
    if (w === 'noetig') Object.keys(ckWahl).forEach((k) => (ckWahl[k] = false));
    if (w === 'auswahl') $$('[data-ck-k]', ck).forEach((s) => (ckWahl[s.dataset.ckK] = s.checked));
    const name = { alle: 'Alle akzeptieren', noetig: 'Nur notwendige', auswahl: 'Auswahl speichern' }[w];
    ckZu('„' + name + '“ gewählt. Aktiv: ' + ckListe() + '. Nichts wurde gespeichert.');
  });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !ck.hidden) ckZu('Vorführung ohne Auswahl beendet.'); });

  /* ================= 8 Kopfleiste: Ansicht einer 2560 px breiten Seite ================= */
  const W = 2560, SPUR = 1440, GUT = 28, LGH = 90, LGB = Math.round(LGH * 2.2436), LGA = 70, WRAP = 1240;
  const menue = ['Gesundheitswesen', 'Kanzleien', 'Unternehmen', 'Managed Services', 'News', 'Über uns'];
  const welle = (b) => {
    let p = '';
    for (let i = 0; i < 14; i++) {
      const o = i * 9;
      p += `<path d="M0 ${230 - o} C ${b * .2} ${120 - o}, ${b * .35} ${300 - o}, ${b * .55} ${200 - o} S ${b * .85} ${110 - o}, ${b} ${190 - o}"/>`;
    }
    return `<svg viewBox="0 0 ${b} 320" width="${b}" fill="none" stroke="url(#brG${b})" stroke-width="2.4" aria-hidden="true"><defs><linearGradient id="brG${b}" x1="0" x2="1"><stop offset="0" stop-color="#2EB329" stop-opacity=".6"/><stop offset=".5" stop-color="#1E96AA" stop-opacity=".55"/><stop offset="1" stop-color="#2D6CDF" stop-opacity=".6"/></linearGradient></defs>${p}</svg>`;
  };
  const leiste = (l, r) => `<div class="br-leiste" style="left:${l}px;width:${r - l}px"><div class="nav" style="flex:1;display:flex;justify-content:space-between;margin:0 44px">${menue.map((m) => `<span>${m}</span>`).join('')}</div><span class="cta">Fernwartung</span></div>`;
  const inhalt = `<div class="br-inhalt" style="left:${(W - WRAP) / 2}px"><div class="h">IT für Praxen, Kanzleien und <b>Unternehmen</b>.</div><div class="l">Betrieb, Datensicherung und Sicherheit. Per Fernwartung deutschlandweit, vor Ort am Niederrhein.</div><div class="b"><span>E-Mail schreiben</span><span>Anrufen</span></div></div>`;
  const s0 = (W - SPUR) / 2;
  const BAU = {
    A: () => `<div class="br-flaeche" style="left:0;width:${W}px"></div><div class="br-welle" style="left:0;width:${W}px">${welle(W)}</div>
      <img class="br-logo" src="${logo ? logo.src : ''}" alt="cloudvibe" style="left:${GUT}px">${leiste(GUT + LGB + LGA, W - GUT)}${inhalt}`,
    B: () => `<div class="br-flaeche" style="left:${s0}px;width:${SPUR}px"></div><div class="br-welle" style="left:${s0}px;width:${SPUR}px">${welle(SPUR)}</div>
      <img class="br-logo" src="${logo ? logo.src : ''}" alt="cloudvibe" style="left:${s0 + GUT}px">${leiste(s0 + GUT + LGB + LGA, s0 + SPUR - GUT)}${inhalt}
      <div class="br-spur" style="left:${s0}px;width:${SPUR}px"><span>1440 px</span></div>`,
    C: () => `<div class="br-flaeche" style="left:0;width:${W}px"></div><div class="br-welle" style="left:0;width:${W}px">${welle(W)}</div>
      <img class="br-logo" src="${logo ? logo.src : ''}" alt="cloudvibe" style="left:${s0 + GUT}px">${leiste(s0 + GUT + LGB + LGA, s0 + SPUR - GUT)}${inhalt}
      <div class="br-spur" style="left:${s0}px;width:${SPUR}px"><span>1440 px</span></div>`,
  };
  $$('.br-screen').forEach((s) => {
    const art = ['A', 'B', 'C'].find((a) => s.classList.contains('br-' + a));
    const inn = $('.br-in', s);
    inn.innerHTML = BAU[art]();
    const skal = () => s.style.setProperty('--s', s.clientWidth / W);
    skal();
    if ('ResizeObserver' in window) new ResizeObserver(skal).observe(s); else addEventListener('resize', skal);
  });
})();

/* ================= Entscheidungen und „Im Original ansehen“ (Leon 25.11.2026) =================
   Je Konzept: Variante wählen → Konzept ist als entschieden markiert (Abzeichen an der Eyebrow, Haken in der Übersicht, Zähler oben).
   Gespeichert wie alle Einstellungen: im Browser (CV.merke, Schlüssel ko-<id>), lokal mit „Speichern“ in der Datei (#ko-entscheidungen),
   für alle mit „Für alle festlegen“. Startwerte stehen in #ko-entscheidungen. Keine neuen p/li/h-Elemente (Speichern vergleicht deren Anzahl). */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const hatCV = typeof CV !== 'undefined';
  let start = {};
  try { start = JSON.parse(($('#ko-entscheidungen') || {}).textContent || '{}'); } catch (e) {}
  const links = ($('#ko-links') || {}).dataset || {};
  // Originalseite je Konzept und Variante: [Seite, Zusatz an der Adresse]; _ = für alle Varianten gleich
  const O = {
    ticket: { A: ['startseite', ''], B: ['support', ''] }, teaminfo: { _: ['support', ''] }, newsletter: { _: ['newsletter', ''] },
    cookies: { _: ['startseite', ''] }, ki: { _: ['ki', ''] }, karriere: { _: ['karriere', ''] }, kopfleiste: { _: ['startseite', ''] },
    terminauswahl: { A: ['termin', '?termin=spalten'], B: ['termin', '?termin=kompakt'], C: ['termin', '?termin=bisher'] },
    vorwahl: { _: ['termin', ''] }, supportmail: { _: ['support', ''] },
    hauptbutton: { A: ['startseite', '?kbtn=ticket'], B: ['startseite', '?kbtn=termin'] },
    heroaufbau: { A: ['kanzleien', '?heroauf=kachel'], B: ['kanzleien', '?heroauf=bisher'] },
    einstiege: { A: ['gesundheitswesen', '?einstieg=raster'], B: ['gesundheitswesen', '?einstieg=liste'] },
    herobuttons: { A: ['arztpraxen', ''], B: ['arztpraxen', '?herobtn=bisher'] }, kurzkoepfe: { _: ['newsbeitrag', ''] },
    ablaeufe: { A: ['gesundheitswesen', '?ablauf=pfeil'], B: ['gesundheitswesen', '?ablauf=zeitleiste'] },
    stimmen: { A: ['gesundheitswesen', '?kst=kompakt'], B: ['gesundheitswesen', '?kst=buehne'], C: ['gesundheitswesen', '?kst=liste'] },
    aufzaehlung: { A: ['arztpraxen', '?az=L'], B: ['arztpraxen', '?az=P'], C: ['arztpraxen', '?az=H'], D: ['arztpraxen', '?az=S'] },
    footer: { A: ['startseite', '?fuss=k'], B: ['startseite', '?fuss=a'] }, menschen: { _: ['startseite', ''] }, telefonie: { _: ['unternehmen', ''] },
    dunkelblau: { A: ['arztpraxen', '?dunkel=1'], B: ['arztpraxen', '?dunkel=1'] }, datevfaq: { _: ['datev', '?fuer=unternehmen#faq'] },
    welle: { A: ['startseite', '?welle=aktuell'], B: ['wellen', ''] },
    begriff: { A: ['gesundheitswesen', '?begriff=Gesundheitswesen'], B: ['gesundheitswesen', '?begriff=Healthcare'] },
  };
  // Konzepte ohne Varianten-Umschalter: Varianten von Hand, sonst nur „So umsetzen“
  const OPT = { kontaktformular: ['A', 'B'], cookies: ['A', 'B', 'C'], kopfleiste: ['A', 'B', 'C'] };
  const stand = {};
  const eigene0 = () => { const o = {}; Object.keys(stand).forEach((k) => { if (stand[k]) o[k] = stand[k]; }); return o; };
  const secs = $$('main > section.ko');

  function zaehle() {
    const n = secs.filter((s) => stand[s.id]).length;
    const z = $('.ko-stand'); if (z) z.innerHTML = `<b>${n} von ${secs.length}</b> Konzepten entschieden`;
  }
  function zeige(sec, v) {
    const id = sec.id, w = $('[data-wahl]', sec);
    stand[id] = v || '';
    sec.classList.toggle('ko-ent-ja', !!v);
    const eb = $('.ko-kopf .eb', sec);
    const lab = v === 'ja' ? 'Entschieden' : v ? 'Entschieden: ' + v : '';
    if (eb) { if (v) eb.dataset.ent = lab; else delete eb.dataset.ent; }
    $$('.ko-ent-b button', sec).forEach((b) => { b.classList.toggle('on', b.dataset.ent === (v || '')); b.setAttribute('aria-pressed', b.dataset.ent === (v || '')); });
    if (w) $$('button', w).forEach((b) => b.classList.toggle('ent', b.dataset.v === v));
    const a = $(`.ko-inhalt a[href="#${id}"]`); if (a && a.parentElement) { if (v) a.parentElement.dataset.ent = '1'; else delete a.parentElement.dataset.ent; }
    zaehle();
  }
  function orig(sec) {
    const o = O[sec.id], a = $('.ko-orig', sec);
    if (!a) return;
    const w = $('[data-wahl]', sec), cur = w ? ($('button.on', w) || {}).dataset?.v : null;
    const z = o && (o[cur] || o._ || o[Object.keys(o)[0]]);
    if (!z || !links[z[0]]) { a.hidden = true; return; }
    a.hidden = false;
    a.href = links[z[0]] + z[1];
    $('span', a).textContent = cur && o[cur] ? `Variante ${cur} im Original ansehen` : 'Im Original ansehen';
  }

  secs.forEach((sec) => {
    const id = sec.id, w = $('[data-wahl]', sec);
    const opts = w ? $$('button', w).map((b) => [b.dataset.v, b.textContent.trim()]) : (OPT[id] || ['ja']).map((v) => [v, v === 'ja' ? 'So umsetzen' : 'Variante ' + v]);
    const box = document.createElement('div');
    box.className = 'ko-ent';
    box.innerHTML = `<span class="ko-ent-t">Deine Entscheidung</span><span class="ko-ent-b" role="group" aria-label="Entscheidung">${opts.map(([v, t]) => `<button type="button" data-ent="${v}">${t}</button>`).join('')}<button type="button" data-ent="" class="offen">Noch offen</button></span><a class="ko-orig" target="_blank" rel="noopener" hidden><span>Im Original ansehen</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg></a>`;
    $('.wrap', sec).appendChild(box);
    $$('.ko-ent-b button', box).forEach((b) => b.addEventListener('click', () => {
      const v = b.dataset.ent;
      zeige(sec, v);
      if (hatCV) { CV.merke('ko-' + id, v); if (CV.geaendert) CV.geaendert(); }
      if (v && v !== 'ja' && w) { const vb = $(`button[data-v="${v}"]`, w); if (vb) vb.click(); }
    }));
    if (w) $$('button', w).forEach((b) => b.addEventListener('click', () => setTimeout(() => orig(sec), 0)));
    const v = hatCV ? CV.wert('ko-' + id, null, start[id] || '') : start[id] || '';
    zeige(sec, v);
    // entschiedene Variante zuerst zeigen (außer die Adresse nennt eine andere)
    if (v && v !== 'ja' && w && !new URLSearchParams(location.search).get(w.dataset.wahl)) { const vb = $(`button[data-v="${v}"]`, w); if (vb) vb.click(); }
    orig(sec);
  });
  // Zähler unter der Übersicht
  const nav = $('.ko-inhalt');
  if (nav) { const z = document.createElement('div'); z.className = 'ko-stand'; nav.after(z); zaehle(); }
  /* „Meine Entscheidungen senden“ (Leon 25.11.2026): Wer auf GitHub oder lokal entschieden hat, schickt seine schon getroffene Wahl
     (aus dem Browser-Speicher) per E-Mail, ohne neu zu entscheiden. Die Mail enthält eine lesbare Liste und eine Code-Zeile,
     die Claude in die Live-Ablage übernimmt. Auf claude.ai (live) ausgeblendet, dort wird ohnehin geteilt. */
  if (nav) {
    const w = document.createElement('div'); w.className = 'ko-senden';
    w.innerHTML = '<button type="button" class="ko-senden-b">Meine Auswahl senden</button><span class="ko-senden-t">Lädt eine Datei mit allem, was du entschieden und eingestellt hast, und öffnet eine fertige E-Mail dazu.</span>';
    ($('.ko-stand') || nav).after(w);
    $('.ko-senden-b', w).addEventListener('click', () => {
      const o = eigene0();
      const ids = Object.keys(o);
      if (!ids.length && !(hatCV && CV.meineSenden)) { $('.ko-senden-t', w).textContent = 'Du hast in diesem Browser noch nichts entschieden.'; return; }
      const zeilen = secs.filter((s) => o[s.id]).map((s) => {
        const nr = ((($('.ko-kopf .eb', s) || {}).textContent || '').match(/\d+/) || [''])[0];
        const h2 = (($('.ko-kopf h2', s) || {}).textContent || s.id).trim();
        return `Konzept ${nr} ${h2}: ${o[s.id] === 'ja' ? 'So umsetzen' : 'Variante ' + o[s.id]}`;
      });
      if (hatCV && CV.meineSenden) { CV.meineSenden(zeilen); $('.ko-senden-t', w).textContent = 'Datei heruntergeladen und E-Mail geöffnet: Datei anhängen und absenden.'; return; }
      const text = `Meine Entscheidungen auf der Konzepte-Seite (${ids.length} von ${secs.length}):\n\n${zeilen.join('\n')}\n\nCode für die Übernahme (bitte nicht ändern):\nCV-ENTSCHEIDUNGEN ${JSON.stringify(o)}\n`;
      location.href = 'mailto:?subject=' + encodeURIComponent('cloudvibe Konzepte: meine Entscheidungen') + '&body=' + encodeURIComponent(text);
      $('.ko-senden-t', w).textContent = 'E-Mail geöffnet. Empfänger eintragen und absenden.';
    });
  }
  // Lokal speichern: Entscheidungen in die Datei schreiben
  if (hatCV && CV.beimSpeichern) CV.beimSpeichern((d) => { const s = d.getElementById('ko-entscheidungen'); if (s) { const o = {}; Object.keys(stand).forEach((k) => { if (stand[k]) o[k] = stand[k]; }); s.textContent = JSON.stringify(o); } });

  /* ---- Live auf claude.ai (Leon 25.11.2026): Entscheidungen aller sehen und übernehmen ----
     Nur wenn die Seite als claude.ai-Artifact mit den Fähigkeiten db und user läuft (sonst bleibt alles wie oben).
     Ablage: entscheidungen/<eigene id> = { werte: {konzept: variante}, zeit }. Jeder liest alle, schreibt nur die eigene. */
  const eigene = () => { const o = {}; Object.keys(stand).forEach((k) => { if (stand[k]) o[k] = stand[k]; }); return o; };
  const live = { db: null, user: null, ich: null, andere: [], schreibt: null };
  // Eigene Wahl in die gemeinsame Ablage, kurz gebündelt, immer nur ein Schreibvorgang zur Zeit
  let warte = null, laeuft = false, nochmal = false;
  async function teile() {
    if (!live.db || !live.ich) return;
    if (laeuft) { nochmal = true; return; }
    laeuft = true;
    try { await live.db.doc('entscheidungen/' + live.ich).set({ werte: eigene(), zeit: new Date().toISOString() }); }
    catch (e) { const m = $('.ko-live'); if (m) m.textContent = 'Deine Entscheidung konnte nicht geteilt werden (nur in diesem Browser gespeichert).'; }
    laeuft = false;
    if (nochmal) { nochmal = false; teile(); }
  }
  secs.forEach((sec) => $$('.ko-ent-b button', sec).forEach((b) => b.addEventListener('click', () => { if (!live.db) return; clearTimeout(warte); warte = setTimeout(teile, 500); })));

  async function zeichneAndere() {
    const ids = live.andere.map((d) => d.id);
    const ps = ids.length && live.user ? await live.user.profiles(ids) : {};
    secs.forEach((sec) => {
      let box = $('.ko-andere', sec);
      const wer = live.andere.filter((d) => d.werte && d.werte[sec.id]);
      if (!wer.length) { if (box) box.remove(); return; }
      if (!box) { box = document.createElement('div'); box.className = 'ko-andere'; $('.ko-ent', sec).appendChild(box); }
      box.textContent = '';
      const t = document.createElement('span'); t.className = 'ko-andere-t'; t.textContent = 'Andere haben entschieden'; box.appendChild(t);
      wer.forEach((d) => {
        const v = d.werte[sec.id], p = ps[d.id] || {};
        const z = document.createElement('span'); z.className = 'ko-person';
        const img = document.createElement('img'); img.alt = ''; if (p.avatarUrl) img.src = p.avatarUrl; z.appendChild(img);
        const n = document.createElement('b'); n.textContent = p.name || d.name || 'Jemand'; z.appendChild(n);
        const w = document.createElement('span'); w.className = 'ko-person-v'; w.textContent = v === 'ja' ? 'So umsetzen' : 'Variante ' + v; z.appendChild(w);
        if (stand[sec.id] !== v) {
          const u = document.createElement('button'); u.type = 'button'; u.textContent = 'Übernehmen';
          u.addEventListener('click', () => { const b = $(`.ko-ent-b button[data-ent="${v}"]`, sec); if (b) b.click(); });
          z.appendChild(u);
        } else { const g = document.createElement('span'); g.className = 'ko-gleich'; g.textContent = 'wie du'; z.appendChild(g); }
        box.appendChild(z);
      });
    });
    const m = $('.ko-live');
    if (m) m.textContent = live.andere.length ? `Live: ${live.andere.length} ${live.andere.length === 1 ? 'weitere Person hat' : 'weitere Personen haben'} entschieden. Deine Wahl sehen die anderen sofort.` : 'Live: Deine Wahl sehen alle, die diese Seite öffnen. Noch hat niemand sonst entschieden.';
  }

  (async () => {
    if (!window.claude || typeof window.claude.use !== 'function') return; // GitHub und lokal: ohne Live-Teilen
    const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
    if (!db || !user) return;
    const ich = await user.id();
    if (!ich) return;
    live.db = db; live.user = user; live.ich = ich;
    { const sw = $('.ko-senden'); if (sw) sw.hidden = true; }
    const z = $('.ko-stand');
    if (z) { const m = document.createElement('div'); m.className = 'ko-live'; m.textContent = 'Live: Entscheidungen der anderen werden geladen …'; z.after(m); }
    // eigene, schon geteilte Wahl übernehmen (z. B. aus einem anderen Browser)
    try {
      const s = await db.doc('entscheidungen/' + ich).get();
      const w = s.exists ? (s.data() || {}).werte || {} : null;
      if (w) secs.forEach((sec) => { const v = w[sec.id] || ''; if (v !== (stand[sec.id] || '')) { zeige(sec, v); if (hatCV) CV.merke('ko-' + sec.id, v); } });
    } catch (e) {}
    const uhr = setTimeout(() => { const m = $('.ko-live'); if (m && !live.geladen) m.textContent = 'Live: Die Entscheidungen der anderen sind gerade nicht erreichbar.'; }, 10000);
    db.collection('entscheidungen').onSnapshot((snap) => {
      if (!snap.metadata.fromCache) { live.geladen = true; clearTimeout(uhr); }
      live.andere = snap.docs.filter((d) => d.id !== ich).map((d) => ({ id: d.id, ...(d.data() || {}) }));
      zeichneAndere();
    }, () => { clearTimeout(uhr); const m = $('.ko-live'); if (m) m.textContent = 'Live: Die Entscheidungen der anderen sind gerade nicht erreichbar.'; });
    // nach eigener Änderung „Übernehmen“/„wie du“ neu setzen
    secs.forEach((sec) => $$('.ko-ent-b button', sec).forEach((b) => b.addEventListener('click', () => setTimeout(zeichneAndere, 0))));
  })();
})();
/* Termin vereinbaren: Buchungs-Mockup (alles simuliert, nichts wird gesendet).
   Ablauf: Terminart wählen -> Kalender (nur Werktage, Beispiel-Slots) -> Uhrzeit -> Angaben -> Bestätigung.
   Zum Prüfen: ?art=erst|ti|check|datev|sl|ki|rueck|kunde, dazu &demo=angaben|fertig; Aufbau ?termin=bisher */
(function () {
  const $ = (i) => document.getElementById(i);
  const bp = $('bp');
  if (!bp) return;
  const B = document.body;
  const kompakt = () => B.classList.contains('tmK');
  const drei = () => B.classList.contains('tm3'); // Drei Spalten (Leon 25.11.2026): Terminart | Tag | Uhrzeit

  // Dauer und Form sind Beispiele (Richtwerte), Formen: video, tel, ort
  const ARTEN = {
    erst: { n: 'Erstberatung', d: 30, f: ['video', 'tel'] },
    ti: { n: 'TI-Beratung', d: 45, f: ['video', 'tel', 'ort'] },
    check: { n: 'Praxis-Check IT‑Sicherheit', d: 60, f: ['ort'] },
    datev: { n: 'DATEV-Termin', d: 30, f: ['video', 'tel'] },
    sl: { n: 'SelectLine-Termin', d: 30, f: ['video', 'tel'] },
    ki: { n: 'KI-Check', d: 45, f: ['video', 'tel', 'ort'] }, // eigene Terminart (Abstimmung 24.11.2026)
    schulung: { n: 'Schulung planen', d: 30, f: ['video', 'tel'] }, // Vorgespräch zur Schulung (Leon 26.11.2026)
    rueck: { n: 'Rückruf', d: 15, f: ['tel'] },
    kunde: { n: 'Termin mit deiner Ansprechperson', d: 30, f: ['video', 'tel', 'ort'] },
  };
  const FORM = { video: 'Video', tel: 'Telefon', ort: 'Vor Ort' };
  const FORM_LANG = { video: 'per Video', tel: 'per Telefon', ort: 'vor Ort am Niederrhein' };
  const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  const WT = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  const ZEITEN = ['08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'];

  const st = { art: null, jahr: 0, monat: 0, tag: null, zeit: null, form: null };
  const heute = new Date(); heute.setHours(0, 0, 0, 0);
  const start = new Date(heute.getFullYear(), heute.getMonth(), 1);
  const MAX_MONATE = 2; // aktueller Monat plus zwei weitere

  /* ---- Feiertage NRW (ohne Slots), dazu 24.12. und 31.12. ---- */
  function ostern(j) {
    const a = j % 19, b = Math.floor(j / 100), c = j % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
    const mo = Math.floor((h + l - 7 * m + 114) / 31), ta = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(j, mo - 1, ta);
  }
  const frei = {};
  function feiertage(j) {
    if (frei[j]) return frei[j];
    const s = new Set(['1-1', '5-1', '10-3', '11-1', '12-24', '12-25', '12-26', '12-31'].map((x) => j + '-' + x));
    const o = ostern(j);
    [-2, 1, 39, 50, 60].forEach((n) => { const d = new Date(o); d.setDate(d.getDate() + n); s.add(`${j}-${d.getMonth() + 1}-${d.getDate()}`); });
    return (frei[j] = s);
  }
  const schluessel = (d) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

  /* ---- Beispiel-Slots: fest je Tag und Terminart (gleiches Ergebnis bei jedem Laden) ---- */
  function slots(d) {
    if (d <= heute || feiertage(d.getFullYear()).has(schluessel(d))) return [];
    let x = (d.getFullYear() * 400 + d.getMonth() * 32 + d.getDate()) * 97 + Object.keys(ARTEN).indexOf(st.art) * 31 + 7;
    const zufall = () => ((x = (x * 1103515245 + 12345) % 2147483648) / 2147483648);
    if (zufall() < 0.18) return []; // manche Tage ausgebucht
    let liste = ZEITEN.filter(() => zufall() < 0.38);
    if (ARTEN[st.art].d >= 60) liste = liste.filter((z) => z !== '16:00' && z !== '11:30');
    if (liste.length < 2) liste = [ZEITEN[2 + (d.getDate() % 4)], ZEITEN[9 + (d.getDate() % 3)]];
    return liste;
  }

  /* ---- Kalender zeichnen ---- */
  function kalender() {
    const j = st.jahr, m = st.monat;
    $('kalMonat').textContent = `${MONATE[m]} ${j}`;
    const idx = (j - start.getFullYear()) * 12 + m - start.getMonth();
    $('kalZur').disabled = idx <= 0;
    $('kalVor').disabled = idx >= MAX_MONATE;
    let h = ['Mo', 'Di', 'Mi', 'Do', 'Fr'].map((t) => `<span class="kal-wt" role="columnheader">${t}</span>`).join('');
    const tage = new Date(j, m + 1, 0).getDate();
    let erster = true;
    for (let t = 1; t <= tage; t++) {
      const d = new Date(j, m, t), w = d.getDay();
      if (w === 0 || w === 6) continue;
      if (erster) { h += '<span class="kal-leer"></span>'.repeat(w - 1); erster = false; }
      const s = slots(d), wahl = st.tag && st.tag.getTime() === d.getTime();
      const cls = ['kal-tag', s.length ? 'frei' : '', wahl ? 'wahl' : '', d.getTime() === heute.getTime() ? 'heute' : ''].filter(Boolean).join(' ');
      const lab = `${WT[w]}, ${t}. ${MONATE[m]}${s.length ? ', ' + s.length + ' freie Zeiten' : ', keine freien Zeiten'}`;
      h += `<button type="button" class="${cls}" data-t="${t}" aria-label="${lab}"${s.length ? '' : ' disabled'}${wahl ? ' aria-pressed="true"' : ''}>${t}<small aria-hidden="true">${s.length ? s.length + ' frei' : ''}</small></button>`;
    }
    $('kal').innerHTML = h;
    monate();
  }

  /* Drei Spalten: Monatsleiste mit Anzahl freier Tage statt Pfeilen */
  function freieTage(j, m) {
    let n = 0;
    const ende = new Date(j, m + 1, 0).getDate();
    for (let t = 1; t <= ende; t++) { const d = new Date(j, m, t); if (d.getDay() % 6 && slots(d).length) n++; }
    return n;
  }
  function monate() {
    if (!drei()) return;
    let h = '';
    for (let i = 0; i <= MAX_MONATE; i++) {
      const d = new Date(start.getFullYear(), start.getMonth() + i, 1), j = d.getFullYear(), m = d.getMonth();
      const n = freieTage(j, m), on = j === st.jahr && m === st.monat;
      h += `<button type="button" class="km${on ? ' on' : ''}" data-i="${i}" aria-pressed="${on}"${n ? '' : ' disabled'}><b>${MONATE[m]}</b><span>${n ? n + (n === 1 ? ' Tag frei' : ' Tage frei') : 'ausgebucht'}</span></button>`;
    }
    $('kalMonate').innerHTML = h;
  }
  // Drei Spalten: immer ein Tag gewählt, damit die Uhrzeit-Spalte nie leer ist
  function autoTag() {
    if (!drei()) return;
    if (st.tag && st.tag.getFullYear() === st.jahr && st.tag.getMonth() === st.monat && slots(st.tag).length) return;
    st.tag = null; st.zeit = null;
    const ende = new Date(st.jahr, st.monat + 1, 0).getDate();
    for (let t = 1; t <= ende; t++) { const d = new Date(st.jahr, st.monat, t); if (d.getDay() % 6 && slots(d).length) { st.tag = d; break; } }
  }

  function zeiten() {
    const z = $('zeiten');
    weg();
    if (!st.tag) {
      // Drei Spalten: ohne Tag ist der Monat ausgebucht (sonst wäre der erste freie Tag gewählt)
      $('zeitenKopf').textContent = drei() ? 'In diesem Monat ist nichts mehr frei. Wähl einen anderen Monat.' : 'Wähl einen Tag mit freien Zeiten.';
      z.innerHTML = ''; $('zuAngaben').disabled = true; return;
    }
    const d = st.tag, s = slots(d);
    $('zeitenKopf').innerHTML = drei()
      ? `<span class="zk-tag">${WT[d.getDay()]}, ${d.getDate()}. ${MONATE[d.getMonth()]}</span><span class="zk-info">${s.length} ${s.length === 1 ? 'freie Zeit' : 'freie Zeiten'}</span>`
      : `Freie Zeiten am <b>${WT[d.getDay()]}, ${d.getDate()}. ${MONATE[d.getMonth()]}</b>`;
    z.classList.toggle('viele', s.length > 8); // Drei Spalten: ab 9 Zeiten dreispaltig, damit die Spalte nicht zu lang wird
    z.innerHTML = s.map((t) => `<button type="button" class="zeit${t === st.zeit ? ' wahl' : ''}" data-z="${t}"${t === st.zeit ? ' aria-pressed="true"' : ''}>${t}</button>`).join('');
    $('zuAngaben').disabled = !st.zeit;
  }
  // Drei Spalten: Gesprächsweg gleich neben der Uhrzeit wählen (im Formular dann nicht noch einmal)
  function weg() {
    if (!drei() || !st.art) { $('wegSeg').innerHTML = ''; return; }
    $('wegSeg').innerHTML = ARTEN[st.art].f.map((f) => `<label><input type="radio" name="t-weg" value="${f}"${f === st.form ? ' checked' : ''}><span>${FORM[f]}</span></label>`).join('');
  }

  /* ---- Schritte ---- */
  const SCHRITTE = ['sZeit', 'sAngaben', 'sFertig'];
  function zeige(n) {
    SCHRITTE.forEach((s, i) => ($(s).hidden = i !== n));
    document.querySelectorAll('.bp-weg li').forEach((li, i) => { li.classList.toggle('on', i === n); li.classList.toggle('ok', i < n); });
    klebe();
  }
  // Mitlaufendes Feld: ist es höher als das Fenster, klebt es so, dass sein unteres Ende erreichbar bleibt
  function klebe() { bp.style.top = Math.min(120, innerHeight - bp.offsetHeight - 24) + 'px'; }
  addEventListener('resize', klebe);
  const wannText = () => {
    const d = st.tag;
    return `${WT[d.getDay()]}, ${d.getDate()}. ${MONATE[d.getMonth()]}, ${st.zeit} Uhr`;
  };

  function waehleArt(id, scrollen) {
    st.art = id; st.tag = null; st.zeit = null;
    const a = ARTEN[id];
    st.form = a.f[0];
    document.querySelectorAll('.ta').forEach((el) => {
      const on = el.dataset.art === id;
      el.classList.toggle('on', on);
      el.querySelector('.ta-wahl').setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    $('bpLeer').hidden = true; $('bpVoll').hidden = false;
    $('bpArt').textContent = a.n;
    $('bpMeta').textContent = `${a.d} Min · ${a.f.map((f) => FORM[f]).join(', ')}`;
    // Kompakt: Beschreibung der gewählten Art steht im Buchungsfeld (in der Liste nur Name und Dauer)
    const p = document.querySelector(`.ta[data-art="${id}"] .ta-text p`);
    $('bpBesch').textContent = p ? p.textContent.trim() : '';
    // ersten Monat mit freien Tagen zeigen
    st.jahr = start.getFullYear(); st.monat = start.getMonth();
    for (let i = 0; i <= MAX_MONATE; i++) {
      const j = start.getFullYear(), m = start.getMonth() + i;
      const ende = new Date(j, m + 1, 0).getDate();
      let hat = false;
      for (let t = 1; t <= ende && !hat; t++) { const d = new Date(j, m, t); if (d.getDay() % 6 && slots(d).length) hat = true; }
      if (hat) { const d = new Date(j, m, 1); st.jahr = d.getFullYear(); st.monat = d.getMonth(); break; }
    }
    autoTag(); kalender(); zeiten(); zeige(0);
    if (scrollen && matchMedia('(max-width:1000px)').matches) bp.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function angaben() {
    const a = ARTEN[st.art];
    // Drei Spalten: Kopf im Buchungsfeld entfällt, deshalb Terminart hier mit nennen
    $('bpWann').textContent = drei() ? `${a.n}: ${wannText()}, ${FORM_LANG[st.form]}` : wannText();
    $('formArt').hidden = a.f.length < 2 || drei();
    $('formWahl').innerHTML = a.f.map((f) => `<label><input type="radio" name="t-form" value="${f}"${f === st.form ? ' checked' : ''}><span>${FORM[f]}</span></label>`).join('');
    $('feldAp').hidden = st.art !== 'kunde';
    formFelder();
    $('bpFehler').hidden = true;
    document.querySelectorAll('.bp-form .feld.fehlt').forEach((f) => f.classList.remove('fehlt'));
    zeige(1);
  }
  function formFelder() {
    $('feldOrt').hidden = st.form !== 'ort';
    // Telefon ist Pflicht, wenn wir anrufen
    $('t-tel').required = st.form === 'tel';
  }

  // Gruppen ohne Terminart (oder deren Arten alle fehlen) nicht als leere Überschrift zeigen
  document.querySelectorAll('.ta-gruppe').forEach((g) => { g.hidden = !document.querySelector(`.ta[data-g="${g.dataset.g}"]`); });

  /* ---- Ereignisse ---- */
  document.querySelectorAll('.ta').forEach((el) => {
    el.addEventListener('click', (e) => {
      if (document.body.classList.contains('edit') && !e.target.closest('.ta-wahl')) return; // Mockup-Bearbeiten: Text anklicken ohne Auswahl
      if (e.target.closest('.lx')) return; // Lexikon-Begriff öffnet nur die Erklärung
      waehleArt(el.dataset.art, true);
    });
  });
  $('kalZur').onclick = () => { const d = new Date(st.jahr, st.monat - 1, 1); st.jahr = d.getFullYear(); st.monat = d.getMonth(); kalender(); };
  $('kalVor').onclick = () => { const d = new Date(st.jahr, st.monat + 1, 1); st.jahr = d.getFullYear(); st.monat = d.getMonth(); kalender(); };
  $('kalMonate').addEventListener('click', (e) => {
    const b = e.target.closest('.km');
    if (!b || b.disabled) return;
    const d = new Date(start.getFullYear(), start.getMonth() + +b.dataset.i, 1);
    st.jahr = d.getFullYear(); st.monat = d.getMonth();
    autoTag(); kalender(); zeiten();
  });
  $('wegSeg').addEventListener('change', (e) => { st.form = e.target.value; });
  $('kal').addEventListener('click', (e) => {
    const b = e.target.closest('.kal-tag');
    if (!b || b.disabled) return;
    st.tag = new Date(st.jahr, st.monat, +b.dataset.t); st.zeit = null;
    kalender(); zeiten();
  });
  $('zeiten').addEventListener('click', (e) => {
    const b = e.target.closest('.zeit');
    if (!b) return;
    st.zeit = b.dataset.z; zeiten();
  });
  $('zuAngaben').onclick = () => { if (st.zeit) angaben(); };
  $('zurZeit').onclick = () => { zeige(0); };
  $('formWahl').addEventListener('change', (e) => { st.form = e.target.value; formFelder(); });

  $('sAngaben').addEventListener('submit', (e) => {
    e.preventDefault();
    const pflicht = ['t-vor', 't-nach', 't-mail'].concat($('t-tel').required ? ['t-tel'] : [], st.form === 'ort' ? ['t-ort'] : []);
    let fehlt = false;
    pflicht.forEach((id) => {
      const i = $(id), leer = !i.value.trim() || (id === 't-mail' && !/^\S+@\S+\.\S+$/.test(i.value.trim()));
      i.closest('.feld').classList.toggle('fehlt', leer);
      if (leer) fehlt = true;
    });
    const f = $('bpFehler');
    if (fehlt) { f.textContent = 'Bitte füll die markierten Felder aus.'; f.hidden = false; return; }
    if (!$('t-ok').checked) { f.textContent = 'Bitte bestätige noch die Einwilligung zum Datenschutz.'; f.hidden = false; return; }
    f.hidden = true;
    fertig();
  });

  function fertig() {
    const a = ARTEN[st.art], esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const vor = esc($('t-vor').value.trim());
    $('fertigT').innerHTML = `Danke, ${vor}. <b>Dein Termin steht.</b>`;
    const z = [['Termin', esc(a.n)], ['Wann', wannText()], ['Dauer', `${a.d} Min`], ['Wie', FORM_LANG[st.form]]];
    if (st.form === 'ort' && $('t-ort').value.trim()) z.push(['Wo', esc($('t-ort').value.trim())]);
    $('fertigZus').innerHTML = z.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('');
    $('fertigMail').textContent = st.form === 'tel' ? `Wir rufen dich zur vereinbarten Zeit an. Die Bestätigung geht an ${$('t-mail').value.trim()}.` : `Die Bestätigung geht an ${$('t-mail').value.trim()}.`;
    zeige(2);
    $('sFertig').focus({ preventScroll: true });
  }
  $('neu').onclick = () => {
    $('sAngaben').reset();
    if (kompakt() && (st.art || VORWAHL)) { waehleArt(st.art || 'erst', false); return; } // Kompakt: Kalender bleibt sichtbar
    st.art = null;
    document.querySelectorAll('.ta').forEach((el) => { el.classList.remove('on'); el.querySelector('.ta-wahl').setAttribute('aria-pressed', 'false'); });
    $('bpVoll').hidden = true; $('bpLeer').hidden = false;
  };

  /* ---- Aufbau Kompakt (Standard) / Bisher (Prüfdokument 24.11.2026: "auf einen Blick die Terminauswahl sehen")
     Kompakt: schmale Liste links, Kalender der gewählten Art sofort rechts; Umschalter im Panel, ?termin=bisher ---- */
  // Drei Spalten (Standard, Leon 25.11.2026): body.tm3 zusätzlich zu tmK; ?termin=spalten|kompakt|bisher
  // Vorauswahl (Konzept 10 B, Leon 26.11.2026): ohne ?art= ist keine Terminart gewählt, rechts steht „Wähl eine Terminart“; ?vorwahl=erst = bisher (Erstberatung)
  const VORWAHL = new URLSearchParams(location.search).get('vorwahl') === 'erst';
  function setAufbau(v, merken) {
    if (!['spalten', 'kompakt', 'bisher'].includes(v)) v = 'spalten';
    const k = v !== 'bisher';
    B.classList.toggle('tmK', k);
    B.classList.toggle('tm3', v === 'spalten');
    document.querySelectorAll('[data-tm]').forEach((b) => b.classList.toggle('on', b.dataset.tm === v));
    $('zuAngaben').textContent = v === 'spalten' ? 'Weiter zu deinen Angaben' : 'Weiter';
    if (k && !st.art && VORWAHL) waehleArt('erst', false); // nur mit ?vorwahl=erst: erste Art vorgewählt
    else if (st.art && !$('sZeit').hidden) { autoTag(); kalender(); zeiten(); }
    klebe();
    if (merken && typeof CV !== 'undefined') CV.merke('termin', v);
  }
  // Umschalter „Terminauswahl“ entfernt (Konzept 9 A entschieden: Drei Spalten, Leon 26.11.2026)

  /* ---- Prüfhilfe über Adress-Parameter ---- */
  const Q = new URLSearchParams(location.search), art = Q.get('art');
  const aufbau = (typeof CV !== 'undefined') ? CV.wert('termin', Q.get('termin'), 'spalten') : (Q.get('termin') || 'spalten');
  setAufbau(aufbau, false); // ?art=… wählt danach die gewünschte Art
  if (art && ARTEN[art]) {
    waehleArt(art, false);
    const demo = Q.get('demo');
    if (demo) {
      const b = $('kal').querySelector('.kal-tag.frei');
      if (b) { b.click(); const z = $('zeiten').querySelector('.zeit'); if (z) z.click(); }
      if (st.zeit) {
        angaben();
        if (demo === 'fertig') {
          $('t-vor').value = 'Anna'; $('t-nach').value = 'Beispiel'; $('t-mail').value = 'anna@beispiel.de';
          if (st.form === 'tel') $('t-tel').value = '02823 123456';
          if (st.form === 'ort') $('t-ort').value = 'Musterstraße 1, 47574 Goch';
          $('t-ok').checked = true;
          $('sAngaben').requestSubmit();
        }
      }
    }
  }
})();

/* Termin vereinbaren: Buchungs-Mockup (alles simuliert, nichts wird gesendet).
   Ablauf: Terminart wählen -> Kalender (nur Werktage, Beispiel-Slots) -> Uhrzeit -> Angaben -> Bestätigung.
   Zum Prüfen: ?art=erst|ti|check|datev|sl|ki|rueck|kunde, dazu &demo=angaben|fertig */
(function () {
  const $ = (i) => document.getElementById(i);
  const bp = $('bp');
  if (!bp) return;

  // Dauer und Form sind Beispiele (Richtwerte), Formen: video, tel, ort
  const ARTEN = {
    erst: { n: 'Erstberatung', d: 30, f: ['video', 'tel'] },
    ti: { n: 'TI-Beratung', d: 45, f: ['video', 'tel', 'ort'] },
    check: { n: 'Praxis-Check IT‑Sicherheit', d: 60, f: ['ort'] },
    datev: { n: 'DATEV-Termin', d: 30, f: ['video', 'tel'] },
    sl: { n: 'SelectLine-Termin', d: 30, f: ['video', 'tel'] },
    ki: { n: 'KI-Check', d: 45, f: ['video', 'tel', 'ort'] }, // eigene Terminart (Abstimmung 24.11.2026)
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
      h += `<button type="button" class="${cls}" data-t="${t}" aria-label="${lab}"${s.length ? '' : ' disabled'}${wahl ? ' aria-pressed="true"' : ''}>${t}</button>`;
    }
    $('kal').innerHTML = h;
  }

  function zeiten() {
    const z = $('zeiten');
    if (!st.tag) { $('zeitenKopf').textContent = 'Wähl einen Tag mit freien Zeiten.'; z.innerHTML = ''; return; }
    const d = st.tag;
    $('zeitenKopf').innerHTML = `Freie Zeiten am <b>${WT[d.getDay()]}, ${d.getDate()}. ${MONATE[d.getMonth()]}</b>`;
    z.innerHTML = slots(d).map((t) => `<button type="button" class="zeit${t === st.zeit ? ' wahl' : ''}" data-z="${t}"${t === st.zeit ? ' aria-pressed="true"' : ''}>${t}</button>`).join('');
    $('zuAngaben').disabled = !st.zeit;
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
    // ersten Monat mit freien Tagen zeigen
    st.jahr = start.getFullYear(); st.monat = start.getMonth();
    for (let i = 0; i <= MAX_MONATE; i++) {
      const j = start.getFullYear(), m = start.getMonth() + i;
      const ende = new Date(j, m + 1, 0).getDate();
      let hat = false;
      for (let t = 1; t <= ende && !hat; t++) { const d = new Date(j, m, t); if (d.getDay() % 6 && slots(d).length) hat = true; }
      if (hat) { const d = new Date(j, m, 1); st.jahr = d.getFullYear(); st.monat = d.getMonth(); break; }
    }
    kalender(); zeiten(); zeige(0);
    if (scrollen && matchMedia('(max-width:1000px)').matches) bp.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function angaben() {
    const a = ARTEN[st.art];
    $('bpWann').textContent = wannText();
    $('formArt').hidden = a.f.length < 2;
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
    st.art = null;
    document.querySelectorAll('.ta').forEach((el) => { el.classList.remove('on'); el.querySelector('.ta-wahl').setAttribute('aria-pressed', 'false'); });
    $('bpVoll').hidden = true; $('bpLeer').hidden = false;
  };

  /* ---- Prüfhilfe über Adress-Parameter ---- */
  const Q = new URLSearchParams(location.search), art = Q.get('art');
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

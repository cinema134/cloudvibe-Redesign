/* Support: geführtes Ticket in drei Schritten (aus Konzepte übernommen, alles simuliert, nichts wird gesendet).
   Hinweis: Es entstehen keine neuen p/li/h-Elemente in main, damit "Bearbeiten und Speichern" stimmig bleibt.
   Zum Prüfen: ?schritt=2|3|fertig (füllt Beispielangaben), dazu &dringend=betrieb für den Anruf-Hinweis. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const tk = $('#tk'), form = $('.tk-form');
  if (!tk || !form) return;
  const mailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
  const DATEI_T = 'Screenshot anhängen (optional)';

  /* ---- Pflichtfelder ---- */
  function pruefe(feld, ok) { (feld.closest('.feld') || feld).classList.toggle('fehlt', !ok); return ok; }
  const feldOk = (i) => pruefe(i, i.type === 'email' ? mailOk(i.value) : i.value.trim() !== '');
  form.addEventListener('input', (e) => { const f = e.target.closest('.feld.fehlt'); if (f && !f.classList.contains('tk-gruppe')) f.classList.remove('fehlt'); });
  form.addEventListener('change', (e) => { const g = e.target.closest('.tk-gruppe.fehlt'); if (g) g.classList.remove('fehlt'); });

  /* ---- Schritte ---- */
  let schritt = 1;
  function zeigeSchritt(n) {
    schritt = n;
    $$('.tk-s', form).forEach((f) => (f.hidden = +f.dataset.s !== n));
    $('.tk-danke', form).hidden = true;
    $$('.tk-schritte li').forEach((l) => {
      const s = +l.dataset.s;
      l.classList.toggle('on', s === n); l.classList.toggle('fertig', s < n);
      if (s === n) l.setAttribute('aria-current', 'step'); else l.removeAttribute('aria-current');
    });
    if (n === 3) zusammenfassen();
  }
  function schrittOk(n) {
    const fs = $(`.tk-s[data-s="${n}"]`, form);
    let ok = true;
    $$('input[required],textarea[required]', fs).forEach((i) => { if (!feldOk(i)) ok = false; });
    $$('.tk-gruppe', fs).forEach((g) => { const gut = !!$('input:checked', g); g.classList.toggle('fehlt', !gut); if (!gut) ok = false; });
    if (!ok) { const f = $('.fehlt input,.fehlt textarea', fs); if (f) f.focus(); }
    return ok;
  }
  const obenHalten = () => { if (tk.getBoundingClientRect().top < 0) tk.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  $$('[data-weiter]', form).forEach((b) => b.addEventListener('click', () => {
    const n = +b.dataset.weiter;
    if (n > schritt && !schrittOk(schritt)) return;
    zeigeSchritt(n);
    obenHalten();
  }));

  // Ganzer Betrieb steht: Hinweis zum Anrufen
  const alarm = () => { const r = $('input[name="tk-dr"]:checked'); $('.tk-alarm').hidden = !r || r.value !== 'Ganzer Betrieb steht'; };
  $$('input[name="tk-dr"]').forEach((r) => r.addEventListener('change', alarm));
  // Dateiname anzeigen
  $('#tk-bild').addEventListener('change', (e) => { const f = e.target.files[0]; $('.tk-datei-t').textContent = f ? 'Angehängt: ' + f.name : DATEI_T; });

  function zusammenfassen() {
    const z = $('.tk-zus');
    const wert = (s) => { const el = $(s); return el ? el.value.trim() : ''; };
    const gewaehlt = (n) => ($(`input[name="${n}"]:checked`) || {}).value || '';
    const zeilen = [
      ['Firma, Praxis oder Kanzlei', wert('#tk-firma')], ['Name', [wert('#tk-vor'), wert('#tk-nach')].filter(Boolean).join(' ')],
      ['Rückrufnummer', wert('#tk-tel')], ['E-Mail', wert('#tk-mail')],
      ['Betroffen', gewaehlt('tk-kat')], ['Dringlichkeit', gewaehlt('tk-dr')],
      ['Gerät oder ID', wert('#tk-geraet')], ['Seit wann', wert('#tk-seit')], ['Beschreibung', wert('#tk-text')],
      ['Screenshot', $('#tk-bild').files[0] ? $('#tk-bild').files[0].name : (tk.dataset.demoBild || '')],
    ];
    z.textContent = '';
    zeilen.forEach(([k, v]) => {
      const d = document.createElement('div');
      const a = document.createElement('span'); a.className = 'k'; a.textContent = k;
      const b = document.createElement('span'); b.className = 'v' + (v ? '' : ' leer'); b.textContent = v || 'keine Angabe';
      d.append(a, b); z.appendChild(d);
    });
  }

  /* ---- Senden (simuliert) und Bestätigung mit Beispiel-Ticketnummer ---- */
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ds = $('#tk-ds');
    $('.tk-ds-fm').classList.toggle('an', !ds.checked);
    if (!ds.checked) return;
    $$('.tk-s', form).forEach((f) => (f.hidden = true));
    $$('.tk-schritte li').forEach((l) => { l.classList.remove('on'); l.classList.add('fertig'); l.removeAttribute('aria-current'); });
    $('#tkNr').textContent = 'CV-48217'; // Beispielnummer, später vergibt Odoo Helpdesk die echte
    $('#tkMl').textContent = `Du bekommst gleich eine Bestätigung an ${$('#tk-mail').value.trim()}. Wir melden uns unter ${$('#tk-tel').value.trim()}. Den Stand siehst du jederzeit im Kundenportal.`;
    const d = $('.tk-danke', form);
    d.hidden = false;
    d.focus({ preventScroll: true });
    obenHalten();
  });
  $('[data-neu]', form).addEventListener('click', () => {
    form.reset(); delete tk.dataset.demoBild;
    $('.tk-alarm').hidden = true; $('.tk-datei-t').textContent = DATEI_T; $('.tk-ds-fm').classList.remove('an');
    $$('.fehlt', form).forEach((f) => f.classList.remove('fehlt'));
    zeigeSchritt(1);
    $('#tk-firma').focus();
  });
  $('#tk-ds').addEventListener('change', (e) => { if (e.target.checked) $('.tk-ds-fm').classList.remove('an'); });

  // Sprung aus "Ticket starten": erstes Feld fokussieren
  $$('a[href="#ticket"]').forEach((a) => a.addEventListener('click', () => setTimeout(() => $('#tk-firma').focus({ preventScroll: true }), 650)));

  /* ---- Prüfhilfe über Adress-Parameter: ?schritt=2|3|fertig&dringend=betrieb ---- */
  const Q = new URLSearchParams(location.search), ziel = Q.get('schritt');
  if (ziel === '2' || ziel === '3' || ziel === 'fertig') {
    const setze = (id, v) => { $(id).value = v; };
    setze('#tk-firma', 'Praxis Dr. Beispiel'); setze('#tk-vor', 'Anna'); setze('#tk-nach', 'Beispiel');
    setze('#tk-tel', '02823 123456'); setze('#tk-mail', 'anna@beispiel.de');
    if (ziel !== '2' || Q.get('dringend')) {
      const dr = Q.get('dringend') === 'betrieb' ? 'Ganzer Betrieb steht' : 'Ein Arbeitsplatz';
      $('input[name="tk-dr"][value="' + dr + '"]').checked = true; alarm();
    }
    if (ziel !== '2') {
      $('input[name="tk-kat"][value="Drucker"]').checked = true;
      setze('#tk-geraet', 'PC-EMPFANG-01'); setze('#tk-seit', 'Seit heute');
      setze('#tk-text', 'Beim Drucken kommt die Meldung „Drucker offline“. Der Drucker am Empfang zeigt keinen Fehler.');
      tk.dataset.demoBild = 'fehlermeldung.png';
    }
    zeigeSchritt(ziel === '2' ? 2 : 3);
    if (ziel === 'fertig') { $('#tk-ds').checked = true; form.requestSubmit(); }
  }
})();

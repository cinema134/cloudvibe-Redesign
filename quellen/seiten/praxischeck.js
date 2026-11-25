/* Praxis-Check: Selbsttest (Prüfdokument 24.11.2026).
   Acht Ja/Nein-Fragen, Ergebnis sofort in Worten (keine Prozente, keine Punktzahl), darunter die offenen Punkte.
   Nichts wird gespeichert oder verschickt (Mockup). */
(function () {
  const S = document.getElementById('selbsttest');
  if (!S) return;
  const fragen = [...S.querySelectorAll('.stt-fragen li')];
  const aus = S.querySelector('.stt-aus'), warte = S.querySelector('.stt-warte');
  const URTEIL = {
    gut: ['Gut <em>aufgestellt</em>.', 'Die Grundlagen stimmen. Im Praxis-Check sehen wir uns an, ob das auch im Detail so ist, zum Beispiel ob die Sicherung wirklich alles umfasst.'],
    mittel: ['Ein paar <em>Baustellen</em>.', 'Vieles läuft, einige Punkte sind noch offen. Im Praxis-Check gehen wir sie gemeinsam durch und sagen dir, was zuerst wichtig ist.'],
    genau: ['Genauer <em>hinsehen</em> lohnt sich.', 'Mehrere wichtige Punkte sind offen. Kein Grund zur Panik, aber ein guter Grund, sie jetzt anzugehen. Im Praxis-Check zeigen wir dir, wo du am besten anfängst.']
  };
  // Datensicherung und Wiederherstellung wiegen schwerer: fehlen beide, lieber genauer hinsehen
  const KERN = ['sicherung', 'wiederherstellung'];

  function auswerten() {
    const antw = fragen.map((li) => li.dataset.antwort || '');
    if (antw.some((a) => !a)) { aus.hidden = true; warte.hidden = false; return; }
    const offen = fragen.filter((li) => li.dataset.antwort === 'nein');
    const kernOffen = offen.filter((li) => KERN.includes(li.dataset.f)).length;
    const stufe = offen.length === 0 ? 'gut' : offen.length >= 4 || kernOffen === 2 ? 'genau' : 'mittel';
    S.querySelector('.stt-urteil').innerHTML = URTEIL[stufe][0];
    S.querySelector('.stt-satz').textContent = URTEIL[stufe][1];
    const ul = S.querySelector('.stt-offen');
    ul.innerHTML = '';
    offen.forEach((li) => {
      const e = document.createElement('li');
      e.innerHTML = '<b></b><span></span>';
      e.querySelector('b').textContent = li.dataset.t;
      e.querySelector('span').textContent = li.dataset.d;
      ul.appendChild(e);
    });
    S.querySelector('.stt-offen-w').hidden = !offen.length;
    warte.hidden = true; aus.hidden = false;
  }

  fragen.forEach((li) => li.querySelectorAll('.stt-ab button').forEach((b) => {
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => {
      li.dataset.antwort = b.dataset.a;
      li.querySelectorAll('button').forEach((x) => { x.classList.toggle('an', x === b); x.setAttribute('aria-pressed', String(x === b)); });
      auswerten();
    });
  }));

  S.querySelector('.stt-neu').addEventListener('click', () => {
    fragen.forEach((li) => { delete li.dataset.antwort; li.querySelectorAll('button').forEach((x) => { x.classList.remove('an'); x.setAttribute('aria-pressed', 'false'); }); });
    S.querySelector('.stt-danke').hidden = true;
    auswerten();
    S.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  S.querySelector('.stt-mail').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = S.querySelector('#sttMail');
    if (!f.value || !f.checkValidity()) { f.focus(); f.style.borderColor = 'var(--blue)'; return; }
    S.querySelector('.stt-danke').hidden = false;
  });

  // Beim Speichern (Bearbeiten-Modus) den Test im Ausgangszustand ablegen, nicht mit Leons Probe-Antworten
  if ((typeof CV !== 'undefined') && CV.beimSpeichern) CV.beimSpeichern((doc) => {
    const s = doc.getElementById('selbsttest');
    if (!s) return;
    s.querySelectorAll('.stt-fragen li').forEach((li) => li.removeAttribute('data-antwort'));
    s.querySelectorAll('.stt-ab button').forEach((b) => { b.classList.remove('an'); b.removeAttribute('aria-pressed'); });
    const a = s.querySelector('.stt-aus'); if (a) a.hidden = true;
    const w = s.querySelector('.stt-warte'); if (w) w.hidden = false;
    const d = s.querySelector('.stt-danke'); if (d) d.hidden = true;
    const o = s.querySelector('.stt-offen'); if (o) o.innerHTML = '';
  });

  auswerten();
})();

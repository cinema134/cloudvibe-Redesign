/* Sicherheits-Check: geführter Selbsttest (Leon 26.11.2026).
   Ablauf: Branche wählen (entfällt bei ?branche=…) → eine Frage pro Bildschirm (Ja / Nein / Weiß ich nicht, Zurück jederzeit)
   → bei Nein oder Weiß ich nicht eine Erklärkarte unter der Frage (kein Pop-up) → Auswertung in Worten (keine Prozente, keine Punkte)
   → Kontaktformular mit Erreichbarkeit; das Ergebnis geht nur mit Häkchen mit. Mockup: es wird nichts gespeichert oder verschickt.
   Der Test wird erst beim Start NACH <main> eingefügt: Speichern (basis.js) zählt die Textelemente in <main>, dynamische Inhalte dort würden es brechen.
   Fragen, Verzweigungen und Texte stehen unten in BRANCHEN und FRAGEN. */
(function () {
  const hero = document.getElementById('top');
  if (!hero) return;
  const Q = new URLSearchParams(location.search);
  const LINK_RECHT = hero.dataset.recht || '#', LINK_TERMIN = hero.dataset.termin || '#';

  // ---------- Inhalte ----------
  // Symbole nach Lucide (ISC-Lizenz), 24er-Raster, Linie (Leon 26.11.2026: „Icons nicht wirklich sauber“)
  const IC = {
    praxis: '<path d="M11 2v2"/><path d="M5 2v2"/><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle cx="20" cy="10" r="2"/>',
    apotheke: '<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>',
    pflege: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>',
    kanzlei: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
    unternehmen: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
    sonst: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  };
  const BRANCHEN = {
    praxis: { t: 'Arztpraxis oder MVZ', s: 'Praxis, Gemeinschaftspraxis, MVZ', betrieb: 'Praxis', gesund: true },
    apotheke: { t: 'Apotheke', s: 'Mit Kasse und Warenwirtschaft', betrieb: 'Apotheke', gesund: true },
    pflege: { t: 'Pflege oder SAPV', s: 'Einrichtung, Dienst, SAPV-Team', betrieb: 'Einrichtung', gesund: true },
    kanzlei: { t: 'Kanzlei', s: 'Steuerberatung, Anwaltskanzlei', betrieb: 'Kanzlei' },
    unternehmen: { t: 'Unternehmen', s: 'Handwerk, Handel, Dienstleistung', betrieb: 'Unternehmen' },
    sonst: { t: 'Etwas anderes', s: 'Allgemeine Fragen', betrieb: 'Unternehmen' },
  };
  // when(a, b): Frage nur stellen, wenn … (a = Antworten bisher, b = Branche). Reihenfolge = Reihenfolge im Test und in den offenen Punkten.
  const FRAGEN = [
    // Wording (Leon 26.11.2026: „Wird regelmäßig gesichert, mit einer Kopie außer Haus“ versteht man nicht direkt als Backup): Alltagssprache, eine Sache pro Frage
    { id: 'sicherung', f: 'Macht ihr regelmäßig ein <b>Backup</b> eurer Daten?', s: 'Also eine automatische Datensicherung, zum Beispiel jede Nacht.',
      t: 'Regelmäßiges Backup', e: 'Ohne Backup sind Daten nach einem Defekt, einem Fehler oder einem Angriff verloren. Ein automatisches Backup läuft, ohne dass jemand daran denken muss.' },
    { id: 'aussenkopie', f: 'Liegt eine Kopie des Backups <b>außerhalb eurer Räume</b>?', s: 'Zum Beispiel in einem Rechenzentrum oder in der Cloud, nicht im selben Raum wie der Server.', when: (a) => a.sicherung === 'ja',
      t: 'Backup-Kopie außer Haus', e: 'Liegt das einzige Backup neben dem Server, hilft es bei Brand, Wasser oder Diebstahl nicht. Erst eine Kopie an einem anderen Ort macht dich davon unabhängig.' },
    { id: 'wiederherstellung', f: 'Habt ihr schon einmal getestet, ob sich Daten aus dem Backup <b>zurückholen</b> lassen?', s: 'Also wirklich eine Datei oder ein System wiederhergestellt, um zu sehen, ob es klappt.', when: (a) => a.sicherung === 'ja',
      t: 'Wiederherstellung testen', e: 'Ein Backup ist nur so gut wie seine Wiederherstellung. Erst ein Test zeigt, ob sich die Daten im Ernstfall wirklich und vollständig zurückholen lassen.' },
    { id: 'updates', f: 'Werden <b>Updates</b> für Windows und eure Programme automatisch installiert?', s: 'Für alle Rechner, den Browser und die Programme, mit denen ihr täglich arbeitet.',
      t: 'Updates automatisieren', e: 'Veraltete Systeme und Programme sind ein bekanntes Einfallstor für Angriffe. Automatische Updates schließen Lücken, ohne dass jemand daran denken muss.' },
    { id: 'zugaenge', f: 'Meldet sich jede Person im Team mit <b>eigenem Konto</b> an?', s: 'Statt dass sich mehrere ein gemeinsames Konto und Passwort teilen.',
      t: 'Eigenes Konto für jede Person', e: 'Geteilte Konten machen es schwer nachzuvollziehen, wer worauf zugreift, und Zugänge sauber zu entfernen, wenn jemand geht.' },
    { id: 'zweifaktor', f: 'Braucht man für den Zugriff von außen <b>mehr als ein Passwort</b>?', s: 'Zum Beispiel einen Code aus einer App auf dem Handy, wenn jemand im Homeoffice oder unterwegs arbeitet.', when: (a, b) => b === 'kanzlei' || b === 'unternehmen',
      t: 'Zugriff von außen absichern', e: 'Ein Passwort allein reicht oft nicht. Ein zweiter Faktor, etwa eine App auf dem Handy, schützt den Zugang auch dann, wenn das Passwort bekannt wird.' },
    { id: 'firewall', f: 'Kümmert sich jemand darum, dass eure <b>Firewall</b> aktuell ist?', s: 'Die Firewall ist der Schutz zwischen eurem Netzwerk und dem Internet.',
      t: 'Firewall betreuen lassen', e: 'Eine Firewall schützt nur, wenn sie richtig eingestellt ist und aktuell bleibt. Einmal eingerichtet und dann vergessen reicht nicht.' },
    { id: 'mail', f: 'Werden eingehende E-Mails automatisch auf <b>Viren und Betrug</b> geprüft?', s: 'Bevor sie im Postfach landen.',
      t: 'E-Mail-Schutz einrichten', e: 'Die meisten Angriffe beginnen mit einer E-Mail. Ein Filter fängt vieles ab, bevor es im Postfach landet und jemand darauf klickt.' },
    { id: 'ti', f: 'Habt ihr einen festen Ansprechpartner, wenn die <b>TI</b> nicht läuft?', s: 'Also Konnektor oder TI-Gateway, Kartenterminals oder KIM.', when: (a, b) => b === 'praxis' || b === 'apotheke',
      t: 'Ansprechpartner für die TI', e: 'Fällt die Anbindung an die Telematikinfrastruktur aus, stocken E-Rezept und Versichertenkarte. Mit einem festen Ansprechpartner bist du schneller wieder arbeitsfähig.' },
    { id: 'mobil', f: 'Sind Tablets und Handys für unterwegs mit <b>Sperre und Verschlüsselung</b> geschützt?', s: 'Und lässt sich ein verlorenes Gerät aus der Ferne löschen?', when: (a, b) => b === 'pflege',
      t: 'Mobile Geräte schützen', e: 'Unterwegs geht schnell ein Gerät verloren. Sperre und Verschlüsselung schützen die Daten darauf, aus der Ferne lässt es sich dann leeren.' },
    { id: 'verschluesselung', f: 'Sind Laptops und Backups mit Mandantendaten <b>verschlüsselt</b>?', s: 'Damit niemand die Daten lesen kann, der das Gerät oder den Datenträger in die Hand bekommt.', when: (a, b) => b === 'kanzlei',
      t: 'Mandantendaten verschlüsseln', e: 'Kanzleien arbeiten mit besonders vertraulichen Daten. Verschlüsselung schützt sie, wenn ein Laptop oder ein Backup in falsche Hände gerät.' },
    { id: 'uebersicht', f: 'Habt ihr eine aktuelle <b>Liste</b> aller Geräte und Programme?', s: 'Welche Rechner, Server und Programme im Einsatz sind, und wie alt sie sind.', when: (a, b) => b === 'unternehmen',
      t: 'Liste der Geräte und Programme', e: 'Nur was bekannt ist, lässt sich aktuell halten und schützen. Die Liste ist auch die Grundlage für Updates und Lizenzen.' },
    { id: 'team', f: 'Weiß dein Team, wie man <b>gefälschte E-Mails</b> erkennt?', s: 'Sogenanntes Phishing: Mails, die zu einem Klick oder zur Eingabe von Passwörtern verleiten sollen.',
      t: 'Team schulen', e: 'Wer weiß, woran man Phishing erkennt, klickt seltener auf den falschen Link. Eine kurze Schulung im Jahr macht hier viel aus.' },
    { id: 'notfall', f: 'Gibt es einen <b>schriftlichen Plan</b> für den Fall, dass die IT ausfällt?', s: 'Wer tut was, wen ruft man an, wie läuft der Betrieb weiter.',
      t: 'Notfallplan festhalten', e: 'Wenn die IT ausfällt, hilft ein kurzer Plan: wer was tut, wen man anruft und wie der Betrieb weiterläuft. Er spart im Ernstfall die wichtigsten Stunden.' },
  ];
  const URTEIL = {
    gut: ['Gut <em>aufgestellt</em>.', '{im} sehen wir uns an, ob das auch im Detail so ist, zum Beispiel ob die Sicherung wirklich alles umfasst.', 'Die Grundlagen stimmen.'],
    mittel: ['Ein paar <em>Baustellen</em>.', '{im} gehen wir die offenen Punkte gemeinsam durch und sagen dir, was zuerst wichtig ist.', 'Vieles läuft, einige Punkte sind noch offen.'],
    genau: ['Genauer <em>hinsehen</em> lohnt sich.', '{im} zeigen wir dir, wo du am besten anfängst.', 'Mehrere wichtige Punkte sind offen. Kein Grund zur Panik, aber ein guter Grund, sie jetzt anzugehen.'],
  };
  const PF_L = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>';
  const IC_INFO = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>';
  const IC_SCHILD = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-4.5"/></svg>';
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  // ---------- Zustand ----------
  // Leon 26.11.2026: von einer Branchenseite (Arztpraxen, Apotheken, Pflege, Kanzleien, Unternehmen) keine Wahl, Branche steht fest;
  // von Gesundheitswesen (?branche=gesundheit) nur die drei Gesundheitsbranchen; ohne Parameter alle
  let branche = BRANCHEN[Q.get('branche')] ? Q.get('branche') : null;
  const vorgewaehlt = !!branche;
  const nurGesund = Q.get('branche') === 'gesundheit';
  const zurWahl = () => Object.entries(BRANCHEN).filter(([, b]) => !nurGesund || b.gesund);
  let antw = {}, schritt = branche ? 0 : -1; // -1 = Branche wählen, 0…n-1 = Fragen, n = Auswertung
  let sec, karte;
  const liste = () => FRAGEN.filter((q) => !q.when || q.when(antw, branche));
  const gesund = () => !!(branche && BRANCHEN[branche].gesund);

  // Termin-Link im Hero: im Gesundheitswesen die Terminart Praxis-Check
  const tb = hero.querySelector('.pc-termin');
  const terminArt = () => (gesund() ? 'check' : 'erst');
  const setTermin = () => { if (tb) tb.href = gesund() ? tb.dataset.gesund : tb.getAttribute('href').replace(/art=\w+/, 'art=erst'); };
  setTermin();

  function bauen() {
    if (sec) return;
    sec = document.createElement('section');
    sec.className = 'ab alt stw-ab'; sec.id = 'selbsttest';
    sec.setAttribute('aria-label', 'Selbsttest IT-Sicherheit');
    sec.innerHTML = '<div class="wrap"><div class="stw glas" aria-live="polite"></div></div>';
    document.querySelector('main').after(sec);
    karte = sec.querySelector('.stw');
  }
  function start(scrollen) {
    bauen(); zeige();
    if (scrollen) requestAnimationFrame(() => sec.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }
  function inSicht() { if (karte.getBoundingClientRect().top < 70) sec.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

  function kopf(nr, gesamt) {
    const anteil = schritt < 0 ? 0 : Math.min(1, (nr - 1) / gesamt);
    return `<div class="stw-kopf"><button type="button" class="stw-zur"${schritt < 0 || (schritt === 0 && vorgewaehlt) ? ' disabled' : ''}>${PF_L}Zurück</button>
      <div class="stw-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${gesamt}" aria-valuenow="${Math.max(0, nr - 1)}"><i style="width:${Math.round(anteil * 100)}%"></i></div>
      <span class="stw-nr">${schritt < 0 ? 'Start' : nr > gesamt ? 'Fertig' : `Frage ${nr} von ${gesamt}`}</span></div>`;
  }

  function zeige() {
    const L = liste();
    if (schritt >= L.length) return auswertung(L);
    if (schritt < 0) {
      karte.innerHTML = kopf(0, L.length) + `<div class="stw-schritt"><span class="stw-eb">Selbsttest IT-Sicherheit</span>
        <span class="stw-f">Wo <b>arbeitest du</b>?</span><span class="stw-sub">Danach passen wir die Fragen an. Rund zehn kurze Fragen, zwei bis drei Minuten, nichts wird gespeichert.</span>
        <div class="stw-br">${zurWahl().map(([k, b]) => `<button type="button" data-b="${k}"${k === branche ? ' class="an"' : ''}><svg viewBox="0 0 24 24" aria-hidden="true">${IC[k]}</svg><span>${b.t}<br><small>${b.s}</small></span></button>`).join('')}</div></div>`;
      karte.querySelectorAll('[data-b]').forEach((x) => (x.onclick = () => { branche = x.dataset.b; setTermin(); schritt = 0; zeige(); inSicht(); }));
      return;
    }
    const q = L[schritt], a = antw[q.id];
    karte.innerHTML = kopf(schritt + 1, L.length) + `<div class="stw-schritt">
      <span class="stw-eb">${esc(BRANCHEN[branche].t)}${schritt === 0 && !vorgewaehlt ? ' · <button type="button" class="stw-link stw-wechsel" style="font-size:12px;letter-spacing:.08em;text-transform:uppercase">ändern</button>' : ''}</span>
      <span class="stw-f" id="stwF">${q.f}</span><span class="stw-sub">${esc(q.s)}</span>
      <div class="stw-a" role="group" aria-labelledby="stwF">${[['ja', 'Ja'], ['nein', 'Nein'], ['weiss', 'Weiß ich nicht']].map(([k, t]) => `<button type="button" data-a="${k}" aria-pressed="${a === k}"${a === k ? ' class="an"' : ''}>${t}</button>`).join('')}</div>
      <div class="stw-erk-w"></div></div>`;
    karte.querySelector('.stw-zur').onclick = zurueck;
    const w = karte.querySelector('.stw-wechsel');
    if (w) w.onclick = () => { schritt = -1; zeige(); };
    karte.querySelectorAll('[data-a]').forEach((x) => (x.onclick = () => antworten(q, x.dataset.a)));
    if (a && a !== 'ja') erklaere(q, a, false);
  }

  function antworten(q, a) {
    antw[q.id] = a;
    // verzweigte Folgefragen ohne Grundlage verwerfen (z. B. Wiederherstellung, wenn nicht gesichert wird)
    FRAGEN.forEach((x) => { if (x.when && !x.when(antw, branche)) delete antw[x.id]; });
    karte.querySelectorAll('[data-a]').forEach((x) => { x.classList.toggle('an', x.dataset.a === a); x.setAttribute('aria-pressed', String(x.dataset.a === a)); });
    if (a === 'ja') { karte.querySelector('.stw-erk-w').innerHTML = ''; setTimeout(() => { schritt++; zeige(); inSicht(); }, 260); }
    else erklaere(q, a, true);
  }

  function erklaere(q, a, fokus) {
    const t = a === 'weiss' ? 'Kein Problem, genau dafür ist der Check da.' : 'Warum das wichtig ist';
    const w = karte.querySelector('.stw-erk-w');
    w.innerHTML = `<div class="stw-erk"><span class="stw-erk-t">${IC_INFO}${t}</span><span class="stw-erk-x">${esc(q.e)}</span>
      <button type="button" class="btn stw-weiter">${schritt + 1 >= liste().length ? 'Zur Auswertung' : 'Weiter'}</button></div>`;
    const b = w.querySelector('.stw-weiter');
    b.onclick = () => { schritt++; zeige(); inSicht(); };
    if (fokus) b.focus({ preventScroll: true });
  }

  function zurueck() { if (schritt === 0 && vorgewaehlt) return; schritt = schritt <= 0 ? -1 : schritt - 1; zeige(); } // ohne Vorwahl von der ersten Frage zurück zur Branchenwahl

  function bewertung(L) {
    const offen = L.filter((q) => antw[q.id] && antw[q.id] !== 'ja');
    const sichOffen = antw.sicherung && antw.sicherung !== 'ja';
    const stufe = offen.length === 0 ? 'gut' : offen.length >= 4 || sichOffen ? 'genau' : 'mittel';
    return { offen, stufe };
  }

  function auswertung(L) {
    const { offen, stufe } = bewertung(L), b = BRANCHEN[branche];
    const im = gesund() ? 'Im Praxis-Check' : 'Im Gespräch';
    const u = URTEIL[stufe];
    const op = (q) => `<span class="stw-op"><b>${esc(q.t)}</b><span>${esc(q.e)}</span></span>`;
    const erste = offen.slice(0, 3), rest = offen.slice(3);
    karte.innerHTML = kopf(L.length + 1, L.length) + `<div class="stw-schritt">
      <span class="stw-eb">Deine erste Einschätzung</span>
      <div class="stw-urt">${IC_SCHILD}<div><span class="stw-f">${u[0]}</span><span class="stw-sub" style="margin:0">${u[2]} ${u[1].replace('{im}', im)}</span></div></div>
      <div class="stw-offen">${offen.length ? `<span class="stw-offen-t">${offen.length === 1 ? 'Dein offener Punkt' : 'Deine wichtigsten offenen Punkte'}</span>${erste.map(op).join('')}
        ${rest.length ? `<details class="stw-mehr"><summary>${rest.length === 1 ? 'Ein weiterer Punkt' : rest.length + ' weitere Punkte'}</summary>${rest.map(op).join('')}</details>` : ''}`
        : '<span class="stw-gut">Bei keiner Frage ist etwas offen geblieben.</span>'}</div>
      <div class="stw-k">
       <span class="stw-k-t">Lass uns <b>darüber sprechen</b>.</span>
       <span class="stw-k-s">Sag uns, wie und wann wir dich am besten erreichen. Wir melden uns zu unseren Servicezeiten, Montag bis Freitag von 8 bis 17 Uhr.</span>
       <form class="stw-form" novalidate>
        ${feld('vorname', 'Vorname', 'given-name', true)}${feld('nachname', 'Nachname', 'family-name', true)}
        ${feld('firma', esc(b.betrieb), 'organization', true, 'voll')}
        ${feld('mail', 'E-Mail', 'email', true, '', 'email')}${feld('tel', 'Telefon', 'tel', false, '', 'tel')}
        <div class="stw-feld voll"><span class="stw-l" id="stwWeg">Wie sollen wir uns melden?</span>
         <div class="stw-chips" role="radiogroup" aria-labelledby="stwWeg">${chip('radio', 'weg', 'rueckruf', 'Rückruf', true)}${chip('radio', 'weg', 'mail', 'Per E-Mail')}</div></div>
        <div class="stw-feld voll stw-wann"><span class="stw-l" id="stwTage">An welchen Tagen passt es dir?</span>
         <div class="stw-chips" aria-labelledby="stwTage">${['Mo', 'Di', 'Mi', 'Do', 'Fr'].map((d) => chip('checkbox', 'tag', d, d)).join('')}</div></div>
        <div class="stw-feld voll stw-wann"><span class="stw-l" id="stwZeit">Zu welcher Zeit?</span>
         <div class="stw-chips" aria-labelledby="stwZeit">${chip('checkbox', 'zeit', 'vormittags', 'Vormittags, 8 bis 12 Uhr')}${chip('checkbox', 'zeit', 'mittags', 'Mittags, 12 bis 14 Uhr')}${chip('checkbox', 'zeit', 'nachmittags', 'Nachmittags, 14 bis 17 Uhr')}</div></div>
        <div class="stw-feld voll"><label class="stw-l" for="stw-notiz">Noch etwas, das wir wissen sollten? <span style="font-weight:400">(optional)</span></label><textarea id="stw-notiz"></textarea></div>
        <label class="check voll"><input type="checkbox" id="stw-erg"> <span>Ergebnis des Selbsttests mitschicken, damit wir uns vorbereiten können.</span></label>
        <label class="check voll"><input type="checkbox" id="stw-ds"> <span>Ich bin einverstanden, dass ihr meine Angaben zur Bearbeitung meiner Anfrage verwendet. Mehr dazu in unserer <a class="link-t" href="${esc(LINK_RECHT)}">Datenschutzerklärung</a>. <i style="font-style:normal;color:var(--blau-t)">*</i></span></label>
        <span class="stw-fm voll stw-ds-fm" hidden>Bitte bestätige die Datenschutzerklärung.</span>
        <div class="voll stw-fuss"><button type="submit" class="btn">Anfrage senden</button><a class="stw-link" href="${esc(LINK_TERMIN)}?art=${terminArt()}">Lieber direkt einen Termin buchen</a><button type="button" class="stw-link stw-neu">Test neu starten</button></div>
       </form>
      </div></div>`;
    karte.querySelector('.stw-zur').onclick = () => { schritt = L.length - 1; zeige(); };
    karte.querySelector('.stw-neu').onclick = () => { antw = {}; schritt = vorgewaehlt ? 0 : -1; zeige(); inSicht(); };
    const f = karte.querySelector('form');
    const wann = () => { const rr = f.querySelector('input[name="weg"]:checked').value === 'rueckruf'; f.querySelectorAll('.stw-wann').forEach((x) => (x.hidden = !rr)); f.querySelector('[for="stw-tel"] i').hidden = !rr; };
    f.querySelectorAll('input[name="weg"]').forEach((x) => (x.onchange = wann)); wann();
    f.addEventListener('input', (e) => { const fe = e.target.closest('.stw-feld'); if (fe) { fe.classList.remove('fehler'); const m = fe.querySelector('.stw-fm'); if (m) m.hidden = true; } if (e.target.id === 'stw-ds') f.querySelector('.stw-ds-fm').hidden = true; });
    f.onsubmit = (e) => {
      e.preventDefault();
      const rr = f.querySelector('input[name="weg"]:checked').value === 'rueckruf';
      let erstes = null;
      const pruef = (id, ok, text) => { const fe = f.querySelector('#stw-' + id).closest('.stw-feld'), m = fe.querySelector('.stw-fm'); fe.classList.toggle('fehler', !ok); m.textContent = text; m.hidden = ok; if (!ok && !erstes) erstes = f.querySelector('#stw-' + id); };
      const v = (id) => f.querySelector('#stw-' + id).value.trim();
      pruef('vorname', !!v('vorname'), 'Bitte gib deinen Vornamen ein.');
      pruef('nachname', !!v('nachname'), 'Bitte gib deinen Nachnamen ein.');
      pruef('firma', !!v('firma'), 'Bitte gib den Namen deines Betriebs ein.');
      pruef('mail', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('mail')), 'Bitte gib eine gültige E-Mail-Adresse ein.');
      pruef('tel', !rr || v('tel').replace(/\D/g, '').length >= 6, 'Für den Rückruf brauchen wir deine Telefonnummer.');
      const ds = f.querySelector('#stw-ds').checked;
      f.querySelector('.stw-ds-fm').hidden = ds;
      if (erstes) { erstes.focus(); return; }
      if (!ds) { f.querySelector('#stw-ds').focus(); return; }
      const tage = [...f.querySelectorAll('input[name="tag"]:checked')].map((x) => x.value), zeit = [...f.querySelectorAll('input[name="zeit"]:checked')].map((x) => x.nextElementSibling.textContent);
      const weg = rr ? `Wir rufen dich an${tage.length ? ' (' + tage.join(', ') + (zeit.length ? '; ' + zeit.join(', ') : '') + ')' : zeit.length ? ' (' + zeit.join(', ') + ')' : ''}.` : 'Wir melden uns per E-Mail.';
      karte.querySelector('.stw-k').innerHTML = `<span class="stw-danke"><b>Danke, ${esc(v('vorname'))}!</b>${weg} ${f.querySelector('#stw-erg').checked ? 'Dein Ergebnis haben wir dabei.' : ''}</span>`; // keine Mockup-Hinweise (Leon 26.11.2026)
    };
  }
  function feld(id, label, ac, pflicht, kl = '', typ = 'text') {
    return `<div class="stw-feld ${kl}"><label class="stw-l" for="stw-${id}">${label} ${pflicht ? '<i>*</i>' : '<i hidden>*</i>'}</label><input id="stw-${id}" type="${typ}" autocomplete="${ac}"><span class="stw-fm" hidden></span></div>`;
  }
  function chip(typ, name, wert, text, an) {
    return `<label class="stw-chip"><input type="${typ}" name="${name}" value="${wert}"${an ? ' checked' : ''}><span>${text}</span></label>`;
  }

  // ---------- Start ----------
  document.querySelectorAll('a[href="#selbsttest"]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); history.replaceState(null, '', location.pathname + location.search + '#selbsttest'); start(true); }));
  if (location.hash === '#selbsttest') start(true);
  window.addEventListener('hashchange', () => { if (location.hash === '#selbsttest') start(true); });
})();

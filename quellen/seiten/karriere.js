/* ================= Karriere: Stellenanzeigen aus Daten, Detailansicht je Stelle =================
   Abstimmung 24.11.2026: Anzahl der Stellen in den Einstellungen selbst festlegen (Titel, Ort, Art, Beschreibung);
   je Stelle eine eigene Ansicht ("Unterseite"). Inhalt und Odoo-Anbindung folgen später, der Aufbau ist darauf vorbereitet:
   ein Datensatz je Stelle mit titel, ort, art, kurz, aufgaben, profil (Zeilen = Aufzählung).
   Änderungen bleiben im Browser (localStorage) und werden mit "Speichern" fest in die Datei geschrieben.
   Zum Prüfen: #stelle-1, #stelle-2 … */
(function () {
  const liste = document.getElementById('krStellen');
  const quelle = document.getElementById('stellen-daten');
  if (!liste || !quelle) return;
  const SPEICHER = 'cloudvibe-karriere-stellen';
  const MAIL = 'hire@cloudvibe.de';
  const PFEIL = '<svg class="pf" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const esc = (s) => String(s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const zeilen = (s) => String(s || '').split('\n').map((z) => z.trim()).filter(Boolean);

  const original = JSON.parse(quelle.textContent);
  let stellen;
  try { stellen = JSON.parse(localStorage.getItem(SPEICHER)) || original; } catch (e) { stellen = original; }

  function merken() {
    try { localStorage.setItem(SPEICHER, JSON.stringify(stellen)); } catch (e) {}
    if (CV.geaendert) CV.geaendert();
  }
  // Beim Speichern die aktuellen Stellen fest in die Datei schreiben
  if (CV.beimSpeichern) CV.beimSpeichern((d) => {
    const s = d.getElementById('stellen-daten');
    if (s) s.textContent = '[\n' + stellen.map((x) => '   ' + JSON.stringify(x)).join(',\n') + '\n  ]';
  });

  /* ---- Liste ---- */
  function zeigeListe() {
    liste.innerHTML = stellen.length
      ? stellen.map((s, i) => `<a href="#stelle-${i + 1}"><span class="kr-st"><b>${esc(s.titel)}</b><small>${esc([s.ort, s.art].filter(Boolean).join(' · '))}</small></span>${s.beispiel ? '<em class="st-bsp" title="Beispielstelle, wird durch echte Stellen ersetzt">Beispiel</em>' : ''}${PFEIL}</a>`).join('')
      : '<p class="kr-leer">Gerade ist keine Stelle ausgeschrieben. Schreib uns trotzdem gern.</p>';
  }

  /* ---- Detailansicht ("Unterseite" je Stelle) ---- */
  const main = document.querySelector('main');
  const ansicht = document.createElement('div');
  ansicht.className = 'stelle-ansicht';
  ansicht.id = 'stelleAnsicht';
  main.after(ansicht);
  function zeigeStelle(i) {
    const s = stellen[i];
    if (!s) { document.body.classList.remove('stelle-an'); return; }
    const betreff = encodeURIComponent('Bewerbung: ' + s.titel);
    const lst = (t) => (zeilen(t).length ? '<ul class="stelle-l">' + zeilen(t).map((z) => `<li>${esc(z)}</li>`).join('') + '</ul>' : '');
    ansicht.innerHTML = `
<section class="uhero stelle-hero">
 <div class="wrap uhero-in">
  <nav class="krumen" aria-label="Pfad"><a href="${esc(document.querySelector('.krumen a')?.getAttribute('href') || '#')}">Startseite</a><span>/</span><a href="#stellen" data-zurueck>Karriere</a><span>/</span>${esc(s.titel)}</nav>
  ${s.beispiel ? '<em class="st-bsp">Beispiel</em>' : ''}
  <h1 class="stelle-h1">${esc(s.titel)}</h1>
  <p class="stelle-meta">${esc([s.ort, s.art].filter(Boolean).join(' · '))}</p>
  ${s.kurz ? `<p class="lead">${esc(s.kurz)}</p>` : ''}
  <div class="btns"><a class="btn" href="mailto:${MAIL}?subject=${betreff}">Jetzt bewerben</a><a class="btn zw" href="#stellen" data-zurueck>Alle Stellen</a></div>
 </div>
</section>
<section class="ab stelle-inhalt">
 <div class="wrap stelle-raster">
  ${zeilen(s.aufgaben).length ? `<div><div class="eb">Deine Aufgaben</div><h2>Was du <b>bei uns machst</b>.</h2>${lst(s.aufgaben)}</div>` : ''}
  ${zeilen(s.profil).length ? `<div><div class="eb">Dein Profil</div><h2>Was du <b>mitbringst</b>.</h2>${lst(s.profil)}</div>` : ''}
 </div>
</section>
<section class="ab alt stelle-bew">
 <div class="wrap stelle-bew-in">
  <div><h2>Klingt nach dir? <b>Schreib uns.</b></h2><p class="lead">Ein paar Sätze zu dir und dein Lebenslauf reichen. Du bekommst eine Rückmeldung von einer echten Person.</p></div>
  <a class="btn" href="mailto:${MAIL}?subject=${betreff}">${MAIL}</a>
 </div>
</section>`;
    document.body.classList.add('stelle-an');
    ansicht.querySelectorAll('[data-zurueck]').forEach((a) => (a.onclick = () => { history.replaceState(null, '', '#stellen'); route(); }));
    scrollTo(0, 0);
  }
  function route() {
    const m = location.hash.match(/^#stelle-(\d+)$/);
    if (m) zeigeStelle(+m[1] - 1);
    else {
      const war = document.body.classList.contains('stelle-an');
      document.body.classList.remove('stelle-an');
      if (war && location.hash) document.querySelector(location.hash)?.scrollIntoView();
    }
  }
  addEventListener('hashchange', route);

  /* ---- Einstellungen: Stellenanzeigen anlegen, ändern, entfernen ---- */
  const inhalt = document.querySelector('#stgPanel .stg-inhalt');
  let panel;
  function zeigePanel() {
    if (!panel) return;
    panel.innerHTML = '<h5>Stellenanzeigen</h5><p class="stg-hin">Anzahl, Titel und Beschreibung frei festlegen. Aufgaben und Profil: eine Zeile je Punkt. „Speichern“ schreibt die Stellen fest in die Datei.</p>' +
      stellen.map((s, i) => `
<details class="stg-stelle" data-i="${i}">
 <summary>${esc(s.titel) || 'Neue Stelle'}</summary>
 <label>Titel<input data-f="titel" value="${esc(s.titel)}"></label>
 <div class="stg-2"><label>Ort<input data-f="ort" value="${esc(s.ort)}"></label><label>Art<input data-f="art" value="${esc(s.art)}"></label></div>
 <label>Kurzbeschreibung<textarea data-f="kurz" rows="3">${esc(s.kurz)}</textarea></label>
 <label>Aufgaben<textarea data-f="aufgaben" rows="4">${esc(s.aufgaben)}</textarea></label>
 <label>Profil<textarea data-f="profil" rows="4">${esc(s.profil)}</textarea></label>
 <label class="stg-ck"><input type="checkbox" data-f="beispiel"${s.beispiel ? ' checked' : ''}> als „Beispiel“ markieren</label>
 <div class="stg-st-knoepfe"><button type="button" data-a="hoch"${i ? '' : ' disabled'}>Nach oben</button><button type="button" data-a="weg">Entfernen</button></div>
</details>`).join('') +
      '<div class="stg-st-knoepfe"><button type="button" data-a="neu" class="prim">+ Stelle hinzufügen</button><button type="button" data-a="reset">Beispiele wiederherstellen</button></div>';
  }
  if (inhalt) {
    panel = document.createElement('section');
    panel.className = 'stg-gr stg-stellen';
    panel.dataset.ziel = '#stellen';
    inhalt.appendChild(panel);
    zeigePanel();
    panel.addEventListener('input', (e) => {
      const f = e.target.dataset.f, box = e.target.closest('[data-i]');
      if (!f || !box) return;
      const s = stellen[+box.dataset.i];
      s[f] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      if (f === 'titel') box.querySelector('summary').textContent = s.titel || 'Neue Stelle';
      merken(); zeigeListe(); route();
    });
    panel.addEventListener('click', (e) => {
      const a = e.target.closest('button[data-a]')?.dataset.a;
      if (!a) return;
      const box = e.target.closest('[data-i]'), i = box ? +box.dataset.i : -1;
      if (a === 'neu') stellen.push({ titel: 'Neue Stelle (m/w/d)', ort: 'Goch', art: 'Vollzeit', kurz: '', aufgaben: '', profil: '', beispiel: false });
      if (a === 'weg') stellen.splice(i, 1);
      if (a === 'hoch' && i > 0) stellen.splice(i - 1, 0, stellen.splice(i, 1)[0]);
      if (a === 'reset') stellen = JSON.parse(JSON.stringify(original));
      merken(); zeigeListe(); zeigePanel(); route();
      if (a === 'neu') { const n = panel.querySelectorAll('.stg-stelle'); n[n.length - 1].open = true; document.getElementById('stellen').scrollIntoView({ behavior: 'smooth' }); }
    });
  }

  zeigeListe();
  route();
})();

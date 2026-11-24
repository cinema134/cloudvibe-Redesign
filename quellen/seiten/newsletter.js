/* Newsletter-Seite: Zustände (?nl=bestaetigt|einstellungen|abgemeldet), Bereich der Beispielausgabe, Einstellungen speichern (simuliert) */
(function () {
  const nl = CV.Q.get('nl');
  const zeige = (z) => document.querySelectorAll('.nl-zustand').forEach((x) => (x.hidden = x.dataset.zustand !== z));
  if (nl === 'bestaetigt' || nl === 'abgemeldet') zeige(nl);
  if (nl === 'einstellungen') setTimeout(() => document.getElementById('einstellungen').scrollIntoView(), 300);

  // Beispielausgabe: Branchenblock je Bereich
  const wahl = document.querySelector('.nl-wahl');
  if (wahl) wahl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-bereich]');
    if (!b) return;
    wahl.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
    document.querySelectorAll('.nl-m-branche').forEach((x) => (x.hidden = x.dataset.fuer !== b.dataset.bereich));
    const betreff = { gesundheit: 'Phishing vor den Feiertagen und neue TI-Updates', kanzlei: 'Phishing vor den Feiertagen und DATEV zum Jahreswechsel', unternehmen: 'Phishing vor den Feiertagen und neue Kolleginnen im Januar' };
    document.querySelector('.nl-betreff').textContent = 'Dezember: ' + betreff[b.dataset.bereich];
  });

  // Einstellungen speichern
  const einst = document.querySelector('.nl-einst');
  if (einst) einst.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = einst.querySelector('.nl-einst-ok');
    ok.hidden = false;
    setTimeout(() => (ok.hidden = true), 3000);
  });
})();

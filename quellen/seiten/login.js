/* ================= Login Kundenportal: Anmelden, Passwort vergessen, Link gesendet, angemeldet (?demo=vergessen|gesendet|drin) ================= */
(function () {
  const karte = document.querySelector('.lg-karte');
  if (!karte) return;
  const teile = [...karte.querySelectorAll('[data-lg]')];
  const zeige = (n, fokus) => {
    teile.forEach((t) => (t.hidden = t.dataset.lg !== n));
    const t = karte.querySelector(`[data-lg="${n}"]`);
    if (fokus) (t.querySelector('input') || t).focus({ preventScroll: true });
  };
  karte.addEventListener('click', (e) => {
    const z = e.target.closest('[data-zu]');
    if (!z) return;
    e.preventDefault();
    zeige(z.dataset.zu, true);
  });
  // Pflichtfelder prüfen wie beim Ticket (rote Hinweise unter dem Feld)
  const pruefe = (form) => {
    let ok = true;
    form.querySelectorAll('input[required]').forEach((i) => {
      const gut = i.type === 'email' ? /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.value.trim()) : i.value.trim() !== '';
      i.closest('.feld').classList.toggle('fehlt', !gut);
      if (!gut && ok) { i.focus(); ok = false; }
    });
    return ok;
  };
  karte.querySelectorAll('form').forEach((f) => {
    f.addEventListener('input', (e) => e.target.closest('.feld')?.classList.remove('fehlt'));
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!pruefe(f)) return;
      zeige(f.dataset.lg === 'an' ? 'drin' : 'gesendet', true);
    });
  });
  // Passwort anzeigen
  const zb = karte.querySelector('.lg-zeig'), pw = document.getElementById('lg-pw');
  zb.onclick = () => {
    const an = pw.type === 'password';
    pw.type = an ? 'text' : 'password';
    zb.setAttribute('aria-pressed', String(an));
    zb.setAttribute('aria-label', an ? 'Passwort verbergen' : 'Passwort anzeigen');
  };
  const demo = CV.Q.get('demo');
  if (['vergessen', 'gesendet', 'drin'].includes(demo)) zeige(demo);
})();

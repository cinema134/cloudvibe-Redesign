/* DATEV: FAQ je Kundengruppe umschalten (Standard Kanzleien, ?fuer=unternehmen) */
(function () {
  const w = document.querySelector('.faq-wahl');
  if (!w) return;
  const set = (f) => {
    w.querySelectorAll('[data-fuer]').forEach((b) => b.classList.toggle('on', b.dataset.fuer === f));
    document.querySelectorAll('.faq-liste details[data-fuer]').forEach((d) => { d.hidden = d.dataset.fuer !== f; if (d.hidden) d.open = false; });
  };
  w.querySelectorAll('[data-fuer]').forEach((b) => (b.onclick = () => set(b.dataset.fuer)));
  set(CV.Q.get('fuer') === 'unternehmen' ? 'unternehmen' : 'kanzlei');
})();
/* Hero-Einstieg rechts (Leon 25.11.2026): "Für Kanzleien" bzw. "Für Unternehmen" schaltet die FAQ passend um und springt hin */
document.querySelectorAll('.hk-z[data-fuer-wahl]').forEach((a) => a.addEventListener('click', () => { const b = document.querySelector('#faq [data-fuer="' + a.dataset.fuerWahl + '"]'); if (b) b.click(); }));

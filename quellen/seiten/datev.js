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
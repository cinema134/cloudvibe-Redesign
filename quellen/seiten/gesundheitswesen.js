/* Gesundheitswesen: Vergleich Überarbeitet (Standard) / Bisher (?gw=bisher), Leon 24.11.2026:
   TI-Aufzählung ohne Nummern, Nummern bei "So starten wir", Praxis-Check unter "So starten wir", ruhigere "Leistungen im Detail" */
(function () {
  const B = document.body;
  const set = (alt) => {
    B.classList.toggle('gwAlt', alt); B.classList.toggle('ldAlt', alt);
    document.querySelectorAll('[data-gw]').forEach((b) => b.classList.toggle('on', (b.dataset.gw === 'alt') === alt));
    if (CV.stickyEinmal) CV.stickyEinmal(alt);
  };
  if (document.getElementById('stgPanel') && CV.panelZeile) {
    const z = document.createElement('div');
    z.className = 'stg-z'; z.dataset.ziel = '#leistungen';
    z.innerHTML = '<span>Seitenaufbau</span><div class="seg"><button type="button" data-gw="neu" class="on">Überarbeitet</button><button type="button" data-gw="alt">Bisher</button></div>';
    CV.panelZeile(z); // Panel-Reiter „Diese Seite“
    z.querySelectorAll('[data-gw]').forEach((b) => (b.onclick = () => set(b.dataset.gw === 'alt')));
  }
  set(CV.Q.get('gw') === 'bisher');
})();
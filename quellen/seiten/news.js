/* News-Übersicht: Filter nach Bereich und Thema; ?kat=hc|kanzlei|unternehmen|sicherheit|backup|ti */
(function () {
  const knoepfe = document.querySelectorAll('.nf [data-kat]'), karten = document.querySelectorAll('.news-alle .nk'), leer = document.querySelector('.nf-leer');
  if (!knoepfe.length) return;
  function setze(k) {
    let n = 0;
    knoepfe.forEach((b) => b.classList.toggle('on', b.dataset.kat === k));
    karten.forEach((c) => { const an = k === 'alle' || c.dataset.kat.split(' ').includes(k); c.hidden = !an; if (an) n++; });
    if (leer) leer.hidden = n > 0;
  }
  knoepfe.forEach((b) => (b.onclick = () => setze(b.dataset.kat)));
  const q = new URLSearchParams(location.search).get('kat');
  setze([...knoepfe].some((b) => b.dataset.kat === q) ? q : 'alle');
})();

/* Newsletter-Karte mit ruhiger Welle im Hintergrund (Prüfdokument 24.11.2026: „würde ich die Welle im Hintergrund einbauen“).
   Werte wie die stehende Welle hinter dem Kontaktblock (#cvK); Inhalt liegt darüber, Dunkelmodus zeichnet CV.stillWelle selbst neu. */
(function () {
  const karte = document.querySelector('#newsletter .nlb');
  if (!karte || typeof CV === 'undefined' || !CV.stillWelle) return;
  const cv = document.createElement('canvas');
  cv.className = 'nlb-welle';
  cv.setAttribute('aria-hidden', 'true');
  karte.classList.add('nlb-mitwelle');
  karte.prepend(cv);
  CV.stillWelle(cv, { N: 16, hs: 0.9, lw: 1.1, bp: 0.78, opm: 0.55 }, 3.4, 0.6); // N 16 statt 26: im flachen Band am Kartenrand sonst zu dicht
})();

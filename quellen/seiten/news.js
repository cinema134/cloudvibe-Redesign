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

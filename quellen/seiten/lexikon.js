/* Lexikon: Suche und Filter nach Bereich; leere Buchstaben-Gruppen ausblenden */
(function () {
  const suche = document.getElementById('lxSuche'), knoepfe = document.querySelectorAll('[data-lxb]:is(button)'), leer = document.querySelector('.lx-leer');
  if (!suche) return;
  let ber = 'alle';
  function filtern() {
    const q = suche.value.trim().toLowerCase();
    let n = 0;
    document.querySelectorAll('.lx-gruppe').forEach((g) => {
      let m = 0;
      g.querySelectorAll('.lx-eintrag').forEach((e) => {
        const an = (ber === 'alle' || e.dataset.lxb === ber) && (!q || e.textContent.toLowerCase().includes(q));
        e.hidden = !an; if (an) m++;
      });
      g.hidden = !m; n += m;
    });
    leer.hidden = n > 0;
  }
  suche.addEventListener('input', filtern);
  knoepfe.forEach((b) => (b.onclick = () => { ber = b.dataset.lxb; knoepfe.forEach((x) => x.classList.toggle('on', x === b)); filtern(); }));
})();

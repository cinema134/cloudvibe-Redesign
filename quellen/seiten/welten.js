/* Vergleich Bereichs-Welten: Kanzleien-Richtung umschalten (A Navy, B Graphit, C Petrol), auch per ?kz=B */
(function () {
  const art = document.querySelector('.w-kz');
  const setKz = (v) => {
    art.classList.remove('kzA', 'kzB', 'kzC');
    art.classList.add('kz' + v);
    document.querySelectorAll('[data-kz]').forEach((b) => b.classList.toggle('on', b.dataset.kz === v));
  };
  document.querySelectorAll('[data-kz]').forEach((b) => (b.onclick = () => setKz(b.dataset.kz)));
  const q = new URLSearchParams(location.search).get('kz');
  setKz(['A', 'B', 'C'].includes(q) ? q : 'C'); // entschieden: C Petrol
})();

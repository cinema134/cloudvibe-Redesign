/* Kanzleien: Branche vorbelegen; Hero-Umschalter der Unterseiten ausblenden (eigener Hero) */
(function () {
  const s = document.getElementById('f-branche');
  if (s) s.value = 'Kanzlei';
  document.querySelectorAll('.stg [data-h]').forEach((b) => (b.hidden = true));
  document.querySelectorAll('.stg .grp').forEach((x) => { if (x.textContent.trim() === 'Hero') { x.hidden = true; const i = x.previousElementSibling; if (i && i.tagName === 'I') i.hidden = true; } });
  document.body.classList.remove('hvA', 'hvB', 'hvC');
})();

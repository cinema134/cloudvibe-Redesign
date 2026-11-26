/* Kanzleien: Branche vorbelegen; Hero-Umschalter der Unterseiten ausblenden (eigener Hero) */
(function () {
  const s = document.getElementById('f-branche');
  if (s) s.value = 'Kanzlei';
  document.querySelectorAll('.stg [data-h]').forEach((b) => (b.hidden = true));
  document.querySelectorAll('.stg .grp').forEach((x) => { if (x.textContent.trim() === 'Hero') { x.hidden = true; const i = x.previousElementSibling; if (i && i.tagName === 'I') i.hidden = true; } });
  document.body.classList.remove('hvA', 'hvB', 'hvC');

  /* Paragraf im Hero selbst ausrichten (Leon 26.11.2026: „immer noch optisch schief, gib mir eine Einstellung“):
     Diese Seite → „Paragraf neigen“, Regler in 0,5°-Schritten, Drehung um die Mitte des Zeichens.
     Gemerkt als hzWinkel (Browser, „Für alle festlegen“). Standard = Wert aus kanzleien.html (rotate(11 60 60)). */
  if (typeof CV === 'undefined') return;
  const g = document.querySelector('.uhero>.hz g[transform^="rotate"]');
  if (!g) return;
  const m = /rotate\(\s*([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)/.exec(g.getAttribute('transform'));
  const STD = m ? +m[1] : 11, cx = m ? m[2] : 60, cy = m ? m[3] : 60;
  // Vorschau im Panel (das Fenster verdeckt den Paragrafen bis ca. 1500 px Breite), mit senkrechter Hilfslinie
  const ns = 'http://www.w3.org/2000/svg', vor = document.createElementNS(ns, 'svg');
  vor.setAttribute('viewBox', '0 0 120 120'); vor.setAttribute('aria-hidden', 'true');
  vor.style.cssText = 'width:96px;height:96px;flex:none;fill:none;stroke:currentColor;stroke-width:5;stroke-linecap:round;color:var(--text,#14171C)';
  vor.innerHTML = `<path d="M${cx} 4V116" style="stroke:var(--blue,#2D6CDF);stroke-width:1.6;stroke-dasharray:4 4;opacity:.9"/>`;
  const g2 = g.cloneNode(true); vor.appendChild(g2);
  const setW = (w) => [g, g2].forEach((x) => x.setAttribute('transform', `rotate(${w} ${cx} ${cy})`));
  const fz = (w) => (w > 0 ? '+' : '') + String(w).replace('.', ',') + '°';
  let w = +CV.wert('hzWinkel', CV.Q.get('hzwinkel'), STD);
  if (!isFinite(w)) w = STD;
  setW(w);
  const z = document.createElement('div');
  z.className = 'stg-z'; z.dataset.ziel = '#top';
  z.innerHTML = '<span>Paragraf neigen</span><label class="sp"><span class="v"></span><input type="range" min="-20" max="30" step="0.5"></label><button type="button" class="hzw-std">Standard</button>';
  const r = z.querySelector('input'), v = z.querySelector('.v');
  r.value = w; v.textContent = fz(w);
  r.addEventListener('input', () => { const x = +r.value; setW(x); v.textContent = fz(x); CV.merke('hzWinkel', x); });
  z.querySelector('.hzw-std').onclick = () => { r.value = STD; setW(STD); v.textContent = fz(STD); CV.merke('hzWinkel', null); };
  z.style.flexWrap = 'wrap';
  const vz = document.createElement('div');
  vz.style.cssText = 'flex-basis:100%;display:flex;align-items:center;gap:14px;font-size:13px;color:var(--muted)';
  vz.append(vor, document.createTextNode('Vorschau mit senkrechter Hilfslinie. Pfeiltasten am Regler: feine Schritte.'));
  z.appendChild(vz);
  CV.panelZeile(z);
})();

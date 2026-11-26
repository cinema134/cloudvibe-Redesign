(function(){
  const T = window.__SAISON || 'weihnachten';
  const karte = (wort) => { const h = [...document.querySelectorAll('main h3')].find((x) => x.textContent.trim() === wort); if (!h) return null; let k = h.parentElement; while (k && k.parentElement && k.getBoundingClientRect().width < 380) k = k.parentElement; return k; }; // ganze Kachel (ca. 420 px breit)
  const st = document.createElement('style');
  st.textContent = '.szk{position:absolute;pointer-events:none;z-index:50}szk-pendel{transform-origin:50% 0;animation:kdP 4s ease-in-out infinite}@keyframes kdP{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}';
  document.head.appendChild(st);
  // ohne die Karte umzupositionieren (sonst werden versteckte Linien sichtbar): absolut auf der Seite, gemessen an der Kachel
  const setze = (el, html, css) => {
    if (!el) return;
    const r = el.getBoundingClientRect(), w = +(/width="(\d+)"/.exec(html) || [0, 0])[1];
    const top = +(/top:(-?\d+)px/.exec(css) || [0, 0])[1], right = +(/right:(-?\d+)px/.exec(css) || [0, 0])[1];
    const d = document.createElement('div'); d.className = 'szk';
    d.style.cssText = `left:${r.right - right - w + scrollX}px;top:${r.top + top + scrollY}px`;
    d.innerHTML = html; document.body.appendChild(d);
  };
  const kugel = (x, faden, r, farbe, kappe = '#C9A94B', verz = 0) => `<g class="szk-pendel" style="transform-box:fill-box;animation-delay:-${verz}s"><path d="M${x} 0V${faden}" stroke="#B8BFCB" stroke-width="1"/><rect x="${x - 3}" y="${faden - 1}" width="6" height="4" rx="1" fill="${kappe}"/><circle cx="${x}" cy="${faden + 3 + r}" r="${r}" fill="${farbe}"/><ellipse cx="${x - r * 0.35}" cy="${faden + 3 + r * 0.6}" rx="${r * 0.25}" ry="${r * 0.38}" fill="#fff" opacity=".45"/></g>`;
  const ei = (x, y, w, h, farbe, muster, dreh) => `<g transform="rotate(${dreh} ${x} ${y})"><path d="M${x} ${y - h / 2} C${x - w * 0.62} ${y - h / 2} ${x - w / 2} ${y + h * 0.2} ${x - w / 2} ${y + h * 0.18} C${x - w / 2} ${y + h * 0.42} ${x - w * 0.28} ${y + h / 2} ${x} ${y + h / 2} C${x + w * 0.28} ${y + h / 2} ${x + w / 2} ${y + h * 0.42} ${x + w / 2} ${y + h * 0.18} C${x + w / 2} ${y + h * 0.2} ${x + w * 0.62} ${y - h / 2} ${x} ${y - h / 2} Z" fill="${farbe}"/>${muster}</g>`;
  if (T === 'weihnachten') {
    // Kanzleien: drei Kugeln oben rechts an der Kartenkante, unterschiedlich lang
    // oben rechts in der Kachel über dem Pfeil, kurze Fäden, damit nichts in den Text hängt
    setze(karte('Kanzleien'), `<svg width="84" height="58" viewBox="0 0 84 58">${kugel(16, 12, 9, '#C0392B', '#C9A94B', 0)}${kugel(42, 22, 11, '#D4A63A', '#B8923A', 1.3)}${kugel(68, 6, 8, '#2E7D5B', '#C9A94B', 2.1)}</svg>`, 'top:0;right:18px');
    // Gesundheitswesen: zwei Kugeln
    setze(karte('Gesundheitswesen'), `<svg width="60" height="54" viewBox="0 0 60 54">${kugel(18, 18, 10, '#2E7D5B', '#C9A94B', .6)}${kugel(44, 6, 8, '#C0392B', '#C9A94B', 1.8)}</svg>`, 'top:0;right:24px');
    // Lichterkette an der Unterkante der Kopfleiste (Leon 26.11.2026): feiner Draht in flachen Bögen, Birnchen in warmen Mischfarben, sanftes Leuchten
    const w = document.querySelector('.kopf .w'), r = w.getBoundingClientRect();
    const FARBEN = ['#FFC94D', '#FF6B5C', '#5FCB94', '#6FB2FF'];
    const bogen = 120, n = Math.floor((r.width - 60) / bogen), x0 = (r.width - n * bogen) / 2;
    let draht = `M${x0} 0`, birnen = '';
    for (let i = 0; i < n; i++) {
      const a = x0 + i * bogen, b = a + bogen;
      draht += ` Q${a + bogen / 2} 22 ${b} 0`;
      [0.25, 0.5, 0.75].forEach((t, j) => {
        const x = a + bogen * t, y = 2 * (1 - t) * t * 22; // Punkt auf der Kurve
        const f = FARBEN[(i * 3 + j) % FARBEN.length];
        birnen += `<g class="lk-b" style="animation-delay:-${((i * 3 + j) * 0.7) % 4}s"><rect x="${(x - 2.2).toFixed(1)}" y="${(y + 1).toFixed(1)}" width="4.4" height="3.4" rx="1" fill="#7C8594"/><ellipse cx="${x.toFixed(1)}" cy="${(y + 8.6).toFixed(1)}" rx="3.6" ry="5.4" fill="${f}" style="filter:drop-shadow(0 0 4px ${f})"/></g>`;
      });
    }
    const lk = document.createElement('div');
    lk.className = 'szk';
    // an der Kopfleiste (.kopf ist fest positioniert) befestigen, Draht beginnt 6 px über der Unterkante der Leiste
    const kopf = document.querySelector('.kopf'), kr = kopf.getBoundingClientRect();
    lk.style.cssText = `position:absolute;left:${r.left - kr.left}px;top:${r.bottom - kr.top - 6}px;width:${r.width}px;height:44px;z-index:5;pointer-events:none`;
    lk.innerHTML = `<style>.lk-b{animation:lkGlimm 4s ease-in-out infinite}@keyframes lkGlimm{0%,100%{opacity:1}50%{opacity:.55}}</style><svg width="${Math.round(r.width)}" height="44" viewBox="0 0 ${Math.round(r.width)} 44" style="display:block;overflow:visible"><path d="${draht}" fill="none" stroke="#8A93A3" stroke-width="1.2"/>${birnen}</svg>`;
    kopf.appendChild(lk);
  } else {
    // Gesundheitswesen und Unternehmen: kleine Eiergruppe unten rechts vor dem Pfeil
    const gruppe = `<svg width="92" height="60" viewBox="0 0 92 60">
      ${ei(24, 36, 26, 34, '#F6D776', '<path d="M12 36q6-4 12 0t12 0" stroke="#E39A3B" stroke-width="2.2" fill="none"/>', -14)}
      ${ei(66, 38, 26, 34, '#C9B6E8', '<circle cx="60" cy="32" r="2.4" fill="#fff"/><circle cx="70" cy="40" r="2.4" fill="#fff"/><circle cx="62" cy="46" r="2" fill="#fff"/>', 12)}
      ${ei(45, 28, 28, 38, '#9ED9B8', '<path d="M32 26h26M32 32h26" stroke="#fff" stroke-width="2.4"/>', 0)}</svg>`;
    // Eier sitzen oben rechts auf der Kartenkante
    setze(karte('Gesundheitswesen'), gruppe.replace('width="92" height="60"', 'width="70" height="46"'), 'top:-36px;right:34px');
    setze(karte('Unternehmen'), gruppe.replace('width="92" height="60"', 'width="70" height="46"').replace(/F6D776/g, 'F4B8C8').replace(/9ED9B8/g, 'F6D776'), 'top:-36px;right:34px');
  }
})();

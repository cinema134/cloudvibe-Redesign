// Skizze 2 Saison-Deko (Leon 26.11.2026): feinere Lichterkette, Kugel am YouTube-Button, Ostereier im Strohnest
// Aufruf über PRUEFEN_JS auf der Startseite, ?saison=weihnachten|ostern&lk=menue|leiste
(function(){
  const Q = new URLSearchParams(location.search);
  const T = Q.get('saison') || 'weihnachten', LK = Q.get('lk') || 'menue';
  const dunkel = document.body.classList.contains('dark') || document.documentElement.classList.contains('dark');
  const st = document.createElement('style');
  st.textContent = '.szk{position:absolute;pointer-events:none;z-index:50}.szk-pendel{transform-origin:50% 0;transform-box:fill-box;animation:szkP 4s ease-in-out infinite}@keyframes szkP{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}.lk-b{animation:lkGlimm 4s ease-in-out infinite}@keyframes lkGlimm{0%,100%{opacity:1}50%{opacity:.6}}';
  document.head.appendChild(st);
  const karte = (wort) => { const h = [...document.querySelectorAll('main h3')].find((x) => x.textContent.trim() === wort); if (!h) return null; let k = h.parentElement; while (k && k.parentElement && k.getBoundingClientRect().width < 380) k = k.parentElement; return k; };
  const absolut = (html, x, y) => { const d = document.createElement('div'); d.className = 'szk'; d.style.left = x + scrollX + 'px'; d.style.top = y + scrollY + 'px'; d.innerHTML = html; document.body.appendChild(d); return d; };
  const kugel = (x, faden, r, farbe, kappe = '#C9A94B', verz = 0) => `<g class="szk-pendel" style="animation-delay:-${verz}s"><path d="M${x} 0V${faden}" stroke="#B8BFCB" stroke-width="1"/><rect x="${x - 3}" y="${faden - 1}" width="6" height="4" rx="1" fill="${kappe}"/><circle cx="${x}" cy="${faden + 3 + r}" r="${r}" fill="${farbe}"/><ellipse cx="${x - r * 0.35}" cy="${faden + 3 + r * 0.6}" rx="${r * 0.25}" ry="${r * 0.38}" fill="#fff" opacity=".45"/></g>`;
  const ei = (x, y, w, h, farbe, muster, dreh) => `<g transform="rotate(${dreh} ${x} ${y})"><path d="M${x} ${y - h / 2} C${x - w * 0.62} ${y - h / 2} ${x - w / 2} ${y + h * 0.2} ${x - w / 2} ${y + h * 0.18} C${x - w / 2} ${y + h * 0.42} ${x - w * 0.28} ${y + h / 2} ${x} ${y + h / 2} C${x + w * 0.28} ${y + h / 2} ${x + w / 2} ${y + h * 0.42} ${x + w / 2} ${y + h * 0.18} C${x + w / 2} ${y + h * 0.2} ${x + w * 0.62} ${y - h / 2} ${x} ${y - h / 2} Z" fill="${farbe}"/>${muster}</g>`;

  if (T === 'weihnachten') {
    // Kugeln auf den Kacheln wie Skizze 1 (Leon: „sehen gut aus“)
    const kachel = (k, html, w, rechts) => { if (!k) return; const r = k.getBoundingClientRect(); absolut(html, r.right - rechts - w, r.top); };
    kachel(karte('Kanzleien'), `<svg width="84" height="58" viewBox="0 0 84 58">${kugel(16, 12, 9, '#C0392B', '#C9A94B', 0)}${kugel(42, 22, 11, '#D4A63A', '#B8923A', 1.3)}${kugel(68, 6, 8, '#2E7D5B', '#C9A94B', 2.1)}</svg>`, 84, 18);
    kachel(karte('Gesundheitswesen'), `<svg width="60" height="54" viewBox="0 0 60 54">${kugel(18, 18, 10, '#2E7D5B', '#C9A94B', .6)}${kugel(44, 6, 8, '#C0392B', '#C9A94B', 1.8)}</svg>`, 60, 24);

    // Lichterkette, fein: dünner Draht direkt an der Unterkante der Leiste, flache Bögen, ein kleines Birnchen je Bogen
    const kopf = document.querySelector('.kopf'), w = kopf.querySelector('.w'), kr = kopf.getBoundingClientRect(), r = w.getBoundingClientRect();
    const rund = r.height / 2 + 14; // Abstand zu den Rundungen
    let von = r.left + rund, bis = r.right - rund;
    if (LK === 'menue') { const n = w.querySelector('nav.nav-neu, .nav-neu'); const nr = n.getBoundingClientRect(); von = Math.max(von, nr.left + 4); bis = Math.min(bis, nr.right - 4); }
    // Skizze 2b (Leon: „zu einfach flach, nicht das gewisse Extra wie bei den Kugeln“): Glasbirnen mit Verlauf, Glanzstrich und Schein,
    // grüne Fassung mit Rillen, verdrillter dunkelgrüner Draht, Birnchen folgen der Kurve (leicht schräg), Bögen abwechselnd tiefer
    const BOGEN = 64, n = Math.max(1, Math.round((bis - von) / BOGEN)), b = (bis - von) / n, L = bis - von;
    const FARBEN = [['#FFD45C', '#FFF3C4'], ['#FF5A4A', '#FFC9BF'], ['#3FC489', '#C8F2DC'], ['#4E9BFF', '#CFE3FF'], ['#FF8FC4', '#FFE0EF']];
    const gruen = dunkel ? '#3F6B4F' : '#2F5A3E', gruen2 = dunkel ? '#5E8C6D' : '#4F7D5E';
    const tiefe = (i) => (i % 2 ? 11 : 8);
    let d = 'M0 0', d2 = 'M0 0', birnen = '', defs = '';
    FARBEN.forEach(([f, h], k) => { defs += `<radialGradient id="lkG${k}" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="${h}"/><stop offset=".55" stop-color="${f}"/><stop offset="1" stop-color="${f}" stop-opacity=".9"/></radialGradient><radialGradient id="lkS${k}"><stop offset="0" stop-color="${f}" stop-opacity=".55"/><stop offset="1" stop-color="${f}" stop-opacity="0"/></radialGradient>`; });
    for (let i = 0; i < n; i++) {
      const a = i * b, t = tiefe(i);
      d += ` Q${(a + b / 2).toFixed(1)} ${t * 2} ${(a + b).toFixed(1)} 0`;
      d2 += ` Q${(a + b / 2).toFixed(1)} ${t * 2 + 1.6} ${(a + b).toFixed(1)} 0`;
      // zwei Birnchen je Bogen bei t=0.32 und 0.68, an der Kurve gedreht
      [0.32, 0.68].forEach((u, j) => {
        const x = a + b * u, y = 2 * (1 - u) * u * t * 2, dy = 2 * t * 2 * (1 - 2 * u), dx = b, wink = Math.atan2(dy, dx) * 180 / Math.PI;
        const k = (i * 2 + j) % FARBEN.length;
        birnen += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(wink * 0.6).toFixed(1)})">
          <circle cx="0" cy="9" r="9" fill="url(#lkS${k})" class="lk-b" style="animation-delay:-${((i * 2 + j) * 0.83) % 4}s"/>
          <rect x="-2.1" y="0" width="4.2" height="3.6" rx=".9" fill="${gruen}"/><path d="M-2.1 1.3h4.2M-2.1 2.5h4.2" stroke="${gruen2}" stroke-width=".5"/>
          <path d="M0 3.4 C-3.4 3.4 -3.6 8 -2.6 10.4 C-1.9 12.2 -0.8 13 0 13 C0.8 13 1.9 12.2 2.6 10.4 C3.6 8 3.4 3.4 0 3.4 Z" fill="url(#lkG${k})"/>
          <path d="M-1.3 5.2 C-1.9 6.6 -1.9 8.4 -1.3 9.6" stroke="#fff" stroke-width=".9" stroke-linecap="round" fill="none" opacity=".75"/></g>`;
      });
    }
    const lk = document.createElement('div'); lk.className = 'szk';
    lk.style.cssText = `left:${von - kr.left}px;top:${r.bottom - kr.top - 1}px;width:${L}px;height:40px;z-index:5`;
    lk.innerHTML = `<svg width="${Math.round(L)}" height="40" viewBox="0 0 ${Math.round(L)} 40" style="display:block;overflow:visible"><defs>${defs}</defs><path d="${d}" fill="none" stroke="${gruen}" stroke-width="1.1"/><path d="${d2}" fill="none" stroke="${gruen2}" stroke-width=".7" stroke-dasharray="3 2.4"/><circle cx="0" cy="0" r="1.8" fill="${gruen}"/><circle cx="${L.toFixed(1)}" cy="0" r="1.8" fill="${gruen}"/>${birnen}</svg>`;
    kopf.appendChild(lk);

    // Kugel baumelnd unten am YouTube-Button bei „Folge uns“
    const yt = document.querySelector('.sozial-hero a[href*="youtube"], .sozial-hero a[aria-label*="YouTube" i]') || [...document.querySelectorAll('.sozial-hero a')].pop();
    if (yt) { const q = yt.getBoundingClientRect(); absolut(`<svg width="24" height="48" viewBox="0 0 24 48" style="overflow:visible">${kugel(12, 22, 9, '#C0392B', '#D4A63A', .4)}</svg>`, q.left + q.width / 2 - 12, q.bottom); }
  } else {
    // Ostereier im Strohnest, unten an der Kachel liegend (links neben dem Pfeil, auf der Unterkante)
    const nest = (eier) => `<svg width="96" height="58" viewBox="0 0 96 58">
      <path d="M10 34 Q48 22 86 34" fill="none" stroke="#B88A4A" stroke-width="3" stroke-linecap="round"/>
      <path d="M14 32 Q48 24 82 32" fill="none" stroke="#DDBB78" stroke-width="2" stroke-linecap="round"/>
      ${eier}
      <path d="M6 34 Q8 54 48 55 Q88 54 90 34 Q48 44 6 34 Z" fill="#C99A55"/>
      <path d="M10 38 Q48 49 86 38 M12 44 Q48 53 84 44 M18 50 Q48 56 78 50" fill="none" stroke="#A97B3C" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M14 36 Q30 42 46 40 M50 41 Q68 42 82 36 M22 46 Q38 50 54 48 M58 48 Q70 48 78 45" fill="none" stroke="#E6C88A" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M6 34 Q2 31 0 33 M90 34 Q94 30 96 32 M30 54 Q26 57 22 56 M66 54 Q72 57 76 55" fill="none" stroke="#B88A4A" stroke-width="1.3" stroke-linecap="round"/>
    </svg>`;
    const eierA = `${ei(30, 27, 22, 29, '#F6D776', '<path d="M20 27q5-3.5 10 0t10 0" stroke="#E39A3B" stroke-width="2" fill="none"/>', -16)}${ei(66, 28, 22, 29, '#C9B6E8', '<circle cx="61" cy="24" r="2" fill="#fff"/><circle cx="69" cy="30" r="2" fill="#fff"/><circle cx="63" cy="34" r="1.7" fill="#fff"/>', 14)}${ei(48, 23, 24, 32, '#9ED9B8', '<path d="M37 21h22M37 27h22" stroke="#fff" stroke-width="2.2"/>', 0)}`;
    const eierB = eierA.replace(/F6D776/g, 'F4B8C8').replace(/9ED9B8/g, 'F6D776');
    // in der Karte am unteren Rand liegend (Leon 26.11.2026), links neben dem Pfeil; unter dem Text, falls der tief reicht
    const lege = (k, eier) => {
      if (!k) return;
      const r = k.getBoundingClientRect(), W = 80, H = 48;
      const pfeil = [...k.querySelectorAll('*')].filter((e) => { const q = e.getBoundingClientRect(); return q.width > 30 && q.width < 60 && Math.abs(q.width - q.height) < 3; }).pop();
      const rechts = pfeil ? pfeil.getBoundingClientRect().left - 10 : r.right - 70;
      const x = rechts - W, y = r.bottom - 5 - H;
      absolut(nest(eier).replace('width="96" height="58"', `width="${W}" height="${H}"`), x, y);
    };
    lege(karte('Gesundheitswesen'), eierA);
    lege(karte('Unternehmen'), eierB);

    // Ostergirlande unter dem Menü (Gegenstück zur Lichterkette): Bastschnur, Pastell-Eier mit Muster an kleinen Schleifen, Blüten an den Aufhängepunkten
    const kopf = document.querySelector('.kopf'), w = kopf.querySelector('.w'), kr = kopf.getBoundingClientRect(), r = w.getBoundingClientRect();
    const nr = w.querySelector('.nav-neu').getBoundingClientRect();
    const von = Math.max(r.left + r.height / 2 + 14, nr.left + 4), bis = Math.min(r.right - r.height / 2 - 14, nr.right - 4), L = bis - von;
    const BOGEN = 64, n = Math.max(1, Math.round(L / BOGEN)), b = L / n, tiefe = (i) => (i % 2 ? 11 : 8);
    const EIER = [['#F6D776', 'zz', '#E39A3B'], ['#C9B6E8', 'pk', '#fff'], ['#9ED9B8', 'st', '#fff'], ['#F4B8C8', 'pk', '#fff'], ['#A9D4F5', 'zz', '#fff']];
    const muster = (m, c) => m === 'st' ? `<path d="M-4.6 1.5h9.2M-4.8 4.5h9.6" stroke="${c}" stroke-width="1.3"/>` : m === 'pk' ? `<circle cx="-1.8" cy="2" r="1.1" fill="${c}"/><circle cx="2" cy="4" r="1.1" fill="${c}"/><circle cx="-1" cy="7" r=".9" fill="${c}"/><circle cx="2.4" cy="0" r=".8" fill="${c}"/>` : `<path d="M-4.6 3l2.3-2 2.3 2 2.3-2 2.3 2" stroke="${c}" stroke-width="1.2" fill="none" stroke-linejoin="round"/>`;
    const eiForm = 'M0 -6.2 C-3.9 -6.2 -5.2 0.6 -5.2 2.6 C-5.2 6.4 -2.9 8.4 0 8.4 C2.9 8.4 5.2 6.4 5.2 2.6 C5.2 0.6 3.9 -6.2 0 -6.2 Z';
    const bluete = (x, y, f) => `<g transform="translate(${x.toFixed(1)} ${y})">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-2.6" rx="1.8" ry="2.6" fill="${f}" transform="rotate(${a})"/>`).join('')}<circle r="1.4" fill="#F6C343"/></g>`;
    let d = 'M0 0', haenger = '', blueten = bluete(0, 0, '#F4B8C8');
    for (let i = 0; i < n; i++) {
      const a = i * b, t = tiefe(i);
      d += ` Q${(a + b / 2).toFixed(1)} ${t * 2} ${(a + b).toFixed(1)} 0`;
      blueten += bluete(a + b, 0, i % 2 ? '#F4B8C8' : '#C9B6E8');
      [0.32, 0.68].forEach((u, j) => {
        const x = a + b * u, y = 2 * (1 - u) * u * t * 2, k = (i * 2 + j) % EIER.length, [f, m, c] = EIER[k], len = j ? 7 : 4;
        haenger += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><path d="M0 0V${len}" stroke="#B88A4A" stroke-width=".8"/><g class="szk-pendel" style="animation-delay:-${((i * 2 + j) * 0.7) % 4}s"><g transform="translate(0 ${len + 6.4}) rotate(${j ? 8 : -8})"><path d="${eiForm}" fill="${f}"/>${muster(m, c)}<ellipse cx="-2.2" cy="-1.8" rx="1.1" ry="2" fill="#fff" opacity=".55"/></g></g></g>`;
      });
    }
    const gl = document.createElement('div'); gl.className = 'szk';
    gl.style.cssText = `left:${von - kr.left}px;top:${r.bottom - kr.top - 1}px;width:${L}px;height:40px;z-index:5`;
    gl.innerHTML = `<svg width="${Math.round(L)}" height="40" viewBox="0 0 ${Math.round(L)} 40" style="display:block;overflow:visible"><path d="${d}" fill="none" stroke="#B88A4A" stroke-width="1.2"/><path d="${d}" fill="none" stroke="#E2C27D" stroke-width=".6" stroke-dasharray="2 3"/>${haenger}${blueten}</svg>`;
    kopf.appendChild(gl);

    // „Folge uns“: Hase lugt links hinter dem YouTube-Button hervor (hinter den Knöpfen, in der Spalte)
    const sh = document.querySelector('.sozial-hero');
    const yt = sh && (sh.querySelector('a[href*="youtube"], a[aria-label*="YouTube" i]') || [...sh.querySelectorAll('a')].pop());
    if (yt) {
      const sr = sh.getBoundingClientRect(), q = yt.getBoundingClientRect();
      const hase = document.createElement('div');
      hase.style.cssText = `position:absolute;left:${q.left - sr.left - 23}px;top:${q.top - sr.top - 22}px;width:40px;height:56px;z-index:-1;pointer-events:none`;
      hase.innerHTML = `<svg width="40" height="56" viewBox="0 0 40 56" style="overflow:visible;width:40px;height:56px">
        <g class="szk-ohr" style="transform-origin:15px 26px;animation:hOhr 5s ease-in-out infinite"><path d="M15 27 C9 18 8 4 12 1 C17 3 19 16 19 26 Z" fill="#B98A5E"/><path d="M15.5 24 C12 17 11.5 7 13 4.5 C15.6 7 17 16 17.2 23 Z" fill="#F4B8C8"/></g>
        <path d="M22 26 C21 16 24 4 29 3 C32 7 29 19 26 27 Z" fill="#A87B52"/><path d="M23.2 23 C23 16 25 8 28 6.5 C29.3 10 27.5 17 25.4 23 Z" fill="#F4B8C8"/>
        <ellipse cx="20" cy="36" rx="13" ry="11.5" fill="#B98A5E"/>
        <circle cx="14.5" cy="34" r="1.7" fill="#2A211A"/><circle cx="14" cy="33.4" r=".5" fill="#fff"/>
        <ellipse cx="10" cy="39" rx="2.2" ry="1.6" fill="#F4A3B6"/>
        <path d="M10 41 L3 40 M10 42 L3.5 43.5" stroke="#E8DCCD" stroke-width=".6" stroke-linecap="round"/>
        <ellipse cx="17" cy="42" rx="4.5" ry="3" fill="#E8DCCD"/></svg>`;
      sh.appendChild(hase);
      const s2 = document.createElement('style'); s2.textContent = '@keyframes hOhr{0%,80%,100%{transform:rotate(0)}86%{transform:rotate(-14deg)}92%{transform:rotate(4deg)}}'; document.head.appendChild(s2);
    }
  }
})();

(function(){
  const T = window.__SAISON || 'weihnachten';
  const img = document.querySelector('.lgOut img') || document.querySelector('.kopf .logo img');
  const r = img.getBoundingClientRect();
  const st = document.createElement('style');
  st.textContent = `
  .sz{position:absolute;pointer-events:none;z-index:60}
  .sz-haenger{transform-origin:50% 0;animation:szPendel 3.6s ease-in-out infinite}
  @keyframes szPendel{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(6deg)}}
  .sz-schnee{position:absolute;inset:0;pointer-events:none;z-index:1;overflow:hidden}
  .sz-schnee i{position:absolute;border-radius:50%;background:#fff;box-shadow:0 0 0 .6px rgba(45,108,223,.18)}
  `;
  document.head.appendChild(st);
  const add = (html, x, y) => { const d = document.createElement('div'); d.className = 'sz'; d.style.left = x + 'px'; d.style.top = y + 'px'; d.innerHTML = html; document.body.appendChild(d); return d; };
  const sx = window.scrollX, sy = window.scrollY;
  if (T === 'weihnachten') {
    // Mütze schräg auf der Wolke (Wolke sitzt im oberen Drittel des Logos, etwas links der Mitte)
    const w = r.width * 0.19;
    add(`<svg width="${w}" viewBox="0 0 60 52" style="transform:scaleX(-1) rotate(22deg)"><path d="M8 40 C14 22 26 8 44 6 C48 14 49 24 50 38 Z" fill="#C0392B"/><path d="M44 6 C50 6 55 10 54 16" fill="none" stroke="#C0392B" stroke-width="5" stroke-linecap="round"/><circle cx="54" cy="18" r="5.5" fill="#fff" stroke="#E3E8F0" stroke-width="1"/><rect x="4" y="36" width="50" height="11" rx="5.5" fill="#fff" stroke="#E3E8F0" stroke-width="1"/></svg>`, r.left + sx + r.width * 0.21, r.top + sy - r.height * 0.16);
    // Kugel unter dem YouTube-Button
    const yt = [...document.querySelectorAll('a')].find(a => /youtube/i.test(a.getAttribute('aria-label') || a.href || ''));
    if (yt) { const q = yt.getBoundingClientRect(); add(`<div class="sz-haenger" style="width:24px"><svg width="24" height="58" viewBox="0 0 24 58"><path d="M12 0V30" stroke="#AEB5C2" stroke-width="1"/><rect x="9" y="29" width="6" height="4" rx="1" fill="#C9A94B"/><circle cx="12" cy="44" r="11" fill="#2D6CDF"/><ellipse cx="8.5" cy="40" rx="3" ry="4.2" fill="#fff" opacity=".45"/></svg></div>`, q.left + sx + q.width / 2 - 12, q.bottom + sy); }
    // leichter Schnee im Hero
    const hero = document.querySelector('main>.hero,main>.uhero');
    const s = document.createElement('div'); s.className = 'sz-schnee';
    let h = ''; for (let i = 0; i < 34; i++) { const z = 2 + ((i * 37) % 5); h += `<i style="left:${(i * 53) % 100}%;top:${(i * 29) % 96}%;width:${z}px;height:${z}px;opacity:${.55 + ((i * 7) % 4) / 10}"></i>`; }
    s.innerHTML = h; hero.style.position = 'relative'; hero.appendChild(s);
  } else {
    // Hasenohren auf der Wolke
    const w = r.width * 0.11;
    add(`<svg width="${w}" viewBox="0 0 50 50"><g transform="rotate(-28 18 46)"><path d="M18 46 C10 30 10 8 17 3 C24 8 25 30 22 46 Z" fill="#fff" stroke="#D5DBE6" stroke-width="1.2"/><path d="M18.5 40 C14 28 14 13 17.5 9 C21 13 21.5 28 20.5 40 Z" fill="#F4C9D3"/></g><g transform="rotate(-6 32 46)"><path d="M30 46 C24 30 26 8 33 3 C40 8 39 30 34 46 Z" fill="#fff" stroke="#D5DBE6" stroke-width="1.2"/><path d="M31 40 C28 28 29 13 33 9 C36.5 13 36 28 33 40 Z" fill="#F4C9D3"/></g></svg>`, r.left + sx + r.width * 0.27, r.top + sy - r.height * 0.09);
    // Ei unter dem YouTube-Button
    const yt = [...document.querySelectorAll('a')].find(a => /youtube/i.test(a.getAttribute('aria-label') || a.href || ''));
    if (yt) { const q = yt.getBoundingClientRect(); add(`<div class="sz-haenger" style="width:24px"><svg width="24" height="62" viewBox="0 0 24 62"><path d="M12 0V30" stroke="#AEB5C2" stroke-width="1"/><path d="M12 30 C4 30 2 42 2 48 C2 56 6 61 12 61 C18 61 22 56 22 48 C22 42 20 30 12 30 Z" fill="#E8F5E7" stroke="#2EB329" stroke-width="1"/><path d="M3 45 Q7 42 12 45 T21 45" fill="none" stroke="#2D6CDF" stroke-width="1.6"/><path d="M3 51 Q7 48 12 51 T21 51" fill="none" stroke="#2EB329" stroke-width="1.6"/></svg></div>`, q.left + sx + q.width / 2 - 12, q.bottom + sy); }
  }
})();

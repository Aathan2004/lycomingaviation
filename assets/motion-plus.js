// Extra aircraft animations. Skipped entirely when the visitor prefers reduced motion.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ready = fn => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn();
  const PLANE = 'M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z';
  const plane = (s, col) => '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" aria-hidden="true"><path d="' + PLANE + '" transform="rotate(90 12 12)" fill="' + (col || 'currentColor') + '"/></svg>';
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  ready(() => {
    const hero = document.querySelector('.hero');

    // 1. sky lane: a plane crosses the home hero now and then
    if (hero) {
      const fly = () => {
        if (document.hidden || hero.getBoundingClientRect().bottom < 0) return;
        const l = el('div', 'm-lane', '<i></i><span class="m-pl">' + plane(22) + '</span>');
        l.style.top = (14 + Math.random() * 56) + '%';
        l.addEventListener('animationend', () => l.remove());
        hero.insertBefore(l, hero.firstChild);
      };
      setTimeout(fly, 14000); setInterval(fly, 26000);
    }

    // 2. orbit dot -> plane
    const dot = document.querySelector('.orbit .dot');
    if (dot) dot.innerHTML = plane(30);

    // 3. parallax clouds + a distant jet in page headers
    const clouds = [...document.querySelectorAll('.m-cloud')];
    clouds.forEach((c, i) => c.dataset.depth = [0.06, 0.12, 0.18][i % 3]);
    document.querySelectorAll('.page-hero').forEach(h => {
      const j = el('div', 'm-jet', '<i></i><span class="m-pl">' + plane(14) + '</span>');
      j.style.top = (24 + Math.random() * 20) + '%'; j.style.animationDelay = '-' + Math.floor(Math.random() * 40) + 's';
      h.insertBefore(j, h.firstChild);
    });

    // 4. runway take-off at the bottom of each page header
    document.querySelectorAll('.page-hero').forEach(h => h.appendChild(el('div', 'm-runway', '<span class="m-pl">' + plane(20) + '</span>')));

    // 5. plane riding the scroll-progress line
    const pp = el('div', 'm-prog-plane', plane(18)); pp.setAttribute('aria-hidden', 'true'); document.body.appendChild(pp);
    let lastY = scrollY, tiltT;

    // 6. roadmap journey
    const road = document.querySelector('.x-road');
    let rp;
    if (road) { rp = el('div', 'm-road-plane', plane(24)); road.appendChild(rp); }

    // 7. footer landing
    const footer = document.querySelector('footer');
    let land;
    if (footer) {
      land = el('div', 'm-land', '<span class="m-pl">' + plane(26) + '</span>'); land.setAttribute('aria-hidden', 'true');
      footer.parentNode.insertBefore(land, footer);
      new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) land.classList.add('go'); else land.classList.remove('go', 'off');
      }), { threshold: .8 }).observe(land);
      const top = document.querySelector('.to-top');
      if (top) top.addEventListener('click', () => { if (land.classList.contains('go')) land.classList.add('off'); });
    }

    // scroll handler (single, throttled)
    let tick = false;
    const onScroll = () => {
      tick = false;
      const h = document.documentElement.scrollHeight - innerHeight, p = h > 0 ? clamp(scrollY / h, 0, 1) : 0;
      pp.style.left = (p * (innerWidth - 18)) + 'px'; pp.classList.toggle('on', scrollY > 20);
      const dy = scrollY - lastY; lastY = scrollY;
      if (Math.abs(dy) > 1) { pp.style.transform = 'rotate(' + (dy > 0 ? 14 : -14) + 'deg)'; clearTimeout(tiltT); tiltT = setTimeout(() => pp.style.transform = '', 160); }
      clouds.forEach(c => { c.style.translate = '0 ' + (-scrollY * c.dataset.depth) + 'px'; });
      if (road) {
        const r = road.getBoundingClientRect(), steps = [...road.children].filter(c => c.classList.contains('x-step'));
        const pts = steps.map(s => { const b = s.getBoundingClientRect(); return [b.left - r.left + b.width / 2, b.top - r.top - 4]; });
        const t = clamp((innerHeight * .75 - r.top) / (r.height + innerHeight * .1), 0, 1) * (pts.length - 1);
        const i = Math.min(Math.floor(t), pts.length - 2), f = t - i;
        if (pts.length > 1) {
          const a = pts[i], b = pts[i + 1], x = a[0] + (b[0] - a[0]) * f, y = a[1] + (b[1] - a[1]) * f;
          rp.style.transform = 'translate(' + (x - 12) + 'px,' + (y - 12) + 'px) rotate(' + (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI) + 'deg)';
          rp.style.opacity = t > .02 && t < pts.length - 1.02 ? 1 : 0;
          steps.forEach((s, k) => s.classList.toggle('lit', k <= Math.round(t) && t > .02));
        }
      }
    };
    addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
    addEventListener('resize', onScroll); onScroll();

    // 8. hero 3D tilt toward the cursor (desktop only)
    const art = document.querySelector('.hero-art');
    if (hero && art && matchMedia('(hover:hover) and (pointer:fine)').matches) {
      art.classList.add('m-tilt');
      hero.addEventListener('mousemove', e => {
        const r = hero.getBoundingClientRect();
        art.style.setProperty('--ry', ((e.clientX - r.left) / r.width - .5) * 12 + 'deg');
        art.style.setProperty('--rx', (-((e.clientY - r.top) / r.height - .5)) * 8 + 'deg');
      });
      hero.addEventListener('mouseleave', () => { art.style.setProperty('--rx', '0deg'); art.style.setProperty('--ry', '0deg'); });
    }

    // 9. click the header logo on the home page: a plane crosses the screen
    const brand = document.querySelector('header .brand');
    if (brand && hero) {
      brand.addEventListener('click', e => {
        e.preventDefault();
        const f = el('div', 'm-click', '<i></i>' + plane(28)); f.style.top = (innerHeight * .3) + 'px';
        f.addEventListener('animationend', () => f.remove()); document.body.appendChild(f);
        scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // 10. hover a country card: the plane takes off along its route again
    document.querySelectorAll('.flag-card, .x-country').forEach(card => {
      card.addEventListener('mouseenter', () => {
        const s = card.querySelector('.m-route'); if (!s || !s.classList.contains('go')) return;
        const [mo, a, b] = s.querySelectorAll('animateMotion, animate');
        try { mo.beginElement(); a.beginElement(); b.beginElementAt(2.1); } catch (err) {}
      });
    });

    // 11. courses page: a small animated icon on each course header
    const ICONS = {
      'ground-classes': '<circle cx="36" cy="36" r="28" fill="none" stroke="#B9AEE0" stroke-width="1.5"/><circle cx="36" cy="36" r="18" fill="none" stroke="#B9AEE0" stroke-width="1.5"/><circle cx="36" cy="36" r="8" fill="none" stroke="#B9AEE0" stroke-width="1.5"/><path class="m-spin" d="M36 36 L36 8 A28 28 0 0 1 60 22 Z" fill="#7B6BB0" fill-opacity=".28"/><circle cx="46" cy="22" r="2.4" fill="#7B6BB0"/>',
      'cabin-crew': '<line x1="6" y1="58" x2="66" y2="58" stroke="#B9AEE0" stroke-width="2" stroke-dasharray="4 5"/><g class="m-slide"><rect x="24" y="30" width="24" height="24" rx="4" fill="none" stroke="#7B6BB0" stroke-width="2.5"/><path d="M30 30v-6h12v6" fill="none" stroke="#7B6BB0" stroke-width="2.5"/><circle cx="29" cy="57" r="3" fill="#7B6BB0"/><circle cx="43" cy="57" r="3" fill="#7B6BB0"/></g>',
      'ground-staff': '<line x1="6" y1="50" x2="66" y2="50" stroke="#7B6BB0" stroke-width="2.5" class="m-belt"/><rect x="6" y="54" width="60" height="4" rx="2" fill="#B9AEE0"/><g class="m-ride"><rect x="28" y="30" width="16" height="16" rx="3" fill="#7B6BB0" fill-opacity=".25" stroke="#7B6BB0" stroke-width="2"/><line x1="28" y1="38" x2="44" y2="38" stroke="#7B6BB0" stroke-width="1.5"/></g>',
      'nios': '<path d="M36 22 C28 16 16 16 8 20 V54 C16 50 28 50 36 56 Z" fill="none" stroke="#7B6BB0" stroke-width="2.5" stroke-linejoin="round"/><g class="m-flip"><path d="M36 22 C44 16 56 16 64 20 V54 C56 50 44 50 36 56 Z" fill="#7B6BB0" fill-opacity=".18" stroke="#7B6BB0" stroke-width="2.5" stroke-linejoin="round"/></g>',
      'cadet': '<path d="M6,62 Q34,58 68,10" fill="none" stroke="#B9AEE0" stroke-width="2" stroke-dasharray="4 5"/><g><path d="' + PLANE + '" transform="rotate(90) scale(1) translate(-12,-12)" fill="#7B6BB0"/><animateMotion dur="3.6s" repeatCount="indefinite" rotate="auto" path="M6,62 Q34,58 68,10"/></g>'
    };
    document.querySelectorAll('.course[id]').forEach(c => {
      const art = ICONS[c.id]; if (!art) return;
      const w = c.querySelector('.wrap'); if (!w) return;
      const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      s.setAttribute('class', 'm-ic'); s.setAttribute('viewBox', '0 0 72 72'); s.setAttribute('aria-hidden', 'true'); s.innerHTML = art;
      w.appendChild(s);
    });
  });
})();

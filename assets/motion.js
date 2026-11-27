// Decorative motion for every page. Skipped entirely when the visitor prefers reduced motion.
(function () {
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (calm) return;
  const ready = fn => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn();
  const PLANE = 'M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z';

  ready(() => {
    // 1. scroll progress line
    const bar = document.createElement('div'); bar.className = 'm-progress'; bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    let tick = false;
    const draw = () => {
      tick = false;
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, scrollY / h) : 0) + ')';
    };
    addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(draw); } }, { passive: true });
    addEventListener('resize', draw); draw();

    // 2. headline word-by-word reveal (text unchanged, only wrapped)
    document.querySelectorAll('.hero h1, .page-hero h1').forEach(h => {
      let i = 0;
      const walk = node => {
        [...node.childNodes].forEach(n => {
          if (n.nodeType === 3) {
            const frag = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach(part => {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
              const s = document.createElement('span'); s.className = 'm-w'; s.style.setProperty('--i', i++); s.textContent = part; frag.appendChild(s);
            });
            n.replaceWith(frag);
          } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
        });
      };
      walk(h);
    });

    // 3. soft clouds in hero areas
    const clouds = [[18, 260, 70, 0], [55, 340, 95, -30], [78, 220, 60, -12]];
    document.querySelectorAll('.hero, .page-hero').forEach(hero => {
      clouds.forEach(([top, w, dur, delay]) => {
        const c = document.createElement('div'); c.className = 'm-cloud'; c.setAttribute('aria-hidden', 'true');
        c.style.cssText = `top:${top}%;width:${w}px;height:${Math.round(w * .38)}px;animation-duration:${dur}s;animation-delay:${delay}s`;
        hero.insertBefore(c, hero.firstChild);
      });
    });

    // 4. home hero: one aircraft flyby with a contrail
    const hero = document.querySelector('.hero');
    if (hero) {
      const NS = 'http://www.w3.org/2000/svg';
      const path = 'M-60,470 C 260,430 480,260 760,200 S 1120,60 1280,30';
      const svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('class', 'm-fly'); svg.setAttribute('viewBox', '0 0 1200 600'); svg.setAttribute('preserveAspectRatio', 'xMidYMid slice'); svg.setAttribute('aria-hidden', 'true');
      svg.innerHTML =
        '<path d="' + path + '" pathLength="1" fill="none" stroke="#B9AEE0" stroke-width="2" stroke-linecap="round" stroke-dasharray="1" stroke-dashoffset="1" opacity=".5">' +
        '<animate attributeName="stroke-dashoffset" from="1" to="0" begin="1.2s" dur="6s" fill="freeze"/>' +
        '<animate attributeName="opacity" from=".5" to="0" begin="7s" dur="1.6s" fill="freeze"/></path>' +
        '<g opacity="0"><path d="' + PLANE + '" transform="rotate(90) scale(1.6) translate(-12,-12)" fill="#7B6BB0"/>' +
        '<animateMotion begin="1.2s" dur="6s" rotate="auto" fill="freeze" path="' + path + '"/>' +
        '<animate attributeName="opacity" from="0" to="1" begin="1.2s" dur=".3s" fill="freeze"/>' +
        '<animate attributeName="opacity" from="1" to="0" begin="6.8s" dur=".6s" fill="freeze"/></g>';
      hero.insertBefore(svg, hero.firstChild);
    }

    // 5. flight-route arcs on country cards (draw when the card scrolls in)
    document.querySelectorAll('.flag-card, .x-country').forEach(card => {
      const NS = 'http://www.w3.org/2000/svg';
      const s = document.createElementNS(NS, 'svg');
      s.setAttribute('class', 'm-route'); s.setAttribute('viewBox', '0 0 200 22'); s.setAttribute('preserveAspectRatio', 'none'); s.setAttribute('aria-hidden', 'true');
      s.innerHTML = '<path class="line" d="M-4,20 Q100,2 204,20"/><g class="pl"><path d="' + PLANE + '" transform="rotate(90) scale(.6) translate(-12,-12)"/>' +
        '<animateMotion dur="2.4s" begin="indefinite" rotate="auto" fill="freeze" path="M-4,20 Q100,2 204,20"/>' +
        '<animate attributeName="opacity" from="0" to="1" dur=".2s" begin="indefinite" fill="freeze"/>' +
        '<animate attributeName="opacity" from="1" to="0" dur=".4s" begin="indefinite" fill="freeze"/></g>';
      card.appendChild(s);
    });
    const routeIO = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      routeIO.unobserve(e.target);
      const svg = e.target.querySelector('.m-route'); if (!svg) return;
      svg.classList.add('go');
      const g = svg.querySelector('.pl');
      const [mo, fadeIn, fadeOut] = g.querySelectorAll('animateMotion, animate');
      const t = svg.getCurrentTime ? svg.getCurrentTime() : 0;
      mo.beginElementAt(.3); fadeIn.beginElementAt(.3); fadeOut.beginElementAt(2.1);
    }), { threshold: .5 });
    document.querySelectorAll('.flag-card, .x-country').forEach(c => routeIO.observe(c));

    // 6. count-up numbers in the stats strip
    const nums = [...document.querySelectorAll('.x-marquee b')].filter(b => /^\d{1,3}[+%]?$/.test(b.textContent.trim()));
    if (nums.length) {
      const io = new IntersectionObserver(es => es.forEach(e => {
        if (!e.isIntersecting) return; io.disconnect();
        nums.forEach(b => {
          const txt = b.textContent.trim(), end = parseInt(txt, 10), suf = txt.replace(/^\d+/, '');
          const t0 = performance.now(), D = 1400;
          const step = now => {
            const p = Math.min(1, (now - t0) / D), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
            b.textContent = v + suf; if (p < 1) requestAnimationFrame(step);
          };
          b.textContent = '0' + suf; requestAnimationFrame(step);
        });
      }), { threshold: .3 });
      io.observe(document.querySelector('.x-marquee'));
    }

    // 7. staggered entrance inside grids
    const groups = ['.x-road', '.flags', '.x-countries', '.grid', '.grid-4', '.grid-2'];
    document.querySelectorAll(groups.join(',')).forEach(g => {
      [...g.children].filter(c => c.classList.contains('reveal') || c.classList.contains('card') || c.classList.contains('flag-card')).forEach((c, i) => {
        if (i === 0) return;
        c.style.transitionDelay = ((i % 5) * 80) + 'ms';
        c.addEventListener('transitionend', () => { c.style.transitionDelay = ''; }, { once: true });
      });
    });
  });
})();

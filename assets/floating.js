// Shared floating buttons: injected once on every page so no page repeats the markup.
// Must load BEFORE main.js / home.js so their [data-wa] pass fills in the WhatsApp link.
(function () {
  if (document.querySelector('.to-top')) return;

  // WhatsApp (link is filled in by the existing [data-wa] code using WHATSAPP_NUMBER)
  if (!document.querySelector('.float-wa')) {
    const wa = document.createElement('a');
    wa.className = 'float-wa'; wa.href = '#'; wa.setAttribute('aria-label', 'Chat on WhatsApp');
    wa.dataset.wa = "Hi Lycoming Aviation, I'd like to know about your courses.";
    wa.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.6-.3z"/></svg>';
    document.body.appendChild(wa);
  }


  // Make the WhatsApp button draggable (mouse or touch); a plain tap/click still opens WhatsApp.
  const waBtn = document.querySelector('.float-wa');
  if (waBtn) {
    const KEY = 'ly-wa-pos';
    let sx, sy, ox, oy, moved = false, down = false;
    const clamp = (x, y) => {
      const r = waBtn.getBoundingClientRect();
      return [Math.min(Math.max(8, x), innerWidth - r.width - 8), Math.min(Math.max(8, y), innerHeight - r.height - 8)];
    };
    const place = (x, y) => {
      [x, y] = clamp(x, y);
      waBtn.style.left = x + 'px'; waBtn.style.top = y + 'px'; waBtn.style.right = 'auto'; waBtn.style.bottom = 'auto';
      return [x, y];
    };
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (saved) place(saved.x * innerWidth, saved.y * innerHeight);
    } catch (e) {}
    waBtn.style.touchAction = 'none'; waBtn.style.cursor = 'grab';
    waBtn.addEventListener('pointerdown', e => {
      down = true; moved = false; sx = e.clientX; sy = e.clientY;
      const r = waBtn.getBoundingClientRect(); ox = r.left; oy = r.top;
      waBtn.setPointerCapture(e.pointerId);
    });
    waBtn.addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!moved && Math.hypot(dx, dy) < 6) return;
      moved = true; waBtn.style.cursor = 'grabbing'; waBtn.style.transition = 'none';
      place(ox + dx, oy + dy);
    });
    const end = () => {
      if (!down) return; down = false; waBtn.style.cursor = 'grab'; waBtn.style.transition = '';
      if (moved) {
        const r = waBtn.getBoundingClientRect();
        try { localStorage.setItem(KEY, JSON.stringify({x: r.left / innerWidth, y: r.top / innerHeight})); } catch (e) {}
      }
    };
    waBtn.addEventListener('pointerup', end); waBtn.addEventListener('pointercancel', end);
    waBtn.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopImmediatePropagation(); moved = false; } }, true);
    waBtn.addEventListener('dragstart', e => e.preventDefault());
    addEventListener('resize', () => { if (waBtn.style.top) { const r = waBtn.getBoundingClientRect(); place(r.left, r.top); } });
  }

  // Scroll-to-top
  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'to-top'; btn.setAttribute('aria-label', 'Scroll to top');
  btn.textContent = '↑';
  document.body.appendChild(btn);

  const SHOW_AT = 350;
  let ticking = false;
  const update = () => { ticking = false; btn.classList.toggle('show', window.scrollY > SHOW_AT); };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  const onClick = () => {
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  btn.addEventListener('click', onClick);
  window.addEventListener('pagehide', () => {
    window.removeEventListener('scroll', onScroll);
    btn.removeEventListener('click', onClick);
  }, { once: true });
  update();
})();

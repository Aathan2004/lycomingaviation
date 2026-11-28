// Mobile & tablet navigation (all pages). Styles: assets/nav.css
(() => {
  const header = document.querySelector('header');
  const burger = header && header.querySelector('.burger');
  const menu = header && header.querySelector('.menu');
  if (!burger || !menu) return;

  const mq = matchMedia('(max-width:1180px)');
  const root = document.documentElement;
  menu.id = menu.id || 'site-menu';
  burger.setAttribute('aria-controls', menu.id);
  burger.setAttribute('aria-expanded', 'false');

  // The panel fills exactly the space below the header (works with mobile browser toolbars)
  const fit = () => menu.style.setProperty('--menu-h', Math.max(0, innerHeight - header.getBoundingClientRect().bottom) + 'px');

  const setOpen = open => {
    if (open) fit();
    menu.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
    root.classList.toggle('menu-open', open);
  };
  const isOpen = () => menu.classList.contains('open');

  burger.addEventListener('click', () => setOpen(!isOpen()));

  // Courses / Countries / Careers expand their sub-links on touch screens
  menu.querySelectorAll('a.has-drop').forEach(a => {
    a.setAttribute('aria-expanded', 'false');
    a.addEventListener('click', e => {
      if (!mq.matches) return;
      e.preventDefault();
      a.setAttribute('aria-expanded', String(a.parentElement.classList.toggle('open')));
    });
  });

  // Close after choosing a page or section
  menu.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (a && !(mq.matches && a.classList.contains('has-drop'))) setOpen(false);
  });

  // Escape closes and returns focus to the menu button
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen()) { setOpen(false); burger.focus(); }
  });

  // Back on desktop width: reset
  const onMq = () => { if (!mq.matches && isOpen()) setOpen(false); };
  mq.addEventListener ? mq.addEventListener('change', onMq) : mq.addListener(onMq);
  addEventListener('resize', () => { if (isOpen()) fit(); }, { passive: true });

  // Soft shadow once the page has scrolled (one update per frame, no layout change)
  let queued = false;
  const update = () => { header.classList.toggle('scrolled', scrollY > 8); queued = false; };
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
  update();
})();

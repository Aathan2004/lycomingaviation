// ===== EDIT: Student results (DGCA scores) =====
// Add one line per student. Put the photo in assets/photos/ with the same name.
const RANKERS = [
  { name: "Yogesh", paper: "CPL · Air Regulation", score: "80/100", photo: "assets/photos/ranker-03.jpg" },
  { name: "Jude", paper: "CPL · Aviation Meteorology", score: "76/100", photo: "assets/photos/ranker-04.jpg" },
  { name: "Abinaya", paper: "CPL · Aviation Meteorology", score: "82/100", photo: "assets/photos/ranker-01.jpg" },
  { name: "Nithish", paper: "CPL · Aviation Meteorology", score: "70/100", photo: "assets/photos/ranker-05.jpg" },
];

// ===== EDIT: Student testimonials (taken word for word from the academy's Google reviews) =====
const TESTIMONIALS = [
  { name: "Sathish R", course: "Aviation course · Placed", text: "I came to know about LAA from Google and I joined Aviation course and gained more knowledge regarding aviation and grooming and also the communication skills and now I placed in Aviation Industry. Thanks to our Faculties" },
  { name: "Nepoleon", course: "Student pilot", text: "Nice place where u can full fill ur dreams!! And the teaching staff are pilots,(Sai, Manoj,imran, salauddin)instructor,ground staff whose aim is to do pilot program contact the lycoming aviation academy Salem am a student pilot!!" },
  { name: "Lokesh Rajkumar", course: "Google review", text: "Very good staffs all are down to earth and good infrastructure.. its really nice place to u can full fill ur dreams.." },
  { name: "Rohith Kumar", course: "Google review", text: "I know this academy few months ago, it's a great platform to learn the knowledge about aviation. And the support staff and faculties are very knowledgeable and experienced person in the field and I'm personally prefer this academy to everyone..." },
  { name: "Anbu", course: "Computer Number assistance", text: "Hi, myself Micheal Anbu. I got my computer number with the help of Mohana Priya. She guided me very politely and also did her job very humbled manner." },
  { name: "Hemalatha P", course: "Google review", text: "I like how lycoming gives the genuine way of explaining about the industry , I got a clear cut view idea now , thanks" },
];

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Rankers
const rk = document.getElementById('rankers');
if (rk) {
  rk.innerHTML = RANKERS.map(r => `
    <article class="x-rank">
      <div class="x-score"><span>★ Score</span><b>${esc(r.score)}</b></div>
      <div class="x-ph"><img src="${esc(r.photo)}" alt="${esc(r.name)}" loading="lazy"></div>
      <div class="x-who">${esc(r.name)}<small>${esc(r.paper)}</small></div>
    </article>`).join('');
  rk.querySelectorAll('.x-ph img').forEach(img => {
    const fail = () => { img.parentElement.classList.add('x-empty'); img.remove(); };
    if (img.complete && !img.naturalWidth) fail(); else img.addEventListener('error', fail);
  });
}

// Testimonials
const tm = document.getElementById('testimonials');
if (tm) {
  tm.innerHTML = TESTIMONIALS.map(t => `
    <article class="x-quote">
      <span class="x-stars">★★★★★</span>
      <q>${esc(t.text)}</q>
      <div class="x-by"><span class="x-av">${esc((t.name.replace(/[^A-Za-z]/g, '')[0] || 'L').toUpperCase())}</span>
        <div><b>${esc(t.name)}</b><small>${esc(t.course)}</small></div></div>
    </article>`).join('');
}

// Course tabs
const tabs = [...document.querySelectorAll('.x-tab')];
const showTab = tab => {
  tabs.forEach(t => {
    const on = t === tab;
    t.setAttribute('aria-selected', on);
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
  });
};
tabs.forEach((t, i) => {
  t.addEventListener('click', () => showTab(t));
  t.addEventListener('keydown', e => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    const n = tabs[(i + d + tabs.length) % tabs.length];
    showTab(n); n.focus();
  });
});
// open a tab from a link like index.html#course-cabin
const fromHash = tabs.find(t => '#' + t.getAttribute('aria-controls') === location.hash);
if (fromHash) showTab(fromHash);
document.querySelectorAll('a[data-tab]').forEach(a => a.addEventListener('click', () => {
  const t = tabs.find(x => x.getAttribute('aria-controls') === a.dataset.tab);
  if (t) showTab(t);
}));

// Roadmap counter on mobile (swipe carousel)
const road = document.querySelector('.x-road');
const cnt = document.querySelector('.x-count');
if (road && cnt) {
  const steps = road.children.length;
  road.addEventListener('scroll', () => {
    const w = road.firstElementChild.getBoundingClientRect().width + 14;
    const i = Math.min(steps, Math.round(road.scrollLeft / w) + 1);
    cnt.textContent = `${String(i).padStart(2, '0')} / ${steps}`;
  }, { passive: true });
}

// WhatsApp links (same behaviour as assets/main.js on the inner pages)
document.querySelectorAll('[data-wa]').forEach(el => {
  const n = typeof WHATSAPP_NUMBER === 'string' ? WHATSAPP_NUMBER : '';
  if (!n || n.includes('X')) { el.href = '#enquire'; return; }
  el.href = `https://wa.me/${n}?text=${encodeURIComponent(el.dataset.wa)}`;
  el.target = '_blank'; el.rel = 'noopener';
});

// Sticky section nav: glass "stuck" state + highlight the section in view
const secnav = document.querySelector('.x-secnav');
if (secnav) {
  const bar = secnav.querySelector('.x-secnav-in');
  const links = [...bar.querySelectorAll('a')];
  const targets = links.map(a => document.querySelector(a.getAttribute('href')));
  let current = null, ticking = false;
  const update = () => {
    ticking = false;
    const top = parseFloat(getComputedStyle(secnav).top) || 0;
    secnav.classList.toggle('stuck', secnav.getBoundingClientRect().top <= top + 0.5 && scrollY > 0);
    const line = bar.getBoundingClientRect().bottom + 40;
    let idx = -1;
    targets.forEach((t, i) => { if (t && t.getBoundingClientRect().top <= line) idx = i; });
    const next = links[idx] || null;
    if (next !== current) {
      links.forEach(a => a.classList.toggle('on', a === next));
      if (next) next.setAttribute('aria-current', 'true');
      if (current) current.removeAttribute('aria-current');
      current = next;
      // keep the active link visible inside the bar (scrolls the bar only, never the page)
      if (next && bar.scrollWidth > bar.clientWidth) {
        const l = next.offsetLeft - (bar.clientWidth - next.offsetWidth) / 2;
        bar.scrollTo({ left: l, behavior: 'smooth' });
      }
    }
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update);
  update();
}

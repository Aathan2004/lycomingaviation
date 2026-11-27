// Themed dropdowns: replaces native <select> popups inside forms (the native popup can't be styled).
document.querySelectorAll('form select').forEach(sel => {
  const dd = document.createElement('div'); dd.className = 'dd';
  sel.parentNode.insertBefore(dd, sel); dd.appendChild(sel);
  const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'dd-btn';
  btn.setAttribute('aria-haspopup', 'listbox'); btn.setAttribute('aria-expanded', 'false');
  if (sel.getAttribute('aria-label')) btn.setAttribute('aria-label', sel.getAttribute('aria-label'));
  const lbl = document.createElement('span'); btn.appendChild(lbl);
  const ul = document.createElement('ul'); ul.className = 'dd-menu'; ul.setAttribute('role', 'listbox');
  dd.append(btn, ul);
  const opts = [...sel.options].map((o, i) => {
    const li = document.createElement('li'); li.setAttribute('role', 'option');
    li.textContent = o.textContent; li.dataset.i = i; ul.appendChild(li); return li;
  });
  let act = sel.selectedIndex;
  const sync = () => {
    lbl.textContent = sel.options[sel.selectedIndex].textContent;
    opts.forEach((li, i) => li.setAttribute('aria-selected', i === sel.selectedIndex));
  };
  const hi = i => { act = i; opts.forEach((li, k) => li.classList.toggle('act', k === i)); opts[i].scrollIntoView({block: 'nearest'}); };
  const open = () => {
    document.querySelectorAll('.dd.open').forEach(d => d.classList.remove('open'));
    const r = btn.getBoundingClientRect();
    dd.classList.toggle('up', innerHeight - r.bottom < 280 && r.top > innerHeight - r.bottom);
    dd.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); hi(sel.selectedIndex);
  };
  const close = () => { dd.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
  const pick = i => { sel.selectedIndex = i; sel.dispatchEvent(new Event('change', {bubbles: true})); sync(); close(); btn.focus(); };
  btn.addEventListener('click', () => dd.classList.contains('open') ? close() : open());
  ul.addEventListener('click', e => { const li = e.target.closest('li'); if (li) pick(+li.dataset.i); });
  btn.addEventListener('keydown', e => {
    const isOpen = dd.classList.contains('open');
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault(); if (!isOpen) return open();
      hi(Math.max(0, Math.min(opts.length - 1, act + (e.key === 'ArrowDown' ? 1 : -1))));
    } else if ((e.key === 'Enter' || e.key === ' ') && isOpen) { e.preventDefault(); pick(act); }
    else if (e.key === 'Escape') close();
  });
  sel.addEventListener('change', sync);
  sel.form && sel.form.addEventListener('reset', () => setTimeout(sync));
  sync();
});
document.addEventListener('click', e => { if (!e.target.closest('.dd')) document.querySelectorAll('.dd.open').forEach(d => d.classList.remove('open')); });

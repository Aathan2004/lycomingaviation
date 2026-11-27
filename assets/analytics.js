/* Analytics + conversion tracking. SAFE BY DEFAULT: does nothing until you add a real ID.
   1. Create a GA4 property at analytics.google.com and copy the Measurement ID (looks like G-XXXXXXXXXX).
   2. Paste it between the quotes below, then re-publish the site.
   When an ID is present, a consent banner appears and Google Analytics loads ONLY if the visitor accepts. */
(function () {
  const GA_MEASUREMENT_ID = "";          // <-- paste your real GA4 ID here
  const KEY = 'ly-consent';

  const send = (name, params) => { if (window.gtag) window.gtag('event', name, params || {}); };

  // Conversion events (they only reach Google if analytics was accepted)
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a'); if (!a) return;
    const h = a.getAttribute('href') || '';
    if (h.indexOf('apply.html') !== -1) send('apply_click', { link_text: a.textContent.trim().slice(0, 40), page: location.pathname });
    else if (h.indexOf('wa.me') !== -1) send('whatsapp_click', { page: location.pathname });
    else if (h.indexOf('tel:') === 0) send('phone_click', { page: location.pathname });
  }, true);
  document.addEventListener('submit', e => {
    if (e.target && (e.target.id === 'contact-form' || e.target.id === 'form')) send('generate_lead', { method: 'whatsapp_form', page: location.pathname });
  }, true);

  if (!GA_MEASUREMENT_ID) return;

  const load = () => {
    if (window.__gaLoaded) return; window.__gaLoaded = true;
    const s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID; document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    gtag('js', new Date()); gtag('config', GA_MEASUREMENT_ID);
    if (/contact\.html$/.test(location.pathname)) send('contact_page_view');
  };

  let choice = null; try { choice = localStorage.getItem(KEY); } catch (e) {}
  if (choice === 'yes') return load();
  if (choice === 'no') return;

  const bar = document.createElement('div');
  bar.setAttribute('role', 'dialog'); bar.setAttribute('aria-label', 'Cookie consent');
  bar.style.cssText = 'position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:120;max-width:560px;width:calc(100% - 32px);background:#fff;border:1px solid #E4E1EE;border-radius:14px;box-shadow:0 18px 50px -14px rgba(60,40,120,.35);padding:16px 18px;font:14px/1.5 Inter,system-ui,sans-serif;color:#16141F';
  bar.innerHTML = 'We would like to use Google Analytics to count visits and see which buttons are used. It is optional. <a href="cookies.html" style="color:#7B6BB0;font-weight:600">Cookie Policy</a>' +
    '<div style="display:flex;gap:10px;margin-top:12px"><button data-c="yes" style="background:#7B6BB0;color:#fff;border:0;border-radius:999px;padding:9px 20px;font:inherit;font-weight:600;cursor:pointer">Accept</button><button data-c="no" style="background:#fff;color:#16141F;border:1px solid #E4E1EE;border-radius:999px;padding:9px 20px;font:inherit;font-weight:600;cursor:pointer">No thanks</button></div>';
  bar.addEventListener('click', e => {
    const c = e.target.getAttribute && e.target.getAttribute('data-c'); if (!c) return;
    try { localStorage.setItem(KEY, c); } catch (err) {}
    bar.remove(); if (c === 'yes') load();
  });
  document.body.appendChild(bar);
})();

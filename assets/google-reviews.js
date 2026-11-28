// ===== Live Google reviews (home page, Reviews section) =====
// Loads the academy's reviews from Google when a visitor scrolls near the section,
// shows only the 5-star ones first, and keeps the hand-picked testimonials after them.
// Google's terms do not allow saving copies of reviews, so they are fetched live each visit.
// If the key is missing, the daily limit is reached or Google is unreachable,
// the section simply keeps the hand-picked testimonials from home.js.

// ===== EDIT: Google settings =====
const GOOGLE_PLACES = {
  apiKey: "",   // Browser key, restricted to lycomingaviation.com and Places API (New)
  placeId: "",  // The academy's Google place ID
  minStars: 5,  // Only reviews with this many stars are shown
};

(() => {
  const { apiKey, placeId, minStars } = GOOGLE_PLACES;
  const section = document.getElementById('reviews');
  const list = document.getElementById('testimonials');
  if (!apiKey || !placeId || !section || !list || !window.fetch) return;

  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const safeUrl = u => (/^https:\/\//.test(u || '') ? u : '');

  const card = r => {
    const a = r.authorAttribution || {};
    const name = a.displayName || 'Google user';
    const profile = safeUrl(a.uri);
    const photo = safeUrl(a.photoUri);
    const text = (r.text && r.text.text) || (r.originalText && r.originalText.text) || '';
    const translated = r.text && r.originalText && r.text.languageCode !== r.originalText.languageCode;
    const avatar = photo
      ? `<img class="x-av x-av-img" src="${esc(photo)}" alt="" width="42" height="42" loading="lazy" referrerpolicy="no-referrer">`
      : `<span class="x-av">${esc((name.replace(/[^A-Za-z]/g, '')[0] || 'G').toUpperCase())}</span>`;
    const who = profile ? `<a href="${esc(profile)}" target="_blank" rel="noopener">${esc(name)}</a>` : esc(name);
    const link = safeUrl(r.googleMapsUri);
    return `
    <article class="x-quote x-quote-g">
      <span class="x-stars" aria-label="${r.rating} out of 5 stars">${'★'.repeat(r.rating)}</span>
      <q>${esc(text)}</q>
      ${translated ? '<small class="x-gnote">Translated by Google</small>' : ''}
      <div class="x-by">${avatar}
        <div><b>${who}</b><small>${esc(r.relativePublishTimeDescription || 'Google review')}${link ? ` · <a href="${esc(link)}" target="_blank" rel="noopener">View on Google Maps</a>` : ''}</small></div></div>
    </article>`;
  };

  const load = async () => {
    try {
      const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=en`, {
        headers: { 'X-Goog-Api-Key': apiKey, 'X-Goog-FieldMask': 'rating,userRatingCount,googleMapsUri,reviews' },
      });
      if (!res.ok) return; // daily limit reached or key problem: keep hand-picked reviews
      const place = await res.json();

      // Rating summary
      const box = section.querySelector('.x-g');
      if (box && place.rating && place.userRatingCount) {
        const spans = box.querySelectorAll('span');
        if (spans[0]) spans[0].textContent = `★ ${Number(place.rating).toFixed(1)}`;
        if (spans[1]) spans[1].textContent = `average on Google · ${place.userRatingCount} reviews`;
        const btn = box.querySelector('a');
        if (btn && safeUrl(place.googleMapsUri)) btn.href = place.googleMapsUri;
      }

      const best = (place.reviews || []).filter(r => r.rating >= minStars && ((r.text && r.text.text) || (r.originalText && r.originalText.text)));
      if (!best.length) return;
      const names = new Set(best.map(r => ((r.authorAttribution || {}).displayName || '').toLowerCase().trim()));
      // Drop hand-picked cards by the same people, then put the live Google ones first
      [...list.querySelectorAll('.x-quote:not(.x-quote-g)')].forEach(q => {
        const n = (q.querySelector('.x-by b') || {}).textContent || '';
        if (names.has(n.toLowerCase().trim())) q.remove();
      });
      list.insertAdjacentHTML('afterbegin', best.map(card).join(''));

      // Notice required by Google when reviews are filtered, plus Google Maps attribution
      if (!section.querySelector('.x-gsrc')) {
        list.insertAdjacentHTML('afterend',
          `<p class="x-gsrc">Showing ${minStars}★ reviews from <a href="${esc(safeUrl(place.googleMapsUri))}" target="_blank" rel="noopener">Google Maps</a>, in Google's order of relevance, followed by reviews chosen by the academy.</p>`);
      }
    } catch (e) { /* offline or blocked: keep hand-picked reviews */ }
  };

  // Only call Google when the visitor is about to reach the section (saves the free monthly quota)
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) { io.disconnect(); load(); }
    }, { rootMargin: '600px 0px' });
    io.observe(section);
  } else load();
})();

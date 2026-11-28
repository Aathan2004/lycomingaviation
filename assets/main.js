// ===== EDIT THESE ONCE =====
const WHATSAPP_NUMBER = "918925850808"; // country code + number, digits only

// Mobile menu: see assets/nav.js

// WhatsApp links
document.querySelectorAll('[data-wa]').forEach(el => {
  const msg = encodeURIComponent(el.dataset.wa || "Hi Lycoming Aviation, I'd like to know more.");
  el.href = WHATSAPP_NUMBER.includes('X') ? '#contact-form' : `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
  if (!WHATSAPP_NUMBER.includes('X')) el.target = '_blank';
});

// Photo/video slots: show a neat placeholder until the real file is added
document.querySelectorAll('.media img').forEach(img => {
  const box = img.closest('.media');
  const fail = () => { box.classList.add('empty'); img.remove(); };
  if (img.complete && !img.naturalWidth) fail(); else img.addEventListener('error', fail);
});
document.querySelectorAll('video[data-optional]').forEach(v => v.addEventListener('error', () => v.remove(), true));

// Reveal on scroll
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .1 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Enquiry form -> WhatsApp
const form = document.getElementById('contact-form');
form && form.addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(form);
  const text = `Hi Lycoming Aviation! New enquiry:\nName: ${f.get('name')}\nPhone: ${f.get('cc') || ''} ${f.get('phone')}\nCity: ${f.get('city') || '-'}\nCourse: ${f.get('course')}\nMessage: ${f.get('msg') || '-'}`;
  document.getElementById('ok').style.display = 'block';
  if (!WHATSAPP_NUMBER.includes('X')) window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
});

const yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();

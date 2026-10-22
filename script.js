const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navigation.classList.toggle('open', !isOpen);
  menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    navigation.classList.remove('open');
  });
});

const marquee = document.querySelector('.work-marquee');
const marqueeToggle = document.querySelector('.marquee-toggle');

marqueeToggle.addEventListener('click', () => {
  const paused = marquee.classList.toggle('is-paused');
  marqueeToggle.setAttribute('aria-pressed', String(paused));
  marqueeToggle.textContent = paused ? 'Play motion' : 'Pause motion';
});

const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
const formPanel = document.querySelector('.contact-form-panel');
const sentOverlay = document.querySelector('#sent-overlay');
const sendButton = contactForm.querySelector('.send-button');
const sendLabel = sendButton.querySelector('span');
const OWNER_EMAIL = 'chanuchaitanyashandilya3@gmail.com';
// Paste your deployed Cloudflare Worker URL here (see contact-worker/SETUP.md).
const CONTACT_ENDPOINT = 'https://portfolio-contact.chanuchaitanyashandilya3.workers.dev';

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const fields = new FormData(contactForm);
  if (fields.get('_honey')) return;
  const name = fields.get('name').trim();
  const email = fields.get('email').trim();
  const message = fields.get('message').trim();

  sendButton.disabled = true;
  sendLabel.textContent = 'Sending…';
  try {
    if (!CONTACT_ENDPOINT) throw new Error('endpoint not configured');
    const response = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error || 'send failed');
    contactForm.reset();
    formPanel.classList.add('is-sent');
    sentOverlay.setAttribute('aria-hidden', 'false');
    sentOverlay.setAttribute('role', 'status');
    sentOverlay.querySelector('.sent-again').focus({ preventScroll: true });
    formStatus.textContent = 'Your message goes straight to my inbox.';
  } catch {
    formStatus.innerHTML = `Couldn’t send right now. Please email me at <a href="mailto:${OWNER_EMAIL}">${OWNER_EMAIL}</a>.`;
    sendLabel.textContent = 'Send message';
  } finally {
    sendButton.disabled = false;
    sendLabel.textContent = 'Send message';
  }
});

sentOverlay.querySelector('.sent-again').addEventListener('click', () => {
  formPanel.classList.remove('is-sent');
  sentOverlay.setAttribute('aria-hidden', 'true');
  contactForm.querySelector('input').focus({ preventScroll: true });
});

const revealItems = document.querySelectorAll('[data-reveal]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !reducedMotion && revealItems.length) {
  document.documentElement.classList.add('motion-enabled');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  revealItems.forEach((item) => revealObserver.observe(item));
}

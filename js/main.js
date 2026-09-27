// ============================================
// NAV: scroll state + mobile menu
// ============================================
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

function onScroll() {
  if (!nav) return;
  nav.classList.toggle('is-scrolled', window.scrollY > 20);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    document.body.classList.toggle('menu-open', isOpen);
    navToggle.classList.toggle('is-open', isOpen);
  });
  mobileMenu.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    })
  );
}

// ============================================
// SCROLL REVEAL
// ============================================
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// stagger index for children of .reveal-stagger
document.querySelectorAll('.reveal-stagger').forEach((parent) => {
  Array.from(parent.children).forEach((child, i) => child.style.setProperty('--i', i));
});

// ============================================
// WORK FILTER (work index page)
// ============================================
const filterBtns = document.querySelectorAll('.filter-btn');
const filterCards = document.querySelectorAll('[data-category]');
if (filterBtns.length) {
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      filterCards.forEach((card) => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.hidden = !match;
      });
    });
  });
}

// ============================================
// BEFORE / AFTER COMPARE SLIDER
// ============================================
document.querySelectorAll('.compare').forEach((wrap) => {
  const before = wrap.querySelector('.compare-before');
  const handle = wrap.querySelector('.compare-handle');
  let dragging = false;

  function setPos(clientX) {
    const rect = wrap.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(0, Math.min(100, pct));
    before.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    handle.style.left = `${pct}%`;
  }

  wrap.addEventListener('pointerdown', (e) => {
    dragging = true;
    setPos(e.clientX);
  });
  window.addEventListener('pointermove', (e) => {
    if (dragging) setPos(e.clientX);
  });
  window.addEventListener('pointerup', () => (dragging = false));
  wrap.addEventListener('touchmove', (e) => {
    if (e.touches[0]) setPos(e.touches[0].clientX);
  });
});

// ============================================
// CUSTOM CURSOR (desktop / fine pointer only)
// ============================================
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);

  window.addEventListener('mousemove', (e) => {
    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;
  });

  document.querySelectorAll('a, button, .compare').forEach((el) => {
    el.addEventListener('mouseenter', () => dot.classList.add('is-active'));
    el.addEventListener('mouseleave', () => dot.classList.remove('is-active'));
  });
}

// ============================================
// CONTACT FORM (no backend — placeholder handling)
// ============================================
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const note = contactForm.querySelector('.form-note');
    if (note) {
      note.textContent = 'This form needs a backend or a service like Formspree connected before it can actually send — see the comment in contact.html.';
    }
  });
}

// ============================================
// 3D TILT (cards + portrait) — fine pointers only, off under reduced motion
// ============================================
(function () {
  const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
                  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!canTilt) return;

  const MAX = 7; // degrees
  document.querySelectorAll('.work-card, .output-item, .hero-photo-frame, .about-photo').forEach((el) => {
    let raf = 0;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transition = 'transform 0.12s ease-out';
        el.style.transform = `perspective(900px) rotateX(${(-py * MAX).toFixed(2)}deg) rotateY(${(px * MAX * 1.2).toFixed(2)}deg) translateZ(0)`;
      });
    });
    el.addEventListener('pointerleave', () => {
      cancelAnimationFrame(raf);
      el.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.transform = '';
    });
  });
})();

// ============================================
// SKILLS ACCORDION (About page)
// ============================================
document.querySelectorAll('.skill-toggle').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.skill-item');
    const panel = item.querySelector('.skill-panel');
    const wasOpen = item.classList.contains('is-open');

    // single-open accordion — collapse any other open item first
    document.querySelectorAll('.skill-item.is-open').forEach((other) => {
      if (other !== item) {
        other.classList.remove('is-open');
        other.querySelector('.skill-toggle').setAttribute('aria-expanded', 'false');
        other.querySelector('.skill-panel').style.maxHeight = '';
      }
    });

    item.classList.toggle('is-open', !wasOpen);
    btn.setAttribute('aria-expanded', String(!wasOpen));
    panel.style.maxHeight = wasOpen ? '' : panel.scrollHeight + 'px';
  });
});

// ===========================
// GSAP ANIMATION CONTROLLER
// ===========================

function getConfig(overrides) {
  return Object.assign({
    duration: 0.7,
    delay: 0,
    ease: 'power3.out',
    stagger: 0.1,
  }, overrides);
}

export function animatePageEntrance(pageEl, config) {
  const gsap = window.gsap;
  if (!gsap || !pageEl) return;

  const cfg = getConfig(config);
  const tl = gsap.timeline();

  const headings = pageEl.querySelectorAll('h1, h2, h3, .section-title, .cover-title, .cover-subtitle');
  if (headings.length) {
    tl.fromTo(headings,
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: cfg.duration, ease: cfg.ease, stagger: cfg.stagger },
      cfg.delay
    );
  }

  const cards = pageEl.querySelectorAll('.course-card, .batch-card, .value-card, .benefit-item, .contact-block');
  if (cards.length) {
    tl.fromTo(cards,
      { opacity: 0, y: 20, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power2.out', stagger: 0.06 },
      cfg.delay + 0.2
    );
  }

  const paragraphs = pageEl.querySelectorAll('p, .course-desc, .batch-days, .batch-time, .course-meta');
  if (paragraphs.length) {
    tl.fromTo(paragraphs,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.04 },
      cfg.delay + 0.3
    );
  }

  const dividers = pageEl.querySelectorAll('.gold-divider, .cover-divider');
  if (dividers.length) {
    tl.fromTo(dividers,
      { width: 0, opacity: 0 },
      { width: 80, opacity: 1, duration: 0.6, ease: 'power2.inOut' },
      cfg.delay + 0.1
    );
  }

  const blobs = pageEl.querySelectorAll('.watercolor-blob, .wc-accent, [class*="blob-"]');
  if (blobs.length) {
    tl.fromTo(blobs,
      { scale: 0.6, opacity: 0 },
      { scale: 1, opacity: 0.15, duration: 1, ease: 'power2.out', stagger: 0.08 },
      cfg.delay
    );
  }

  const cta = pageEl.querySelectorAll('.cta-button');
  if (cta.length) {
    tl.fromTo(cta,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      cfg.delay + 0.5
    );
  }

  return tl;
}

export function animateCoverEntrance(pageEl) {
  const gsap = window.gsap;
  if (!gsap || !pageEl) return;

  const tl = gsap.timeline({ delay: 0.3 });

  const palette = pageEl.querySelector('.cover-palette-icon');
  if (palette) {
    tl.fromTo(palette,
      { scale: 0, rotation: -30, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' }
    );
  }

  const title = pageEl.querySelector('.cover-title');
  if (title) {
    tl.fromTo(title,
      { opacity: 0, letterSpacing: '0.5em', filter: 'blur(4px)' },
      { opacity: 1, letterSpacing: '0.25em', filter: 'blur(0px)', duration: 1, ease: 'power3.out' },
      '-=0.3'
    );
  }

  const foilDivider = pageEl.querySelector('.cover-gold-foil-divider');
  if (foilDivider) {
    tl.fromTo(foilDivider,
      { width: 0, opacity: 0 },
      { width: 120, opacity: 1, duration: 0.6, ease: 'power2.inOut' },
      '-=0.5'
    );
  }

  const subtitle = pageEl.querySelector('.cover-subtitle');
  const tagline = pageEl.querySelector('.cover-tagline');
  if (subtitle) {
    tl.fromTo(subtitle, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3');
  }
  if (tagline) {
    tl.fromTo(tagline, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2');
  }

  const iconsRow = pageEl.querySelector('.cover-icons-row');
  if (iconsRow) {
    tl.fromTo(iconsRow, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3');
  }

  const since = pageEl.querySelector('.cover-since');
  if (since) {
    tl.fromTo(since, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.2');
  }

  const corners = pageEl.querySelectorAll('.cover-corner');
  if (corners.length) {
    tl.fromTo(corners,
      { opacity: 0 },
      { opacity: 0.5, duration: 0.4, ease: 'power2.out', stagger: 0.1 },
      '-=0.4'
    );
  }

  const paletteIll = pageEl.querySelector('.cover-palette-illustration');
  if (paletteIll) {
    tl.fromTo(paletteIll,
      { scale: 0.7, opacity: 0 },
      { scale: 1, opacity: 0.8, duration: 1, ease: 'power2.out' },
      0.2
    );
  }

  return tl;
}

export function animatePageFlip(currentPage, nextPage) {
  const gsap = window.gsap;
  if (!gsap || !nextPage) return;

  gsap.fromTo(nextPage,
    { scale: 0.98, opacity: 0.8 },
    { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out', delay: 0.1 }
  );
}

if (typeof Lenis === 'undefined') {
    window.Lenis = function() {
      return { raf: function(){}, on: function(){}, scrollTo: function(el, opts) {
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }};
    };
  }



// ── Lenis Smooth Scroll ──────────────────────────────────────────────────
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.lagSmoothing(0);

// ── Custom Cursor ────────────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.05 });
});
function animateFollower() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  gsap.set(follower, { x: followerX, y: followerY });
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    gsap.to(cursor, { scale: 2.5, background: 'rgba(229,57,53,0.6)', duration: 0.3 });
    gsap.to(follower, { scale: 0.4, opacity: 0.5, duration: 0.3 });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(cursor, { scale: 1, background: 'var(--red)', duration: 0.3 });
    gsap.to(follower, { scale: 1, opacity: 1, duration: 0.3 });
  });
});

// ── Navigation ────────────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
ScrollTrigger.create({
  start: 'top -80',
  onUpdate: (self) => {
    if (self.progress > 0) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
});

// ── Hamburger ─────────────────────────────────────────────────────────────
/*
  FIX APPLIED:
  ORIGINAL CODE set mobileNav.style.display = 'flex' when opening and relied
  on display:none as the closed state in CSS. This fought the CSS and caused
  a one-frame flash where the element was display:flex + opacity:0 but fully
  in the stacking context — contributing to the ghost overlay on the navbar.

  FIX: Removed all element.style.display manipulation.
  The .open class toggle on #mobile-nav is now the SOLE mechanism.
  CSS handles everything: visibility:hidden + opacity:0 (closed) →
  visibility:visible + opacity:1 (open), with a smooth transition.
  aria-hidden is also toggled for accessibility.
*/
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
let navOpen = false;

hamburger.addEventListener('click', () => {
  navOpen = !navOpen;
  mobileNav.classList.toggle('open', navOpen);
  hamburger.setAttribute('aria-expanded', navOpen);
  mobileNav.setAttribute('aria-hidden', !navOpen);

  const spans = hamburger.querySelectorAll('span');
  if (navOpen) {
    gsap.to(spans[0], { rotate: 45, y: 6, duration: 0.3 });
    gsap.to(spans[1], { opacity: 0, duration: 0.3 });
    gsap.to(spans[2], { rotate: -45, y: -6, duration: 0.3 });
  } else {
    gsap.to(spans[0], { rotate: 0, y: 0, duration: 0.3 });
    gsap.to(spans[1], { opacity: 1, duration: 0.3 });
    gsap.to(spans[2], { rotate: 0, y: 0, duration: 0.3 });
  }
});

document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navOpen = false;
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');

    const spans = hamburger.querySelectorAll('span');
    gsap.to(spans[0], { rotate: 0, y: 0, duration: 0.3 });
    gsap.to(spans[1], { opacity: 1, duration: 0.3 });
    gsap.to(spans[2], { rotate: 0, y: 0, duration: 0.3 });
  });
});

// ── Hero Entrance ─────────────────────────────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

gsap.set('#hero-label', { opacity: 0, y: 20 });
gsap.set('#hero-headline', { opacity: 0, y: 40 });
gsap.set('#hero-sub', { opacity: 0, y: 20 });
gsap.set('#hero-buttons', { opacity: 0, y: 20 });
gsap.set('#hero-badge', { opacity: 0, x: 20 });
gsap.set('#scroll-indicator', { opacity: 0 });
gsap.set('#hero-video-showcase', { opacity: 0, x: 30 });

const heroTl = gsap.timeline({ delay: 0.3 });
heroTl
  .to('#hero-label',          { opacity: 1, y: 0, duration: 1,   ease: 'power3.out' }, 0)
  .to('#hero-headline',       { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, 0.2)
  .to('#hero-sub',            { opacity: 1, y: 0, duration: 1,   ease: 'power3.out' }, 0.5)
  .to('#hero-buttons',        { opacity: 1, y: 0, duration: 1,   ease: 'power3.out' }, 0.7)
  .to('#hero-badge',          { opacity: 1, x: 0, duration: 1,   ease: 'power3.out' }, 0.8)
  .to('#hero-video-showcase', { opacity: 1, x: 0, duration: 1,   ease: 'power3.out' }, 0.9)
  .to('#scroll-indicator',    { opacity: 1,        duration: 1,   ease: 'power2.out' }, 1.2);

// ── Reveal animations ─────────────────────────────────────────────────────
gsap.utils.toArray('.reveal').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' } }
  );
});
gsap.utils.toArray('.reveal-left').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, x: -50 },
    { opacity: 1, x: 0, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' } }
  );
});
gsap.utils.toArray('.reveal-right').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, x: 50 },
    { opacity: 1, x: 0, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' } }
  );
});

// ── Workflow steps ─────────────────────────────────────────────────────────
gsap.utils.toArray('.workflow-step').forEach((step, i) => {
  gsap.to(step, {
    opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
    delay: i * 0.08,
    scrollTrigger: { trigger: step, start: 'top 88%', toggleActions: 'play none none none' }
  });
});

// ── Counter animations ─────────────────────────────────────────────────────
gsap.utils.toArray('.counter').forEach(counter => {
  const target = parseFloat(counter.dataset.target);
  const decimals = parseInt(counter.dataset.decimals) || 0;
  ScrollTrigger.create({
    trigger: counter, start: 'top 80%', once: true,
    onEnter: () => {
      gsap.to({ val: 0 }, {
        val: target, duration: 2.2, ease: 'power2.out',
        onUpdate: function() { counter.textContent = this.targets()[0].val.toFixed(decimals); },
        onComplete: () => { counter.textContent = target.toFixed(decimals); }
      });
    }
  });
});

// ── Service row stagger ────────────────────────────────────────────────────
gsap.utils.toArray('.service-row').forEach((row, i) => {
  gsap.fromTo(row,
    { opacity: 0, x: -20 },
    { opacity: 1, x: 0, duration: 0.7, ease: 'power2.out',
      delay: i * 0.05,
      scrollTrigger: { trigger: row, start: 'top 90%', toggleActions: 'play none none none' } }
  );
});

// ── Testimonial stagger ────────────────────────────────────────────────────
gsap.utils.toArray('.testimonial').forEach((t, i) => {
  gsap.fromTo(t,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      delay: i * 0.1,
      scrollTrigger: { trigger: t, start: 'top 88%', toggleActions: 'play none none none' } }
  );
});

// ── Pillar stagger ────────────────────────────────────────────────────────
gsap.utils.toArray('.pillar').forEach((p, i) => {
  gsap.fromTo(p,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      delay: i * 0.1,
      scrollTrigger: { trigger: p, start: 'top 88%', toggleActions: 'play none none none' } }
  );
});

// ── Why features stagger ──────────────────────────────────────────────────
gsap.utils.toArray('.why-feature').forEach((f, i) => {
  gsap.fromTo(f,
    { opacity: 0, x: -30 },
    { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
      delay: i * 0.1,
      scrollTrigger: { trigger: f, start: 'top 88%', toggleActions: 'play none none none' } }
  );
});

// ── Metric hover glow ─────────────────────────────────────────────────────
gsap.utils.toArray('.metric-item').forEach(item => {
  const num = item.querySelector('.metric-number');
  item.addEventListener('mouseenter', () => { gsap.to(num, { color: 'var(--red)', duration: 0.3 }); });
  item.addEventListener('mouseleave', () => { gsap.to(num, { color: 'var(--white)', duration: 0.3 }); });
});

// ── CTA parallax circles ─────────────────────────────────────────────────
gsap.utils.toArray('.cta-circle').forEach((circle, i) => {
  gsap.to(circle, {
    scale: 1.15, ease: 'none',
    scrollTrigger: {
      trigger: '#cta', start: 'top bottom', end: 'bottom top',
      scrub: 1 + i * 0.3,
    }
  });
});

// ── Hero video parallax ────────────────────────────────────────────────────
gsap.to('#hero-video', {
  yPercent: 25, ease: 'none',
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
});

// ── Smooth anchor scrolling ────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = anchor.getAttribute('href');
    if (target === '#') return;
    e.preventDefault();
    const el = document.querySelector(target);
    if (el) lenis.scrollTo(el, { offset: -80, duration: 1.8 });
  });
});

// ================= PRELOADER =================

window.addEventListener("load", () => {

  const tl = gsap.timeline();

  tl.to(".preloader-logo", {
    opacity:1,
    duration:1
  })

  .to(".preloader-title", {
    opacity:1,
    y:0,
    duration:0.8
  }, "-=0.4")

  .to(".preloader-line", {
    width:"240px",
    duration:0.8
  })

  .to(".preloader-subtitle", {
    opacity:1,
    duration:0.8
  })

  .to("#preloader", {
    opacity:0,
    duration:1,
    delay:0.5,
    onComplete: () => {
      document.getElementById("preloader").remove();
    }
  });

});
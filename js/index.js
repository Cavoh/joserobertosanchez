/* ================================================================
   JOSE ROBERTO SANCHEZ — Portfolio 2026
   Vanilla JS — No jQuery, No particles.js
   ================================================================ */

'use strict';

/* ================================================================
   1. LOADER
   ================================================================ */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;

  setTimeout(() => {
    loader.classList.add('hidden');
    // Show hero after loader
    const hero = document.getElementById('hero');
    if (hero) {
      hero.style.display = 'block';
      hero.classList.add('active');
    }
    initRevealAnimations();
  }, 1800);
});

/* ================================================================
   2. CUSTOM CURSOR
   ================================================================ */
(function initCursor() {
  const dot = document.querySelector('.cursor-dot');
  const outline = document.querySelector('.cursor-outline');

  if (!dot || !outline) return;

  let mouseX = -100, mouseY = -100;
  let outlineX = -100, outlineY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Smooth trail for outline
  function animateOutline() {
    outlineX += (mouseX - outlineX) * 0.12;
    outlineY += (mouseY - outlineY) * 0.12;
    outline.style.left = outlineX + 'px';
    outline.style.top  = outlineY + 'px';
    requestAnimationFrame(animateOutline);
  }
  animateOutline();

  // Hover effects
  const hoverTargets = document.querySelectorAll('a, button, .filter-btn, .portfolio-card, .service-card, .blog-card, .nav-toggle');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => outline.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => outline.classList.remove('cursor-hover'));
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    outline.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    outline.style.opacity = '1';
  });
})();

/* ================================================================
   3. NAVIGATION — Sticky + Mobile
   ================================================================ */
(function initNavigation() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-links a[data-section]');

  // Sticky navbar on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('open');
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
      }
    });
  }

  // Section navigation
  const sections = {
    home:      document.getElementById('hero'),
    about:     document.getElementById('about'),
    skills:    document.getElementById('skills'),
    services:  document.getElementById('services'),
    portfolio: document.getElementById('portfolio'),
    blog:      document.getElementById('blog'),
    contact:   document.getElementById('contact'),
  };

  function showSection(id) {
    Object.values(sections).forEach(sec => {
      if (!sec) return;
      sec.style.display = 'none';
      sec.classList.remove('active');
    });

    const target = sections[id];
    if (target) {
      target.style.display = 'block';
      // Force reflow for animation
      void target.offsetWidth;
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Trigger skill bars if skills section
      if (id === 'skills') animateSkillBars();

      // Trigger reveal animations
      setTimeout(initRevealAnimations, 100);
    }

    // Update active link
    links.forEach(link => {
      link.classList.toggle('active', link.dataset.section === id);
    });
  }

  // Make showSection globally accessible
  window.showSection = showSection;

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showSection(link.dataset.section);
    });
  });

  // Logo goes home
  const logo = document.querySelector('.nav-logo');
  if (logo) {
    logo.addEventListener('click', () => showSection('home'));
  }

  // Hero buttons
  const heroPfBtn = document.getElementById('hero-portfolio-btn');
  if (heroPfBtn) heroPfBtn.addEventListener('click', (e) => { e.preventDefault(); showSection('portfolio'); });
  const heroCtBtn = document.getElementById('hero-contact-btn');
  if (heroCtBtn) heroCtBtn.addEventListener('click', (e) => { e.preventDefault(); showSection('contact'); });
  const aboutHireBtn = document.getElementById('about-hire-btn');
  if (aboutHireBtn) aboutHireBtn.addEventListener('click', (e) => { e.preventDefault(); showSection('contact'); });

  // Initial state — show hero
  const hero = document.getElementById('hero');
  if (hero) {
    hero.style.display = 'block';
  }
  Object.entries(sections).forEach(([id, el]) => {
    if (id !== 'home' && el) el.style.display = 'none';
  });
})();

/* ================================================================
   4. TYPING EFFECT
   ================================================================ */
(function initTyping() {
  const el = document.querySelector('.typing-text');
  if (!el) return;

  const phrases = [
    'Web Developer',
    'AI-First Designer',
    'Creative Coder',
    'Freelancer',
    'SaaS Builder',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let isDeleting = false;
  let delay      = 120;

  function type() {
    const current = phrases[phraseIdx];
    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      delay = 60;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      delay = 120;
    }

    if (!isDeleting && charIdx === current.length) {
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 1800);
})();

/* ================================================================
   5. SCROLL REVEAL ANIMATIONS
   ================================================================ */
function initRevealAnimations() {
  const elements = document.querySelectorAll('.reveal:not(.visible)');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ================================================================
   6. SKILL BARS ANIMATION
   ================================================================ */
function animateSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  fills.forEach(fill => {
    const target = fill.dataset.width || '0%';
    setTimeout(() => {
      fill.style.width = target;
    }, 100);
  });
}

/* ================================================================
   7. PORTFOLIO FILTER
   ================================================================ */
(function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Active class
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter cards
      cards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          card.style.animation = 'sectionFadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();

/* ================================================================
   8. CONTACT FORM (EmailJS)
   ================================================================ */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = document.getElementById('form-submit');
  const successMsg = document.querySelector('.form-success');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = document.getElementById('form-name').value.trim();
    const email   = document.getElementById('form-email').value.trim();
    const subject = document.getElementById('form-subject').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !subject || !message) return;

    // Button loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // If EmailJS is loaded
    if (typeof emailjs !== 'undefined') {
      try {
        await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
          from_name: name,
          from_email: email,
          subject: subject,
          message: message,
        });
        if (successMsg) successMsg.classList.add('show');
        form.reset();
      } catch (err) {
        console.error('EmailJS error:', err);
      }
    } else {
      // Simulate success for demo
      if (successMsg) successMsg.classList.add('show');
      form.reset();
    }

    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message →';

    setTimeout(() => {
      if (successMsg) successMsg.classList.remove('show');
    }, 5000);
  });
})();

/* ================================================================
   9. SMOOTH HOVER TILT on Service Cards
   ================================================================ */
(function initCardTilt() {
  const cards = document.querySelectorAll('.service-card, .portfolio-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -5;
      const rotateY = (x - centerX) / centerX * 5;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ================================================================
   10. ANIMATE NUMBER COUNTERS
   ================================================================ */
function animateCount(el, target, duration = 1500) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Observe stat counters
document.addEventListener('DOMContentLoaded', () => {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target, parseInt(entry.target.dataset.count));
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => obs.observe(el));
});
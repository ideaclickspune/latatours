/* =====================================================
   LATA TOURS & TRAVELS — SCRIPTS
   Lightweight vanilla JS — no frameworks
   ===================================================== */

(function () {
  'use strict';

  /* ============ HEADER SCROLL BEHAVIOUR ============ */
  const header = document.getElementById('header');

  function updateHeader() {
    if (window.scrollY > 50) {
      header.classList.add('solid');
      header.classList.remove('transparent');
    } else {
      header.classList.remove('solid');
      header.classList.add('transparent');
    }
  }

  // Set initial state
  header.classList.add('transparent');
  updateHeader();

  window.addEventListener('scroll', updateHeader, { passive: true });


  /* ============ HAMBURGER MENU ============ */
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  hamburger.addEventListener('click', function () {
    const isOpen = nav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close nav on link click
  nav.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    });
  });

  // Close nav on outside click
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('open') && !nav.contains(e.target) && e.target !== hamburger && !hamburger.contains(e.target)) {
      nav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    }
  });


  /* ============ FAQ ACCORDION ============ */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const btn = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');

    btn.addEventListener('click', function () {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all others
      faqItems.forEach(function (otherItem) {
        const otherBtn = otherItem.querySelector('.faq-q');
        const otherAns = otherItem.querySelector('.faq-a');
        otherBtn.setAttribute('aria-expanded', 'false');
        otherAns.hidden = true;
        otherAns.style.maxHeight = null;
      });

      // Toggle current
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.hidden = false;
        // Animate open
        const height = answer.scrollHeight;
        answer.style.maxHeight = '0px';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'max-height 0.35s ease';
        requestAnimationFrame(function () {
          answer.style.maxHeight = height + 'px';
        });
      }
    });
  });


  /* ============ SCROLL FADE-IN ANIMATIONS ============ */
  const fadeEls = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Stagger children of same parent
            const siblings = entry.target.parentElement
              ? Array.from(entry.target.parentElement.querySelectorAll('.fade-up:not(.visible)'))
              : [];
            const index = siblings.indexOf(entry.target);
            const delay = Math.min(index * 80, 400);
            setTimeout(function () {
              entry.target.classList.add('visible');
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all immediately
    fadeEls.forEach(function (el) { el.classList.add('visible'); });
  }


  /* ============ SMOOTH SCROLL ============ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerH = header.offsetHeight || 70;
        const top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 10;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });


  /* ============ ACTIVE NAV LINK ON SCROLL ============ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function setActiveNav() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(function (section) {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', setActiveNav, { passive: true });


  /* ============ LAZY IMAGE LOADING FALLBACK ============ */
  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading — nothing needed
  } else {
    // Fallback polyfill via IntersectionObserver
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
      const imgObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) img.src = img.dataset.src;
            obs.unobserve(img);
          }
        });
      });
      lazyImages.forEach(function (img) { imgObserver.observe(img); });
    }
  }


  /* ============ PHONE LINK — ADD GTM/GA EVENT HOOK ============ */
  // Uncomment and add your GA4 Measurement ID if needed
  // document.querySelectorAll('a[href^="tel"]').forEach(function(el) {
  //   el.addEventListener('click', function() {
  //     if (window.gtag) {
  //       gtag('event', 'phone_call_click', { event_category: 'contact', event_label: 'call_cta' });
  //     }
  //   });
  // });
  // document.querySelectorAll('a[href^="https://wa.me"]').forEach(function(el) {
  //   el.addEventListener('click', function() {
  //     if (window.gtag) {
  //       gtag('event', 'whatsapp_click', { event_category: 'contact', event_label: 'wa_cta' });
  //     }
  //   });
  // });

})();

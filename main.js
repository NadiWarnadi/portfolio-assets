/* ============================================
   WARNADI.DEV — Portfolio Interactions
   ============================================ */
(function () {
  'use strict';

  /* ---------- 1. AUTO YEAR ---------- */
  var yearEl = document.getElementById('wd-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 2. MOBILE MENU ---------- */
  var toggle = document.querySelector('.wd-menu-toggle');
  var linksNav = document.querySelector('.wd-nav-links');
  if (toggle && linksNav) {
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('is-active');
      linksNav.classList.toggle('is-open');
    });
    linksNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.classList.remove('is-active');
        linksNav.classList.remove('is-open');
      });
    });
  }

  /* ---------- 3. SCROLL REVEAL ---------- */
  var reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-revealed');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-revealed'); });
  }

  /* ---------- 4. NAV SCROLL STATE ---------- */
  var nav = document.querySelector('.wd-nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 5. ACTIVE NAV LINK (SCROLL SPY) ---------- */
  var sections = document.querySelectorAll('section[id]');
  var navAnchors = document.querySelectorAll('.wd-nav-links a[href^="#"]');
  if (sections.length && navAnchors.length && 'IntersectionObserver' in window) {
    var map = {};
    navAnchors.forEach(function (a) {
      map[a.getAttribute('href').slice(1)] = a;
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          navAnchors.forEach(function (a) { a.classList.remove('is-active'); });
          if (map[e.target.id]) map[e.target.id].classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- 6. SMOOTH SCROLL WITH NAV OFFSET ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length > 1) {
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          var offset = 80;
          var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }
    });
  });
})();
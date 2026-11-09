(function () {
  'use strict';
  var THEME_KEY = 'wd-theme';
  var root = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  var toggleBtn = document.getElementById('wd-theme-toggle');

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
    if (toggleBtn) toggleBtn.setAttribute('aria-label', t === 'dark' ? 'Aktifkan tema terang' : 'Aktifkan tema gelap');
    if (meta) meta.setAttribute('content', t === 'dark' ? '#0a0e1a' : '#f8fafc');
  }
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      applyTheme((root.getAttribute('data-theme') || 'dark') === 'dark' ? 'light' : 'dark');
    });
    applyTheme(root.getAttribute('data-theme') || 'dark');
  }

  var yearEl = document.getElementById('wd-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var menuBtn = document.getElementById('wd-menu-toggle');
  var navLinks = document.getElementById('wd-nav-links');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function () {
      var open = navLinks.classList.toggle('is-open');
      menuBtn.classList.toggle('is-active', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('wd-menu-open', open);
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        menuBtn.classList.remove('is-active');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('wd-menu-open');
      });
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 720) {
        navLinks.classList.remove('is-open');
        menuBtn.classList.remove('is-active');
        document.body.classList.remove('wd-menu-open');
      }
    });
  }

  var nav = document.getElementById('wd-nav');
  if (nav) {
    var s = function () { nav.classList.toggle('is-scrolled', window.scrollY > 40); };
    window.addEventListener('scroll', s, { passive: true });
    s();
  }

  var path = window.location.pathname;
  document.querySelectorAll('.wd-nav-links a').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    if (href === path) a.classList.add('is-active');
  });
})();
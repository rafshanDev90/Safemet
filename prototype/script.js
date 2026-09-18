(function () {
  'use strict';

  var header = document.getElementById('siteHeader');
  var hamburger = document.getElementById('hamburger');
  var drawer = document.getElementById('mobileDrawer');
  var overlay = document.getElementById('drawerOverlay');
  var closeBtn = document.getElementById('drawerClose');

  /* ---------- Scroll state ---------- */
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 0);
  }

  /* Throttle rAF so it stays buttery-smooth while scrolling */
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  onScroll();

  /* ---------- Mobile drawer ---------- */
  function openDrawer() {
    drawer.classList.add('open');
    overlay.hidden = false;
    requestAnimationFrame(function () { overlay.classList.add('show'); });
    drawer.setAttribute('aria-hidden', 'false');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('show');
    drawer.setAttribute('aria-hidden', 'true');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
    setTimeout(function () { overlay.hidden = true; }, 300);
  }

  hamburger.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  /* Close drawer when a link inside it is clicked */
  drawer.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeDrawer);
  });

  /* ---------- Mobile accordion submenus ---------- */
  drawer.querySelectorAll('.drawer-toggle').forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));

      var sub = toggle.nextElementSibling;
      if (expanded) {
        sub.style.maxHeight = null;
      } else {
        sub.style.maxHeight = sub.scrollHeight + 'px';
      }
    });
  });

  /* Close drawer when resizing back up to desktop width */
  window.addEventListener('resize', function () {
    if (window.innerWidth > 992) closeDrawer();
  });

  /* ---------- Close desktop dropdowns on outside click ---------- */
  document.addEventListener('click', function (e) {
    var toggles = document.querySelectorAll('.dropdown-toggle');
    toggles.forEach(function (t) {
      var parent = t.parentElement;
      if (!parent.contains(e.target)) {
        t.setAttribute('aria-expanded', 'false');
      }
    });
  });

  document.querySelectorAll('.has-dropdown').forEach(function (li) {
    var toggle = li.querySelector('.dropdown-toggle');
    li.addEventListener('mouseenter', function () { toggle.setAttribute('aria-expanded', 'true'); });
    li.addEventListener('mouseleave', function () { toggle.setAttribute('aria-expanded', 'false'); });
  });
})();
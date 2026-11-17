// ==============================================================
// reveal.js
// Makes each station gently fade and rise into place the first
// time it scrolls into view.
//
// How it stays safe and calm:
// - The words are always in the page. This script only adds and
//   removes CSS classes. If it fails or scripts are off, everything
//   is simply visible, with no animation.
// - If the visitor's device asks for less motion, it does nothing.
// - The gate (first screen) is skipped on purpose, so the site
//   starts calm. The PRD says effects build up as you scroll.
// ==============================================================

// 1. Respect the "reduce motion" setting on the visitor's device
const wantsLessMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 2. Older browsers without IntersectionObserver just show everything
const canWatchScrolling = 'IntersectionObserver' in window;

if (!wantsLessMotion && canWatchScrolling) {

  // Every station except the gate
  const stations = document.querySelectorAll('.station:not(.gate)');

  // The watcher: when the top of a station passes the bottom 10% of
  // the screen, reveal it once. This works even for very tall sections.
  const watcher = new IntersectionObserver((seenItems) => {
    seenItems.forEach((item) => {
      if (item.isIntersecting) {
        item.target.classList.add('is-visible');
        watcher.unobserve(item.target);   // stop watching, it only happens once
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });

  stations.forEach((station) => {
    // Anything already on screen when the page loads stays as it is,
    // so nothing the visitor can already see blinks out and back in.
    const box = station.getBoundingClientRect();
    const alreadyOnScreen = box.top < window.innerHeight && box.bottom > 0;
    if (alreadyOnScreen) return;

    station.classList.add('reveal');      // start hidden (see styles.css)
    watcher.observe(station);
  });

  // Safety net: if anything goes wrong, show everything after 3 seconds
  // so no one is ever stuck looking at a blank section.
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.is-visible)').forEach((station) => {
      const box = station.getBoundingClientRect();
      const isOnScreen = box.top < window.innerHeight && box.bottom > 0;
      if (isOnScreen) station.classList.add('is-visible');
    });
  }, 3000);
}

// ==============================================================
// gate.js
// Opens the garden gate as you scroll.
//
// How it works:
// - It measures how far you've scrolled through the gate area,
//   as a number from 0 (closed) to 1 (all the way through).
// - It saves that number as a CSS variable called --p.
// - styles.css uses --p to unlock the padlock, swing the doors
//   and move you through the arch. All the motion lives in CSS.
//
// Safe defaults:
// - Scripts off: the gate just sits closed and the page scrolls normally.
// - "Reduce motion" on: this script does nothing, and CSS shows the
//   gate already open and still.
// ==============================================================

// The { } around this file keep its names private, so two files can
// use the same name (like wantsLessMotion) without clashing.
{
const scene = document.querySelector('.gate-scene');
const wantsLessMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (scene && !wantsLessMotion) {

  // This class makes the gate area taller, so there's room to scroll it open
  scene.classList.add('is-scroll-driven');

  let waiting = false;   // stops us from doing the math more than once per frame

  function updateGate() {
    const box = scene.getBoundingClientRect();
    const scrollableDistance = box.height - window.innerHeight;

    // How far through the gate area we are, kept between 0 and 1
    let progress = -box.top / scrollableDistance;
    progress = Math.min(1, Math.max(0, progress));

    scene.style.setProperty('--p', progress.toFixed(4));
    waiting = false;
  }

  function onScroll() {
    if (!waiting) {
      waiting = true;
      window.requestAnimationFrame(updateGate);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateGate();
}
}

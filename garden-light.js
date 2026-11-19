// ==============================================================
// garden-light.js
// Living Light: a soft warm light follows the mouse over the garden.
//
// How it works:
// - When the mouse moves over the garden, this works out where it is,
//   as a percent of the painting (0% = left/top, 100% = right/bottom).
// - It saves that as two CSS variables, --light-x and --light-y.
// - styles.css places the light there and fades it in (the .is-lit class).
// - All the looks live in styles.css. This file only says WHERE.
//
// Safe defaults:
// - Scripts off: no moving light. Everything else still works.
// - Phones and tablets (no mouse): this does nothing. CSS makes the
//   light drift slowly on its own instead.
// - "Reduce motion" on: this does nothing, and CSS hides the light.
// ==============================================================

// The { } around this file keep its names private, so two files can
// use the same name without clashing.
{
const art = document.querySelector('.art');
const canvas = document.querySelector('.art-canvas');
const wantsLessMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (art && canvas && !wantsLessMotion && hasMouse) {

  let mouseX = 0;
  let mouseY = 0;
  let waiting = false;   // stops us from doing the math more than once per frame

  // Turns the mouse position into percents of the painting
  function moveLight() {
    const box = canvas.getBoundingClientRect();
    const x = ((mouseX - box.left) / box.width) * 100;
    const y = ((mouseY - box.top) / box.height) * 100;

    canvas.style.setProperty('--light-x', x.toFixed(1) + '%');
    canvas.style.setProperty('--light-y', y.toFixed(1) + '%');
    waiting = false;
  }

  // Mouse moves over the garden: remember where, turn the light on
  art.addEventListener('pointermove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    art.classList.add('is-lit');

    if (!waiting) {
      waiting = true;
      window.requestAnimationFrame(moveLight);
    }
  });

  // Mouse leaves the garden: the light fades out
  art.addEventListener('pointerleave', () => {
    art.classList.remove('is-lit');
  });
}
}

// ==============================================================
// theme.js
// Makes the button in the menu switch between golden hour and night.
// The colors for each mode are at the top of styles.css.
// The choice is remembered on this device only. Nothing is sent anywhere.
// ==============================================================

// The { } around this file keep its names private, so two files can
// use the same name (like wantsLessMotion) without clashing.
{
const themeButton = document.querySelector('.theme-switch');
const page = document.documentElement;

// Updates the button so it always says which mode you'd switch TO
function showCurrentMode() {
  const isNight = page.getAttribute('data-theme') === 'night';
  themeButton.textContent = isNight ? 'Golden hour' : 'Night';
  themeButton.setAttribute('aria-pressed', String(isNight));
}

if (themeButton) {
  showCurrentMode();

  themeButton.addEventListener('click', () => {
    const goingToNight = page.getAttribute('data-theme') !== 'night';

    if (goingToNight) {
      page.setAttribute('data-theme', 'night');
    } else {
      page.removeAttribute('data-theme');
    }

    // Remember the choice. If saving is blocked, the switch still works for this visit.
    try {
      localStorage.setItem('theme', goingToNight ? 'night' : 'golden');
    } catch (error) {
      // Saving isn't available. That's fine.
    }

    showCurrentMode();
  });
}
}

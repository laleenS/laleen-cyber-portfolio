// ==============================================================
// theme-init.js
// Runs before the page draws. If the visitor picked night mode last
// time, it switches it on right away so the page doesn't flash.
// Day is the default, so nothing happens on a first visit.
//
// The try/catch is there because some browsers block saved data
// (private mode, strict privacy settings). Then we just use the default.
// ==============================================================

try {
  if (localStorage.getItem('theme') === 'night') {
    document.documentElement.setAttribute('data-theme', 'night');
  }
} catch (error) {
  // Saved data isn't available. Day it is.
}

import { $ } from './lib/dom.js';
export function initTheme() {
  const button = $('#theme-toggle');
  const update = () => {
    const golden = document.documentElement.dataset.theme === 'golden';
    button.setAttribute('aria-pressed', String(golden));
    button.setAttribute('aria-label', golden ? 'Switch to moonlit garden' : 'Switch to golden-hour garden');
    button.title = golden ? 'Switch to moonlit garden' : 'Switch to golden-hour garden';
    $('#theme-label').textContent = golden ? 'Golden hour' : 'Moonlit';
    document.querySelector('meta[name="theme-color"]').content = golden ? '#f2e8d8' : '#111f29';
  };
  button.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'golden' ? 'moonlit' : 'golden';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('root-access-theme-v1', theme); } catch { /* Theme changes still work for this visit. */ }
    update();
    document.dispatchEvent(new CustomEvent('garden:themechange', { detail: theme }));
  });
  window.addEventListener('storage', event => {
    if (event.key !== 'root-access-theme-v1' && event.key !== null) return;
    document.documentElement.dataset.theme = event.newValue === 'golden' ? 'golden' : 'moonlit';
    update();
    document.dispatchEvent(new CustomEvent('garden:themechange'));
  });
  update();
}

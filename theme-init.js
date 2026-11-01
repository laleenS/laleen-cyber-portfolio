// Apply the saved light before styles paint. Storage can be unavailable in private contexts.
try {
  document.documentElement.dataset.theme = localStorage.getItem('root-access-theme-v1') === 'golden' ? 'golden' : 'moonlit';
} catch {
  document.documentElement.dataset.theme = 'moonlit';
}

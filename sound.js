let context;
let enabled = false;
let volume = .3;
let last = 0;
const voices = {
  tap: [640, 450, .055, 'sine'],
  glass: [1260, 890, .18, 'sine'],
  paper: [230, 140, .09, 'triangle'],
  latch: [150, 80, .14, 'triangle'],
  release: [440, 220, .13, 'sine'],
  discover: [520, 1040, .4, 'sine'],
  key: [330, 280, .035, 'triangle'],
};
export function playSound(kind = 'tap') {
  if (!enabled || document.hidden || performance.now() - last < 45) return;
  last = performance.now();
  try {
    context ||= new (window.AudioContext || window.webkitAudioContext)();
    void context.resume().catch(() => {});
    const [start, end, duration, type] = voices[kind] || voices.tap;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(start, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(end, context.currentTime + duration);
    gain.gain.setValueAtTime(.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(Math.max(.0001, volume * .09), context.currentTime + .008);
    gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + duration + .02);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  } catch {
    enabled = false;
    const button = document.querySelector('#sound');
    button.textContent = 'Sound unavailable';
    button.setAttribute('aria-pressed', 'false');
  }
}
export function initSound() {
  const toggle = document.querySelector('#sound');
  toggle.addEventListener('click', () => {
    enabled = !enabled;
    toggle.textContent = `Sound ${enabled ? 'on' : 'off'}`;
    toggle.setAttribute('aria-pressed', String(enabled));
    playSound('glass');
  });
  document.querySelector('#volume').addEventListener('input', e => { volume = Number(e.target.value) / 100; });
  document.addEventListener('click', e => {
    const control = e.target.closest('button,a,summary');
    if (control && control.id !== 'sound') playSound(control.dataset.sound || 'tap');
  });
}

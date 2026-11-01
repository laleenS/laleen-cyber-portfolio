import { discoveries } from './garden-data.js';
import { $, make, action, announce } from './lib/dom.js';
import { playSound } from './sound.js';
const storageKey = 'root-access-discoveries-v1';
let entries = new Set();
let storageWorks = true;
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (Array.isArray(saved)) entries = new Set(saved.filter(id => discoveries.some(d => d.id === id)));
} catch { storageWorks = false; }
function updateCounts() {
  $('#discovery-count').textContent = entries.size;
  $('#dock-count').textContent = `${entries.size}/${discoveries.length}`;
  document.body.dataset.discoveries = entries.size;
}
function persist() {
  try { localStorage.setItem(storageKey, JSON.stringify([...entries])); }
  catch { storageWorks = false; }
}
export function discover(id) {
  if (entries.has(id) || !discoveries.some(d => d.id === id)) return;
  entries.add(id); persist(); updateCounts();
  const item = discoveries.find(d => d.id === id);
  announce(`Discovery recorded: ${item.title}. ${entries.size} of ${discoveries.length}.`);
  playSound('discover');
}
export function journalContent() {
  const content = make('div');
  content.append(make('p', 'A SMALL COLLECTION OF CURIOSITIES', 'case-number'), make('h2', 'Your field journal'));
  const note = make('p', storageWorks ? 'Saved only in this browser. No account, tracking, or leaderboard. Your progress never locks portfolio content.' : 'Browser storage is unavailable. Discoveries still work for this visit.');
  content.append(note);
  const list = make('ol', null, 'discovery-list');
  for (const item of discoveries) {
    const found = entries.has(item.id);
    const li = make('li', null, found ? 'found' : '');
    li.append(make('span', found ? '✳︎' : '○', 'discovery-mark'), make('strong', item.title), make('p', item.description), make('span', found ? 'DISCOVERED' : 'WAITING TO BE FOUND', 'tiny'));
    list.append(li);
  }
  content.append(list);
  const clear = action('Reset this journal', () => {
    // An explicit second step prevents an accidental loss of discoveries.
    clear.hidden = true; confirmation.hidden = false; confirm.focus();
  }, 'text-button');
  const confirmation = make('div', null, 'button-row'); confirmation.hidden = true;
  const confirm = action('Yes, clear my discoveries', () => {
    entries.clear(); persist(); updateCounts();
    content.replaceWith(journalContent());
    announce('Discovery journal cleared.');
    $('#drawer-content .text-button')?.focus();
  });
  confirmation.append(confirm, action('Keep my journal', () => { confirmation.hidden = true; clear.hidden = false; clear.focus(); }, 'text-button'));
  content.append(clear, confirmation);
  return content;
}
export function initJournal() { updateCounts(); }

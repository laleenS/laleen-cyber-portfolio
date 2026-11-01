export const $ = (selector, root = document) => root.querySelector(selector);
export const make = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text !== undefined && text !== null) node.textContent = text;
  if (className) node.className = className;
  return node;
};
export function action(text, handler, className = 'outline-button') {
  const button = make('button', text, className);
  button.type = 'button';
  button.addEventListener('click', handler);
  return button;
}
export function announce(message) { $('#garden-announcement').textContent = message; }

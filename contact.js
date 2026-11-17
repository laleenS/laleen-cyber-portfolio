// ==============================================================
// contact.js
// Turns the email on the page into a clickable link.
//
// Why: spam bots scan pages for text like "name@gmail.com".
// The page only says "name at gmail dot com", so most bots miss it.
// This script rebuilds the real address in the visitor's browser.
// If scripts are off, people still see the readable version.
//
// SECURITY: it only uses textContent and setAttribute, never
// innerHTML, so nothing can be injected as HTML.
// ==============================================================

// The { } around this file keep its names private, so two files can
// use the same name (like wantsLessMotion) without clashing.
{
// Find every email placeholder on the page
const emailSpots = document.querySelectorAll('.email');

emailSpots.forEach((spot) => {
  const user = spot.dataset.user;      // from data-user="..."
  const domain = spot.dataset.domain;  // from data-domain="..."

  // If either part is missing, leave the readable text alone
  if (!user || !domain) return;

  const address = user + '@' + domain;

  // Build a normal email link
  const link = document.createElement('a');
  link.setAttribute('href', 'mailto:' + address);
  link.textContent = address;

  // Swap the placeholder text for the link
  spot.replaceChildren(link);
});
}

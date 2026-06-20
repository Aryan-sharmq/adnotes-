// Inline SVG icon set (stroke-based, 24x24)
const I = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;

export const icons = {
  plus: I('<path d="M12 5v14M5 12h14"/>'),
  search: I('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>'),
  note: I('<path d="M4 4h11l5 5v11a0 0 0 0 1 0 0H4z"/><path d="M15 4v5h5"/>'),
  star: I('<path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8L3.5 9.7l5.9-.9Z"/>'),
  starFill: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8L3.5 9.7l5.9-.9Z"/></svg>',
  book: I('<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22.5z"/><path d="M4 19.5h16"/>'),
  tag: I('<path d="M12 2H7a2 2 0 0 0-2 2v5l9 9a2 2 0 0 0 2.8 0l4-4a2 2 0 0 0 0-2.8z"/><circle cx="9" cy="7" r="1.2"/>'),
  archive: I('<rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8M10 12h4"/>'),
  trash: I('<path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/>'),
  pin: I('<path d="M12 17v5M9 3h6l-1 6 3 3v2H7v-2l3-3z"/>'),
  menu: I('<path d="M4 6h16M4 12h16M4 18h16"/>'),
  more: I('<circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/>'),
  x: I('<path d="M18 6 6 18M6 6l12 12"/>'),
  grid: I('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'),
  list: I('<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>'),
  sun: I('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  moon: I('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'),
  bold: I('<path d="M6 4h8a4 4 0 0 1 0 8H6zM6 12h9a4 4 0 0 1 0 8H6z"/>'),
  italic: I('<path d="M19 4h-9M14 20H5M15 4 9 20"/>'),
  underline: I('<path d="M6 4v6a6 6 0 0 0 12 0V4M4 21h16"/>'),
  strike: I('<path d="M5 12h14M16 6.5C16 5 14 4 12 4s-4 1-4 3 2 3 4 3.5M8 17.5C8 19 10 20 12 20s4-1 4-3"/>'),
  h1: I('<path d="M4 6v12M12 6v12M4 12h8M17 18V9l-2 1.5"/>'),
  h2: I('<path d="M4 6v12M11 6v12M4 12h7M16 9a2 2 0 1 1 3.5 1.5L16 18h5"/>'),
  ul: I('<path d="M8 6h13M8 12h13M8 18h13M4 6h.01M4 12h.01M4 18h.01"/>'),
  ol: I('<path d="M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 16H4l2 2v2H4"/>'),
  check: I('<path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>'),
  quote: I('<path d="M6 17h3l2-4V7H5v6h2zM14 17h3l2-4V7h-6v6h2z"/>'),
  link: I('<path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5"/>'),
  download: I('<path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"/>'),
  copy: I('<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>'),
  restore: I('<path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5"/>'),
  logout: I('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>'),
  share: I('<circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.4 10.7 15.6 6.4M8.4 13.3l7.2 4.3"/>'),
  users: I('<path d="M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="3.2"/><path d="M22 20v-2a4 4 0 0 0-3-3.8M16 3.8a4 4 0 0 1 0 7.4"/>'),
  globe: I('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'),
  userPlus: I('<path d="M15 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="3.2"/><path d="M19 8v6M22 11h-6"/>'),
  eye: I('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>'),
  sparkle: I('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>'),
};

let toastTimer;
export function toast(message, action) {
  const wrap = document.getElementById('toasts');
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<span>${escapeHtml(message)}</span>`;
  if (action) {
    const b = document.createElement('span');
    b.className = 'undo';
    b.textContent = action.label;
    b.onclick = () => {
      action.fn();
      el.remove();
    };
    el.appendChild(b);
  }
  wrap.appendChild(el);
  clearTimeout(toastTimer);
  setTimeout(() => el.remove(), action ? 5000 : 2600);
}

export function escapeHtml(s = '') {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function relTime(iso) {
  const d = new Date(iso);
  const diff = (Date.now() - d) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

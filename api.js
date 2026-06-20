export const NOTE_COLORS = [
  'default', 'yellow', 'coral', 'mint', 'sky', 'lavender', 'peach', 'rose', 'sage',
];

// Editable creator details — shown on the About screen and in the footer.
// Aryan: drop your real details in here and they appear everywhere instantly.
export const CREATOR = {
  name: 'Aryan',
  tagline: 'Builder — tech, media & systems.', // ← your one-liner
  role: 'Creator & Engineer',
  email: 'you@example.com',                    // ← your email (or leave '')
  website: '',                                 // ← e.g. https://aryan.dev (or leave '')
  location: 'India',                           // ← optional
  year: new Date().getFullYear(),
};

export const state = {
  user: null,
  filter: 'notes', // notes | favorites | archived | trash
  notebook: null,
  tag: null,
  q: '',
  sort: 'updated',
  view: 'grid',
  notes: [],
  meta: { notebooks: [], tags: [], counts: {} },
};

export const theme = {
  apply(mode) {
    const sys = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const resolved = mode === 'system' ? sys : mode;
    document.documentElement.dataset.theme = resolved;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content', resolved === 'dark' ? '#111118' : '#6c5ce7'
    );
  },
};

import { api, auth } from './api.js';
import { state, theme, CREATOR, NOTE_COLORS } from './store.js';
import { icons, toast, escapeHtml, relTime } from './ui.js';
import { openEditor } from './editor.js';

const app = document.getElementById('app');

let _splashAt = Date.now();
function hideSplash() {
  const s = document.getElementById('splash');
  if (!s || s.classList.contains('gone')) return;
  const wait = Math.max(0, 650 - (Date.now() - _splashAt));
  setTimeout(() => { s.classList.add('gone'); setTimeout(() => s.remove(), 500); }, wait);
}

/* ============================ boot ============================ */
async function boot() {
  const path = location.pathname;
  const token = new URLSearchParams(location.search).get('token');

  if (path.startsWith('/s/')) return renderPublic(path.slice(3));
  if (path === '/verify' && token) return verifyFlow(token);
  if (path === '/reset' && token) return renderReset(token);

  theme.apply('system');

  if (!auth.token) return renderAuth('login');
  try {
    const { user } = await api.me();
    state.user = user;
    state.view = user.settings?.defaultView || 'grid';
    theme.apply(user.settings?.theme || 'system');
    await renderApp();
    if (new URLSearchParams(location.search).get('new') === '1') newNote();
  } catch {
    auth.token = null;
    renderAuth('login');
  }
}

/* ============================ auth ============================ */
function renderAuth(mode) {
  const screens = {
    login: { h: 'Welcome back', s: 'Sign in to pick up where you left off.' },
    register: { h: 'Create your account', s: 'Start capturing ideas in seconds.' },
    forgot: { h: 'Reset password', s: 'We’ll email you a link to set a new one.' },
  };
  const m = screens[mode];
  app.innerHTML = `
    <div class="auth">
      <div class="auth-card">
        <div class="auth-brand"><img src="/icons/icon-192.png" alt=""><b>Lumen</b></div>
        <h1>${m.h}</h1>
        <p class="sub">${m.s}</p>
        <div class="form-error hidden" id="err"></div>
        <form id="form">
          ${mode === 'register' ? field('name', 'Name', 'text', 'Your name') : ''}
          ${mode !== 'reset' ? field('email', 'Email', 'email', 'you@example.com') : ''}
          ${mode !== 'forgot' ? field('password', 'Password', 'password', '••••••••') : ''}
          ${mode === 'login' ? `<div class="forgot-row"><span class="link" data-go="forgot">Forgot password?</span></div>` : ''}
          <button class="btn btn-primary btn-block" type="submit">${
            mode === 'login' ? 'Sign in' : mode === 'register' ? 'Create account' : 'Send reset link'
          }</button>
        </form>
        <div class="auth-foot">
          ${
            mode === 'login'
              ? `New here? <span class="link" data-go="register">Create an account</span>`
              : `Have an account? <span class="link" data-go="login">Sign in</span>`
          }
        </div>
      </div>
    </div>`;

  app.querySelectorAll('[data-go]').forEach((el) => (el.onclick = () => renderAuth(el.dataset.go)));
  const form = app.querySelector('#form');
  form.onsubmit = (e) => { e.preventDefault(); submitAuth(mode, form); };
  hideSplash();
}

function field(name, label, type, ph) {
  return `<div class="field"><label>${label}</label><input name="${name}" type="${type}" placeholder="${ph}" autocomplete="${
    type === 'password' ? 'current-password' : type
  }" required></div>`;
}

function showErr(msg) {
  const e = app.querySelector('#err');
  if (!e) return;
  e.textContent = msg;
  e.classList.remove('hidden');
}

async function submitAuth(mode, form) {
  const btn = form.querySelector('button[type=submit]');
  const data = Object.fromEntries(new FormData(form));
  btn.disabled = true;
  try {
    if (mode === 'login') {
      const r = await api.login(data); auth.token = r.token; state.user = r.user;
    } else if (mode === 'register') {
      const r = await api.register(data); auth.token = r.token; state.user = r.user;
    } else if (mode === 'forgot') {
      await api.forgot(data.email);
      toast('If that email exists, a reset link is on its way.');
      btn.disabled = false;
      return renderAuth('login');
    }
    theme.apply(state.user.settings?.theme || 'system');
    state.view = state.user.settings?.defaultView || 'grid';
    await renderApp();
  } catch (err) {
    showErr(err.message);
    btn.disabled = false;
  }
}

function renderReset(token) {
  theme.apply('system');
  app.innerHTML = `
    <div class="auth"><div class="auth-card">
      <div class="auth-brand"><img src="/icons/icon-192.png" alt=""><b>Lumen</b></div>
      <h1>Set a new password</h1><p class="sub">Choose something you’ll remember.</p>
      <div class="form-error hidden" id="err"></div>
      <form id="form">
        ${field('password', 'New password', 'password', '••••••••')}
        <button class="btn btn-primary btn-block" type="submit">Save password</button>
      </form>
    </div></div>`;
  const form = app.querySelector('#form');
  form.onsubmit = async (e) => {
    e.preventDefault();
    const pw = new FormData(form).get('password');
    try {
      const r = await api.reset(token, pw);
      auth.token = r.token; state.user = r.user;
      history.replaceState({}, '', '/');
      await renderApp();
      toast('Password updated');
    } catch (err) { showErr(err.message); }
  };
  hideSplash();
}

async function renderPublic(token) {
  theme.apply('system');
  hideSplash();
  app.innerHTML = `<div class="public-wrap"><div class="public-load">Loading…</div></div>`;
  try {
    const { note } = await api.getShared(token);
    app.innerHTML = `
      <div class="public-wrap">
        <header class="public-top">
          <a class="public-brand" href="/"><img src="/icons/icon-192.png" alt=""><b>Lumen</b></a>
          <a class="btn btn-ghost" href="/">Open Lumen</a>
        </header>
        <article class="public-note" data-color="${note.color}">
          ${note.title ? `<h1>${escapeHtml(note.title)}</h1>` : ''}
          <div class="public-by">Shared by ${escapeHtml(note.ownerName)} · ${relTime(note.updatedAt)}</div>
          <div class="public-content">${note.content || '<p style="color:var(--ink-3)">This note is empty.</p>'}</div>
        </article>
        <footer class="public-foot">Made with <a href="/">Lumen</a> · by Aryan</footer>
      </div>`;
  } catch (e) {
    app.innerHTML = `
      <div class="public-wrap"><div class="empty" style="margin-top:80px">
        <div class="ill">${icons.globe}</div>
        <h3>Note unavailable</h3>
        <p>${escapeHtml(e.message || 'This link may have been turned off.')}</p>
        <a class="btn btn-primary" href="/">Go to Lumen</a>
      </div></div>`;
  }
}

async function verifyFlow(token) {
  theme.apply('system');
  try {
    await api.verify(token);
    toast('Email verified ✦');
  } catch { /* show below */ }
  history.replaceState({}, '', '/');
  boot();
}

/* ============================ app shell ============================ */
async function renderApp() {
  app.innerHTML = `
    <div class="app">
      <aside class="sidebar" id="sidebar"></aside>
      <main class="main">
        <header class="topbar">
          <button class="icon-btn menu-btn" id="menuBtn">${icons.menu}</button>
          <div class="search">${icons.search}<input id="search" placeholder="Search notes…" value="${escapeHtml(state.q)}"></div>
          <div class="spacer"></div>
          <button class="icon-btn" id="viewBtn" title="Toggle view"></button>
          <button class="icon-btn" id="themeBtn" title="Theme"></button>
        </header>
        <div class="content" id="content"></div>
      </main>
      <button class="fab" id="fab">${icons.plus}</button>
      <nav class="bottom-nav" id="bottomNav"></nav>
    </div>`;

  renderSidebar();
  renderBottomNav();
  updateViewBtn();
  updateThemeBtn();
  hideSplash();

  app.querySelector('#fab').onclick = newNote;
  app.querySelector('#menuBtn').onclick = () => app.querySelector('#sidebar').classList.toggle('open');
  app.querySelector('#viewBtn').onclick = toggleView;
  app.querySelector('#themeBtn').onclick = cycleTheme;

  let searchTimer;
  app.querySelector('#search').oninput = (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { state.q = e.target.value; loadNotes(); }, 250);
  };

  await Promise.all([loadMeta(), loadNotes()]);
}

function renderSidebar() {
  const c = state.meta.counts || {};
  const navMain = [
    ['notes', icons.note, 'All notes', c.notes],
    ['favorites', icons.star, 'Favorites', c.favorites],
    ['shared', icons.users, 'Shared with me', c.shared],
    ['archived', icons.archive, 'Archive', c.archived],
    ['trash', icons.trash, 'Trash', c.trash],
  ];
  const sb = app.querySelector('#sidebar');
  sb.innerHTML = `
    <div class="side-brand"><img src="/icons/icon-192.png" alt=""><b>Lumen</b></div>
    <button class="side-new" id="newBtn">${icons.plus} New note</button>
    ${navMain.map((n) => navItem(n[0], n[1], n[2], n[3])).join('')}
    ${state.meta.notebooks.length ? `<div class="side-label">Notebooks</div>${state.meta.notebooks.map(nbItem).join('')}` : ''}
    ${state.meta.tags.length ? `<div class="side-label">Tags</div>${state.meta.tags.map(tagItem).join('')}` : ''}
    <div class="side-foot">
      <button class="user-chip" id="userChip">
        <span class="avatar">${escapeHtml((state.user.name || '?')[0].toUpperCase())}</span>
        <span class="meta"><b>${escapeHtml(state.user.name)}</b><span>${escapeHtml(state.user.email)}</span></span>
      </button>
    </div>`;

  sb.querySelector('#newBtn').onclick = newNote;
  sb.querySelector('#userChip').onclick = openUserMenu;
  sb.querySelectorAll('[data-nav]').forEach((b) => (b.onclick = () => {
    state.filter = b.dataset.nav; state.notebook = null; state.tag = null;
    sb.classList.remove('open'); refresh();
  }));
  sb.querySelectorAll('[data-nb]').forEach((b) => (b.onclick = () => {
    state.notebook = b.dataset.nb; state.tag = null; state.filter = 'notes';
    sb.classList.remove('open'); refresh();
  }));
  sb.querySelectorAll('[data-tag]').forEach((b) => (b.onclick = () => {
    state.tag = b.dataset.tag; state.notebook = null; state.filter = 'notes';
    sb.classList.remove('open'); refresh();
  }));
}

function navItem(id, ic, label, count) {
  const active = state.filter === id && !state.notebook && !state.tag;
  return `<button class="nav-item ${active ? 'active' : ''}" data-nav="${id}">${ic}<span>${label}</span>${
    count ? `<span class="count">${count}</span>` : ''
  }</button>`;
}
function nbItem(nb) {
  return `<button class="nav-item ${state.notebook === nb ? 'active' : ''}" data-nb="${escapeHtml(nb)}">${icons.book}<span>${escapeHtml(nb)}</span></button>`;
}
function tagItem(t) {
  return `<button class="nav-item ${state.tag === t ? 'active' : ''}" data-tag="${escapeHtml(t)}">${icons.tag}<span>${escapeHtml(t)}</span></button>`;
}

function renderBottomNav() {
  const items = [
    ['notes', icons.note, 'Notes'],
    ['shared', icons.users, 'Shared'],
    ['archived', icons.archive, 'Archive'],
    ['trash', icons.trash, 'Trash'],
  ];
  const nav = app.querySelector('#bottomNav');
  nav.innerHTML = items
    .map((i) => `<button class="bn-item ${state.filter === i[0] && !state.notebook && !state.tag ? 'active' : ''}" data-nav="${i[0]}">${i[1]}<span>${i[2]}</span></button>`)
    .join('');
  nav.querySelectorAll('[data-nav]').forEach((b) => (b.onclick = () => {
    state.filter = b.dataset.nav; state.notebook = null; state.tag = null; refresh();
  }));
}

/* ============================ notes ============================ */
async function loadMeta() {
  try { state.meta = await api.meta(); renderSidebar(); renderBottomNav(); } catch {}
}

async function loadNotes() {
  const content = app.querySelector('#content');
  try {
    const { notes } = await api.listNotes({
      filter: state.filter, q: state.q, notebook: state.notebook, tag: state.tag, color: null, sort: state.sort,
    });
    state.notes = notes;
    renderContent();
  } catch (e) {
    content.innerHTML = `<div class="empty"><h3>Couldn’t load notes</h3><p>${escapeHtml(e.message)}</p></div>`;
  }
}

function headTitle() {
  if (state.notebook) return state.notebook;
  if (state.tag) return `#${state.tag}`;
  return { notes: 'All notes', favorites: 'Favorites', shared: 'Shared with me', archived: 'Archive', trash: 'Trash' }[state.filter];
}

function renderContent() {
  const content = app.querySelector('#content');
  const notes = state.notes;

  const verifyBanner =
    !state.user.isVerified && state.filter === 'notes' && !state.q
      ? `<div class="verify-banner">${icons.sparkle}<span>Verify your email to secure your account.</span><div class="spacer"></div><button id="resend">Resend link</button></div>`
      : '';

  const trashBar = state.filter === 'trash' && notes.length
    ? `<div class="trash-bar">${icons.trash}<span>Notes in trash are deleted permanently when you empty it.</span><div class="spacer"></div><button class="btn-danger" id="emptyTrash">Empty trash</button></div>`
    : '';

  content.innerHTML = `
    ${verifyBanner}
    <div class="content-head">
      <h2>${escapeHtml(headTitle())}</h2>
      <span class="pill">${notes.length}</span>
      <div class="spacer"></div>
      <select class="sort-select" id="sort">
        <option value="updated" ${state.sort === 'updated' ? 'selected' : ''}>Last edited</option>
        <option value="created" ${state.sort === 'created' ? 'selected' : ''}>Date created</option>
        <option value="title" ${state.sort === 'title' ? 'selected' : ''}>Title A–Z</option>
      </select>
    </div>
    ${trashBar}
    ${notes.length ? `<div class="notes-grid ${state.view === 'list' ? 'list-view' : ''}" id="grid"></div>` : emptyState()}`;

  content.querySelector('#sort').onchange = (e) => { state.sort = e.target.value; loadNotes(); };
  content.querySelector('#resend')?.addEventListener('click', async (e) => {
    e.target.disabled = true; await api.resendVerify(); toast('Verification email sent');
  });
  content.querySelector('#emptyTrash')?.addEventListener('click', emptyTrash);

  const grid = content.querySelector('#grid');
  if (grid) notes.forEach((n) => grid.appendChild(noteCard(n)));
}

function emptyState() {
  const msg = {
    notes: ['No notes yet', 'Tap “New note” and start writing. Everything you capture lives here.'],
    favorites: ['No favorites', 'Star a note to keep it close.'],
    shared: ['Nothing shared with you', 'When someone shares a Lumen note with your email, it shows up here.'],
    archived: ['Archive is empty', 'Archived notes are tucked away but never deleted.'],
    trash: ['Trash is empty', 'Deleted notes wait here until you empty the trash.'],
  }[state.notebook || state.tag ? 'notes' : state.filter];
  return `<div class="empty"><div class="ill">${icons.note}</div><h3>${msg[0]}</h3><p>${msg[1]}</p>
    ${state.filter === 'notes' && !state.q ? `<button class="btn btn-primary" onclick="document.getElementById('fab')?.click()">${icons.plus} New note</button>` : ''}</div>`;
}

function noteCard(n) {
  const el = document.createElement('div');
  el.className = 'note-card';
  el.dataset.color = n.color;
  const preview = (n.plainText || '').slice(0, 280);

  const shared = n.myRole && n.myRole !== 'owner';
  const peopleCount = (n.collaborators || []).length;
  let badge = '';
  if (shared) badge = `<span class="card-badge" title="Shared by ${escapeHtml(n.ownerName || '')}">${icons.users}${escapeHtml(n.ownerName || 'Shared')}</span>`;
  else if (n.shareEnabled || peopleCount) badge = `<span class="card-badge" title="You're sharing this">${n.shareEnabled ? icons.globe : icons.users}${peopleCount ? peopleCount + (peopleCount > 1 ? ' people' : ' person') : 'Link'}</span>`;

  el.innerHTML = `
    ${n.myRole === 'owner' || !n.myRole ? `<button class="note-pin ${n.pinned ? 'pinned' : ''}" title="Pin">${icons.pin}</button>` : ''}
    ${n.title ? `<div class="note-title">${escapeHtml(n.title)}</div>` : ''}
    ${preview ? `<div class="note-body">${escapeHtml(preview)}</div>` : (!n.title ? `<div class="note-body" style="color:var(--ink-3)">Empty note</div>` : '')}
    <div class="note-meta">
      ${badge}
      ${(n.tags || []).slice(0, 3).map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
      <span class="note-date">${relTime(n.updatedAt)}</span>
    </div>`;

  el.onclick = (e) => { if (!e.target.closest('.note-pin')) editNote(n); };
  const pinBtn = el.querySelector('.note-pin');
  if (pinBtn) pinBtn.onclick = async (e) => {
    e.stopPropagation();
    await api.updateNote(n._id, { pinned: !n.pinned });
    refresh();
  };
  return el;
}

/* ============================ note actions ============================ */
const shareApi = {
  link: (id) => api.shareLink(id),
  unlink: (id) => api.unshareLink(id),
  addUser: (id, e, r) => api.shareUser(id, e, r),
  removeUser: (id, u) => api.unshareUser(id, u),
};

function newNote() {
  app.querySelector('#sidebar')?.classList.remove('open');
  openEditor({
    note: { color: state.user.settings?.defaultColor || 'default' },
    onSave: saveNote,
    onMutate: mutateNote,
    onClose: refresh,
    share: shareApi,
  });
}

function editNote(n) {
  openEditor({ note: n, onSave: saveNote, onMutate: mutateNote, onClose: refresh, share: shareApi });
}

async function saveNote(id, data) {
  if (id) { const { note } = await api.updateNote(id, data); return note; }
  const { note } = await api.createNote(data);
  return note;
}

async function mutateNote(action, id, payload) {
  if (action === 'flag') await api.updateNote(id, payload);
  else if (action === 'trash') {
    await api.updateNote(id, { trashed: true });
    toast('Moved to trash', { label: 'Undo', fn: async () => { await api.updateNote(id, { trashed: false }); refresh(); } });
  } else if (action === 'restore') { await api.updateNote(id, { trashed: false }); toast('Note restored'); }
  else if (action === 'purge') { await api.deleteNote(id); toast('Deleted forever'); }
  refresh();
}

async function emptyTrash() {
  if (!confirm('Permanently delete all notes in trash? This can’t be undone.')) return;
  await api.emptyTrash();
  toast('Trash emptied');
  refresh();
}

async function refresh() { await Promise.all([loadMeta(), loadNotes()]); }

/* ============================ view / theme ============================ */
function updateViewBtn() {
  app.querySelector('#viewBtn').innerHTML = state.view === 'grid' ? icons.list : icons.grid;
}
function toggleView() {
  state.view = state.view === 'grid' ? 'list' : 'grid';
  updateViewBtn();
  app.querySelector('#grid')?.classList.toggle('list-view', state.view === 'list');
  api.saveSettings({ defaultView: state.view }).catch(() => {});
}
function updateThemeBtn() {
  const dark = document.documentElement.dataset.theme === 'dark';
  app.querySelector('#themeBtn').innerHTML = dark ? icons.sun : icons.moon;
}
function cycleTheme() {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  theme.apply(next);
  updateThemeBtn();
  if (state.user) { state.user.settings.theme = next; api.saveSettings({ theme: next }).catch(() => {}); }
}

/* ============================ user menu + about ============================ */
function openUserMenu() {
  const chip = app.querySelector('#userChip').getBoundingClientRect();
  const m = document.createElement('div');
  m.className = 'menu';
  m.style.left = `${chip.left}px`;
  m.style.bottom = `${window.innerHeight - chip.top + 8}px`;
  m.innerHTML = `
    <button data-m="account">${icons.eye}<span>Account & settings</span></button>
    <button data-m="about">${icons.sparkle}<span>About Lumen</span></button>
    <div class="sep"></div>
    <button data-m="logout" class="danger">${icons.logout}<span>Sign out</span></button>`;
  const bd = document.createElement('div');
  bd.className = 'sheet-backdrop'; bd.style.background = 'transparent';
  bd.onclick = () => { m.remove(); bd.remove(); };
  document.body.append(bd, m);
  m.querySelectorAll('[data-m]').forEach((b) => (b.onclick = () => {
    m.remove(); bd.remove();
    if (b.dataset.m === 'account') openAccount();
    if (b.dataset.m === 'about') openAbout();
    if (b.dataset.m === 'logout') { auth.token = null; location.href = '/'; }
  }));
}

function openAccount() {
  const u = state.user;
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.innerHTML = `
    <div class="share-panel">
      <div class="share-head"><b>Account &amp; settings</b><button class="icon-btn" data-x>${icons.x}</button></div>
      <div class="share-body">
        <div class="share-sec">
          <div class="acct-id">
            <span class="avatar">${escapeHtml((u.name || '?')[0].toUpperCase())}</span>
            <div><b>${escapeHtml(u.name)}</b><span>${escapeHtml(u.email)}</span></div>
            <span class="verify-pill ${u.isVerified ? 'on' : ''}">${u.isVerified ? 'Verified' : 'Unverified'}</span>
          </div>
          ${u.isVerified ? '' : `<button class="btn btn-ghost btn-block" id="resendV" style="margin-top:12px">Resend verification email</button>`}
        </div>

        <div class="share-sec">
          <div class="share-sec-head">${icons.sun}<div><b>Appearance</b><span>Theme and default layout</span></div></div>
          <div class="seg" id="themeSeg">
            ${['light', 'dark', 'system'].map((t) => `<button data-theme-opt="${t}" class="${(u.settings?.theme || 'system') === t ? 'on' : ''}">${t[0].toUpperCase() + t.slice(1)}</button>`).join('')}
          </div>
          <div class="seg" id="viewSeg" style="margin-top:8px">
            ${['grid', 'list'].map((v) => `<button data-view-opt="${v}" class="${(u.settings?.defaultView || 'grid') === v ? 'on' : ''}">${v[0].toUpperCase() + v.slice(1)}</button>`).join('')}
          </div>
        </div>

        <div class="share-sec">
          <div class="share-sec-head">${icons.eye}<div><b>Change password</b><span>Use at least 8 characters</span></div></div>
          <div class="pw-msg hidden" data-pwmsg></div>
          <div class="field"><input type="password" placeholder="Current password" data-cur autocomplete="current-password"></div>
          <div class="field"><input type="password" placeholder="New password" data-new autocomplete="new-password"></div>
          <div class="field"><input type="password" placeholder="Confirm new password" data-conf autocomplete="new-password"></div>
          <button class="btn btn-primary btn-block" data-savepw>Update password</button>
        </div>
      </div>
    </div>`;
  overlay.addEventListener('mousedown', (e) => { if (e.target === overlay) overlay.remove(); });
  overlay.querySelector('[data-x]').onclick = () => overlay.remove();
  document.body.appendChild(overlay);

  overlay.querySelector('#resendV')?.addEventListener('click', async (e) => {
    e.target.disabled = true; await api.resendVerify(); toast('Verification email sent');
  });

  // appearance
  overlay.querySelectorAll('[data-theme-opt]').forEach((b) => (b.onclick = () => {
    const t = b.dataset.themeOpt;
    theme.apply(t); updateThemeBtn();
    state.user.settings.theme = t;
    overlay.querySelectorAll('[data-theme-opt]').forEach((x) => x.classList.toggle('on', x === b));
    api.saveSettings({ theme: t }).catch(() => {});
  }));
  overlay.querySelectorAll('[data-view-opt]').forEach((b) => (b.onclick = () => {
    const v = b.dataset.viewOpt;
    state.view = v; state.user.settings.defaultView = v; updateViewBtn();
    app.querySelector('#grid')?.classList.toggle('list-view', v === 'list');
    overlay.querySelectorAll('[data-view-opt]').forEach((x) => x.classList.toggle('on', x === b));
    api.saveSettings({ defaultView: v }).catch(() => {});
  }));

  // change password
  const pwMsg = (msg, ok) => {
    const e = overlay.querySelector('[data-pwmsg]');
    e.textContent = msg; e.className = 'pw-msg ' + (ok ? 'ok' : 'err'); e.classList.toggle('hidden', !msg);
  };
  overlay.querySelector('[data-savepw]').addEventListener('click', async (e) => {
    const cur = overlay.querySelector('[data-cur]').value;
    const nw = overlay.querySelector('[data-new]').value;
    const conf = overlay.querySelector('[data-conf]').value;
    if (nw.length < 8) return pwMsg('New password must be at least 8 characters.');
    if (nw !== conf) return pwMsg('New passwords don’t match.');
    e.target.disabled = true; pwMsg('');
    try {
      await api.changePassword(cur, nw);
      pwMsg('Password updated.', true);
      overlay.querySelector('[data-cur]').value = '';
      overlay.querySelector('[data-new]').value = '';
      overlay.querySelector('[data-conf]').value = '';
    } catch (x) { pwMsg(x.message); }
    e.target.disabled = false;
  });
}

function openAbout() {
  const c = CREATOR;
  const line = (label, val, href) =>
    val ? `<div style="display:flex;justify-content:space-between;gap:16px;padding:9px 0;border-bottom:1px solid var(--border);font-size:14px"><span style="color:var(--ink-3)">${label}</span>${
      href ? `<a class="link" href="${href}" target="_blank" rel="noopener">${escapeHtml(val)}</a>` : `<span style="font-weight:600">${escapeHtml(val)}</span>`
    }</div>` : '';
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.innerHTML = `
    <div class="editor" style="max-width:440px">
      <div class="editor-top"><div class="spacer"></div><button class="icon-btn" id="aboutClose">${icons.x}</button></div>
      <div class="editor-scroll" style="text-align:center;padding-bottom:28px">
        <img src="/icons/icon-512.png" alt="" style="width:76px;height:76px;border-radius:20px;box-shadow:var(--shadow-md);margin:6px auto 14px;display:block">
        <h1 style="font-size:24px;font-weight:800;letter-spacing:-.02em">Lumen</h1>
        <p style="color:var(--ink-2);font-size:14px;margin:4px 0 22px">A fast, colourful home for every note.</p>
        <div style="text-align:left;background:var(--surface-2);border-radius:14px;padding:6px 16px;margin-bottom:18px">
          ${line('Created by', c.name)}
          ${line('Role', c.role)}
          ${line('About', c.tagline)}
          ${line('Location', c.location)}
          ${line('Email', c.email && c.email !== 'you@example.com' ? c.email : '', c.email && c.email !== 'you@example.com' ? `mailto:${c.email}` : '')}
          ${line('Website', c.website, c.website)}
        </div>
        <p style="font-size:12.5px;color:var(--ink-3)">Lumen · © ${c.year} ${escapeHtml(c.name)} · Made with care</p>
      </div>
    </div>`;
  overlay.addEventListener('mousedown', (e) => { if (e.target === overlay) overlay.remove(); });
  overlay.querySelector('#aboutClose').onclick = () => overlay.remove();
  document.body.appendChild(overlay);
}

/* ============================ start ============================ */
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (!state.user || state.user.settings?.theme === 'system') { theme.apply('system'); updateThemeBtn?.(); }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}

boot();

/* ============================================================
   Lumen — design system
   ============================================================ */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap');

:root {
  /* brand */
  --violet: #6c5ce7;
  --violet-600: #5a4bd4;
  --violet-soft: #efecff;

  /* light theme canvas */
  --bg: #fafafb;
  --surface: #ffffff;
  --surface-2: #f4f4f7;
  --border: #ececf1;
  --border-strong: #dcdce4;
  --ink: #1a1a2e;
  --ink-2: #51516b;
  --ink-3: #9a9ab0;

  --shadow-sm: 0 1px 2px rgba(26, 26, 46, .06), 0 1px 3px rgba(26, 26, 46, .04);
  --shadow-md: 0 4px 14px rgba(26, 26, 46, .08), 0 2px 6px rgba(26, 26, 46, .05);
  --shadow-lg: 0 16px 48px rgba(26, 26, 46, .16);

  --radius: 16px;
  --radius-sm: 10px;
  --radius-lg: 22px;

  --font: 'Plus Jakarta Sans', system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  --mono: 'JetBrains Mono', ui-monospace, monospace;

  --sidebar-w: 264px;
  --ease: cubic-bezier(.2, .8, .2, 1);

  /* note colours (light) */
  --n-default-bg: #ffffff;   --n-default-bar: #dcdce4;
  --n-yellow-bg:  #fff6d6;   --n-yellow-bar:  #f4c430;
  --n-coral-bg:   #ffe2e5;   --n-coral-bar:   #ff7a8a;
  --n-mint-bg:    #d8f5ee;   --n-mint-bar:    #22c7a9;
  --n-sky-bg:     #ddebff;   --n-sky-bar:     #4d96ff;
  --n-lavender-bg:#eae4ff;   --n-lavender-bar:#8b7bf0;
  --n-peach-bg:   #ffe6d2;   --n-peach-bar:   #ff9f66;
  --n-rose-bg:    #ffe0f0;   --n-rose-bar:    #ff6bb5;
  --n-sage-bg:    #e4f0dc;   --n-sage-bar:    #8fb96b;
}

[data-theme='dark'] {
  --bg: #111118;
  --surface: #1a1a24;
  --surface-2: #22222e;
  --border: #2a2a38;
  --border-strong: #383848;
  --ink: #f0f0f5;
  --ink-2: #b4b4c6;
  --ink-3: #74748a;
  --violet-soft: #2a2546;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, .3);
  --shadow-md: 0 6px 18px rgba(0, 0, 0, .4);
  --shadow-lg: 0 20px 56px rgba(0, 0, 0, .55);

  --n-default-bg: #1f1f2b;   --n-default-bar: #3a3a4c;
  --n-yellow-bg:  #3a3413;   --n-yellow-bar:  #e0b020;
  --n-coral-bg:   #3a2024;   --n-coral-bar:   #ff7a8a;
  --n-mint-bg:    #103530;   --n-mint-bar:    #22c7a9;
  --n-sky-bg:     #122842;   --n-sky-bar:     #4d96ff;
  --n-lavender-bg:#241f3e;   --n-lavender-bar:#8b7bf0;
  --n-peach-bg:   #3a261a;   --n-peach-bar:   #ff9f66;
  --n-rose-bg:    #3a1c30;   --n-rose-bar:    #ff6bb5;
  --n-sage-bg:    #20301a;   --n-sage-bar:    #8fb96b;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; }

/* ============================================================
   Launch splash
   ============================================================ */
.splash {
  position: fixed; inset: 0; z-index: 200; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 26px;
  background:
    radial-gradient(700px 420px at 50% 38%, rgba(108,92,231,.16), transparent 60%),
    #fafafb;
  transition: opacity .45s ease, visibility .45s ease;
}
.splash.gone { opacity: 0; visibility: hidden; }
.splash-mark { display: flex; flex-direction: column; align-items: center; gap: 14px; animation: splashIn .6s cubic-bezier(.2,.8,.2,1) both; }
.splash-mark img { width: 76px; height: 76px; border-radius: 20px; box-shadow: 0 16px 40px rgba(108,92,231,.28); }
.splash-mark b { font-size: 26px; font-weight: 800; letter-spacing: -.02em; color: #1a1a2e; }
.splash-dots { display: flex; gap: 7px; }
.splash-dots i { width: 8px; height: 8px; border-radius: 50%; background: #6c5ce7; opacity: .35; animation: splashDot 1s infinite ease-in-out; }
.splash-dots i:nth-child(2) { animation-delay: .15s; }
.splash-dots i:nth-child(3) { animation-delay: .3s; }
@keyframes splashIn { from { opacity: 0; transform: translateY(10px) scale(.96); } }
@keyframes splashDot { 0%,100% { opacity: .3; transform: translateY(0); } 50% { opacity: 1; transform: translateY(-5px); } }
@media (prefers-color-scheme: dark) {
  .splash { background: radial-gradient(700px 420px at 50% 38%, rgba(108,92,231,.20), transparent 60%), #111118; }
  .splash-mark b { color: #f0f0f5; }
}
body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
  line-height: 1.5;
  overscroll-behavior: none;
}
button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }
input, textarea { font-family: inherit; }
::selection { background: var(--violet); color: #fff; }
.hidden { display: none !important; }
/* Safety net: any inline icon defaults to a sane size; specific rules override. */
svg { width: 20px; height: 20px; flex-shrink: 0; }

/* scrollbars */
::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 8px; border: 2px solid var(--bg); }
::-webkit-scrollbar-thumb:hover { background: var(--ink-3); }

/* ============================================================
   Buttons
   ============================================================ */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  height: 44px; padding: 0 18px; border-radius: var(--radius-sm);
  font-weight: 600; font-size: 14.5px; transition: all .16s var(--ease);
  white-space: nowrap;
}
.btn svg { width: 18px; height: 18px; }
.btn-primary { background: var(--violet); color: #fff; box-shadow: var(--shadow-sm); }
.btn-primary:hover { background: var(--violet-600); transform: translateY(-1px); box-shadow: var(--shadow-md); }
.btn-primary:active { transform: translateY(0); }
.btn-ghost { background: var(--surface-2); color: var(--ink); }
.btn-ghost:hover { background: var(--border); }
.btn-block { width: 100%; }
.btn:disabled { opacity: .55; cursor: not-allowed; transform: none; }

.icon-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 40px; height: 40px; border-radius: 12px; color: var(--ink-2);
  transition: all .14s var(--ease);
}
.icon-btn svg { width: 20px; height: 20px; }
.icon-btn:hover { background: var(--surface-2); color: var(--ink); }
.icon-btn.active { background: var(--violet-soft); color: var(--violet); }

/* ============================================================
   Auth screens
   ============================================================ */
.auth {
  min-height: 100dvh; display: grid; place-items: center; padding: 24px;
  background:
    radial-gradient(900px 500px at 12% -10%, rgba(108,92,231,.14), transparent 60%),
    radial-gradient(800px 500px at 110% 10%, rgba(255,122,138,.12), transparent 55%),
    radial-gradient(700px 600px at 50% 120%, rgba(34,199,169,.12), transparent 55%),
    var(--bg);
}
.auth-card {
  width: 100%; max-width: 410px; background: var(--surface);
  border: 1px solid var(--border); border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg); padding: 36px 32px;
}
.auth-brand { display: flex; align-items: center; gap: 11px; margin-bottom: 26px; }
.auth-brand img { width: 40px; height: 40px; border-radius: 11px; box-shadow: var(--shadow-sm); }
.auth-brand b { font-size: 22px; font-weight: 800; letter-spacing: -.02em; }
.auth-card h1 { font-size: 23px; font-weight: 800; letter-spacing: -.02em; margin-bottom: 6px; }
.auth-card .sub { color: var(--ink-2); font-size: 14.5px; margin-bottom: 24px; }

.field { margin-bottom: 15px; }
.field label { display: block; font-size: 13px; font-weight: 600; color: var(--ink-2); margin-bottom: 7px; }
.field input {
  width: 100%; height: 46px; padding: 0 14px; border-radius: var(--radius-sm);
  border: 1.5px solid var(--border-strong); background: var(--surface);
  color: var(--ink); font-size: 15px; transition: border-color .14s, box-shadow .14s;
}
.field input:focus { outline: none; border-color: var(--violet); box-shadow: 0 0 0 4px var(--violet-soft); }
.auth-foot { margin-top: 20px; text-align: center; font-size: 14px; color: var(--ink-2); }
.link { color: var(--violet); font-weight: 600; cursor: pointer; }
.link:hover { text-decoration: underline; }
.form-error {
  background: #ffeef0; color: #c0344a; border: 1px solid #ffd5da;
  padding: 10px 13px; border-radius: var(--radius-sm); font-size: 13.5px; margin-bottom: 15px;
}
[data-theme='dark'] .form-error { background: #3a1c24; color: #ff8fa3; border-color: #5a2630; }
.forgot-row { display: flex; justify-content: flex-end; margin: -6px 0 16px; }

/* ============================================================
   App shell
   ============================================================ */
.app { display: grid; grid-template-columns: var(--sidebar-w) 1fr; height: 100dvh; }

.sidebar {
  background: var(--surface); border-right: 1px solid var(--border);
  display: flex; flex-direction: column; padding: 18px 14px; gap: 4px; overflow-y: auto;
}
.side-brand { display: flex; align-items: center; gap: 10px; padding: 4px 8px 16px; }
.side-brand img { width: 32px; height: 32px; border-radius: 9px; }
.side-brand b { font-size: 19px; font-weight: 800; letter-spacing: -.02em; }
.side-new {
  display: flex; align-items: center; gap: 9px; width: 100%; height: 46px;
  background: var(--violet); color: #fff; border-radius: var(--radius-sm);
  font-weight: 700; font-size: 14.5px; padding: 0 16px; margin-bottom: 12px;
  box-shadow: var(--shadow-sm); transition: all .16s var(--ease);
}
.side-new:hover { background: var(--violet-600); box-shadow: var(--shadow-md); }
.side-new svg { width: 19px; height: 19px; }

.side-label {
  font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em;
  color: var(--ink-3); padding: 14px 12px 6px;
}
.nav-item {
  display: flex; align-items: center; gap: 11px; width: 100%; height: 42px;
  padding: 0 12px; border-radius: var(--radius-sm); color: var(--ink-2);
  font-size: 14.5px; font-weight: 600; transition: all .13s var(--ease); text-align: left;
}
.nav-item svg { width: 19px; height: 19px; flex-shrink: 0; }
.nav-item .count { margin-left: auto; font-size: 12.5px; font-weight: 600; color: var(--ink-3); }
.nav-item:hover { background: var(--surface-2); color: var(--ink); }
.nav-item.active { background: var(--violet-soft); color: var(--violet); }
.nav-item.active .count { color: var(--violet); }
.nav-item .dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
.nav-sub { padding-left: 4px; }

.side-foot { margin-top: auto; padding-top: 12px; border-top: 1px solid var(--border); }
.user-chip {
  display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 10px;
  border-radius: var(--radius-sm); transition: background .13s;
}
.user-chip:hover { background: var(--surface-2); }
.avatar {
  width: 34px; height: 34px; border-radius: 50%; background: var(--violet);
  color: #fff; display: grid; place-items: center; font-weight: 700; font-size: 14px; flex-shrink: 0;
}
.user-chip .meta { text-align: left; overflow: hidden; }
.user-chip .meta b { font-size: 13.5px; display: block; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
.user-chip .meta span { font-size: 11.5px; color: var(--ink-3); white-space: nowrap; text-overflow: ellipsis; overflow: hidden; display: block; }

/* ============================================================
   Main column
   ============================================================ */
.main { display: flex; flex-direction: column; overflow: hidden; }
.topbar {
  display: flex; align-items: center; gap: 12px; padding: 16px 28px;
  border-bottom: 1px solid var(--border); background: var(--surface);
}
.topbar .menu-btn { display: none; }
.search {
  flex: 1; max-width: 560px; position: relative; display: flex; align-items: center;
}
.search svg { position: absolute; left: 14px; width: 18px; height: 18px; color: var(--ink-3); pointer-events: none; }
.search input {
  width: 100%; height: 44px; padding: 0 14px 0 42px; border-radius: 12px;
  border: 1.5px solid var(--border); background: var(--surface-2);
  color: var(--ink); font-size: 14.5px; transition: all .14s;
}
.search input:focus { outline: none; border-color: var(--violet); background: var(--surface); box-shadow: 0 0 0 4px var(--violet-soft); }
.topbar .spacer { flex: 1; }

.content { flex: 1; overflow-y: auto; padding: 26px 28px 110px; }
.content-head { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.content-head h2 { font-size: 24px; font-weight: 800; letter-spacing: -.02em; }
.content-head .pill { font-size: 13px; font-weight: 600; color: var(--ink-3); background: var(--surface-2); padding: 4px 11px; border-radius: 100px; }
.content-head .spacer { flex: 1; }
.sort-select {
  height: 38px; padding: 0 12px; border-radius: 10px; border: 1.5px solid var(--border);
  background: var(--surface); color: var(--ink-2); font-size: 13.5px; font-weight: 600;
}

/* trash banner */
.trash-bar {
  display: flex; align-items: center; gap: 12px; background: var(--surface-2);
  border: 1px solid var(--border); border-radius: var(--radius-sm);
  padding: 12px 16px; margin-bottom: 18px; font-size: 13.5px; color: var(--ink-2);
}
.trash-bar .spacer { flex: 1; }
.trash-bar svg { width: 18px; height: 18px; flex-shrink: 0; }
.btn-danger { background: #ffe9ec; color: #c0344a; height: 36px; padding: 0 14px; border-radius: 9px; font-weight: 600; font-size: 13px; }
.btn-danger:hover { background: #ffd9de; }
[data-theme='dark'] .btn-danger { background: #3a1c24; color: #ff8fa3; }

/* ============================================================
   Notes grid + cards
   ============================================================ */
.notes-grid { columns: 4 230px; column-gap: 16px; }
.notes-grid.list-view { columns: 1; max-width: 760px; }

.note-card {
  break-inside: avoid; margin-bottom: 16px; position: relative;
  background: var(--n-default-bg); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 16px 16px 14px 18px; overflow: hidden;
  box-shadow: var(--shadow-sm); transition: transform .15s var(--ease), box-shadow .15s var(--ease);
}
.note-card::before {
  content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 5px; background: var(--n-default-bar);
}
.note-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.note-card[data-color='yellow']  { background: var(--n-yellow-bg); }  .note-card[data-color='yellow']::before  { background: var(--n-yellow-bar); }
.note-card[data-color='coral']   { background: var(--n-coral-bg); }   .note-card[data-color='coral']::before   { background: var(--n-coral-bar); }
.note-card[data-color='mint']    { background: var(--n-mint-bg); }    .note-card[data-color='mint']::before    { background: var(--n-mint-bar); }
.note-card[data-color='sky']     { background: var(--n-sky-bg); }     .note-card[data-color='sky']::before     { background: var(--n-sky-bar); }
.note-card[data-color='lavender']{ background: var(--n-lavender-bg); }.note-card[data-color='lavender']::before{ background: var(--n-lavender-bar); }
.note-card[data-color='peach']   { background: var(--n-peach-bg); }   .note-card[data-color='peach']::before   { background: var(--n-peach-bar); }
.note-card[data-color='rose']    { background: var(--n-rose-bg); }    .note-card[data-color='rose']::before    { background: var(--n-rose-bar); }
.note-card[data-color='sage']    { background: var(--n-sage-bg); }    .note-card[data-color='sage']::before    { background: var(--n-sage-bar); }

.note-pin {
  position: absolute; top: 10px; right: 10px; width: 30px; height: 30px;
  border-radius: 9px; display: grid; place-items: center; color: var(--ink-3);
  opacity: 0; transition: all .14s; background: rgba(255,255,255,.5);
}
[data-theme='dark'] .note-pin { background: rgba(0,0,0,.25); }
.note-card:hover .note-pin { opacity: 1; }
.note-pin svg { width: 16px; height: 16px; }
.note-pin.pinned { opacity: 1; color: var(--violet); }

.note-title { font-size: 15.5px; font-weight: 700; letter-spacing: -.01em; margin-bottom: 6px; padding-right: 26px; word-break: break-word; }
.note-body { font-size: 13.5px; color: var(--ink-2); line-height: 1.55; word-break: break-word; max-height: 220px; overflow: hidden; }
.note-body :where(h1,h2,h3) { font-size: 14px; margin: 4px 0; }
.note-body ul, .note-body ol { padding-left: 18px; }
.note-body p { margin: 2px 0; }
.note-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; margin-top: 11px; }
.tag {
  font-size: 11px; font-weight: 600; color: var(--ink-2);
  background: rgba(0,0,0,.05); padding: 2px 9px; border-radius: 100px;
}
[data-theme='dark'] .tag { background: rgba(255,255,255,.08); }
.note-date { font-size: 11px; color: var(--ink-3); margin-left: auto; }

/* ============================================================
   Empty state
   ============================================================ */
.empty { text-align: center; padding: 80px 24px; color: var(--ink-3); }
.empty .ill { width: 84px; height: 84px; margin: 0 auto 18px; opacity: .9; }
.empty .ill svg { width: 100%; height: 100%; stroke-width: 1.5; }
.empty h3 { font-size: 18px; font-weight: 700; color: var(--ink-2); margin-bottom: 6px; }
.empty p { font-size: 14px; max-width: 320px; margin: 0 auto 18px; }

/* ============================================================
   Editor modal
   ============================================================ */
.overlay {
  position: fixed; inset: 0; background: rgba(20, 20, 35, .42);
  backdrop-filter: blur(3px); display: grid; place-items: center;
  padding: 24px; z-index: 60; animation: fade .15s var(--ease);
}
@keyframes fade { from { opacity: 0; } }
.editor {
  width: 100%; max-width: 680px; max-height: 88dvh; display: flex; flex-direction: column;
  background: var(--n-default-bg); border: 1px solid var(--border);
  border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); overflow: hidden;
  animation: rise .2s var(--ease);
}
@keyframes rise { from { transform: translateY(16px) scale(.99); opacity: 0; } }
.editor[data-color='yellow']  { background: var(--n-yellow-bg); }
.editor[data-color='coral']   { background: var(--n-coral-bg); }
.editor[data-color='mint']    { background: var(--n-mint-bg); }
.editor[data-color='sky']     { background: var(--n-sky-bg); }
.editor[data-color='lavender']{ background: var(--n-lavender-bg); }
.editor[data-color='peach']   { background: var(--n-peach-bg); }
.editor[data-color='rose']    { background: var(--n-rose-bg); }
.editor[data-color='sage']    { background: var(--n-sage-bg); }

.editor-top { display: flex; align-items: center; gap: 6px; padding: 12px 14px; border-bottom: 1px solid var(--border); }
.editor-top .icon-btn:hover { background: rgba(0,0,0,.06); }
[data-theme='dark'] .editor-top .icon-btn:hover { background: rgba(255,255,255,.08); }
.editor-top .spacer { flex: 1; }
.save-hint { font-size: 12px; color: var(--ink-3); font-weight: 600; margin-right: 4px; }

.editor-scroll { overflow-y: auto; padding: 20px 26px; }
.editor-title {
  width: 100%; border: none; background: transparent; color: var(--ink);
  font-size: 22px; font-weight: 800; letter-spacing: -.02em; margin-bottom: 10px; resize: none;
}
.editor-title:focus { outline: none; }
.editor-title::placeholder { color: var(--ink-3); }

.toolbar {
  display: flex; flex-wrap: wrap; gap: 2px; padding: 6px 0 12px; margin-bottom: 8px;
  border-bottom: 1px solid var(--border); position: sticky; top: 0;
}
.tool {
  width: 34px; height: 34px; border-radius: 8px; display: grid; place-items: center;
  color: var(--ink-2); transition: all .12s;
}
.tool svg { width: 17px; height: 17px; }
.tool:hover { background: rgba(0,0,0,.06); color: var(--ink); }
[data-theme='dark'] .tool:hover { background: rgba(255,255,255,.08); }
.tool.active { background: var(--violet-soft); color: var(--violet); }
.tool-sep { width: 1px; background: var(--border); margin: 6px 4px; }

.editor-content {
  min-height: 180px; font-size: 15px; line-height: 1.7; color: var(--ink); outline: none;
}
.editor-content:empty::before { content: attr(data-placeholder); color: var(--ink-3); }
.editor-content h1 { font-size: 24px; margin: 12px 0 6px; }
.editor-content h2 { font-size: 19px; margin: 10px 0 6px; }
.editor-content ul, .editor-content ol { padding-left: 24px; margin: 6px 0; }
.editor-content blockquote { border-left: 3px solid var(--violet); padding-left: 14px; color: var(--ink-2); margin: 8px 0; }
.editor-content a { color: var(--violet); }
.editor-content ul[data-type='check'] { list-style: none; padding-left: 4px; }
.editor-content ul[data-type='check'] li { display: flex; gap: 8px; align-items: flex-start; }

.editor-bottom {
  display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
  padding: 12px 18px; border-top: 1px solid var(--border);
}
.swatches { display: flex; gap: 7px; }
.swatch { width: 24px; height: 24px; border-radius: 50%; border: 2px solid rgba(0,0,0,.08); transition: transform .12s; }
.swatch:hover { transform: scale(1.12); }
.swatch.active { box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--violet); }
.sw-default{background:#fff;border-color:#dcdce4} .sw-yellow{background:#f4c430} .sw-coral{background:#ff7a8a}
.sw-mint{background:#22c7a9} .sw-sky{background:#4d96ff} .sw-lavender{background:#8b7bf0}
.sw-peach{background:#ff9f66} .sw-rose{background:#ff6bb5} .sw-sage{background:#8fb96b}

.tag-input {
  height: 34px; border: 1.5px solid var(--border); background: var(--surface);
  border-radius: 8px; padding: 0 10px; font-size: 13px; color: var(--ink); min-width: 130px; flex: 1;
}
.tag-input:focus { outline: none; border-color: var(--violet); }
.editor-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.editor-tags .tag { display: inline-flex; align-items: center; gap: 5px; cursor: default; }
.editor-tags .tag b { cursor: pointer; color: var(--ink-3); font-weight: 700; }
.editor-tags .tag b:hover { color: #c0344a; }

/* ============================================================
   FAB (mobile)
   ============================================================ */
.fab {
  position: fixed; right: 20px; bottom: 86px; width: 58px; height: 58px;
  border-radius: 50%; background: var(--violet); color: #fff;
  display: none; place-items: center; box-shadow: var(--shadow-lg); z-index: 40;
}
.fab svg { width: 26px; height: 26px; }

/* ============================================================
   Bottom nav (mobile)
   ============================================================ */
.bottom-nav {
  display: none; position: fixed; left: 0; right: 0; bottom: 0; height: 64px;
  background: var(--surface); border-top: 1px solid var(--border);
  z-index: 45; padding: 0 8px;
  grid-template-columns: repeat(4, 1fr); align-items: center;
}
.bn-item { display: flex; flex-direction: column; align-items: center; gap: 3px; color: var(--ink-3); font-size: 10.5px; font-weight: 600; height: 100%; justify-content: center; }
.bn-item svg { width: 22px; height: 22px; }
.bn-item.active { color: var(--violet); }

/* ============================================================
   Toasts + sheets
   ============================================================ */
.toasts { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 90; display: flex; flex-direction: column; gap: 8px; align-items: center; }
.toast {
  background: var(--ink); color: #fff; padding: 11px 18px; border-radius: 100px;
  font-size: 13.5px; font-weight: 600; box-shadow: var(--shadow-lg); display: flex; align-items: center; gap: 12px;
  animation: rise .2s var(--ease);
}
.toast .undo { color: #b9adff; font-weight: 700; cursor: pointer; }

.sheet-backdrop { position: fixed; inset: 0; background: rgba(20,20,35,.42); z-index: 70; animation: fade .15s; }
.menu {
  position: fixed; z-index: 75; background: var(--surface); border: 1px solid var(--border);
  border-radius: 14px; box-shadow: var(--shadow-lg); padding: 6px; min-width: 190px; animation: rise .15s var(--ease);
}
.menu button {
  display: flex; align-items: center; gap: 11px; width: 100%; height: 40px; padding: 0 12px;
  border-radius: 9px; font-size: 14px; font-weight: 600; color: var(--ink-2); text-align: left;
}
.menu button svg { width: 18px; height: 18px; }
.menu button:hover { background: var(--surface-2); color: var(--ink); }
.menu button.danger:hover { background: #ffe9ec; color: #c0344a; }
[data-theme='dark'] .menu button.danger:hover { background: #3a1c24; color: #ff8fa3; }
.menu .sep { height: 1px; background: var(--border); margin: 5px 8px; }

.verify-banner {
  display: flex; align-items: center; gap: 12px; background: var(--violet-soft);
  color: var(--violet); padding: 11px 16px; border-radius: var(--radius-sm);
  font-size: 13.5px; font-weight: 600; margin-bottom: 18px;
}
.verify-banner svg { width: 18px; height: 18px; flex-shrink: 0; }
.verify-banner .spacer { flex: 1; }
.verify-banner button { color: var(--violet); font-weight: 700; text-decoration: underline; }

/* ============================================================
   Responsive
   ============================================================ */
@media (max-width: 880px) {
  .app { grid-template-columns: 1fr; }
  .sidebar {
    position: fixed; left: 0; top: 0; bottom: 0; width: 280px; z-index: 80;
    transform: translateX(-100%); transition: transform .25s var(--ease); box-shadow: var(--shadow-lg);
  }
  .sidebar.open { transform: translateX(0); }
  .topbar { padding: 14px 16px; }
  .topbar .menu-btn { display: inline-flex; }
  .content { padding: 18px 16px 96px; }
  .notes-grid { columns: 2 150px; column-gap: 12px; }
  .fab { display: grid; }
  .bottom-nav { display: grid; }
  .content-head h2 { font-size: 21px; }
}
@media (max-width: 520px) {
  .notes-grid { columns: 2 140px; }
  .editor-bottom { gap: 10px; }
}
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}

/* ============================================================
   Sharing
   ============================================================ */
.role-badge {
  display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 600;
  color: var(--ink-2); background: var(--surface-2); padding: 5px 11px; border-radius: 100px;
}
.role-badge svg { width: 15px; height: 15px; }

.avatar.sm { width: 30px; height: 30px; font-size: 12px; }

.share-overlay { z-index: 70; }
.share-panel {
  width: 100%; max-width: 460px; max-height: 86dvh; overflow-y: auto;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); animation: rise .2s var(--ease);
}
.share-head { display: flex; align-items: center; padding: 16px 18px; border-bottom: 1px solid var(--border); }
.share-head b { font-size: 17px; font-weight: 800; flex: 1; }
.share-body { padding: 8px 18px 20px; }
.share-sec { padding: 18px 0; border-bottom: 1px solid var(--border); }
.share-sec:last-child { border-bottom: none; }
.share-sec-head { display: flex; align-items: flex-start; gap: 11px; margin-bottom: 14px; }
.share-sec-head svg { width: 20px; height: 20px; color: var(--violet); margin-top: 2px; }
.share-sec-head b { display: block; font-size: 14.5px; font-weight: 700; }
.share-sec-head span { display: block; font-size: 12.5px; color: var(--ink-3); margin-top: 1px; }

.link-row { display: flex; gap: 8px; margin-bottom: 10px; }
.link-row input {
  flex: 1; height: 42px; padding: 0 12px; border-radius: var(--radius-sm);
  border: 1.5px solid var(--border); background: var(--surface-2); color: var(--ink-2); font-size: 13px;
}
.link-row .btn { height: 42px; }
.link-off { font-size: 13px; font-weight: 600; color: #c0344a; padding: 4px 2px; }
.link-off:hover { text-decoration: underline; }

.share-add { display: flex; gap: 8px; margin-bottom: 10px; flex-wrap: wrap; }
.share-add .tag-input { flex: 1; height: 42px; min-width: 150px; }
.role-sel {
  height: 42px; padding: 0 10px; border-radius: var(--radius-sm);
  border: 1.5px solid var(--border); background: var(--surface); color: var(--ink-2); font-size: 13px; font-weight: 600;
}
.share-add .btn { height: 42px; }
.share-err { background: #ffeef0; color: #c0344a; padding: 8px 12px; border-radius: var(--radius-sm); font-size: 13px; margin-bottom: 10px; }
[data-theme='dark'] .share-err { background: #3a1c24; color: #ff8fa3; }

.people-list { display: flex; flex-direction: column; gap: 4px; }
.people-empty { font-size: 13px; color: var(--ink-3); padding: 6px 2px; }
.person { display: flex; align-items: center; gap: 11px; padding: 7px 6px; border-radius: var(--radius-sm); }
.person:hover { background: var(--surface-2); }
.person .p-meta { flex: 1; overflow: hidden; }
.person .p-meta b { display: block; font-size: 13.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.person .p-meta span { display: block; font-size: 11.5px; color: var(--ink-3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.person .p-role { font-size: 12px; font-weight: 600; color: var(--ink-2); background: var(--surface-2); padding: 3px 9px; border-radius: 100px; }
.person:hover .p-role { background: var(--surface); }
.person .icon-btn { width: 32px; height: 32px; }

.card-badge {
  display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600;
  color: var(--violet); background: var(--violet-soft); padding: 2px 8px; border-radius: 100px;
}
.card-badge svg { width: 13px; height: 13px; }

/* ============================================================
   Public shared-note view
   ============================================================ */
.public-wrap { min-height: 100dvh; background: var(--bg); }
.public-top {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 24px; border-bottom: 1px solid var(--border); background: var(--surface);
  position: sticky; top: 0; z-index: 5;
}
.public-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; color: var(--ink); }
.public-brand img { width: 30px; height: 30px; border-radius: 9px; }
.public-brand b { font-size: 18px; font-weight: 800; letter-spacing: -.02em; }
.public-top .btn { text-decoration: none; }
.public-load { text-align: center; padding: 100px 20px; color: var(--ink-3); }

.public-note {
  max-width: 720px; margin: 32px auto; background: var(--surface);
  border: 1px solid var(--border); border-left: 6px solid var(--n-default-bar);
  border-radius: var(--radius); padding: 36px 40px; box-shadow: var(--shadow-sm);
}
.public-note[data-color='yellow']  { border-left-color: var(--n-yellow-bar); }
.public-note[data-color='coral']   { border-left-color: var(--n-coral-bar); }
.public-note[data-color='mint']    { border-left-color: var(--n-mint-bar); }
.public-note[data-color='sky']     { border-left-color: var(--n-sky-bar); }
.public-note[data-color='lavender']{ border-left-color: var(--n-lavender-bar); }
.public-note[data-color='peach']   { border-left-color: var(--n-peach-bar); }
.public-note[data-color='rose']    { border-left-color: var(--n-rose-bar); }
.public-note[data-color='sage']    { border-left-color: var(--n-sage-bar); }
.public-note h1 { font-size: 28px; font-weight: 800; letter-spacing: -.02em; margin-bottom: 8px; }
.public-by { font-size: 13px; color: var(--ink-3); margin-bottom: 22px; }
.public-content { font-size: 16px; line-height: 1.75; color: var(--ink); }
.public-content h1 { font-size: 24px; margin: 16px 0 8px; }
.public-content h2 { font-size: 20px; margin: 14px 0 6px; }
.public-content ul, .public-content ol { padding-left: 24px; margin: 8px 0; }
.public-content blockquote { border-left: 3px solid var(--violet); padding-left: 14px; color: var(--ink-2); margin: 10px 0; }
.public-content a { color: var(--violet); }
.public-foot { text-align: center; padding: 28px; font-size: 13px; color: var(--ink-3); }
.public-foot a { color: var(--violet); font-weight: 600; text-decoration: none; }

@media (max-width: 520px) {
  .public-note { margin: 16px; padding: 24px 22px; }
  .share-panel { max-width: 100%; }
}

/* ============================================================
   Account & settings
   ============================================================ */
.acct-id { display: flex; align-items: center; gap: 12px; }
.acct-id .avatar { width: 44px; height: 44px; font-size: 17px; }
.acct-id div { flex: 1; overflow: hidden; }
.acct-id b { display: block; font-size: 15px; font-weight: 700; }
.acct-id span:not(.verify-pill) { display: block; font-size: 12.5px; color: var(--ink-3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.verify-pill { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 100px; background: var(--surface-2); color: var(--ink-3); }
.verify-pill.on { background: #e4f6ee; color: #1a9d6a; }
[data-theme='dark'] .verify-pill.on { background: #103530; color: #34d39e; }

.seg { display: flex; gap: 6px; background: var(--surface-2); padding: 4px; border-radius: 12px; }
.seg button { flex: 1; height: 36px; border-radius: 9px; font-size: 13.5px; font-weight: 600; color: var(--ink-2); transition: all .13s var(--ease); }
.seg button.on { background: var(--surface); color: var(--violet); box-shadow: var(--shadow-sm); }

.pw-msg { padding: 9px 12px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 600; margin-bottom: 12px; }
.pw-msg.err { background: #ffeef0; color: #c0344a; }
.pw-msg.ok { background: #e4f6ee; color: #1a9d6a; }
[data-theme='dark'] .pw-msg.err { background: #3a1c24; color: #ff8fa3; }
[data-theme='dark'] .pw-msg.ok { background: #103530; color: #34d39e; }
.share-body .field { margin-bottom: 10px; }
.share-body .field input { width: 100%; height: 44px; padding: 0 14px; border-radius: var(--radius-sm); border: 1.5px solid var(--border-strong); background: var(--surface); color: var(--ink); font-size: 14.5px; }
.share-body .field input:focus { outline: none; border-color: var(--violet); box-shadow: 0 0 0 4px var(--violet-soft); }

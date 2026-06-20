import { icons, toast, escapeHtml } from './ui.js';
import { NOTE_COLORS } from './store.js';

let activeEditor = null;

export function openEditor(opts) {
  if (activeEditor) activeEditor.close();
  activeEditor = new Editor(opts);
  return activeEditor;
}

class Editor {
  constructor({ note, onSave, onMutate, onClose, share }) {
    this.note = { title: '', content: '', color: 'default', notebook: '', tags: [], collaborators: [], myRole: 'owner', ...(note || {}) };
    if (!Array.isArray(this.note.tags)) this.note.tags = [];
    if (!Array.isArray(this.note.collaborators)) this.note.collaborators = [];
    this.onSave = onSave;
    this.onMutate = onMutate;
    this.onClose = onClose;
    this.share = share || {};
    this.role = this.note.myRole || 'owner';
    this.isOwner = this.role === 'owner';
    this.canEdit = this.role === 'owner' || this.role === 'editor';
    this.saveTimer = null;
    this.dirty = false;
    this.render();
  }

  render() {
    const n = this.note;
    const readOnly = n.trashed || this.role === 'viewer';

    const topActions = this.isOwner
      ? `<button class="icon-btn" data-act="favorite" title="Favorite">${n.favorite ? icons.starFill : icons.star}</button>
         <button class="icon-btn" data-act="pin" title="Pin">${icons.pin}</button>`
      : `<span class="role-badge">${icons.users}${this.role === 'editor' ? 'Shared · can edit' : 'Shared · view only'}</span>`;

    const shareBtn = this.isOwner && n._id
      ? `<button class="icon-btn" data-act="share" title="Share">${icons.share}</button>`
      : '';

    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `
      <div class="editor" data-color="${n.color}">
        <div class="editor-top">
          ${topActions}
          <div class="spacer"></div>
          <span class="save-hint"></span>
          ${shareBtn}
          <button class="icon-btn" data-act="more" title="More">${icons.more}</button>
          <button class="icon-btn" data-act="close" title="Close">${icons.x}</button>
        </div>
        <div class="editor-scroll">
          <textarea class="editor-title" rows="1" placeholder="Title" ${readOnly ? 'disabled' : ''}>${escapeHtml(n.title)}</textarea>
          ${readOnly ? '' : this.toolbarHtml()}
          <div class="editor-content" contenteditable="${!readOnly}" data-placeholder="Start writing…">${n.content || ''}</div>
        </div>
        <div class="editor-bottom">
          <div class="swatches">
            ${NOTE_COLORS.map((c) => `<button class="swatch sw-${c} ${c === n.color ? 'active' : ''}" data-color="${c}" title="${c}" ${readOnly ? 'disabled' : ''}></button>`).join('')}
          </div>
          <input class="tag-input" placeholder="Notebook" value="${escapeHtml(n.notebook || '')}" data-role="notebook" ${this.isOwner ? '' : 'disabled'}/>
          <div style="flex:1 1 100%;display:flex;gap:8px;align-items:center;flex-wrap:wrap">
            <div class="editor-tags"></div>
            ${readOnly ? '' : `<input class="tag-input" placeholder="Add tag + Enter" data-role="tag-add" style="max-width:150px"/>`}
          </div>
        </div>
      </div>`;

    document.body.appendChild(overlay);
    this.overlay = overlay;
    this.el = overlay.querySelector('.editor');
    this.titleEl = overlay.querySelector('.editor-title');
    this.contentEl = overlay.querySelector('.editor-content');
    this.hintEl = overlay.querySelector('.save-hint');
    this.renderTags();
    this.wire(readOnly);
    this.autoGrowTitle();
    if (!this.note._id && !readOnly) this.titleEl.focus();
  }

  toolbarHtml() {
    const t = (cmd, ic, title, arg = '') => `<button class="tool" data-cmd="${cmd}" data-arg="${arg}" title="${title}">${ic}</button>`;
    return `<div class="toolbar">
      ${t('bold', icons.bold, 'Bold')}
      ${t('italic', icons.italic, 'Italic')}
      ${t('underline', icons.underline, 'Underline')}
      ${t('strikeThrough', icons.strike, 'Strikethrough')}
      <div class="tool-sep"></div>
      ${t('h1', icons.h1, 'Heading 1')}
      ${t('h2', icons.h2, 'Heading 2')}
      <div class="tool-sep"></div>
      ${t('insertUnorderedList', icons.ul, 'Bullet list')}
      ${t('insertOrderedList', icons.ol, 'Numbered list')}
      ${t('checklist', icons.check, 'Checklist')}
      ${t('formatBlock', icons.quote, 'Quote', 'blockquote')}
      <div class="tool-sep"></div>
      ${t('createLink', icons.link, 'Link')}
    </div>`;
  }

  wire(readOnly) {
    // close on backdrop / esc
    this.overlay.addEventListener('mousedown', (e) => { if (e.target === this.overlay) this.close(); });
    this._esc = (e) => { if (e.key === 'Escape') this.close(); };
    document.addEventListener('keydown', this._esc);

    this.overlay.querySelectorAll('[data-act]').forEach((b) =>
      b.addEventListener('click', () => this.action(b.dataset.act))
    );

    // color swatches
    this.overlay.querySelectorAll('.swatch').forEach((s) =>
      s.addEventListener('click', () => {
        this.note.color = s.dataset.color;
        this.el.dataset.color = s.dataset.color;
        this.overlay.querySelectorAll('.swatch').forEach((x) => x.classList.toggle('active', x === s));
        this.queueSave();
      })
    );

    if (readOnly) return;

    // toolbar commands
    this.overlay.querySelectorAll('.tool').forEach((b) =>
      b.addEventListener('mousedown', (e) => {
        e.preventDefault();
        this.exec(b.dataset.cmd, b.dataset.arg);
      })
    );

    this.titleEl.addEventListener('input', () => { this.autoGrowTitle(); this.queueSave(); });
    this.contentEl.addEventListener('input', () => this.queueSave());
    this.contentEl.addEventListener('click', (e) => {
      // toggle checklist items
      const li = e.target.closest('li');
      if (li && li.parentElement.dataset.type === 'check' && e.offsetX < 4) {
        li.classList.toggle('done');
      }
    });

    const nb = this.overlay.querySelector('[data-role="notebook"]');
    nb.addEventListener('input', () => { this.note.notebook = nb.value; this.queueSave(); });

    const tagAdd = this.overlay.querySelector('[data-role="tag-add"]');
    tagAdd?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && tagAdd.value.trim()) {
        e.preventDefault();
        const v = tagAdd.value.trim().toLowerCase();
        if (!this.note.tags.includes(v)) { this.note.tags.push(v); this.renderTags(); this.queueSave(); }
        tagAdd.value = '';
      }
    });
  }

  exec(cmd, arg) {
    this.contentEl.focus();
    if (cmd === 'h1' || cmd === 'h2') {
      document.execCommand('formatBlock', false, cmd === 'h1' ? 'H1' : 'H2');
    } else if (cmd === 'createLink') {
      const url = prompt('Link URL');
      if (url) document.execCommand('createLink', false, url.startsWith('http') ? url : `https://${url}`);
    } else if (cmd === 'checklist') {
      document.execCommand('insertUnorderedList');
      const list = this.contentEl.querySelector('ul:not([data-type])');
      if (list) list.dataset.type = 'check';
    } else {
      document.execCommand(cmd, false, arg || null);
    }
    this.queueSave();
  }

  renderTags() {
    const wrap = this.overlay.querySelector('.editor-tags');
    wrap.innerHTML = this.note.tags
      .map((t, i) => `<span class="tag">${escapeHtml(t)}${this.note.trashed ? '' : `<b data-i="${i}">×</b>`}</span>`)
      .join('');
    wrap.querySelectorAll('b').forEach((b) =>
      b.addEventListener('click', () => { this.note.tags.splice(+b.dataset.i, 1); this.renderTags(); this.queueSave(); })
    );
  }

  autoGrowTitle() {
    this.titleEl.style.height = 'auto';
    this.titleEl.style.height = this.titleEl.scrollHeight + 'px';
  }

  collect() {
    return {
      title: this.titleEl.value.trim(),
      content: this.contentEl.innerHTML,
      color: this.note.color,
      notebook: this.note.notebook?.trim() || '',
      tags: this.note.tags,
    };
  }

  isEmpty() {
    const d = this.collect();
    return !d.title && !this.contentEl.textContent.trim();
  }

  queueSave() {
    this.dirty = true;
    this.hintEl.textContent = 'Saving…';
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this.flush(), 700);
  }

  async flush() {
    if (!this.dirty || this.isEmpty()) { this.hintEl.textContent = ''; return; }
    try {
      const saved = await this.onSave(this.note._id, this.collect());
      if (saved && !this.note._id) this.note._id = saved._id;
      this.dirty = false;
      this.hintEl.textContent = 'Saved';
      setTimeout(() => { if (!this.dirty) this.hintEl.textContent = ''; }, 1400);
    } catch (e) {
      this.hintEl.textContent = '';
      toast(e.message || 'Could not save');
    }
  }

  async action(act) {
    if (act === 'close') return this.close();
    if (act === 'more') return this.openMenu();
    if (act === 'share') return this.openSharePanel();
    if (act === 'pin' || act === 'favorite') {
      await this.flush();
      if (!this.note._id) return;
      this.note[act] = !this.note[act];
      await this.onMutate('flag', this.note._id, { [act]: this.note[act] });
      const btn = this.overlay.querySelector(`[data-act="${act}"]`);
      if (act === 'favorite') btn.innerHTML = this.note.favorite ? icons.starFill : icons.star;
      btn.classList.toggle('active', this.note[act]);
    }
  }

  openMenu() {
    const trashed = this.note.trashed;
    const rect = this.overlay.querySelector('[data-act="more"]').getBoundingClientRect();
    const m = document.createElement('div');
    m.className = 'menu';
    m.style.top = `${rect.bottom + 6}px`;
    m.style.right = `${window.innerWidth - rect.right}px`;
    const item = (act, ic, label, danger) => `<button data-m="${act}" class="${danger ? 'danger' : ''}">${ic}<span>${label}</span></button>`;

    if (!this.isOwner) {
      m.innerHTML = item('copy', icons.copy, 'Copy text') + item('export', icons.download, 'Export as .md');
    } else if (trashed) {
      m.innerHTML = item('restore', icons.restore, 'Restore note') + `<div class="sep"></div>` + item('purge', icons.trash, 'Delete forever', true);
    } else {
      m.innerHTML =
        item('archive', icons.archive, this.note.archived ? 'Unarchive' : 'Archive') +
        item('copy', icons.copy, 'Copy text') +
        item('export', icons.download, 'Export as .md') +
        `<div class="sep"></div>` +
        item('trash', icons.trash, 'Move to trash', true);
    }

    const bd = document.createElement('div');
    bd.className = 'sheet-backdrop';
    bd.style.background = 'transparent';
    bd.onclick = () => { m.remove(); bd.remove(); };
    document.body.append(bd, m);

    m.querySelectorAll('[data-m]').forEach((b) =>
      b.addEventListener('click', async () => {
        const a = b.dataset.m;
        m.remove(); bd.remove();
        await this.flush();
        if (a === 'copy') {
          navigator.clipboard.writeText(`${this.titleEl.value}\n\n${this.contentEl.innerText}`.trim());
          return toast('Copied to clipboard');
        }
        if (a === 'export') return this.exportMd();
        if (!this.note._id) return this.close();
        if (a === 'archive') { await this.onMutate('flag', this.note._id, { archived: !this.note.archived }); return this.close(); }
        if (a === 'trash') { await this.onMutate('trash', this.note._id); return this.close(true); }
        if (a === 'restore') { await this.onMutate('restore', this.note._id); return this.close(true); }
        if (a === 'purge') { await this.onMutate('purge', this.note._id); return this.close(true); }
      })
    );
  }

  openSharePanel() {
    const overlay = document.createElement('div');
    overlay.className = 'overlay share-overlay';
    overlay.innerHTML = `<div class="share-panel"><div class="share-head"><b>Share note</b><button class="icon-btn" data-x>${icons.x}</button></div><div class="share-body"></div></div>`;
    overlay.addEventListener('mousedown', (e) => { if (e.target === overlay) overlay.remove(); });
    overlay.querySelector('[data-x]').onclick = () => overlay.remove();
    document.body.appendChild(overlay);
    this.sharePanel = overlay;
    this.renderShare();
  }

  renderShare() {
    const body = this.sharePanel.querySelector('.share-body');
    const n = this.note;
    const linkOn = n.shareEnabled && n.shareUrl;

    body.innerHTML = `
      <div class="share-sec">
        <div class="share-sec-head">${icons.globe}<div><b>Public link</b><span>${linkOn ? 'Anyone with the link can view this note' : 'Create a read-only link to share with anyone'}</span></div></div>
        ${linkOn
          ? `<div class="link-row"><input readonly value="${escapeHtml(n.shareUrl)}" data-link><button class="btn btn-ghost" data-copy>${icons.copy}Copy</button></div>
             <button class="link-off" data-unlink>Stop sharing link</button>`
          : `<button class="btn btn-primary" data-link-on>${icons.link}Create public link</button>`}
      </div>
      <div class="share-sec">
        <div class="share-sec-head">${icons.users}<div><b>People</b><span>Share with another Lumen user by email</span></div></div>
        <div class="share-add">
          <input class="tag-input" type="email" placeholder="name@email.com" data-email>
          <select class="role-sel" data-share-role><option value="viewer">Can view</option><option value="editor">Can edit</option></select>
          <button class="btn btn-primary" data-add>${icons.userPlus}Add</button>
        </div>
        <div class="share-err hidden" data-err></div>
        <div class="people-list">
          ${(n.collaborators || []).length
            ? n.collaborators.map((c) => `<div class="person"><span class="avatar sm">${escapeHtml((c.name || c.email || '?')[0].toUpperCase())}</span><div class="p-meta"><b>${escapeHtml(c.name || c.email)}</b><span>${escapeHtml(c.email || '')}</span></div><span class="p-role">${c.role === 'editor' ? 'Can edit' : 'Can view'}</span><button class="icon-btn" data-remove="${c.id}" title="Remove">${icons.x}</button></div>`).join('')
            : `<div class="people-empty">No one yet — add someone above.</div>`}
        </div>
      </div>`;

    const err = (msg) => { const e = body.querySelector('[data-err]'); e.textContent = msg; e.classList.toggle('hidden', !msg); };
    const update = (note) => { Object.assign(this.note, { collaborators: note.collaborators, shareEnabled: note.shareEnabled, shareUrl: note.shareUrl }); this.renderShare(); };

    body.querySelector('[data-link-on]')?.addEventListener('click', async (e) => {
      e.target.disabled = true;
      try { const { note } = await this.share.link(n._id); update(note); toast('Public link created'); }
      catch (x) { toast(x.message); e.target.disabled = false; }
    });
    body.querySelector('[data-unlink]')?.addEventListener('click', async () => {
      try { const { note } = await this.share.unlink(n._id); update(note); toast('Link disabled'); }
      catch (x) { toast(x.message); }
    });
    body.querySelector('[data-copy]')?.addEventListener('click', () => {
      navigator.clipboard.writeText(n.shareUrl); toast('Link copied');
    });

    const addBtn = body.querySelector('[data-add]');
    const emailEl = body.querySelector('[data-email]');
    const roleEl = body.querySelector('[data-share-role]');
    const doAdd = async () => {
      const email = emailEl.value.trim();
      if (!email) return;
      addBtn.disabled = true; err('');
      try { const { note } = await this.share.addUser(n._id, email, roleEl.value); update(note); toast('Note shared'); }
      catch (x) { err(x.message); addBtn.disabled = false; }
    };
    addBtn?.addEventListener('click', doAdd);
    emailEl?.addEventListener('keydown', (e) => { if (e.key === 'Enter') doAdd(); });

    body.querySelectorAll('[data-remove]').forEach((b) =>
      b.addEventListener('click', async () => {
        try { const { note } = await this.share.removeUser(n._id, b.dataset.remove); update(note); }
        catch (x) { toast(x.message); }
      })
    );
  }

  exportMd() {
    const title = this.titleEl.value.trim() || 'note';
    const body = this.contentEl.innerText;
    const blob = new Blob([`# ${title}\n\n${body}`], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${title.replace(/[^\w]+/g, '-').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async close(skipFlush) {
    if (!skipFlush) await this.flush();
    document.removeEventListener('keydown', this._esc);
    this.overlay?.remove();
    activeEditor = null;
    this.onClose?.();
  }
}

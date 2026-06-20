const TOKEN_KEY = 'lumen.token';

export const auth = {
  get token() {
    return localStorage.getItem(TOKEN_KEY);
  },
  set token(v) {
    if (v) localStorage.setItem(TOKEN_KEY, v);
    else localStorage.removeItem(TOKEN_KEY);
  },
};

async function req(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth.token) headers.Authorization = `Bearer ${auth.token}`;

  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    /* no body */
  }

  if (!res.ok) {
    const err = new Error(data.error || 'Something went wrong. Try again.');
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  // auth
  register: (b) => req('POST', '/auth/register', b),
  login: (b) => req('POST', '/auth/login', b),
  me: () => req('GET', '/auth/me'),
  verify: (token) => req('POST', '/auth/verify', { token }),
  resendVerify: () => req('POST', '/auth/resend-verify'),
  forgot: (email) => req('POST', '/auth/forgot', { email }),
  reset: (token, password) => req('POST', '/auth/reset', { token, password }),
  changePassword: (currentPassword, newPassword) => req('PATCH', '/auth/password', { currentPassword, newPassword }),
  saveSettings: (b) => req('PATCH', '/auth/settings', b),

  // notes
  listNotes: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v != null && v !== '')
    ).toString();
    return req('GET', `/notes${qs ? `?${qs}` : ''}`);
  },
  meta: () => req('GET', '/notes/meta'),
  createNote: (b) => req('POST', '/notes', b),
  updateNote: (id, b) => req('PATCH', `/notes/${id}`, b),
  deleteNote: (id) => req('DELETE', `/notes/${id}`),
  emptyTrash: () => req('POST', '/notes/empty-trash'),

  // sharing
  shareLink: (id) => req('POST', `/notes/${id}/share/link`),
  unshareLink: (id) => req('DELETE', `/notes/${id}/share/link`),
  shareUser: (id, email, role) => req('POST', `/notes/${id}/share/user`, { email, role }),
  unshareUser: (id, userId) => req('DELETE', `/notes/${id}/share/user/${userId}`),
  getShared: (token) => req('GET', `/notes/share/${token}`),
};

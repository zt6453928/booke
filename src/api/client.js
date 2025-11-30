const BASE = import.meta.env.VITE_API_BASE || ''

function baseUrl(path) {
  if (!BASE) return path // same origin fallback
  return BASE.replace(/\/$/, '') + path
}

export async function apiLogin(user, pass) {
  try {
    const res = await fetch(baseUrl('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, pass })
    })
    if (!res.ok) {
      const text = await res.text()
      const err = new Error(text || `HTTP ${res.status}`)
      err.status = res.status
      throw err
    }
    return res.json()
  } catch (e) {
    // Network/CORS error
    if (!(e && e.status)) {
      const err = new Error('NETWORK_ERROR')
      err.cause = e
      throw err
    }
    throw e
  }
}

export async function apiListBooks() {
  const res = await fetch(baseUrl('/api/books'))
  if (!res.ok) throw new Error('Failed to fetch books')
  return res.json()
}

export async function apiGetBook(id) {
  const res = await fetch(baseUrl(`/api/books/${id}`))
  if (!res.ok) throw new Error('Failed to fetch book')
  return res.json()
}

export async function apiCreateBook(data, token) {
  const res = await fetch(baseUrl('/api/books'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function apiDeleteBook(id, token) {
  const res = await fetch(baseUrl(`/api/books/${id}`), {
    method: 'DELETE',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

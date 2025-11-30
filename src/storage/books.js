const KEY = 'booke:books'

function readAll() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    console.error('Failed to parse books from localStorage', e)
    return []
  }
}

function writeAll(arr) {
  try {
    localStorage.setItem(KEY, JSON.stringify(arr))
  } catch (e) {
    // Surface the error so UI can show a proper message
    const msg = e && e.message ? e.message : String(e)
    throw new Error(`LocalStorage 写入失败，可能空间不足或被禁用：${msg}`)
  }
}

export function listBooks() {
  return readAll().sort((a,b)=> (b.updatedAt||b.createdAt) - (a.updatedAt||a.createdAt))
}

export function getBook(id) {
  return readAll().find(b => b.id === id) || null
}

export function addBook(book) {
  const all = readAll()
  all.push(book)
  writeAll(all)
}

export function updateBook(id, patch) {
  const all = readAll()
  const idx = all.findIndex(b => b.id === id)
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...patch, updatedAt: Date.now() }
    writeAll(all)
    return all[idx]
  }
  return null
}

export function removeBook(id) {
  const all = readAll().filter(b => b.id !== id)
  writeAll(all)
}

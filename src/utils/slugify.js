export function slugify(input) {
  const s = (input || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[\u3000-\u303F\uFF00-\uFFEF]/g, '-') // full-width punct
    .replace(/[^a-z0-9\-\u4e00-\u9fa5]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return s || 'book'
}

export function genId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`
}


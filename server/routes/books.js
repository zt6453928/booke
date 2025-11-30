import express from 'express'
import { query } from '../db.js'
import { genId, slugify } from '../utils/slugify.js'
import { requireAuth } from './auth.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    // include cover_base64 so frontend can show cover on cards
    const { rows } = await query('select id, title, author, slug, format, cover_base64, created_at, updated_at from books order by updated_at desc')
    res.json(rows)
  } catch (e) {
    console.error('[books:list]', e)
    res.status(500).json({ error: 'Failed to list books' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { rows } = await query('select * from books where id = $1', [id])
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' })
    res.json(rows[0])
  } catch (e) {
    console.error('[books:get]', e)
    res.status(500).json({ error: 'Failed to get book' })
  }
})

router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, author, slug, cover_base64, coverDataUrl, code, format } = req.body || {}
    if (!title || !code) return res.status(400).json({ error: 'title and code are required' })
    const id = genId()
    const slugValue = slug && slug.trim() ? slugify(slug) : slugify(title)
    const cover = cover_base64 || coverDataUrl || ''
    await query(
      'insert into books (id, title, author, slug, cover_base64, code, format) values ($1,$2,$3,$4,$5,$6,$7)',
      [id, title, author || null, slugValue, cover || null, code, format || 'react']
    )
    const { rows } = await query('select id, title, author, slug, format, created_at, updated_at from books where id=$1', [id])
    res.status(201).json(rows[0])
  } catch (e) {
    console.error('[books:create]', e)
    if (String(e?.message || '').includes('duplicate key value') && String(e?.message || '').includes('slug')) {
      return res.status(409).json({ error: 'Slug already exists' })
    }
    res.status(500).json({ error: 'Failed to create book' })
  }
})

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    await query('delete from books where id=$1', [id])
    res.json({ ok: true })
  } catch (e) {
    console.error('[books:delete]', e)
    res.status(500).json({ error: 'Failed to delete book' })
  }
})

export default router

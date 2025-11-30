import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const router = express.Router()

function getEnv(key, fallback = '') {
  const v = process.env[key]
  return (v === undefined || v === null || v === '') ? fallback : v
}

router.post('/login', async (req, res) => {
  try {
    const { user, pass } = req.body || {}
    const ADMIN_USER = getEnv('ADMIN_USER')
    const PASS_HASH = getEnv('ADMIN_PASS_HASH')
    const PASS_PLAIN = getEnv('ADMIN_PASS')
    const JWT_SECRET = getEnv('JWT_SECRET')

    if (!ADMIN_USER || !JWT_SECRET || (!PASS_HASH && !PASS_PLAIN)) {
      return res.status(500).json({ error: 'Server auth not configured' })
    }

    if (user !== ADMIN_USER) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    let ok = false
    if (PASS_HASH) {
      ok = await bcrypt.compare(String(pass || ''), PASS_HASH)
    } else if (PASS_PLAIN) {
      ok = String(pass || '') === PASS_PLAIN
    }
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign({ sub: 'admin', user }, JWT_SECRET, { expiresIn: '12h' })
    return res.json({ token, user })
  } catch (e) {
    console.error('[auth/login]', e)
    return res.status(500).json({ error: 'Login failed' })
  }
})

export function requireAuth(req, res, next) {
  try {
    const header = req.headers['authorization'] || ''
    const [, token] = header.split(' ')
    if (!token) return res.status(401).json({ error: 'Unauthorized' })
    const payload = jwt.verify(token, getEnv('JWT_SECRET'))
    req.user = payload
    next()
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}

export default router

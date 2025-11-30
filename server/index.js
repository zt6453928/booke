import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.js'
import booksRouter from './routes/books.js'

const app = express()

const origins = (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean)
const corsOptions = origins.length === 0 ? { origin: true } : {
  origin: function (origin, cb) {
    if (!origin) return cb(null, true)
    const ok = origins.includes(origin)
    cb(ok ? null : new Error('Not allowed by CORS'), ok)
  }
}

app.use(cors(corsOptions))
app.use(express.json({ limit: '2mb' }))

// Root welcome route so opening the API domain doesn't show an error
app.get('/', (req, res) => {
  res.type('text/plain').send('Booke API is running. Try GET /api/health')
})

app.get('/api/health', (req, res) => res.json({ ok: true }))
app.use('/api/auth', authRouter)
app.use('/api/books', booksRouter)

const PORT = process.env.PORT || 8787
app.listen(PORT, () => {
  console.log(`API running on :${PORT}`)
})

import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.warn('[db] DATABASE_URL not set. API will fail to connect.')
}

export const pool = new Pool({ connectionString })

export async function query(text, params) {
  const res = await pool.query(text, params)
  return res
}


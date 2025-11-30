import React from 'react'
import { useNavigate } from 'react-router-dom'
import BookCard from '../components/BookCard'
import { listBooks, removeBook } from '../storage/books'
import { apiListBooks, apiDeleteBook } from '../api/client'
import { Search, X } from 'lucide-react'
import { getToken, isLoggedIn } from '../utils/auth'

export default function Home() {
  const navigate = useNavigate()
  const [books, setBooks] = React.useState(() => listBooks())
  const [remote, setRemote] = React.useState(false)
  const [q, setQ] = React.useState('')
  const [logged, setLogged] = React.useState(isLoggedIn())

  React.useEffect(() => {
    const onStorage = () => setLogged(isLoggedIn())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const onDeleteLocal = (id) => {
    if (confirm('确定删除这本书吗？此操作不可恢复。')) {
      removeBook(id)
      setBooks(listBooks())
    }
  }

  const onDeleteRemote = async (id) => {
    const token = getToken()
    if (!token) return
    if (!confirm('确定删除这本书吗？此操作不可恢复。')) return
    try {
      await apiDeleteBook(id, token)
      setBooks(prev => prev.filter(b => b.id !== id))
    } catch (e) {
      alert('删除失败，请检查登录状态或稍后再试。')
    }
  }

  const empty = books.length === 0
  const normalized = (s) => (s || '').toLowerCase()
  const query = normalized(q)
  const filtered = !query
    ? books
    : books.filter(b => {
        const hay = [b.title, b.author, b.slug].map(normalized).join('\n')
        return hay.includes(query)
      })

  React.useEffect(() => {
    let mounted = true
    const fetchRemote = async () => {
      try {
        const data = await apiListBooks()
        if (!mounted) return
        setBooks(data)
        setRemote(true)
      } catch {
        // stay with local list
      }
    }
    if (import.meta.env.VITE_API_BASE) fetchRemote()
    return () => { mounted = false }
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">我的书库</h1>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-xl">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            placeholder="搜索书名/作者..."
            className="w-full pl-9 pr-8 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600/30"
          />
          {q && (
            <button aria-label="清除"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600"
              onClick={()=>setQ('')}
            >
              <X size={16} />
            </button>
          )}
        </div>
        {q && (
          <div className="mt-2 text-xs text-stone-500">共 {filtered.length} 条匹配</div>
        )}
      </div>

      {empty ? (
        <div className="bg-white border border-dashed border-stone-300 rounded-xl p-10 text-center">
          <div className="text-stone-500">还没有书籍。点击页面右上角“导入书籍”添加，或在导入页加载示例。</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border rounded-xl p-10 text-center text-stone-500">未找到匹配结果。</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(b => (
            <BookCard
              key={b.id}
              book={b}
              onOpen={() => navigate(`/read/${b.id}`)}
              onDelete={remote ? (logged ? (() => onDeleteRemote(b.id)) : undefined) : (() => onDeleteLocal(b.id))}
            />
          ))}
        </div>
      )}
    </div>
  )
}

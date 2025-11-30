import React from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { Library, Plus, LogIn, LogOut } from 'lucide-react'
import Home from './pages/Home'
import ImportBook from './pages/ImportBook'
import Reader from './pages/Reader'
import Login from './pages/Login'
import { isLoggedIn, clearToken } from './utils/auth'

function TopNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const [logged, setLogged] = React.useState(isLoggedIn())
  React.useEffect(() => {
    const onStorage = () => setLogged(isLoggedIn())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])
  // Hide top nav on reader pages for immersive mode
  if (location.pathname.startsWith('/read/')) return null
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-stone-200">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-stone-900">
          <Library className="text-amber-700" size={20} />
          <span className="font-semibold tracking-wide">Booke</span>
        </button>
        <nav className="flex items-center gap-2">
          <Link to="/" className={`px-3 py-1.5 rounded-md text-sm ${location.pathname==='/'? 'bg-stone-900 text-white':'hover:bg-stone-100'}`}>书库</Link>
          {logged ? (
            <>
              <Link to="/import" className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1 ${location.pathname.startsWith('/import')? 'bg-amber-700 text-white':'hover:bg-amber-100 text-amber-800'}`}>
                <Plus size={16}/>
                导入书籍
              </Link>
              <button onClick={()=>{ clearToken(); setLogged(false); navigate('/') }} className="px-3 py-1.5 rounded-md text-sm flex items-center gap-1 text-stone-600 hover:bg-stone-100">
                <LogOut size={16}/> 退出
              </button>
            </>
          ) : (
            <Link to="/login" className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1 ${location.pathname.startsWith('/login')? 'bg-stone-900 text-white':'hover:bg-stone-100'}`}>
              <LogIn size={16}/> 登录
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default function App() {
  const location = useLocation()
  const isReader = location.pathname.startsWith('/read/')
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/import" element={<ImportBook />} />
          <Route path="/login" element={<Login />} />
          <Route path="/read/:id" element={<Reader />} />
        </Routes>
      </main>
      {/* Footer intentionally removed for clean UI */}
    </div>
  )
}

import React from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { getBook as getLocalBook, updateBook } from '../storage/books'
import { apiGetBook } from '../api/client'
import RuntimeRenderer from '../components/RuntimeRenderer'
import IframeRenderer from '../components/IframeRenderer'
import { ArrowLeft, Pencil, RefreshCw } from 'lucide-react'

export default function Reader() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [book, setBook] = React.useState(() => getLocalBook(id))
  const [code, setCode] = React.useState(book?.code || '')
  const params = React.useMemo(() => new URLSearchParams(location.search), [location.search])
  const showControls = params.get('controls') === '1'
  const [loading, setLoading] = React.useState(() => (!book && !!import.meta.env.VITE_API_BASE))

  const detectFormat = (src) => {
    const s = (src || '').trim()
    if (/^<!doctype\s+html/i.test(s)) return 'html'
    if (/<\s*html[\s>]/i.test(s) || /<\s*body[\s>]/i.test(s) || /<\s*head[\s>]/i.test(s)) return 'html'
    return 'react'
  }

  const format = (book?.format) || detectFormat(code)

  React.useEffect(() => {
    let mounted = true
    const fetchRemote = async () => {
      try {
        setLoading(true)
        const b = await apiGetBook(id)
        if (!mounted) return
        setBook(b)
        setCode(b.code || '')
        setLoading(false)
      } catch {
        // fall back to local
        setLoading(false)
      }
    }
    if (import.meta.env.VITE_API_BASE) fetchRemote()
    return () => { mounted = false }
  }, [id])

  const handleBack = React.useCallback(() => {
    try {
      if (window.history.length > 1) {
        navigate(-1)
      } else {
        navigate('/')
      }
    } catch {
      navigate('/')
    }
  }, [navigate])

  return (
    <div className="min-h-screen flex flex-col">
      {!showControls && (
        <button
          onClick={handleBack}
          aria-label="返回"
          title="返回"
          className="fixed left-4 top-4 z-40 p-2 rounded-full bg-white/90 backdrop-blur border border-stone-200 shadow hover:bg-white text-stone-700"
        >
          <ArrowLeft size={18} />
        </button>
      )}
      {showControls && (
        <div className="border-b bg-white">
          <div className="mx-auto max-w-6xl px-4 h-12 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded hover:bg-stone-100" onClick={() => navigate(-1)} title="返回">
                <ArrowLeft size={18} />
              </button>
              <div className="font-semibold">{book.title}</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-2.5 py-1.5 rounded-md text-sm border hover:bg-stone-50" onClick={async () => {
                if (import.meta.env.VITE_API_BASE) {
                  try {
                    setLoading(true)
                    const b = await apiGetBook(book.id)
                    setBook(b)
                    setCode(b.code || '')
                  } finally {
                    setLoading(false)
                  }
                } else {
                  const fresh = getLocalBook(book.id)
                  setBook(fresh)
                  setCode(fresh?.code || '')
                }
              }}>
                <RefreshCw size={14} className="inline mr-1"/> 刷新
              </button>
              <button className="px-2.5 py-1.5 rounded-md text-sm border hover:bg-stone-50" onClick={() => {
                const newCode = prompt('直接编辑代码（注意：将覆盖原内容）', code)
                if (newCode != null) {
                  const newFormat = detectFormat(newCode)
                  updateBook(book.id, { code: newCode, format: newFormat })
                  setCode(newCode)
                }
              }}>
                <Pencil size={14} className="inline mr-1"/> 快速编辑
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1">
        {loading && (
          <div className="p-8 text-center text-stone-500">加载中...</div>
        )}
        {!loading && !book && (
          <div className="mx-auto max-w-3xl px-4 py-12 text-center">
            <div className="text-stone-500 mb-4">未找到该书籍</div>
            <button className="px-3 py-2 rounded-md border" onClick={()=>navigate('/')}>返回首页</button>
          </div>
        )}
        {!loading && book && (
          <>
            {format === 'html' ? (
              <IframeRenderer html={code} />
            ) : (
              <RuntimeRenderer code={code} />
            )}
          </>
        )}
      </div>
    </div>
  )
}

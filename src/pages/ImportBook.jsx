import React from 'react'
import { useNavigate } from 'react-router-dom'
import { addBook } from '../storage/books'
import { genId, slugify } from '../utils/slugify'
import { Upload, FileCode, Image as ImageIcon, Rocket, LogIn } from 'lucide-react'
import { getToken } from '../utils/auth'
import { apiCreateBook } from '../api/client'

function detectFormat(src) {
  const s = (src || '').trim()
  if (/^<!doctype\s+html/i.test(s)) return 'html'
  if (/<\s*html[\s>]/i.test(s) || /<\s*body[\s>]/i.test(s) || /<\s*head[\s>]/i.test(s)) return 'html'
  return 'react'
}

export default function ImportBook() {
  const navigate = useNavigate()
  const [title, setTitle] = React.useState('')
  const [author, setAuthor] = React.useState('')
  const [slug, setSlug] = React.useState('')
  const [code, setCode] = React.useState('')
  const [coverDataUrl, setCoverDataUrl] = React.useState('')
  const [saving, setSaving] = React.useState(false)
  const token = getToken()

  const onPickCover = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setCoverDataUrl(String(reader.result || ''))
    reader.readAsDataURL(file)
  }

  const onLoadSample = async () => {
    try {
      const res = await fetch('/samples/ohyos.jsx')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const txt = await res.text()
      setCode(txt)
      setTitle('百年孤独（示例）')
      setAuthor('Gabriel García Márquez')
      setSlug(slugify('百年孤独'))
    } catch (e) {
      console.error(e)
      alert('加载示例失败，请检查网络或刷新后重试。')
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) { alert('请输入书名'); return }
    if (!code.trim()) { alert('请粘贴/填写书籍页面代码'); return }
    setSaving(true)
    try {
      const format = detectFormat(code)
      if (token) {
        const payload = {
          title: title.trim(),
          author: author.trim() || undefined,
          slug: slugify(slug || title),
          coverDataUrl: coverDataUrl || undefined,
          code,
          format
        }
        const created = await apiCreateBook(payload, token)
        navigate(`/read/${created.id}`)
        return
      }
      // fallback to local storage (dev/test)
      const id = genId()
      const book = {
        id,
        title: title.trim(),
        author: author.trim(),
        slug: slugify(slug || title),
        coverDataUrl: coverDataUrl || '',
        code: code,
        format,
        createdAt: Date.now()
      }
      addBook(book)
      navigate(`/read/${id}`)
    } catch (err) {
      console.error(err)
      alert(`保存失败：${err?.message || err}`)
    } finally {
      setSaving(false)
    }
  }

  if (!token && import.meta.env.VITE_API_BASE) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="text-stone-600 mb-6">该环境需要管理员登录后才能导入书籍。</div>
        <button onClick={()=>navigate('/login')} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-stone-900 text-white hover:bg-stone-800">
          <LogIn size={16}/> 去登录
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">导入书籍</h1>
      <form onSubmit={onSubmit} className="grid gap-6">
        <div className="grid gap-2">
          <label className="text-sm font-medium">书名</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600/30" placeholder="例如：百年孤独" />
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm font-medium">作者（可选）</label>
            <input value={author} onChange={e=>setAuthor(e.target.value)} className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600/30" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">自定义访问路径（可选）</label>
            <input value={slug} onChange={e=>setSlug(e.target.value)} className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600/30" placeholder="用于生成链接的短标识" />
          </div>
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium flex items-center gap-2"><ImageIcon size={16}/> 封面图片（可选）</label>
          <input type="file" accept="image/*" onChange={onPickCover} />
          {coverDataUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt="cover" src={coverDataUrl} className="w-60 h-auto rounded-md border" />
          )}
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium flex items-center gap-2"><FileCode size={16}/> 书籍页面代码（支持 React 或 HTML）</label>
          <textarea value={code} onChange={e=>setCode(e.target.value)} rows={18} className="font-mono text-sm p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600/30" placeholder="React：需 export default；HTML：可直接粘贴完整文档或片段"></textarea>
          <div className="flex gap-2">
            <button type="button" onClick={onLoadSample} className="px-3 py-1.5 text-sm rounded-md bg-stone-100 hover:bg-stone-200 inline-flex items-center gap-1">
              <Upload size={14}/> 加载示例代码
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button disabled={saving} type="submit" className="px-4 py-2 rounded-md bg-amber-700 text-white hover:bg-amber-600 inline-flex items-center gap-2">
            <Rocket size={16}/> {saving ? '保存中...' : '保存并阅读'}
          </button>
        </div>
      </form>
    </div>
  )
}

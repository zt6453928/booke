import React from 'react'
import { useNavigate } from 'react-router-dom'
import { apiLogin } from '../api/client'
import { setToken } from '../utils/auth'

export default function Login() {
  const navigate = useNavigate()
  const [user, setUser] = React.useState('')
  const [pass, setPass] = React.useState('')
  const [err, setErr] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      const { token } = await apiLogin(user, pass)
      setToken(token)
      navigate('/import')
    } catch (e) {
      if (e && e.message === 'NETWORK_ERROR') {
        setErr('无法连接 API，请先启动后端：npm run dev:api；或检查 VITE_API_BASE 是否配置为 http://localhost:8787')
      } else if (e && e.status === 401) {
        setErr('账户或密码不正确。')
      } else {
        setErr(`登录失败：${e?.message || e}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-12">
      <h1 className="text-2xl font-semibold mb-6">管理员登录</h1>
      <form onSubmit={onSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <label className="text-sm">账号</label>
          <input className="px-3 py-2 border rounded-md" value={user} onChange={e=>setUser(e.target.value)} placeholder="ADMIN_USER" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">密码</label>
          <input type="password" className="px-3 py-2 border rounded-md" value={pass} onChange={e=>setPass(e.target.value)} placeholder="******" />
        </div>
        {err && <div className="text-sm text-red-600">{err}</div>}
        <div>
          <button disabled={loading} className="px-4 py-2 rounded-md bg-stone-900 text-white hover:bg-stone-800">
            {loading ? '登录中...' : '登录'}
          </button>
        </div>
      </form>
    </div>
  )
}

import React from 'react'

function ensureDoc(html) {
  const hasHtml = /<\s*html[\s>]/i.test(html)
  const hasDoctype = /<!doctype\s+html/i.test(html)
  if (hasHtml || hasDoctype) return html
  // Wrap fragment into a minimal HTML document with Tailwind CDN
  return `<!DOCTYPE html>
  <html lang="zh-CN">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <script src="https://cdn.tailwindcss.com"></script>
      <title>Document</title>
      <style>body{margin:0}</style>
    </head>
    <body>${html}</body>
  </html>`
}

export default function IframeRenderer({ html }) {
  const doc = React.useMemo(() => ensureDoc(html || ''), [html])
  const ref = React.useRef(null)
  const [height, setHeight] = React.useState(800)

  const measure = React.useCallback(() => {
    const el = ref.current
    if (!el) return
    try {
      const d = el.contentDocument || el.contentWindow?.document
      if (!d) return
      const b = d.body
      const e = d.documentElement
      const h = Math.max(
        b?.scrollHeight || 0,
        e?.scrollHeight || 0,
        b?.offsetHeight || 0,
        e?.offsetHeight || 0,
        b?.clientHeight || 0,
        e?.clientHeight || 0,
      )
      if (h && Math.abs(h - height) > 10) setHeight(h)
    } catch (err) {
      // cross-origin access blocked
    }
  }, [height])

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const onLoad = () => {
      measure()
      // Try multiple times for late-loading assets
      let n = 0
      const id = setInterval(() => {
        measure()
        if (++n > 20) clearInterval(id)
      }, 150)

      try {
        const w = el.contentWindow
        const d = el.contentDocument
        if (w && d) {
          w.addEventListener('resize', measure)
          const ro = new w.ResizeObserver(() => measure())
          ro.observe(d.documentElement)
          ro.observe(d.body)
          // Cleanup when iframe reloads
          el._ro = ro
        }
      } catch {}
    }
    el.addEventListener('load', onLoad)
    return () => {
      el.removeEventListener('load', onLoad)
      try { el._ro && el._ro.disconnect() } catch {}
    }
  }, [doc, measure])

  return (
    <iframe
      title="book-html"
      className="w-full bg-white"
      style={{ height: height + 'px' }}
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-pointer-lock allow-popups-to-escape-sandbox"
      loading="eager"
      referrerPolicy="no-referrer"
      ref={ref}
      srcDoc={doc}
    />
  )
}

import React, { useEffect, useMemo, useState } from 'react'
import * as Babel from '@babel/standalone'
import * as lucide from 'lucide-react'

function preprocess(code) {
  // Extract lucide icon names
  const lucideMatch = code.match(/import\s*{\s*([^}]+)\s*}\s*from\s*["']lucide-react["']/m)
  const iconList = lucideMatch ? lucideMatch[1].split(',').map(s => s.trim()).filter(Boolean) : []

  // Remove imports from react and lucide-react (support multi-line forms)
  let stripped = (code || '').replace(/import[\s\S]*?from\s*["']react["']\s*;?/g, '')
  stripped = stripped.replace(/import[\s\S]*?from\s*["']lucide-react["']\s*;?/g, '')

  // Transform `export default` to a local symbol we can reference
  let defaultName = null
  // export default function Named() { ... }
  stripped = stripped.replace(/export\s+default\s+function\s+([A-Za-z0-9_]+)/, (_, name) => {
    defaultName = name
    return `function ${name}`
  })
  // export default function () { ... }
  if (!defaultName && /export\s+default\s+function\s*\(/.test(stripped)) {
    stripped = stripped.replace(/export\s+default\s+function\s*\(/, 'function __DefaultExport__(')
    defaultName = '__DefaultExport__'
  }
  // export default <expr>
  if (!defaultName && /export\s+default\s+/.test(stripped)) {
    stripped = stripped.replace(/export\s+default\s+/, 'const __DefaultExport__ = ')
    defaultName = '__DefaultExport__'
  }

  const reactDestructure = 'const { useState, useEffect, useMemo, useRef, useCallback, useContext } = React;\n'
  const lucideDestructure = iconList.length ? `const { ${iconList.join(', ')} } = lucide;\n` : ''

  // Important: do NOT include a top-level `return` here; Babel parses this chunk.
  const body = reactDestructure + lucideDestructure + stripped + '\n'

  return { body, defaultName: defaultName || '__DefaultExport__' }
}

export default function RuntimeRenderer({ code }) {
  const [err, setErr] = useState(null)
  const [Comp, setComp] = useState(null)

  const compiled = useMemo(() => {
    try {
      const pre = preprocess(code || '')
      const out = Babel.transform(pre.body, { presets: ['react'], filename: 'book.jsx' }).code
      return { code: out, defaultName: pre.defaultName }
    } catch (e) {
      setErr(e)
      return null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

  useEffect(() => {
    if (!compiled) return
    setErr(null)
    try {
      // Build function returning the component, wrap a runtime return here (outside Babel)
      const runtime = `${compiled.code}\nreturn (typeof ${compiled.defaultName} !== 'undefined' ? ${compiled.defaultName} : null);\n`
      // eslint-disable-next-line no-new-func
      const fn = new Function('React', 'lucide', runtime)
      const comp = fn(React, lucide)
      setComp(() => comp)
    } catch (e) {
      setErr(e)
      setComp(null)
    }
  }, [compiled])

  if (err) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded-md text-sm">
        <div className="font-semibold mb-1">渲染失败</div>
        <pre className="whitespace-pre-wrap text-xs">{String(err.stack || err.message || err)}</pre>
      </div>
    )
  }
  if (!Comp) {
    return <div className="p-6 text-stone-500">正在编译书籍页面...</div>
  }
  return <Comp />
}

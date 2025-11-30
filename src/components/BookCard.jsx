import React from 'react'
import { Trash2, BookOpen } from 'lucide-react'

export default function BookCard({ book, onOpen, onDelete }) {
  const cover = book.coverDataUrl || book.cover_base64
  return (
    <div className="group border border-stone-200 bg-white rounded-xl overflow-hidden flex flex-col hover:shadow-md transition">
      <div className="aspect-[16/10] bg-stone-100 overflow-hidden">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt={book.title} className="h-full w-full object-cover"/>
        ) : (
          <div className="h-full w-full grid place-items-center text-stone-400">
            <BookOpen size={48} />
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="font-semibold line-clamp-1">{book.title || '未命名书籍'}</div>
        {book.author && <div className="text-xs text-stone-500 mt-1">{book.author}</div>}
        <div className="mt-4 flex items-center justify-between">
          <button onClick={onOpen} className="px-3 py-1.5 text-sm rounded-md bg-stone-900 text-white hover:bg-stone-800">阅读</button>
          {onDelete && (
            <button onClick={onDelete} className="p-1.5 text-stone-500 hover:text-red-600" title="删除">
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

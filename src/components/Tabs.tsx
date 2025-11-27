'use client'
// 通用 Tab 组件：支持选中、悬浮与常规三态样式
export type TabItem = {
  id: string
  label: string
}

export default function Tabs({
  items,
  active,
  onChange,
}: {
  items: TabItem[]
  active: number
  onChange: (next: number) => void
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((t, i) => (
        <button
          key={t.id}
          className={`rounded px-3 py-2 ${active === i ? 'bg-white/20' : 'bg-white/10'} hover:bg-white/15`}
          onClick={() => onChange(i)}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

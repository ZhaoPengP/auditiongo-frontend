'use client'
// 通用轮播组件：支持自动播放（默认6秒）、点击指示器切换、左右控制、点击幻灯片跳转
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
export type Slide = {
  id: string
  label: string
  image?: string
  imageUrl?: string
  href?: string
}

export default function Carousel({
  slides,
  interval = 6000,
  onChange,
}: {
  slides: Slide[]
  interval?: number
  onChange?: (index: number) => void
}) {
  const [index, setIndex] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // 显式判断并清理定时器，避免无效表达式触发 ESLint 警告
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, interval)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [slides.length, interval])

  useEffect(() => {
    onChange?.(index)
  }, [index, onChange])

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length)
  const next = () => setIndex((i) => (i + 1) % slides.length)

  const current = slides[index]

  return (
    <div className="relative h-full w-full overflow-hidden rounded bg-white/10">
      <div className="flex h-full w-full items-center justify-center">
        {current.href ? (
          <a
            href={current.href}
            target="_blank"
            rel="noreferrer"
            className="text-lg"
          >
            <Image
              src={current.imageUrl || current.image || ''}
              alt={current.label || ''}
              fill
              className="h-auto w-auto"
            />
          </a>
        ) : (
          <Image
            src={current.imageUrl || current.image || ''}
            alt={current.label || ''}
            fill
            className="h-full w-auto"
          />
        )}
      </div>
      {/* 左右控制 */}
      <div className="absolute inset-y-0 left-0 flex items-center">
        <button className="mx-2 rounded bg-black/40 px-3 py-1" onClick={prev}>
          ◀
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center">
        <button className="mx-2 rounded bg-black/40 px-3 py-1" onClick={next}>
          ▶
        </button>
      </div>
      {/* 指示器 */}
      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {slides.map((s, i) => (
          <button
            key={i}
            className={`h-2 w-8 rounded ${index === i ? 'bg-white' : 'bg-white/40'}`}
            onClick={() => setIndex(i)}
            aria-label={`go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

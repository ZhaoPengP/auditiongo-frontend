'use client'
// 渐变按钮组件：用于欢迎页“进入官网”按钮复用
import Link from 'next/link'

export default function ButtonGradient({
  href,
  children,
  target = '_blank',
}: {
  href: string
  children: React.ReactNode
  target?: '_self' | '_blank'
}) {
  return (
    <Link
      href={href}
      target={target}
      className="btn-gradient rounded px-4 py-2 text-sm"
    >
      {children}
    </Link>
  )
}

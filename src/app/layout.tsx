import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AuditionGo 欢迎页',
  description: '中文鹦鹉团・沉浸式互动社交元宇宙欢迎页',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang={navigator.language}>
      <body className="antialiased">{children}</body>
    </html>
  )
}

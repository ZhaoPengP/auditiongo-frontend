// 多语言布局：负责注入 Header 与 Footer，并加载文案
import type { Metadata } from 'next'
import '../globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FixedDownloadApp from '@/components/FixedDownloadApp'
import { getMessages } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'AuditionGo 官网',
  description: '中文鹦鹉团・沉浸式互动社交元宇宙',
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  // Next.js 16 中 params 为异步动态 API
  params: Promise<{ locale: string }>
}>) {
  // 解包路由参数，获取 locale
  const { locale: rawLocale } = await params
  // 确保 locale 是支持的语言
  const locale = (rawLocale as 'en' | 'zh-CN' | 'zh-TW' | 'ja' | 'ko') || 'en'
  const messages = getMessages(locale)

  return (
    <div className="bg-black text-white w-full min-h-screen bg-[url('/image/channel/page-bg.png')] bg-auto bg-cover overflow-x-hidden">
      {/* 顶部导航固定 */}
      <Header messages={messages} locale={locale} />
      {/* 主体内容，移动端响应式布局 */}
      <main className="w-full mx-auto mt-[80px]">
        {children}
        <FixedDownloadApp />
      </main>
      <Footer messages={messages} locale={locale} />
    </div>
  )
}

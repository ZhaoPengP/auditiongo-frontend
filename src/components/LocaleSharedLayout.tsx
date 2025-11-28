// 共享多语言布局组件
import { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
import FixedDownloadApp from './FixedDownloadApp'
import { getMessages } from '@/lib/i18n'
import Image from 'next/image'

interface LocaleSharedLayoutProps {
  children: ReactNode
  locale: string
}

export default function LocaleSharedLayout({
  children,
  locale,
}: LocaleSharedLayoutProps) {
  // 确保 locale 是支持的语言
  const validLocale = (locale as 'en' | 'zh-CN' | 'zh-TW' | 'ja' | 'ko') || 'en'
  const messages = getMessages(validLocale)

  return (
    <div className="bg-black text-white w-full min-h-screen bg-[url('/image/channel/page-bg.png')] bg-auto bg-cover overflow-x-hidden">
      {/* 顶部导航固定 */}
      <Image
        src="/image/home/bg29.png"
        alt="bg2"
        width={1920}
        height={604}
        className="w-full h-[604px] mx-auto object-cover absolute top-80 left-0 z-[0]"
      />
      <Header messages={messages} locale={validLocale} />
      {/* 主体内容，移动端响应式布局 */}
      <main className="w-full mx-auto mt-[80px] relative z-[1]">
        {children}
        <FixedDownloadApp />
      </main>
      <Footer messages={messages} locale={validLocale} />
    </div>
  )
}

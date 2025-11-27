'use client'
// 顶部导航组件：固定 80px，高透明黑背景，含 logo + slogan + 导航 + 多语言 + 登录注册
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import type { Messages } from '@/lib/i18n'

const NAV_ITEMS = [
  { href: '/home', key: 'home' },
  { href: '/data', key: 'data' },
  { href: '/chat', key: 'chat' },
  { href: '/community', key: 'community' },
  { href: '/channel', key: 'channel' },
  { href: '/fans', key: 'fans' },
]

export default function Header({
  messages,
  locale,
}: {
  // 文案对象（由布局传入）
  messages: Messages
  locale: string
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const locales = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko']

  // 在客户端根据传入 messages 生成 t 函数，避免跨边界传递函数
  // 简单的文案读取：支持 'slogan' 返回字符串，'nav' 返回键值
  const t = (ns: keyof Messages, key?: string) => {
    const val = messages[ns]
    if (typeof val === 'string') return val
    if (key && val && typeof val === 'object') {
      const table = val as Record<string, string>
      return table[key] ?? key
    }
    return key ?? ''
  }

  // 语言切换：替换当前路径的语言前缀
  const switchLocale = (next: string) => {
    const parts = (pathname || '/').split('/').filter(Boolean)
    if (locales.includes(parts[0])) {
      parts[0] = next
    } else {
      parts.unshift(next)
    }
    window.location.href = '/' + parts.join('/')
  }

  const isActiveRoute = (route: string) => {
    // 检查当前路径是否以指定路由开头，支持一级和二级路由
    if (!pathname) return false
    const fullRoute = `/${locale}${route}`
    return pathname === fullRoute || pathname.startsWith(fullRoute + '/')
  }

  return (
    <header className="header-fixed text-white">
      <div className="mx-auto flex h-20 items-center justify-between pl-[30px] ">
        <div className="flex items-center">
          {/* 左侧 logo + slogan */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {/* logo 占位，比例 116:64 */}
              <Image
                src="/image/common/logo.png"
                alt="logo"
                width={116}
                height={64}
                className="h-[64px] w-[116px] mr-[10px] cursor-pointer"
                onClick={() => (window.location.href = `/${locale}/home`)}
              />
              {/* <div className="h-[64px] w-[116px] bg-white/20 rounded-sm flex items-center justify-center">
                <span className="text-xs">Logo</span> 
              </div> */}
              {/* slogan 占位，比例 368:48 */}
              <Image
                src="/image/common/slogan.png"
                alt="slogan"
                width={174}
                height={55}
                className="h-[55px] w-[174px]"
              />
              {/* <div className="h-[48px] w-[368px] bg-white/10 rounded-sm flex items-center justify-center">
                <span className="text-sm">{t('slogan')}</span>
              </div> */}
            </div>
          </div>

          {/* 右侧导航与操作 */}
          <nav className="hidden items-center gap-8 md:flex ml-[50px]">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                className={`text-[14px] relative transition-all duration-300 hover:text-[#33E11F] ${isActiveRoute(item.href) ? 'font-bold active-nav text-[#33E11F]' : ''}`}
                href={`/${locale}${item.href}`}
              >
                {t('nav', item.key)}
              </Link>
            ))}
            <div className="flex items-center gap-3 cursor-pointer">
              {/* <Link className="text-sm" href={`/${locale}/login`}>
                {t('nav', 'login')}
              </Link>
              <Link className="text-sm" href={`/${locale}/register`}>
                {t('nav', 'register')}
              </Link> */}
              <select
                className="rounded bg-black px-2 py-1 text-sm border-none cursor-pointer"
                value={locale}
                onChange={(e) => switchLocale(e.target.value)}
              >
                {locales.map((lang) => (
                  <option key={lang} value={lang} className="border-none">
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </nav>
        </div>
        {/* pc右侧登录注册 */}
        {/* <Link
          href="/en/home"
          target="_back"
          className="hidden text-sm w-[209px] h-[49px] flex items-center justify-center bg-[url('/image/common/but-bg1.png')]"
          aria-label="open menu"
        >
          <b className="text-[22px]">
            {t('nav', 'login')}/{t('nav', 'register')}
          </b>
        </Link> */}
        <button className="hidden text-sm w-[209px] h-[80px] lg:flex items-center justify-center bg-[url('/image/common/bg4.png')] bg-size-[209px_49px] bg-no-repeat bg-center cursor-pointer">
          <b className="text-[22px]">
            {t('nav', 'login')}/{t('nav', 'register')}
          </b>
        </button>

        {/* 右侧移动端菜单按钮 */}
        <button
          className="md:hidden inline-flex items-center justify-center rounded bg-white/10 px-3 py-2"
          onClick={() => setOpen(true)}
          aria-label="open menu"
        >
          菜单
        </button>
      </div>

      {/* 右侧抽屉菜单 */}
      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[280px] bg-black py-4">
            <div className="mb-4 flex items-center justify-between px-4">
              <span className="text-sm">
                {t('nav', 'language')}: {locale}
              </span>
              <button
                className="inline-flex items-center justify-center rounded bg-white/10 px-3 py-2"
                onClick={() => setOpen(false)}
                aria-label="close menu"
              >
                关闭
              </button>
            </div>
            <ul className="space-y-3 bg-black">
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <Link
                    className="block rounded px-3 py-2 hover:bg-white/10"
                    href={`/${locale}${item.href}`}
                    onClick={() => setOpen(false)}
                  >
                    {t('nav', item.key)}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  className="block rounded px-3 py-2 hover:bg-white/10"
                  href={`/${locale}/login`}
                  onClick={() => setOpen(false)}
                >
                  {t('nav', 'login')}
                </Link>
              </li>
              <li>
                <Link
                  className="block rounded px-3 py-2 hover:bg-white/10"
                  href={`/${locale}/register`}
                  onClick={() => setOpen(false)}
                >
                  {t('nav', 'register')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  )
}

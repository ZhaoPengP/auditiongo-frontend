// 多语言中间件：默认英文，支持中文简体、繁体、日文、韩文
import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['en', 'zh-CN', 'zh-TW', 'ja', 'ko'],
  defaultLocale: 'en',
  localeDetection: true,
})

export const config = {
  matcher: ['/', '/(en|zh-CN|zh-TW|ja|ko)/:path*'],
}

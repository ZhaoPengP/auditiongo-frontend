// 多语言中间件：默认英文，支持中文简体、繁体、日文、韩文
import createMiddleware from 'next-intl/middleware'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export default createMiddleware({
  locales: ['en', 'zh-CN', 'zh-TW', 'ja', 'ko'],
  defaultLocale: 'en',
  localeDetection: true,
})

export const headerMiddleware = () => {
  return async (request: NextRequest) => {
    const headers = new Headers(request.headers)
    headers.set('my-current-pathname', request.nextUrl.pathname)
    headers.set('my-current-search', request.nextUrl.search)
    return NextResponse.next({
      request: {
        headers,
      },
    })
  }
}
// 简化中间件链的实现，直接导出一个处理函数
export const chainMiddleware = async (request: NextRequest) => {
  // 先调用headerMiddleware
  const headerResponse = await headerMiddleware()(request)

  // 如果headerMiddleware已经返回了响应，直接使用它
  if (headerResponse) {
    return headerResponse
  }
  console.log('headerMiddleware', headerResponse)

  // 否则继续下一个中间件（这里只有一个中间件）
  return NextResponse.next()
}

export const config = {
  // 匹配所有路径，但排除API路由、静态资源和_next路径
  matcher: [
    '/',
    '/(en|zh-CN|zh-TW|ja|ko)/:path*',
    '!/_next/:path*',
    '!/api/:path*',
    '!/favicon.ico',
  ],
}

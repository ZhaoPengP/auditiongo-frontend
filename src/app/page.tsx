'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// 支持的语言列表
const supportedLocales = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko']

// 获取浏览器语言并映射到支持的语言
function getBrowserLocale(): string {
  const browserLang = navigator.language || 'en'

  // 处理zh-CN, zh-TW, zh-HK等中文变体
  if (browserLang.startsWith('zh')) {
    if (browserLang.includes('TW') || browserLang.includes('HK')) {
      return 'zh-TW'
    } else {
      return 'zh-CN'
    }
  }

  // 检查其他支持的语言
  if (supportedLocales.includes(browserLang)) {
    return browserLang
  }

  // 默认使用英文
  return 'en'
}

export default function RootRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // 获取浏览器语言
    const locale = getBrowserLocale()
    // 重定向到对应的语言路径
    router.replace(`/${locale}`)
  }, [router])

  // 在重定向前不显示任何内容
  return null
}

// 简单的 i18n 加载工具：根据 locale 加载对应 JSON 文案
import en from '@/i18n/en.json'
import zhCN from '@/i18n/zh-CN.json'
import zhTW from '@/i18n/zh-TW.json'
import ja from '@/i18n/ja.json'
import ko from '@/i18n/ko.json'

export type Locale = 'en' | 'zh-CN' | 'zh-TW' | 'ja' | 'ko'

// 文案类型：以英文文案结构为基准，确保类型安全
export type Messages = typeof en

export function getMessages(locale: string): Messages {
  const supportedLocales: Locale[] = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko']

  // 验证locale是否被支持，如果不支持则使用默认语言
  if (!supportedLocales.includes(locale as Locale)) {
    return en
  }

  switch (locale) {
    case 'zh-CN':
      return zhCN
    case 'zh':
      return zhCN
    case 'zh-TW':
      return zhTW
    case 'ja':
      return ja
    case 'ko':
      return ko
    case 'en':
    default:
      return en
  }
}

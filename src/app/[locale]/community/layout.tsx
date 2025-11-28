// 使用共享布局组件
import LocaleSharedLayout from '@/components/LocaleSharedLayout'

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  // 安全地获取 locale 参数
  const { locale } = await params

  return <LocaleSharedLayout locale={locale}>{children}</LocaleSharedLayout>
}

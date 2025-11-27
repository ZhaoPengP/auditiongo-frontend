import SvgIcon from '@/components/SvgIcon'
import AgeRecommendations from '@/components/AgeRecommendations'
import { Messages, Locale } from '@/lib/i18n'
import Image from 'next/image'
// 底部版权组件
export default function Footer({
  messages,
  locale,
}: {
  messages: Messages
  locale: Locale
}) {
  return (
    <footer className="bg-slate-950/70 backdrop-opacity-20 backdrop-blur text-white">
      <AgeRecommendations className="top-18 right-10" />
      <div className="mx-auto max-w-7xl text-sm border-b border-white/50 pt-20 pb-20">
        <Image
          src="/image/common/logo.png"
          alt="logo"
          width={100}
          height={60}
          className="h-[60px] w-[100px]"
        />
        <p className="mt-5">{messages.footer.healthWarning}</p>
        <p className="mt-2">{messages.footer.warningContent}</p>
        <div className="h-[1px] my-10 bg-white/50 w-full"></div>
        <div className="flex items-center justify-between">
          <p>
            <span>国新出审〔2025〕</span>
            <span>1608号(沪新出审〔2025〕 968号</span>
            <span>网络游戏出版物号（ISBN）ISBN 978-7-498-15528-3</span>
          </p>
          <p className="w-[75px] flex items-center justify-between">
            <SvgIcon src="/svg/emile.svg" width={28} height={28} />
            <SvgIcon src="/svg/phone.svg" width={28} height={28} />
          </p>
        </div>
        <p className="mt-[15px]">{messages.footer.icpInfo}</p>
        <p className="mt-[15px]">{messages.footer.copyright}</p>
      </div>
    </footer>
  )
}

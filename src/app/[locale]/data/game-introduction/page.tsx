'use client'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { getMessages } from '@/lib/i18n'

export default function GameFeatures() {
  const { locale } = useParams() as { locale: string }
  const messages = getMessages(locale)
  const router = useRouter()

  const openGameIntroduction = () => {
    router.push(`/${locale}/data`)
  }
  return (
    <div className="w-full h-[880px] rounded-lg">
      <div className="lg:w-[1248px] h-[880px] mx-auto">
        <Image
          src="/image/data/bg4.png"
          width={400}
          height={112}
          alt="logo"
          className="w-[400px] h-[112px] mx-auto mt-[73px]"
        ></Image>
        <Image
          src="/image/data/bg3.png"
          width={1200}
          height={400}
          alt="title"
          className="w-full aspect-[1200/400] mx-auto mt-[40px]"
        ></Image>
        <div className="mt-[60px]">
          <h1 className="text-[18px] font-bold text-center text-white mx-auto">
            大江东去，浪淘尽，千古风流人物。故垒西边，人道是，三国周郎赤壁。
          </h1>
          <p className="text-[14px] mt-4">
            蜩与学鸠笑之曰：“我决起而飞，抢榆枋而止，时则不至，而控于地而已矣，奚以之九万里而南为？”适莽苍者，三餐而反，腹犹果然；适百里者，宿舂粮；适千里者，三月聚粮。之二虫又何知！在金融领域，“小作文”被用来指各路写手写下的、在股票市场上发布并传播给投资者的传言性文字。这些传言性文字通常出现在各大财经网站的博客、贴吧以及各类群聊、朋友圈等社交平台中，且通常是朦胧的利好消息。写手以此刺激股价上涨，从而坐收渔利。在金融领域，“小作文”被用来指各路写手写下的、在股票市场上发布并传播给投资者的传言性文字。这些传言性文字通常出现在各大财经网站的博客、贴吧以及各类群聊、朋友圈等社交平台中，且通常是朦胧的利好消息。写手以此刺激股价上涨，从而坐收渔利。在金融领域，“小作文”被用来指各路写手写下的、在股票市场上发布并传播给投资者的传言性文字。这些传言性文字通常出现在各大财经网站的博客、贴吧以及各类群聊、朋友圈等社交平台中，且通常是朦胧的利好消息。写手以此刺激股价上涨，从而坐收渔利。在金融领域，“小作文”被用来指各路写手写下的、在股票市场上发布并传播给投资者的传言性文字。这些传言性文字通常出现在各大财经网站的博客、贴吧以及各类群聊、朋友圈等社交平台中，且通常是朦胧的利好消息。写手以此刺激股价上涨，从而坐收渔利。在金融领域，“小作文”被用来指各路写手写下的、在股票市场上发布并传播给投资者的传言性文字。这些传言性文字通常出现在各大财经网站的博
          </p>
        </div>
      </div>
      {/* 右侧悬浮层 */}
      <div className="fixed right-[10px] top-[10%] w-auto flex flex-col items-center h-[100px]">
        <button
          className="w-full h-[36px] bg-[#282A32] text-white rounded-[4px]  px-[20px] hover:text-[#33E11F] cursor-pointer"
          onClick={() => openGameIntroduction()}
        >
          {messages?.data?.blogs?.['team-intro']}
        </button>
        <button className="w-full h-[36px] bg-[#282A32] text-white rounded-[4px] mt-[14px] px-[20px] btn-tab cursor-pointer">
          {messages?.data?.blogs?.['game-intro']}
        </button>
      </div>
    </div>
  )
}

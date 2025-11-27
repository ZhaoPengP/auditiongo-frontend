/* eslint-disable react-hooks/purity */
'use client'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Calendar from '@/components/Calendar'
import { getMessages } from '@/lib/i18n'
// 偶像频道：偶像直播（视频+弹幕）与直播日历占位
export default function ChannelPage() {
  const { locale } = useParams() as { locale: string }
  // 多语言消息
  const messages = getMessages(locale)

  // 预生成评论数据，避免在渲染中使用Math.random()
  const [comments, setComments] = useState<string[]>([])

  // 预定义评论模板
  const commentTemplates = [
    '방송인님 금방 1000명 팬 돌파 준비됐네요!',
    '本当に驚きと怖さが入り混じるわ呜ー呜ー',
    "Sent a private message—they're really nice. Probably a biologist since they keep talking about toads and swans or something, I didn't really get it.",
    '或許為了生計還出來兼職算命，老問我算什麼東西。閒著沒事好像還兼職配鑰匙，還問我配不配。',
    '혹시나 의사도 겸업하는 건가봐, 갑자기 내가 병이 있다고 말하고 더위먹지 않게 시원한 데서 있으래…',
    'ベットしてみる！もしUP主が火ってきたら俺が元老ファンだぜ',
    'Investing with one coin!',
    '或許你不認識我，但我也不認識你',
    '配信者さんはどんな品種の猫ちゃんですか[星目]',
    "The streamer's voice is so nice, feels so gentle૮",
    '보배야 너무 귀여워~',
    '主播最近直播的節目都很火，我也想和她互動一下',
    "Well, since it's come to this, might as well be an old fan first!",
  ]

  // 在组件挂载时生成评论数据
  useEffect(() => {
    // 预生成200条评论
    const generatedComments = Array.from({ length: 200 }, () => {
      return commentTemplates[
        Math.floor(Math.random() * commentTemplates.length)
      ]
    })

    setComments(generatedComments)
  }, [])
  return (
    <div className="space-y-10 mx-auto pb-10 lg:w-[1248px]">
      {/* 模块一：偶像直播 */}
      <section>
        <div className="my-[40px]">
          <h3 className="text-[16px] inline-block bg-[url('/image/home/test2.png')] bg-no-repeat text-[28px] px-[28px] min-w-[204px] h-[70px]">
            {messages.channel?.liveStream || 'Live Stream'}
          </h3>
          <div className="flex justify-between items-center border border-white/10 rounded-2xl overflow-hidden">
            <div className="w-[808px] h-[640px] bg-white/10">
              <video
                src="/video/video18.mp4"
                autoPlay
                loop
                muted
                className="w-full h-full object-cover"
              ></video>
            </div>
            <div className="w-[440px] h-[640px] bg-white/10">
              <div className="bg-[#161622] h-full w-full pt-[15px]">
                <div className="h-[45px] flex items-center justify-between px-[15px]">
                  <div className="h-full w-[180px] rounded-full bg-white/10 flex items-center justify-between px-[4px]">
                    <div className="flex items-center">
                      <Image
                        src="/image/channel/person1.png"
                        alt="logo"
                        width={38}
                        height={38}
                        className="h-[38px] w-[38px] rounded-full"
                      />
                      <div className="ml-2">
                        <p className="text-[12px] font-bold">潘瑛琪 </p>
                        <p className="text-[10px] text-white/70">233333</p>
                      </div>
                    </div>
                    <div className="h-[36px] w-[48px] rounded-full btn-tab flex items-center justify-center">
                      +
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-[180px]">
                    {[1, 2, 3].map((item, index) => (
                      <div
                        key={index}
                        className="h-[36px] w-[36px] gap-2 rounded-full relative"
                      >
                        <Image
                          src="/image/channel/person.png"
                          alt="logo"
                          width={38}
                          height={38}
                          className="h-[38px] w-[38px] rounded-full"
                        />
                        <span className="absolute bottom-[-8px] left-1 h-[16px] px-[4px] rounded-full bg-[#FFCD3D] text-white text-[8px]">
                          1118
                        </span>
                      </div>
                    ))}
                    <div className="w-[36px] h-[36px] rounded-full bg-white/10 flex items-center justify-center text-[10px] text-[#ddd]">
                      1233
                    </div>
                  </div>
                </div>
                <div className="h-[510px] w-full max-w-[440px] px-[30px] py-[20px] text-sm text-white/70 border-b border-white/10">
                  <div className="w-full h-full overflow-auto relative">
                    <div className="animate-vertical-scroll whitespace-nowrap">
                      {comments.map((comment, i) => {
                        // 定义一些随机颜色
                        const colors = [
                          'text-red-500',
                          'text-blue-500',
                          'text-green-500',
                          'text-yellow-500',
                          'text-purple-500',
                          'text-pink-500',
                          'text-orange-500',
                          'text-indigo-500',
                        ]
                        const randomColor =
                          colors[Math.floor(Math.random() * colors.length)]

                        return (
                          <div key={i} className="py-2">
                            <p className="w-full text-balance">
                              <span className={`${randomColor}`}>
                                {`用户${Math.floor(Math.random() * 100) + 1}`}:
                              </span>{' '}
                              <span className={`${randomColor}`}>
                                {comment}
                              </span>{' '}
                              <span className={`${randomColor}`}>
                                {messages.channel?.liveComment ||
                                  'Live Comments'}
                              </span>
                            </p>
                          </div>
                        )
                      })}
                    </div>
                    <style jsx>{`
                      @keyframes scrollUp {
                        0% {
                          transform: translateY(0);
                        }
                        100% {
                          transform: translateY(-100%);
                        }
                      }
                      .animate-vertical-scroll {
                        animation: scrollUp 120s linear infinite;
                      }
                      .animate-vertical-scroll:hover {
                        animation-play-state: paused;
                      }
                    `}</style>
                  </div>
                </div>
                <div className="w-full h-[72px] flex items-center justify-between px-[15px]">
                  <input
                    className="w-[240px] h-[40px] rounded-full bg-[#22222E] text-white text-[12px] px-[15px]"
                    placeholder={
                      messages.channel?.commentPlaceholder || 'Say something'
                    }
                  />
                  <Image
                    src="/image/channel/setting1.png"
                    alt="setting"
                    width={40}
                    height={40}
                    className="h-[40px] w-[40px] rounded-full cursor-pointer"
                  />
                  <Image
                    src="/image/channel/setting2.png"
                    alt="setting"
                    width={40}
                    height={40}
                    className="h-[40px] w-[40px] rounded-full cursor-pointer"
                  />
                  <Image
                    src="/image/channel/setting3.png"
                    alt="setting"
                    width={40}
                    height={40}
                    className="h-[40px] w-[40px] rounded-full cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 模块二：直播日历 */}
      <section>
        <h3 className="text-[16px] inline-block bg-[url('/image/home/test2.png')] bg-no-repeat text-[28px] px-[28px] min-w-[204px] h-[70px]">
          {messages.channel?.calendar || 'Live Calendar'}
        </h3>
        <div className="w-full bg-white/10">
          <Calendar
            className="bg-white/10"
            events={[
              {
                id: '1',
                title: messages.channel?.events?.ybyLive || '杨冰怡直播',
                subtitle: messages.channel?.events?.cheer || 'Cheer Up',
                date: new Date(2025, 10, 8),
                isActive: true,
              },
              {
                id: '2',
                title: messages.channel?.events?.cyxLive || '陈俞希 直播',
                subtitle: messages.channel?.events?.cheer || 'Cheer Up',
                date: new Date(2025, 10, 20),
                isActive: false,
              },
            ]}
          />
        </div>
      </section>
    </div>
  )
}

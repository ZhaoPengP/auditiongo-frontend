'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import SvgIcon from '@/components/SvgIcon'
import { useParams } from 'next/navigation'
import { getMessages } from '@/lib/i18n'

// 粉丝圈：类似微博超话的论坛占位
// 帖子数据结构
type Comment = {
  id: string
  user: {
    avatar: string
    name: string
    location: string
    time: string
  }
  content: string
  likes: number
}

type Post = {
  id: string
  user: {
    avatar: string
    name: string
    location: string
    time: string
  }
  content: string
  image?: string
  likes: number
  comments: Comment[]
}

// 原始数据
const originalData: Post[] = [
  {
    id: '1',
    user: {
      avatar: '/image/fans/avatar1.png',
      name: 'ディトドゥルル', // 日语：原"ditodululu"音译，符合日语外来语用户名习惯
      location: '広東から', // 日语
      time: '23分钟前',
    },
    content:
      'The shooting has an impromptu beauty—are there no more talents for the 3.0 consecutive dance MVs?', // 英语
    image: '/image/fans/image.png',
    likes: 1464,
    comments: [
      {
        id: 'c1',
        user: {
          avatar: '/image/fans/avatar2.png',
          name: '肯德基滋滋YES烤雞腿堡', // 繁体中文：原名称繁体转换，保留核心元素
          location: '來自廣東', // 繁体中文
          time: '25-11-7 23:27',
        },
        content:
          '是你，說出了我的感覺。佈景很美，但有種有力使不上的感覺。有點盲頭蒼蠅，而且冬脖子上的大花我不理解審美', // 繁体中文
        likes: 464,
      },
      {
        id: 'c2',
        user: {
          avatar: '/image/fans/avatar1.png',
          name: '理想主义障碍症', // 汉语（简体）：与语言一致，保留原名称
          location: '来自广东', // 汉语（简体）
          time: '25-11-7 23:27',
        },
        content: '老铁我在骂mv拍摄很垃圾，你回的也有种鸡同鸭讲的美感', // 汉语（简体）
        likes: 56,
      },
    ],
  },
  {
    id: '2',
    user: {
      avatar: '/image/fans/avatar1.png',
      name: 'DreamyField', // 英语：原"大梦懿场"意译，dreamy对应"梦"的意境，field对应"场"
      location: 'From Shanghai', // 英语
      time: '1小时前',
    },
    content:
      '今日SNH48のオフラインイベントを見に行ったけど、会場の雰囲気超讃！メンバー達もとても熱心で、パフォーマンスも素晴らしかったです。次のお会いを楽しみにしています！', // 日语
    image: '/image/fans/image.png',
    likes: 892,
    comments: [
      {
        id: 'c3',
        user: {
          avatar: '/image/fans/avatar2.png',
          name: '十二點準時睡覺_', // 繁体中文：原名称繁体转换，保留个性后缀
          location: '來自北京', // 繁体中文
          time: '25-11-7 22:15',
        },
        content:
          "I feel like this song doesn't have a clear focus? The whole track feels really empty, like it can't deliver its full potential.", // 英语
        likes: 56,
      },
    ],
  },
  {
    id: '3',
    user: {
      avatar: '/image/fans/avatar2.png',
      name: '理想主義障礙症', // 繁体中文：原"理想主义障碍症"繁体转换，与语言一致
      location: '來自成都', // 繁体中文
      time: '3小时前',
    },
    content:
      '分享一首最近很喜歡的SNH48新歌《夢想的旗幟》，旋律真的超級洗腦，歌詞也很勵志。大家一定要去聽！', // 繁体中文
    likes: 567,
    comments: [
      {
        id: 'c4',
        user: {
          avatar: '/image/fans/avatar1.png',
          name: '帆立貝好きシュガー', // 日语：原"爱吃扇贝的糖"意译，帆立貝=扇贝，好き=喜欢，シュガー=糖，符合日语用户名结构
          location: '広州から', // 日语
          time: '25-11-7 20:42',
        },
        content:
          'クローズアップすべき時に遠景を撮り、特寫すべき時に隊形を映し、振り付けを強調すべき時に全景を撮っている——本当に評価が難しい。これは海外メンバーを避けるなどとは無関係で、単なる技術的な問題だ', // 日语
        likes: 89,
      },
      {
        id: 'c5',
        user: {
          avatar: '/image/fans/avatar2.png',
          name: '贊西_cy', // 繁体中文：原"Zancy_cy"音译+保留后缀，Zancy→贊西，贴合繁体语言场景
          location: '来自杭州', // 汉语（简体）
          time: '25-11-7 20:30',
        },
        content:
          '沒躲寧吧，我覺得在躲吉[保衛蘿蔔_哭哭]（個人觀點，吉真的全遠景）', // 繁体中文
        likes: 67,
      },
    ],
  },
]
const groupedData = [
  {
    id: '01',
    name: 'Peak idols',
  },
  {
    id: '02',
    name: 'Infinity Girls',
  },
  {
    id: '03',
    name: 'Alpha V',
  },
  {
    id: '04',
    name: 'La GonGon',
  },
  {
    id: '05',
    name: 'La BonBon',
  },
  {
    id: '06',
    name: 'Black Rose',
  },
  {
    id: '07',
    name: '@Boys',
  },
]

export default function FansPage() {
  const { locale } = useParams() as { locale: string }
  const messages = getMessages(locale)

  // 随机排序数组的辅助函数
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const tabList = [
    { id: 'only', name: '仅看楼主' },
    { id: 'hot', name: messages?.fans?.tabs?.hot || '热门' },
    { id: 'latest', name: messages?.fans?.tabs?.latest || '最新发帖' },
    {
      id: 'latest_comment',
      name: messages?.fans?.tabs?.latest_comment || '最新评论',
    },
    { id: 'announcement', name: messages?.fans?.tabs?.announcement || '公告' },
  ]
  const [content, setContent] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [activeTab, setActiveTab] = useState('hot')
  const [searchQuery, setSearchQuery] = useState('')
  const [data, setData] = useState<Post[]>(originalData)
  const [inputKey, setInputKey] = useState(0) // 用于完全重建输入框的key
  const [currentPostId, setCurrentPostId] = useState<string | null>(null) // 当前正在评论的post ID
  const inputRef = React.useRef<HTMLDivElement>(null)

  const [activeGroup, setActiveGroup] = useState('')

  const [specificTab, setSpecificTab] = useState('01')
  return (
    <div className="mx-auto lg:w-[1248px] px-10 pt-[20px] grid grid-cols-10 gap-[10px]">
      <div className={`col-span-2 relative `}>
        <div className="px-[10px] py-[6px] cursor-pointer text-black fixed top-[318px] w-[166px] ml-[54px]">
          {specificTab === '02'
            ? groupedData.map((item) => (
                <div
                  key={item.id}
                  className={`px-[15px] py-[10px] cursor-pointer text-black bg-[#fff] rounded-[10px] mb-[10px] bg-black text-white ${activeGroup === item.id ? 'btn-tab' : ''}`}
                  onClick={() => {
                    setActiveGroup(item.id)
                    setData((prevData) => shuffleArray(prevData))
                  }}
                >
                  {item.name}
                </div>
              ))
            : ['游戏活动', '模式交流', '休闲交友'].map((item, i) => (
                <div
                  key={i}
                  className={`px-[15px] py-[10px] cursor-pointer text-black bg-[#fff] rounded-[10px] mb-[10px] bg-black text-white ${activeGroup === item ? 'btn-tab' : ''}`}
                  onClick={() => {
                    setActiveGroup(item)
                    setData((prevData) => shuffleArray(prevData))
                  }}
                >
                  {item}
                </div>
              ))}
        </div>
      </div>
      <div className={`transform transition-all duration-300 col-span-8`}>
        <section>
          <div className="grid grid-cols-2 gap-[10px]">
            <div className="w-full h-full">
              {specificTab === '01' ? (
                <Image
                  src="/image/fans/banner1-a.png"
                  alt="banner1"
                  width={240}
                  height={120}
                  className="w-full h-full cursor-pointer"
                />
              ) : (
                <Image
                  src="/image/fans/banner1.png"
                  alt="banner2"
                  width={240}
                  height={120}
                  className="w-full h-full cursor-pointer"
                  onClick={() => setSpecificTab('01')}
                />
              )}
            </div>
            <div className="w-full h-full">
              <div>
                {specificTab === '02' ? (
                  <Image
                    src="/image/fans/banner2-a.png"
                    alt="banner2"
                    width={240}
                    height={120}
                    className="w-full h-full cursor-pointer"
                  />
                ) : (
                  <Image
                    src="/image/fans/banner2.png"
                    alt="banner2"
                    width={240}
                    height={120}
                    className="w-full h-full cursor-pointer"
                    onClick={() => setSpecificTab('02')}
                  />
                )}
              </div>
              <div className="grid grid-cols-2 gap-[10px] mt-[10px]">
                <div className="w-full h-full">
                  <Image
                    src="/image/fans/banner3.png"
                    alt="banner3"
                    width={240}
                    height={120}
                    className="w-full h-full"
                  />
                </div>
                <div className="w-full h-full">
                  <Image
                    src="/image/fans/banner4.png"
                    alt="banner4"
                    width={240}
                    height={120}
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={specificTab === '02' ? 'block' : 'hidden'}>
          <div className="w-full h-[330px] bg-gradient-to-b from-[#bdd0ff] to-[#ecf2ff] rounded-[10px] flex items-center justify-between mt-[20px]">
            <div className="w-[808px] h-[330px] p-5">
              <div className="flex items-center justify-between w-full">
                <div className="text-[22px] text-black">
                  {messages?.fans?.teamName || 'SNH48 X队（TEAM X）'}
                </div>
                <div className="flex items-center justify-between">
                  <p className="flex items-center text-[#333]">
                    <span>📝</span>
                    <span className="ml-[4px]">
                      {messages?.fans?.stats?.postCount || '帖子数'}
                      {123}
                    </span>
                  </p>
                  <p className="flex items-center text-[#333] ml-[20px]">
                    <span>👁️</span>
                    <span className="ml-[4px]">
                      {messages?.fans?.stats?.viewCount || '浏览量'}
                      {123}
                    </span>
                  </p>
                </div>
              </div>
              <p className="text-[#333] mt-[30px]">
                以世界之名，让世界洋溢青春。8月2日晚，由次世代大型AIUGC音舞及虚拟偶像养成生态模拟游戏——【AUDITIONSGO】担纲总主冠名的2025
                SNH48
                GROUP第十二届年度青春盛典首次登陆中国香港•亚洲国际博览馆，掀起了一场充满热血的青春风暴。
                来自SNH48（上海）、GNZ48（广州）、BEJ48（北京）、CKG48（重庆）、CGT48（成都）五团近200名成员共同献上这场美轮美奂的青春盛宴，
                也一同缔造了今夏女子偶像团体的巅峰一刻。
              </p>
            </div>
            <Image
              src="/image/fans/image.png"
              alt=""
              width={440}
              height={330}
              className="w-[440px] h-[330px]"
            />
          </div>
        </section>
        <section>
          <div className="mt-[20px] py-[30px] bg-[#fff] rounded-[10px]">
            <div className="flex items-center w-full px-[30px]">
              {tabList.map((item) => (
                <button
                  key={item.id}
                  id={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    // 点击时随机排序data
                    setData((prevData) => shuffleArray(prevData))
                  }}
                  className={`px-[15px] h-[36px] rounded-[5px] cursor-pointer mr-[15px] ${
                    activeTab === item.id
                      ? 'btn-tab text-[#fff]'
                      : 'bg-[#eee] text-[#666]'
                  } ${specificTab === '01' && item.id === 'only' ? 'hidden' : ''}`}
                >
                  {item.name}
                </button>
              ))}
              <input
                type="text"
                placeholder={messages?.fans?.search || '搜索'}
                className="w-[200px] h-[36px] rounded-[5px] bg-[#f5f5f5] text-[#333] px-4 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setData((prevData) => shuffleArray(prevData))

                    // e.preventDefault()
                  }
                }}
              />
            </div>
            <div className="h-[1px] bg-[#eee] w-full mt-[30px]"></div>
            <div className="px-[30px]">
              {(activeTab === 'hot' ||
                activeTab === 'latest' ||
                activeTab === 'only' ||
                activeTab === 'latest_comment' ||
                activeTab === 'announcement') && (
                <div className="space-y-6 mt-[20px]">
                  {data.map((post) => (
                    <div
                      key={post.id}
                      className="border-b border-[#eee] pb-6 last:border-b-0"
                    >
                      {/* 帖子头部 */}
                      <div className="flex items-center">
                        <Image
                          src={post.user.avatar}
                          alt={post.user.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div className="ml-3">
                          <div className="flex items-center">
                            <span className="font-medium text-[#333]">
                              {post.user.name}
                            </span>
                            <span className="ml-2 text-sm text-[#999]">
                              {post.user.location}
                            </span>
                          </div>
                          <div className="text-xs text-[#999]">
                            {post.user.time}
                          </div>
                        </div>
                      </div>

                      {/* 帖子内容 */}
                      <div className="mt-3 text-[#333]">{post.content}</div>

                      {/* 帖子图片 */}
                      {post.image && (
                        <div className="mt-3">
                          <Image
                            src={post.image}
                            alt="Post image"
                            width={300}
                            height={200}
                            className="rounded-lg"
                          />
                        </div>
                      )}

                      {/* 互动按钮 */}
                      <div className="mt-3 flex items-center justify-end">
                        <button className="flex items-center text-[#999]">
                          <SvgIcon
                            src="/svg/15298.svg"
                            alt="Like"
                            width={16}
                            height={16}
                            className="cursor-pointer"
                          />
                          <span className="ml-1">{post.likes}</span>
                        </button>
                        <button className="ml-6 flex items-center text-[#999] cursor-pointer">
                          <SvgIcon
                            src="/svg/15300.svg"
                            alt="Comment"
                            width={16}
                            height={16}
                          />
                          <span className="ml-1">回复</span>
                        </button>
                      </div>

                      <div className="border-t border-b border-[#eee] w-full my-[10px] pt-[30px] pb-[20px]">
                        <div className="bg-[#F6F6F6] p-2">
                          <div className="flex justify-between w-full p-1 rounded-[5px]">
                            <Image
                              src={post.user.avatar}
                              alt={post.user.name}
                              width={40}
                              height={40}
                              className="rounded-full h-[45px] w-[45px] mr-[4px]"
                            />
                            {/* <textarea
                            rows={1}
                            cols={50}
                            placeholder={
                              messages?.fans?.placeholder || '请输入内容'
                            }
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full border border-[#ccc] rounded-[5px] px-[10px] py-[10px] text-black"
                          ></textarea> */}
                            {/* 使用inputKey完全重建输入框，避免状态与DOM不同步 */}
                            <div
                              key={inputKey}
                              contentEditable="true"
                              ref={inputRef}
                              className="w-full rounded-[5px] px-[10px] py-[10px] text-black input-empty"
                              onInput={(e) => {
                                const target = e.currentTarget as HTMLDivElement
                                setContent(target.textContent || '')
                              }}
                              onFocus={() => {
                                setIsFocused(true)
                                setCurrentPostId(post.id) // 记录当前评论的post ID
                              }}
                            ></div>
                            <style>{`
                            .input-empty:focus {
                              outline: none;
                            }
                            .input-empty:empty::before {
                              content: '请输入内容...';
                              color: #999;
                            }
                          `}</style>
                          </div>
                          {isFocused && (
                            <div className="mt-[20px] flex items-center justify-between pl-[50px] pr-[20px]">
                              <div className="flex items-center">
                                <Image
                                  src="/image/fans/15340.png"
                                  alt="Send"
                                  width={24}
                                  height={24}
                                  className="mr-[8px] cursor-pointer"
                                />
                                <Image
                                  src="/image/fans/15341.png"
                                  alt="Send"
                                  width={24}
                                  height={24}
                                  className="cursor-pointer"
                                />
                              </div>
                              <div
                                className="rounded-[5px] flex items-center justify-center btn-tab px-[10px] py-[5px] w-[90px] cursor-pointer"
                                onClick={() => {
                                  console.log(
                                    '发送内容:',
                                    content,
                                    '到帖子:',
                                    currentPostId
                                  )

                                  // 1. 如果有内容且知道当前评论的post ID，则添加评论
                                  if (content.trim() && currentPostId) {
                                    // 生成随机用户信息和评论ID
                                    const newComment: Comment = {
                                      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                                      user: {
                                        avatar: `/image/fans/avatar${Math.floor(Math.random() * 5) + 1}.png`,
                                        name: `用户${Math.floor(Math.random() * 1000)}`,
                                        location: [
                                          '北京',
                                          '上海',
                                          '广州',
                                          '深圳',
                                          '成都',
                                          '杭州',
                                        ][Math.floor(Math.random() * 6)],
                                        time: '刚刚',
                                      },
                                      content: content.trim(),
                                      likes: 0,
                                    }

                                    // 更新数据，将新评论添加到对应的post
                                    setData((prevData) =>
                                      prevData.map((post) =>
                                        post.id === currentPostId
                                          ? {
                                              ...post,
                                              comments: [
                                                ...post.comments,
                                                newComment,
                                              ],
                                            }
                                          : post
                                      )
                                    )
                                  }

                                  // 2. 重置所有状态
                                  setIsFocused(false)
                                  setContent('')
                                  setCurrentPostId(null)

                                  // 3. 强制完全重建输入框DOM
                                  setInputKey((prev) => prev + 1)

                                  // 4. 额外的DOM操作保障
                                  if (inputRef.current) {
                                    inputRef.current = null
                                  }
                                }}
                              >
                                发送
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 评论列表 */}
                      {post.comments.length > 0 && (
                        <div className="mt-3 pl-4 border-l-2 border-[#eee] space-y-3">
                          {post.comments.map((comment) => (
                            <div key={comment.id}>
                              <div className="flex items-start w-full">
                                <Image
                                  src={comment.user.avatar}
                                  alt={comment.user.name}
                                  width={24}
                                  height={24}
                                  className="rounded-full"
                                />
                                <div className="ml-2 w-full">
                                  <div className="mt-1 text-sm text-[#333]">
                                    {comment.content}
                                  </div>
                                  <div className="flex items-end justify-between w-full">
                                    <div className="flex items-center">
                                      <span className="text-xs font-medium text-[#333]">
                                        {comment.user.name}
                                      </span>
                                      <span className="ml-2 text-xs text-[#999]">
                                        {comment.user.time}
                                      </span>
                                    </div>
                                    <div className="mt-1 text-[#999] flex items-center">
                                      <button className="flex items-center text-[#999]">
                                        <SvgIcon
                                          src="/svg/15298.svg"
                                          alt="Like"
                                          width={16}
                                          height={16}
                                          className="cursor-pointer"
                                        />
                                        <span className="ml-1">
                                          {comment.likes}
                                        </span>
                                      </button>
                                      <button className="ml-6 flex items-center text-[#999] cursor-pointer">
                                        <SvgIcon
                                          src="/svg/15300.svg"
                                          alt="Comment"
                                          width={16}
                                          height={16}
                                        />
                                        <span className="ml-1">回复</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

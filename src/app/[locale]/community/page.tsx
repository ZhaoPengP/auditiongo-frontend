'use client'
// 创作社区：筛选条件 + 占位图 + 瀑布流占位 + 详情布局提示
import { useMemo, useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Dropdown from '@/components/Dropdown'
import WaterfallGrid from '@/components/WaterfallGrid'
import Image from 'next/image'
import Carousel from '@/components/Carousel'
import Overlay from '@/components/Overlay'
import SvgIcon from '@/components/SvgIcon'
import videos from '@/moke/videos.json'
import { Swiper, SwiperSlide } from 'swiper/react'
import {
  EffectCoverflow,
  Pagination,
  Autoplay,
  Navigation,
} from 'swiper/modules'
import { getMessages } from '@/lib/i18n'

export default function CommunityPage() {
  const { locale } = useParams() as { locale: string }
  // 分类筛选数据
  const messages = getMessages(locale)

  // 使用useState管理视频列表，初始显示前10条数据
  // 配置参数：初始加载数量和每次加载数量
  const initialLoadCount = 13 // 初始加载10条数据
  const batchLoadCount = 5 // 每次加载3条数据

  const [videosList, setVideosList] = useState(() =>
    videos.slice(0, initialLoadCount)
  )

  // 使用useEffect实现动态加载视频列表，支持可配置的批量加载数量
  useEffect(() => {
    // 只有当videosList的长度小于videos的长度时才需要继续加载
    if (videosList.length >= videos.length) return

    // 设置定时器，每隔指定时间添加一批数据
    const timer = setInterval(() => {
      setVideosList((prevList) => {
        // 如果已经加载完所有数据，清除定时器
        if (prevList.length >= videos.length) {
          clearInterval(timer)
          return prevList
        }

        // 计算本次要加载的数据范围
        const startIndex = prevList.length
        const endIndex = Math.min(startIndex + batchLoadCount, videos.length)

        // 添加一批数据
        const newVideos = videos.slice(startIndex, endIndex)
        return [...prevList, ...newVideos]
      })
    }, 500) // 500毫秒 = 0.5秒

    // 组件卸载时清除定时器
    return () => clearInterval(timer)
  }, [videosList.length, videos])

  // 分类筛选数据
  const categoryOptions = [
    { key: 'all', label: messages?.community?.categories?.all },
    {
      key: 'variety',
      label: messages?.community?.categories?.variety,
    },
    { key: 'blog', label: messages?.community?.categories?.blog },
    {
      key: 'theater',
      label: messages?.community?.categories?.theater,
    },
    {
      key: 'workshop',
      label: messages?.community?.categories?.workshop,
    },
  ]

  // 排序方式数据
  const sortOptions = [
    { key: 'latest', label: messages?.community?.sort?.latest },
    { key: 'popular', label: messages?.community?.sort?.popular },
    {
      key: 'trending',
      label: messages?.community?.sort?.trending,
    },
    {
      key: 'following',
      label: messages?.community?.sort?.following,
    },
  ]

  // 时间筛选数据
  const timeOptions = [
    { key: 'all', label: messages?.community?.time?.all },
    { key: 'day', label: messages?.community?.time?.day },
    { key: 'week', label: messages?.community?.time?.week },
    { key: 'month', label: messages?.community?.time?.month },
    { key: 'year', label: messages?.community?.time?.year },
  ]

  const groupedItems = useMemo(
    () => [
      {
        id: '1',
        label: messages?.community?.labels?.['alpha-group'] || 'ALPHA 男子组合',
        image: '/image/common/6.png',
      },
      {
        id: '2',
        label:
          messages?.community?.labels?.['black-rose'] || 'Black Rose 概念照',
        image: '/image/common/2.png',
      },
    ],
    [messages]
  )

  // 模拟数据
  const data = [
    {
      id: '1',
      user: {
        avatar: '/image/fans/avatar1.png',
        name: '季節のレンズちゃん', // 日语（贴合原"季节的镜头呢"，符合日语用户名习惯）
        location: '広東から', // 日语
        time: '23分钟前',
      },
      content:
        '나는 계절 언니 팬은 아니지만！초점 맞춘 렌즈 하나 없다는 게 정말 말이 안 돼ㅠㅠ', // 韩语
      image: '/image/fans/image.png',
      likes: 1464,
      comments: [
        {
          id: 'c1',
          user: {
            avatar: '/image/fans/avatar2.png',
            name: 'UniqueNameSeeker', // 英语（贴合原"取什么名字能不撞"，简洁自然）
            location: 'From Guangdong', // 英语
            time: '25-11-7 23:27',
          },
          content:
            '非粉但真的離譜加一，這個造型有頭飾明明很美，但是不給鏡頭是怎麼回事', // 繁体中文
          likes: 1464,
        },
        {
          id: 'c2',
          user: {
            avatar: '/image/fans/avatar1.png',
            name: '묵락주사', // 韩语（原"墨落朱砂"音译，符合韩语中文名习惯）
            location: '대구에서', // 韩语
            time: '25-11-7 23:27',
          },
          content:
            "I'm a Ning fan but seriously didn't see a single close-up of Jijie throughout—this is absurd!", // 英语
          likes: 1464,
        },
      ],
    },
    {
      id: '2',
      user: {
        avatar: '/image/fans/avatar1.png',
        name: '超甜辣椒醬', // 繁体中文（原"我超甜的辣椒酱"繁体简化，符合繁体圈用户名风格）
        location: '來自上海', // 繁体中文
        time: '1小时前',
      },
      content:
        '今日SNH48のオフラインイベントを見に行った！会場の雰囲気は超棒で、メンバー達もみんな熱心で、パフォーマンスもめちゃくちゃ精彩です。次のお会いを楽しみにしています！', // 日语
      image: '/image/fans/image.png',
      likes: 892,
      comments: [
        {
          id: 'c3',
          user: {
            avatar: '/image/fans/avatar2.png',
            name: '산반산', // 韩语（原"山搬山"音译，简洁易读）
            location: '베이징에서', // 韩语
            time: '25-11-7 22:15',
          },
          content: '나도 가고 싶어！현장에서 굿즈 파는 거 있나요？', // 韩语
          likes: 156,
        },
      ],
    },
    {
      id: '3',
      user: {
        avatar: '/image/fans/avatar2.png',
        name: '음악천사', // 韩语（原"音乐小天使"意译，符合韩语用户名简洁性）
        location: '한국에서', // 韩语
        time: '3小时前',
      },
      content: '妈的就吉吉沒有懟臉鏡頭氣死我了', // 繁体中文
      likes: 567,
      comments: [
        {
          id: 'c4',
          user: {
            avatar: '/image/fans/avatar1.png',
            name: '朝ごはん早起きちゃん', // 日语（贴合原"早点起来吃早饭行不行"，口语化）
            location: '広州から', // 日语
            time: '25-11-7 20:42',
          },
          content: "Totally agree! I've been looping this song all day long.", // 英语
          likes: 89,
        },
        {
          id: 'c5',
          user: {
            avatar: '/image/fans/avatar2.png',
            name: '機頂盒贈手機', // 繁体中文（原"送的机顶盒手机"语序优化，符合繁体表达）
            location: '來自杭州', // 繁体中文
            time: '25-11-7 20:30',
          },
          content:
            '그런데 그녀가 옷을 그냥 제대로 입기만 해도 정말 아름다워...😭', // 韩语
          likes: 67,
        },
      ],
    },
  ]

  const defaultItems = [
    {
      id: 1,
      image: '/image/data/bg2.png',
      title: 'ALPHA 男子组合',
      date: '2023-10-10',
    },
    {
      id: 2,
      image: '/image/data/group1.png',
      title: 'Black Rose 概念照',
      date: '2023-10-10',
    },
    {
      id: 3,
      image: '/image/community/img2.png',
      title: 'B-Angels 最新舞台',
      date: '2023-10-10',
    },
    {
      id: 4,
      image: '/image/data/group2.png',
      title: 'Flash Girls 练习日常',
      date: '2023-10-10',
    },
    {
      id: 5,
      image: '/image/community/img1.png',
      title: 'Infinity 新歌发布',
      date: '2023-10-10',
    },
    {
      id: 6,
      image: '/image/data/group3.png',
      title: 'Boys Planet 成员互动',
      date: '2023-10-10',
    },
    {
      id: 7,
      image: '/image/data/group1.png',
      title: 'Boys Planet 成员互动',
      date: '2023-10-10',
    },
    {
      id: 8,
      image: '/image/data/bg2.png',
      title: 'ALPHA 男子组合',
      date: '2023-10-10',
    },
    {
      id: 9,
      image: '/image/data/group1.png',
      title: 'Black Rose 概念照',
      date: '2023-10-10',
    },
    {
      id: 10,
      image: '/image/community/img2.png',
      title: 'B-Angels 最新舞台',
      date: '2023-10-10',
    },
    {
      id: 11,
      image: '/image/data/group2.png',
      title: 'Flash Girls 练习日常',
      date: '2023-10-10',
    },
    {
      id: 12,
      image: '/image/community/img1.png',
      title: 'Infinity 新歌发布',
      date: '2023-10-10',
    },
    {
      id: 13,
      image: '/image/data/group3.png',
      title: 'Boys Planet 成员互动',
      date: '2023-10-10',
    },
    {
      id: 14,
      image: '/image/data/group1.png',
      title: 'Boys Planet 成员互动',
      date: '2023-10-10',
    },
    {
      id: 15,
      image: '/image/data/group1.png',
      title: 'Boys Planet 成员互动',
      date: '2023-10-10',
    },
  ]

  const [activeCategory, setActiveCategory] = useState(categoryOptions[0].key)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeGroup, setActiveGroup] = useState(0)
  const [isVideoOverlayVisible, setIsVideoOverlayVisible] = useState(false)

  const modules = [Pagination, Autoplay, EffectCoverflow, Navigation]
  const [currentVideoUrl, setCurrentVideoUrl] = useState('')
  // 关闭视频弹窗
  const closeVideoOverlay = () => {
    setIsVideoOverlayVisible(false)
  }

  // 打开视频弹窗
  const openVideoOverlay = (
    item: {
      id: string | number
      image?: string
      title: string
      src?: string
      [key: string]: unknown
    },
    index: number
  ) => {
    setCurrentVideoUrl(item.src || '')
    setIsVideoOverlayVisible(true)
  }

  // 获取当前选中的选项标签
  const getSelectedLabel = (
    options: { key: string | number; label: React.ReactNode }[],
    key: string
  ) => {
    const option = options.find((opt) => opt.key === key)
    return option?.label || options[0].label
  }

  // 随机排序数组的辅助函数
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // 处理分类选择
  const handleCategorySelect = (
    key: string | number,
    option: { key: string | number; label: React.ReactNode }
  ) => {
    setActiveCategory(key as string)
    // 对当前videosList进行随机排序
    setVideosList((prevList) => shuffleArray(prevList))
  }

  const swipecount = useMemo(() => {
    return (
      <Swiper
        className="h-full w-full"
        // 设置为无限滚动模式
        slidesPerView={1}
        spaceBetween={20}
        loop={true}
        // 设置自动播放，每3秒切换一次
        // autoplay={{
        //   delay: 3000,
        //   disableOnInteraction: false,
        //   pauseOnMouseEnter: true,
        // }}
        // 左右滑动效果
        slidesOffsetBefore={0}
        slidesOffsetAfter={0}
        modules={modules}
        // pagination={{
        //   clickable: true,
        //   dynamicBullets: false,
        //   bulletClass: 'my-bullet',
        //   bulletActiveClass: 'my-bullet-active',
        //   el: '.swiper-pagination', // 指定分页器元素
        // }}
        // navigation={{
        //   nextEl: '.swiper-button-next',
        //   prevEl: '.swiper-button-prev',
        // }}
        // onSlideChange={() => console.log('')}
        // onSwiper={(swiper) => console.log(swiper)}
      >
        {groupedItems.map((item, index) => (
          <SwiperSlide
            key={item.id}
            className="h-[100%] w-full flex items-center justify-center"
          >
            <div className="relative w-full max-w-[650px] mx-auto">
              <Image
                src={item.image || ''}
                alt={item.label || ''}
                width={605}
                height={460}
                className="h-[460px] w-full object-cover rounded-lg"
              />
              {/* 添加标题显示 */}
              {/* <div className="absolute bottom-4 left-4 right-4 bg-black/60 text-white p-2 rounded">
                {item.label}
              </div> */}
            </div>
          </SwiperSlide>
        ))}
        {/* 分页器容器 */}
        <div className="swiper-pagination"></div>
        {/* 导航按钮 */}
        <div className="swiper-button-prev"></div>
        <div className="swiper-button-next"></div>
      </Swiper>
    )
  }, [groupedItems, modules])

  return (
    <div className="w-full h-full pb-10">
      {/* 顶部筛选工具栏 */}
      <section>
        <div className="px-2 bg-[#1B1C21] w-full">
          <div className="flex items-center text-white lg:w-[1248px] mx-auto py-[10px] bg-[#1B1C21]">
            <ul className="flex items-center gap-8">
              {categoryOptions.map((item, idx) => (
                <li
                  key={item.key}
                  className={`cursor-pointer `}
                  onClick={() => handleCategorySelect(item.key, item)}
                >
                  <span
                    className={`hover:text-[#33E11F] ${activeCategory === item.key ? 'text-[#33E11F]' : 'text-white'}`}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`ml-8 ${idx === 4 ? 'hidden' : ''} text-xs text-white/50 text-thin`}
                  >
                    |
                  </span>
                </li>
              ))}
            </ul>
            <div className="border border-[#282A32] rounded-[20px] h-[38px] w-[240px] flex items-center ml-5 px-4">
              <svg
                className="w-6 h-6 text-white/50"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21 21L15 15M17 10C17 14.4183 13.4183 18 9 18C4.58172 18 1 14.4183 1 9C1 4.58172 4.58172 1 9 1C13.4183 1 17 4.58172 17 9Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <input
                type="text"
                placeholder={messages?.community?.placeholder}
                className="w-full h-full bg-transparent text-white px-4 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>
      <section>
        {activeCategory === 'all' && (
          <div className="h-[460px] mt-[40px] flex justify-between mx-auto lg:w-[1248px]">
            <div className=" bg-[#fff] w-[605] h-full rounded-lg">
              <Image
                src={groupedItems[0].image || ''}
                alt={groupedItems[0].label || ''}
                width={605}
                height={460}
                className="h-[460px] w-full object-cover rounded-lg"
              />
            </div>
            <div className=" bg-[#fff] w-[605] h-full rounded-lg">
              <Image
                src={groupedItems[1].image || ''}
                alt={groupedItems[1].label || ''}
                width={605}
                height={460}
                className="h-[460px] w-full object-cover rounded-lg"
              />
            </div>
          </div>
        )}
      </section>
      <section>
        <div className="mt-[40px] mx-auto lg:w-[1248px]">
          <div className="flex justify-between">
            <h3 className="text-[16px] inline-block mb-[20px] bg-[url('/image/home/test2.png')] bg-no-repeat text-[28px] px-[28px] min-w-[204px] h-[70px]">
              {messages?.community?.promoVideo || '宣传视频'}
            </h3>
            <div className="flex gap-4">
              {[
                messages?.community?.tabs?.latest,
                messages?.community?.tabs?.popular,
              ].map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveGroup(index)
                    // 对当前videosList进行随机排序
                    setVideosList((prevList) => shuffleArray(prevList))
                  }}
                  className={`rounded px-7 h-[36px] py-1 cursor-pointer hover:text-[#33E11F] ${activeGroup === index ? 'btn-tab' : 'bg-white/10'}
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <WaterfallGrid
            onItemClick={openVideoOverlay}
            columnCount={4}
            items={
              videosList as {
                id: number
                type: 'video'
                src: string
                title: string
                [key: string]: unknown
              }[]
            }
          />
        </div>
      </section>
      {/* 分类筛选下拉菜单 */}
      {/* <Dropdown
          trigger={
            <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors">
              <span>{getSelectedLabel(categoryOptions, activeCategory)}</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          }
          options={categoryOptions}
          onSelect={handleCategorySelect}
          backgroundColor="#1f2937"
          textColor="#ffffff"
          activeBackgroundColor="#374151"
          activeTextColor="#ffffff"
        /> */}
      <Overlay
        isVisible={isVideoOverlayVisible}
        onClose={() => setIsVideoOverlayVisible(false)}
      >
        <div className="w-[940px] h-[750px] flex justify-between">
          <div className="w-[500px] h-full bg-[#000]">
            <video
              className="inset-0 w-full h-full"
              autoPlay
              loop
              muted
              playsInline
              controls
            >
              <source src={currentVideoUrl} type="video/mp4" />
              {messages?.community?.video?.notSupported ||
                '您的浏览器不支持视频标签。'}
            </video>
          </div>
          <div className="w-[440px] h-[750px] bg-[#fff] text-[#333]">
            {/* 评论区域 */}
            <div className="space-y-6 h-[680px] overflow-y-auto px-[30px] py-[30px]">
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
                  <div className="mt-3 flex items-center">
                    <button className="flex items-center text-[#999]">
                      <SvgIcon
                        src="/svg/invitation.svg"
                        alt="Like"
                        width={16}
                        height={16}
                      />
                      <span className="ml-1">{post.likes}</span>
                    </button>
                    <button className="ml-6 flex items-center text-[#999]">
                      <SvgIcon
                        src="/svg/browse.svg"
                        alt="Comment"
                        width={16}
                        height={16}
                      />
                      <span className="ml-1">{post.comments.length}</span>
                    </button>
                  </div>

                  {/* 评论列表 */}
                  {post.comments.length > 0 && (
                    <div className="mt-3 pl-4 border-l-2 border-[#eee] space-y-3">
                      {post.comments.map((comment) => (
                        <div key={comment.id}>
                          <div className="flex items-center">
                            <Image
                              src={comment.user.avatar}
                              alt={comment.user.name}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                            <div className="ml-2">
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-[#333]">
                                  {comment.user.name}
                                </span>
                                <span className="ml-2 text-xs text-[#999]">
                                  {comment.user.time}
                                </span>
                              </div>
                              <div className="mt-1 text-sm text-[#333]">
                                {comment.content}
                              </div>
                              <div className="mt-1 text-xs text-[#999]">
                                <button className="flex items-center">
                                  <SvgIcon
                                    src="/svg/invitation.svg"
                                    alt="Like"
                                    width={12}
                                    height={12}
                                  />
                                  <span className="ml-1">{comment.likes}</span>
                                </button>
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
            <div className="w-full h-[1px] bg-[#eee]"></div>
            <div className="w-full h-[69px] flex items-center justify-between px-[20px]">
              <div className="w-[154px] h-[40px] bg-[#F6F6F6] px-[10px] rounded-[10px] flex items-center">
                <Image
                  src="/image/fans/avatar2.png"
                  alt="Like"
                  width={30}
                  height={30}
                />
                <input
                  type="text"
                  placeholder={messages?.community?.comment?.placeholder}
                  className="w-full h-[30px] bg-[#F6F6F6] rounded-[10px] px-[10px] outline-none"
                />
              </div>
              <p>
                <SvgIcon
                  src="/svg/like.svg"
                  alt="Like"
                  width={18}
                  height={18}
                />
                <span className="ml-1">111</span>
              </p>
              <p>
                <SvgIcon
                  src="/svg/collect.svg"
                  alt="Reply"
                  width={18}
                  height={18}
                />
                <span className="ml-1">
                  {messages?.community?.comment?.collect}
                </span>
              </p>
              <p>
                <SvgIcon
                  src="/svg/reply.svg"
                  alt="Reply"
                  width={18}
                  height={18}
                />
                <span className="ml-1">
                  {messages?.community?.comment?.reply}
                </span>
              </p>
              <p>
                <SvgIcon
                  src="/svg/share.svg"
                  alt="Reply"
                  width={18}
                  height={18}
                />
              </p>
            </div>
          </div>
        </div>
      </Overlay>
    </div>
  )
}
